// Native streaming writers. Codec state belongs to each call, so a bounded
// encoder worker may run while the engine renders the next frame.
#include "output.hpp"

#include <algorithm>
#include <csetjmp>
#include <cstring>
#include <limits>
#include <memory>

#include <jpeglib.h>
#include <jerror.h>
#include <png.h>
#include <webp/encode.h>
#include "stb_image_write.h"

namespace spkhost {
namespace {
struct Sink {
    std::FILE* file = nullptr;
    std::vector<uint8_t>* bytes = nullptr;
    bool write(const void* data, size_t n) noexcept {
        if (file) return std::fwrite(data, 1, n, file) == n;
        try {
            const auto* p = static_cast<const uint8_t*>(data);
            bytes->insert(bytes->end(), p, p + n);
            return true;
        } catch (...) { return false; }
    }
};

// Stream the VP8L chunks into an extended RIFF container. ICC/EXIF do not
// require a second full compressed-image copy or an external mux process.
struct WebpSink {
    Sink sink;
    uint64_t written = 0;
    size_t skipped = 0;
    uint8_t header[12]{};
    bool write(const void* data, size_t size) noexcept {
        if (written + size > uint64_t(UINT32_MAX) + 8 || !sink.write(data, size)) return false;
        written += size; return true;
    }
    bool u32(uint32_t value) noexcept {
        const uint8_t bytes[]{uint8_t(value), uint8_t(value >> 8), uint8_t(value >> 16), uint8_t(value >> 24)};
        return write(bytes, 4);
    }
    bool chunk(const char* name, const std::vector<uint8_t>& data) noexcept {
        const uint8_t zero = 0;
        return data.size() <= UINT32_MAX && write(name, 4) && u32(uint32_t(data.size())) &&
            write(data.data(), data.size()) && (!(data.size() & 1) || write(&zero, 1));
    }
};
int webp_write(const uint8_t* data, size_t size, const WebPPicture* picture) {
    auto* state = static_cast<WebpSink*>(picture->custom_ptr);
    const size_t skip = std::min(size, 12 - state->skipped);
    if (skip) { std::memcpy(state->header + state->skipped, data, skip); state->skipped += skip; }
    return state->write(data + skip, size - skip) ? 1 : 0;
}
bool webp_to(Sink sink, const uint8_t* rgb, uint32_t w, uint32_t h, const std::vector<uint8_t>& icc,
             std::string& error, const Exif* exif) {
    if (!rgb || !w || !h || w > WEBP_MAX_DIMENSION || h > WEBP_MAX_DIMENSION || icc.size() > UINT32_MAX) {
        error = "WebP requires dimensions between 1 and 16383 pixels"; return false;
    }
    const auto block = exif ? exif_block(*exif, w, h) : std::vector<uint8_t>{};
    WebpSink state{sink};
    std::vector<uint8_t> extended(10, 0); extended[0] = uint8_t((icc.empty() ? 0 : 0x20) | (block.empty() ? 0 : 0x08));
    for (int i = 0; i < 3; ++i) { extended[4 + i] = uint8_t((w - 1) >> (8 * i)); extended[7 + i] = uint8_t((h - 1) >> (8 * i)); }
    if (!state.write("RIFF", 4) || !state.u32(0) || !state.write("WEBP", 4) || !state.chunk("VP8X", extended) ||
        (!icc.empty() && !state.chunk("ICCP", icc))) { error = "WebP header write failed"; return false; }
    WebPConfig config; WebPPicture picture;
    if (!WebPConfigInit(&config) || !WebPConfigLosslessPreset(&config, 3) || !WebPPictureInit(&picture)) {
        error = "WebP encoder version mismatch"; return false;
    }
    config.thread_level = 0; config.exact = 1;
    picture.width = int(w); picture.height = int(h); picture.use_argb = 1; picture.writer = webp_write; picture.custom_ptr = &state;
    const bool ok = WebPPictureImportRGB(&picture, rgb, int(w * 3)) && WebPEncode(&config, &picture);
    const auto code = picture.error_code; WebPPictureFree(&picture);
    if (!ok || state.skipped != 12 || std::memcmp(state.header, "RIFF", 4) || std::memcmp(state.header + 8, "WEBP", 4)) {
        error = "WebP lossless encoding failed: " + std::to_string(int(code)); return false;
    }
    if (!block.empty() && !state.chunk("EXIF", block)) { error = "WebP EXIF write failed"; return false; }
    const uint32_t length = uint32_t(state.written - 8);
    const uint8_t bytes[]{uint8_t(length), uint8_t(length >> 8), uint8_t(length >> 16), uint8_t(length >> 24)};
    if (sink.file) {
        if (std::fseek(sink.file, 4, SEEK_SET) || std::fwrite(bytes, 1, 4, sink.file) != 4 || std::fseek(sink.file, 0, SEEK_END)) { error = "WebP RIFF finalization failed"; return false; }
    } else std::copy(bytes, bytes + 4, sink.bytes->begin() + 4);
    return true;
}

// At Q96--100 the old float RGB->YCbCr path preserves fraction bits which
// the native 8-bit JPEG path rounds before its DCT. The measured Q98/Q100
// error exceeded our non-regression gate, so preserve those pixels. Buffer
// stb's tiny entropy writes; this still streams without a full encoded copy.
struct LegacyJpegSink {
    Sink sink; uint8_t buffer[65536]; size_t used = 0, skip = 2; bool failed = false;
    void flush() { if (used && !sink.write(buffer, used)) failed = true; used = 0; }
};
void legacy_jpeg_write(void* context, void* data, int count) {
    auto& s = *static_cast<LegacyJpegSink*>(context);
    if (count == 1 && !s.skip && !s.failed) {
        s.buffer[s.used++] = *static_cast<const uint8_t*>(data);
        if (s.used == sizeof s.buffer) s.flush();
        return;
    }
    const auto* p = static_cast<const uint8_t*>(data);
    size_t n = size_t(count), skip = std::min(s.skip, n); s.skip -= skip; p += skip; n -= skip;
    while (n && !s.failed) {
        const size_t take = std::min(n, sizeof s.buffer - s.used);
        std::memcpy(s.buffer + s.used, p, take); s.used += take; p += take; n -= take;
        if (s.used == sizeof s.buffer) s.flush();
    }
}
bool jpeg_marker(Sink sink, uint8_t marker, const uint8_t* data, size_t size) {
    const uint8_t header[] = {255, marker, uint8_t((size + 2) >> 8), uint8_t(size + 2)};
    return sink.write(header, sizeof header) && sink.write(data, size);
}
bool legacy_jpeg_to(Sink sink, const uint8_t* rgb, uint32_t w, uint32_t h, int quality,
                    const std::vector<uint8_t>& icc, const std::vector<uint8_t>& exif, std::string& error) {
    auto buffered = std::make_unique<LegacyJpegSink>(); buffered->sink = sink;
    const uint8_t soi[] = {255, 216};
    bool ok = sink.write(soi, 2);
    if (!exif.empty() && exif.size() <= 65533) ok = ok && jpeg_marker(sink, 225, exif.data(), exif.size());
    constexpr size_t chunk_size = 65519;
    const size_t chunks = (icc.size() + chunk_size - 1) / chunk_size;
    for (size_t part = 0; part < chunks && ok; ++part) {
        const size_t at = part * chunk_size, n = std::min(chunk_size, icc.size() - at);
        std::vector<uint8_t> chunk{'I','C','C','_','P','R','O','F','I','L','E',0,uint8_t(part + 1),uint8_t(chunks)};
        chunk.insert(chunk.end(), icc.begin() + at, icc.begin() + at + n);
        ok = jpeg_marker(sink, 226, chunk.data(), chunk.size());
    }
    if (!ok) { error = "JPEG output write failed"; return false; }
    ok = stbi_write_jpg_to_func(legacy_jpeg_write, buffered.get(), int(w), int(h), 3, rgb, quality) != 0;
    buffered->flush();
    if (!ok || buffered->failed) { error = "JPEG output write failed"; return false; }
    return true;
}

struct PngState { Sink sink; char error[256]{}; };
void png_failure(png_structp png, png_const_charp message) {
    auto* s = static_cast<PngState*>(png_get_error_ptr(png));
    std::snprintf(s->error, sizeof s->error, "%s", message);
    png_longjmp(png, 1);
}
void png_warning_ignored(png_structp, png_const_charp) {}
void png_write(png_structp png, png_bytep p, png_size_t n) {
    auto* s = static_cast<PngState*>(png_get_io_ptr(png));
    if (!s->sink.write(p, n)) png_error(png, "PNG output write failed");
}
void png_flush(png_structp) {}

bool png_to(Sink sink, const void* rgb, uint32_t w, uint32_t h,
            const std::vector<uint8_t>& icc, std::string& error, const Exif* exif, uint32_t bits = 8) {
    if (!rgb || !w || !h || w > PNG_UINT_31_MAX || h > PNG_UINT_31_MAX ||
        uint64_t(w) * h * 3 > std::numeric_limits<size_t>::max() || icc.size() > PNG_UINT_31_MAX) {
        error = "invalid PNG image dimensions or profile"; return false;
    }
    // C libraries report errors with longjmp. All C++ owned objects are made
    // before setjmp; callbacks cannot throw through the C codec.
    const auto block = exif ? exif_block(*exif, w, h) : std::vector<uint8_t>{};
    std::vector<uint8_t> row(bits == 16 ? size_t(w) * 6 : 0);
    auto state = std::make_unique<PngState>();
    state->sink = sink;
    png_structp png = png_create_write_struct(PNG_LIBPNG_VER_STRING, state.get(), png_failure, png_warning_ignored);
    if (!png) { error = "PNG allocation failed"; return false; }
    png_infop info = png_create_info_struct(png);
    if (!info) { png_destroy_write_struct(&png, nullptr); error = "PNG allocation failed"; return false; }
    if (setjmp(png_jmpbuf(png))) {
        error = state->error;
        png_destroy_write_struct(&png, &info);
        return false;
    }
    png_set_write_fn(png, state.get(), png_write, png_flush);
    png_set_IHDR(png, info, w, h, bits, PNG_COLOR_TYPE_RGB, PNG_INTERLACE_NONE,
                 PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
    png_set_compression_level(png, 3); // lossless, favour interactive export speed
    if (!icc.empty()) png_set_iCCP(png, info, "ICC Profile", PNG_COMPRESSION_TYPE_BASE,
                                   icc.data(), png_uint_32(icc.size()));
    if (!block.empty()) png_set_eXIf_1(png, info, png_uint_32(block.size()), const_cast<png_bytep>(block.data()));
    png_write_info(png, info);
    for (uint32_t y = 0; y < h; ++y) {
        if (bits == 16) {
            const auto* source = static_cast<const uint16_t*>(rgb) + size_t(y) * w * 3;
            for (size_t i = 0; i < size_t(w) * 3; ++i) { row[2 * i] = uint8_t(source[i] >> 8); row[2 * i + 1] = uint8_t(source[i]); }
            png_write_row(png, row.data());
        } else png_write_row(png, const_cast<png_bytep>(static_cast<const uint8_t*>(rgb) + size_t(y) * w * 3));
    }
    png_write_end(png, info);
    png_destroy_write_struct(&png, &info);
    return true;
}

struct JpegError { jpeg_error_mgr base; std::jmp_buf jump; char message[JMSG_LENGTH_MAX]{}; };
void jpeg_failure(j_common_ptr codec) {
    auto* e = reinterpret_cast<JpegError*>(codec->err);
    (*codec->err->format_message)(codec, e->message);
    std::longjmp(e->jump, 1);
}
struct JpegSink { jpeg_destination_mgr base; Sink sink; JOCTET buffer[65536]; };
void jpeg_init(j_compress_ptr c) {
    auto* d = reinterpret_cast<JpegSink*>(c->dest);
    d->base.next_output_byte = d->buffer;
    d->base.free_in_buffer = sizeof d->buffer;
}
boolean jpeg_flush(j_compress_ptr c) {
    auto* d = reinterpret_cast<JpegSink*>(c->dest);
    if (!d->sink.write(d->buffer, sizeof d->buffer)) ERREXIT(c, JERR_FILE_WRITE);
    jpeg_init(c); return TRUE;
}
void jpeg_finish(j_compress_ptr c) {
    auto* d = reinterpret_cast<JpegSink*>(c->dest);
    if (!d->sink.write(d->buffer, sizeof d->buffer - d->base.free_in_buffer)) ERREXIT(c, JERR_FILE_WRITE);
}

bool jpeg_to(Sink sink, const uint8_t* rgb, uint32_t w, uint32_t h, int quality,
             const std::vector<uint8_t>& icc, std::string& error, const Exif* exif) {
    if (!rgb || !w || !h || w > JPEG_MAX_DIMENSION || h > JPEG_MAX_DIMENSION ||
        uint64_t(w) * h * 3 > std::numeric_limits<size_t>::max() || icc.size() > 255u * 65519u) {
        error = "invalid JPEG image dimensions or profile"; return false;
    }
    auto block = exif ? exif_block(*exif, w, h) : std::vector<uint8_t>{};
    if (!block.empty()) block.insert(block.begin(), {'E','x','i','f',0,0});
    quality = std::clamp(quality, 1, 100);
    if (quality >= 96) return legacy_jpeg_to(sink, rgb, w, h, quality, icc, block, error);
    auto codec = std::make_unique<jpeg_compress_struct>();
    auto failures = std::make_unique<JpegError>();
    auto destination = std::make_unique<JpegSink>();
    codec->err = jpeg_std_error(&failures->base);
    failures->base.error_exit = jpeg_failure;
    destination->sink = sink;
    destination->base.init_destination = jpeg_init;
    destination->base.empty_output_buffer = jpeg_flush;
    destination->base.term_destination = jpeg_finish;
    if (setjmp(failures->jump)) {
        error = failures->message;
        jpeg_destroy_compress(codec.get());
        return false;
    }
    jpeg_create_compress(codec.get());
    codec->dest = &destination->base;
    codec->image_width = w; codec->image_height = h;
    codec->input_components = 3; codec->in_color_space = JCS_RGB;
    jpeg_set_defaults(codec.get());
    jpeg_set_quality(codec.get(), quality, TRUE);
    // Match the existing stb quality split; preserving the number alone would
    // silently reduce chroma resolution for the default Q92 and Q100 exports.
    codec->comp_info[0].h_samp_factor = quality <= 90 ? 2 : 1;
    codec->comp_info[0].v_samp_factor = quality <= 90 ? 2 : 1;
    codec->dct_method = JDCT_ISLOW;
    codec->optimize_coding = FALSE;
    jpeg_start_compress(codec.get(), TRUE);
    if (!block.empty() && block.size() <= 65533)
        jpeg_write_marker(codec.get(), JPEG_APP0 + 1, block.data(), unsigned(block.size()));
    if (!icc.empty()) jpeg_write_icc_profile(codec.get(), icc.data(), unsigned(icc.size()));
    while (codec->next_scanline < h) {
        JSAMPROW row = const_cast<JSAMPROW>(rgb + size_t(codec->next_scanline) * w * 3);
        jpeg_write_scanlines(codec.get(), &row, 1);
    }
    jpeg_finish_compress(codec.get());
    jpeg_destroy_compress(codec.get());
    return true;
}
} // namespace

bool encode_webp_lossless(const uint8_t* rgb, uint32_t w, uint32_t h, const std::vector<uint8_t>& icc,
                          std::vector<uint8_t>& out, std::string& error, const Exif* exif) {
    out.clear(); return webp_to({nullptr, &out}, rgb, w, h, icc, error, exif);
}
bool encode_webp_lossless_file(std::FILE* f, const uint8_t* rgb, uint32_t w, uint32_t h,
                               const std::vector<uint8_t>& icc, std::string& error, const Exif* exif) {
    if (!f) { error = "WebP output file is null"; return false; }
    return webp_to({f, nullptr}, rgb, w, h, icc, error, exif);
}
bool encode_png8(const uint8_t* rgb, uint32_t w, uint32_t h, const std::vector<uint8_t>& icc,
                 std::vector<uint8_t>& out, std::string& error, const Exif* exif) {
    out.clear(); return png_to({nullptr, &out}, rgb, w, h, icc, error, exif);
}
bool encode_png16(const uint16_t* rgb, uint32_t w, uint32_t h, const std::vector<uint8_t>& icc,
                  std::vector<uint8_t>& out, std::string& error, const Exif* exif) {
    out.clear(); return png_to({nullptr, &out}, rgb, w, h, icc, error, exif, 16);
}
bool encode_jpeg(const uint8_t* rgb, uint32_t w, uint32_t h, int quality, const std::vector<uint8_t>& icc,
                 std::vector<uint8_t>& out, std::string& error, const Exif* exif) {
    out.clear(); return jpeg_to({nullptr, &out}, rgb, w, h, quality, icc, error, exif);
}
bool encode_png8_file(std::FILE* f, const uint8_t* rgb, uint32_t w, uint32_t h,
                      const std::vector<uint8_t>& icc, std::string& error, const Exif* exif) {
    if (!f) { error = "PNG output file is null"; return false; }
    return png_to({f, nullptr}, rgb, w, h, icc, error, exif);
}
bool encode_png16_file(std::FILE* f, const uint16_t* rgb, uint32_t w, uint32_t h,
                       const std::vector<uint8_t>& icc, std::string& error, const Exif* exif) {
    if (!f) { error = "PNG file is null"; return false; }
    return png_to({f, nullptr}, rgb, w, h, icc, error, exif, 16);
}
bool encode_jpeg_file(std::FILE* f, const uint8_t* rgb, uint32_t w, uint32_t h, int quality,
                      const std::vector<uint8_t>& icc, std::string& error, const Exif* exif) {
    if (!f) { error = "JPEG output file is null"; return false; }
    return jpeg_to({f, nullptr}, rgb, w, h, quality, icc, error, exif);
}
} // namespace spkhost
