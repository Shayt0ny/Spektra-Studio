// Windows missing-camera compatibility adapter (camera data retains separate notices), Copyright (C) 2026 shayt0ny. Modified 2026-11-01.
#pragma once

#include "raw_camera.hpp"
#include <cmath>
#include <cstring>
#include <utility>

namespace spk::io {

// Keep LibRaw's decoder and matrix normalization. Supply a missing camera
// calibration only for an exact model, before unpack snapshots colour data.
class CameraLibRaw : public detail::CameraLibRaw {
public:
    using detail::CameraLibRaw::CameraLibRaw;

    template<class... Args> int open_file(Args&&... args) {
        const int status = LibRaw::open_file(std::forward<Args>(args)...);
        if (status == LIBRAW_SUCCESS) apply_missing_camera_profile();
        return status;
    }

    bool apply_missing_camera_profile() {
        const auto& id = imgdata.idata;
        if (id.maker_index != LIBRAW_CAMERAMAKER_Nikon || id.colors != 3) return false;
        const bool z5ii = std::strcmp(id.normalized_model, "Z5_2") == 0;
        const bool zr = std::strcmp(id.normalized_model, "ZR") == 0;
        const bool z50ii = std::strcmp(id.normalized_model, "Z50_2") == 0;
        if (!z5ii && !zr && !z50ii) return false;
        if (z50ii && id.dng_version) return false;
        // Future LibRaw and file-supplied profiles take precedence. Never
        // replace a non-empty matrix with our compatibility entry.
        for (const auto& row : imgdata.color.cam_xyz)
            for (float v : row) if (!std::isfinite(v) || v != 0) return false;
        for (int r = 0; r < 3; ++r) for (int c = 0; c < 4; ++c) {
            if (imgdata.color.cmatrix[r][c] != 0 ||
                imgdata.color.rgb_cam[r][c] != float(r == c)) return false;
        }
        // RawSpeed's exact Z50_2 entry matches LibRaw's existing Z 50
        // calibration (11640,-4829,-1079 / -5107,13006,2325 / -972,1711,7380).
        // Reuse only that lookup, after the same missing-profile guard. The
        // candidate decoder still owns compression; do not ignore corrupt data.
        if (z50ii) return adobe_coeff(LIBRAW_CAMERAMAKER_Nikon, "Z 50", 0) != 0;
        // Exact Nikon Z5 II / ZR D65 XYZ->camera matrices.
        // RawSpeed cameras.xml, CC BY-SA 3.0; attribution and pinned source:
        // engine/resources/io/Nikon-{Z5-II,ZR}-profile-NOTICE.txt.
        constexpr int z5ii_values[3][3] = {{13133, -5542, -1280},
                                          {-4325, 12543, 1972}, {34, 792, 7662}};
        constexpr int zr_values[3][3] = {{11206, -4286, -941},
                                        {-4879, 12847, 2251}, {-745, 1654, 7374}};
        const auto& values = zr ? zr_values : z5ii_values;
        double matrix[4][3]{};
        for (int r = 0; r < 3; ++r) for (int c = 0; c < 3; ++c)
            matrix[r][c] = imgdata.color.cam_xyz[r][c] = float(values[r][c] / 10000.0);
        cam_xyz_coeff(imgdata.color.rgb_cam, matrix);
        libraw_internal_data.internal_output_params.raw_color = 0;
        return true;
    }
};

} // namespace spk::io
