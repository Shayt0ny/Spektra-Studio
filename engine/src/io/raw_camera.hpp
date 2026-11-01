#pragma once
#include <libraw/libraw.h>
#include <cstring>

namespace spk::io::detail {
// LibRaw 0.22.2 lacks this model. Values verified against RawSpeed's
// data/cameras.xml, FUJIFILM GFX100RF (both compressed and uncompressed):
// https://github.com/darktable-org/rawspeed/blob/develop/data/cameras.xml
// Its XYZ-to-camera matrix is exactly LibRaw's existing GFX 100 II entry.
// Reuse that coefficient lookup only; preserve the actual model, decoder,
// sensor geometry, black/white levels and all normal LibRaw processing.
class CameraLibRaw : public LibRaw {
public:
    explicit CameraLibRaw(unsigned flags = LIBRAW_OPTIONS_NO_DATAERR_CALLBACK) : LibRaw(flags) {}
protected:
    int adobe_coeff(unsigned make, const char* model, int internal_only = 0) override {
        // DC-ZS300 / TZ300 / TX3 calibration in RawSpeed cameras.xml is
        // identical to LibRaw's DC-ZS200: 7790,-2736,-755 / -3452,11870,1769 /
        // -628,1647,4898. Reuse the existing LibRaw coefficient lookup only.
        // An upstream/file-supplied calibration always wins. No sensor levels,
        // geometry, file model or decoder are rewritten. See Panasonic notice.
        if(make==LIBRAW_CAMERAMAKER_Panasonic && model && imgdata.idata.colors==3 && !imgdata.idata.dng_version &&
            (!std::strcmp(model,"DC-ZS300")||!std::strcmp(model,"DC-TZ300")||!std::strcmp(model,"DC-TX3"))) {
            const int found=LibRaw::adobe_coeff(make,model,internal_only);
            return found?found:LibRaw::adobe_coeff(make,"DC-ZS200",internal_only);
        }
        if (make != LIBRAW_CAMERAMAKER_Fujifilm || !model ||
            (std::strcmp(model, "GFX100RF") && std::strcmp(model, "GFX 100RF")))
            return LibRaw::adobe_coeff(make, model, internal_only);
        if (imgdata.idata.colors != 3 || imgdata.idata.dng_version)
            return LibRaw::adobe_coeff(make, model, internal_only);
        return LibRaw::adobe_coeff(make, "GFX 100 II", internal_only);
    }
};
} // namespace spk::io::detail
