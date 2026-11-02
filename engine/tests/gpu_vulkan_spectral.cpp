// Independent FP64 oracle for density -> transmitted light -> spectral response.
// Matches upstream conversions.density_to_light (10**-D, invalid rows zeroed),
// followed by printing/scanning's wavelength integral. This is a stage gate,
// not a claim of whole-image parity with the external Python implementation.
#include "core/blob.hpp"
#include "core/colour.hpp"
#include "core/profile.hpp"
#include "core/spectral.hpp"
#include "gpu/gpu.hpp"
#include "gpu_vulkan_read.hpp"

#include <algorithm>
#include <array>
#include <cmath>
#include <cstdio>
#include <filesystem>
#include <limits>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

namespace {
using spk::Vec;
using spk::gpu::Arg;
using spk::gpu::BufferRef;
using spk::gpu::Gpu;
constexpr float guard = -12345.25f;
constexpr size_t guards = 11;

void require(bool ok, const std::string& error) {
    if (!ok) throw std::runtime_error(error);
}

BufferRef upload(Gpu& gpu, const Vec& v, std::string& error) {
    std::vector<float> f(v.begin(), v.end());
    return gpu.upload(f.data(), f.size() * sizeof(float), error);
}

Vec narrowed(const Vec& v) {
    Vec out(v.size());
    std::transform(v.begin(), v.end(), out.begin(), [](double x) { return double(float(x)); });
    return out;
}

std::vector<float> dispatch(Gpu& gpu, const std::vector<float>& cmy,
                           const spk::SpectralConstants& sc, uint32_t mode) {
    std::string error;
    auto input = gpu.upload(cmy.data(), cmy.size() * sizeof(float), error);
    auto chd = upload(gpu, sc.channel_density, error);
    auto base = upload(gpu, sc.base_density, error);
    auto integral = upload(gpu, sc.illum_x_sens, error);
    const float ep[] = {1, 1, 1, 0, 0, 0};
    auto epilogue = gpu.upload(ep, sizeof ep, error);
    std::vector<float> initial(cmy.size() + guards, guard);
    auto output = gpu.upload(initial.data(), initial.size() * sizeof(float), error);
    require(input && chd && base && integral && epilogue && output, error);
    const uint32_t meta[] = {uint32_t(cmy.size() / 3), uint32_t(sc.base_density.size()), mode};
    require(gpu.dispatch("spk_spectral_epilogue",
            {Arg::buf(input), Arg::buf(chd), Arg::buf(base), Arg::buf(integral),
             Arg::buf(epilogue), Arg::inline_bytes(meta, 3), Arg::buf(output)}, meta[0], error), error);
    require(gpu.flush(error), error);
    std::vector<float> got;
    require(read_test_buffer(&gpu, output, got, error), error);
    for (size_t i = cmy.size(); i < cmy.size() + guards; ++i)
        require(got[i] == guard, "spectral kernel wrote beyond the logical output");
    got.resize(cmy.size());
    return got;
}

// Uses pow(10, -D), not the shader's exp2(-D * rounded_log2_10).
// float here is a separate CPU FP32 baseline, double is the oracle. Inputs
// remain binary32 in both, exactly as at the engine's public image boundary.
template <typename T>
std::array<double, 3> reference(const float* cmy, const spk::SpectralConstants& sc,
                              uint32_t mode) {
    T sums[3] = {};
    for (size_t l = 0; l < sc.base_density.size(); ++l) {
        T density = T(sc.base_density[l]);
        for (size_t c = 0; c < 3; ++c)
            density += T(cmy[c]) * T(sc.channel_density[3 * l + c]);
        const T transmission = std::pow(T(10), -density);
        for (size_t c = 0; c < 3; ++c)
            sums[c] += transmission * T(sc.illum_x_sens[3 * l + c]);
    }
    std::array<double, 3> result;
    for (size_t c = 0; c < 3; ++c) {
        T value = std::max(sums[c], T(0)) + T(1e-10);
        result[c] = double(mode == 0 ? std::log10(value) : value);
    }
    return result;
}

double log_error(double a, double b, uint32_t mode) {
    return mode == 0 ? std::abs(a - b) : std::abs(std::log10(a) - std::log10(b));
}

struct Metrics {
    size_t values = 0;
    double gpu_fp64 = 0, cpu_fp32 = 0, constants = 0, gpu_narrowed = 0;
    double total_gpu = 0, total_cpu = 0;
    std::string worst;
};

void profile_case(Gpu& gpu, const spk::Profile& profile, const spk::SpectralConstants& sc,
                  const std::string& stage, Metrics& metrics) {
    // Full three-dimensional density cube, not just neutral greys. Use each
    // measured stock's normalized density range, including toe and shoulder.
    std::vector<float> cmy;
    for (size_t r = 0; r <= 10; ++r)
        for (size_t g = 0; g <= 10; ++g)
            for (size_t b = 0; b <= 10; ++b) {
                cmy.push_back(float(profile.density_max[0] * r / 10));
                cmy.push_back(float(profile.density_max[1] * g / 10));
                cmy.push_back(float(profile.density_max[2] * b / 10));
            }
    const spk::SpectralConstants narrow{narrowed(sc.channel_density), narrowed(sc.base_density),
                                        narrowed(sc.illum_x_sens)};
    for (uint32_t mode : {0u, 1u}) {
        const auto got = dispatch(gpu, cmy, sc, mode);
        for (size_t p = 0; p < cmy.size() / 3; ++p) {
            const auto exact = reference<double>(&cmy[3 * p], sc, mode);
            const auto quantized = reference<double>(&cmy[3 * p], narrow, mode);
            const auto cpu32 = reference<float>(&cmy[3 * p], narrow, mode);
            for (size_t c = 0; c < 3; ++c) {
                require(std::isfinite(got[3 * p + c]) && std::isfinite(exact[c]),
                        profile.info.stock + ": non-finite spectral result");
                const double delta = log_error(got[3 * p + c], exact[c], mode);
                if (delta > metrics.gpu_fp64) {
                    metrics.gpu_fp64 = delta;
                    metrics.worst = profile.info.stock + "/" + stage + "/" +
                                    std::to_string(mode) + "/" + std::to_string(p) + "/" + std::to_string(c);
                }
                metrics.cpu_fp32 = std::max(metrics.cpu_fp32, log_error(cpu32[c], exact[c], mode));
                metrics.constants = std::max(metrics.constants, log_error(quantized[c], exact[c], mode));
                metrics.gpu_narrowed = std::max(metrics.gpu_narrowed,
                    log_error(got[3 * p + c], quantized[c], mode));
                metrics.total_gpu += delta;
                metrics.total_cpu += log_error(cpu32[c], exact[c], mode);
                ++metrics.values;
            }
        }
    }
    gpu.end_frame();
}

double summation_case(Gpu& gpu) {
    // Analytic adversary: every small wavelength contribution is below half
    // an ulp of the leading one, but their sum is ten ulps. A plain running
    // FP32 sum drops all eighty; the physically relevant total is nonzero.
    spk::SpectralConstants sc;
    sc.channel_density.assign(81 * 3, 0);
    sc.base_density.assign(81, 0);
    sc.illum_x_sens.assign(81 * 3, std::ldexp(1.0, -26));
    for (size_t c = 0; c < 3; ++c) sc.illum_x_sens[c] = 1;
    std::vector<float> cmy(257 * 3, 0); // incomplete final workgroup
    double maximum = 0;
    for (uint32_t mode : {0u, 1u}) {
        const auto got = dispatch(gpu, cmy, sc, mode);
        const double linear = 1.0 + 80 * std::ldexp(1.0, -26) + 1e-10;
        const double want = mode == 0 ? std::log10(linear) : linear;
        for (float value : got) maximum = std::max(maximum, std::abs(double(value) - want));
    }
    gpu.end_frame();
    return maximum;
}
} // namespace

int main(int argc, char** argv) {
    try {
        require(argc == 2 || (argc == 3 && std::string(argv[2]) == "--audit"),
                "usage: spk_vulkan_spectral <resources> [--audit]");
        const bool audit = argc == 3;
        const std::string resources = argv[1];
        std::string error;
        std::unique_ptr<Gpu> gpu(Gpu::create_vulkan(resources + "/vulkan", error));
        require(bool(gpu), error);
        std::printf("Vulkan device: %s\n", gpu->device_name().c_str());
        spk::Blob blob;
        spk::Colour colour;
        require(blob.open(resources + "/spektrafilm_constants.bin", error), error);
        require(colour.init(blob, error), error);
        spk::Profile paper;
        require(spk::load_profile(resources, "kodak_portra_endura", paper, error), error);
        Vec sensitivity(paper.data.log_sensitivity.size());
        std::transform(paper.data.log_sensitivity.begin(), paper.data.log_sensitivity.end(),
            sensitivity.begin(), [](double x) { return std::isnan(x) ? 0.0 : std::pow(10.0, x); });
        Vec enlarger;
        require(spk::standard_illuminant(colour, blob, "TH-KG3", enlarger, error), error);
        std::vector<std::filesystem::path> profiles;
        for (const auto& file : std::filesystem::directory_iterator(resources + "/profiles"))
            if (file.path().extension() == ".json") profiles.push_back(file.path());
        std::sort(profiles.begin(), profiles.end());
        require(profiles.size() >= 28, "measured profiles missing; refusing a partial green run");
        Metrics metrics;
        size_t stages = 0;
        for (const auto& path : profiles) {
            spk::Profile p;
            require(spk::load_profile(resources, path.stem().string(), p, error), error);
            Vec illuminant;
            require(spk::standard_illuminant(colour, blob, p.info.viewing_illuminant, illuminant, error), error);
            double norm = 0;
            for (size_t l = 0; l < illuminant.size(); ++l)
                norm += illuminant[l] * colour.cmfs_1931_2deg()[3 * l + 1];
            spk::SpectralConstants sc;
            spk::prepare_spectral_constants(p.data.channel_density, p.data.base_density,
                illuminant, colour.cmfs_1931_2deg(), norm, sc);
            profile_case(*gpu, p, sc, "scan", metrics);
            ++stages;
            if (p.info.support == "film") {
                spk::prepare_spectral_constants(p.data.channel_density, p.data.base_density,
                    enlarger, sensitivity, 1.0, sc);
                profile_case(*gpu, p, sc, "print", metrics);
                ++stages;
            }
        }
        const double sum_error = summation_case(*gpu);
        std::printf("spectral: %zu profiles, %zu stages, %zu values (both linear/log modes)\n"
                    "max log10-response errors: GPU/FP64=%.9g CPU32/FP64=%.9g "
                    "narrowing/FP64=%.9g GPU/narrowed64=%.9g\n"
                    "mean log10-response errors: GPU/FP64=%.9g CPU32/FP64=%.9g\n"
                    "worst GPU/FP64: %s\nanalytic 81-term summation abs error: %.9g\n",
                    profiles.size(), stages, metrics.values, metrics.gpu_fp64, metrics.cpu_fp32,
                    metrics.constants, metrics.gpu_narrowed, metrics.total_gpu / metrics.values,
                    metrics.total_cpu / metrics.values, metrics.worst.c_str(), sum_error);
        // Response units, not output RGB or a perceptual delta-E. This bound
        // allows < 4.7 ppm relative response drift; it includes coefficient
        // narrowing as well as the shader's arithmetic and transcendental.
        require(metrics.gpu_fp64 < 2e-6, "measured-stock response drift exceeds 2e-6 log10 units");
        if (!audit)
            require(sum_error <= std::numeric_limits<float>::epsilon(),
                    "spectral summation loses the small wavelength contributions");
        std::puts(audit ? "AUDIT ONLY: analytic summation gate not enforced" : "spectral FP64 gate passed; all guards intact");
        return 0;
    } catch (const std::exception& e) {
        std::fprintf(stderr, "spectral: %s\n", e.what());
        return 1;
    }
}
