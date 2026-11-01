# Export codecs are fetched/verified by setup-codecs, never by CMake. Keep
# upstream builds isolated: libjpeg-turbo does not support add_subdirectory.
include(ExternalProject)
set(SPEKTRALAB_CODECS_DIR "${SPEKTRALAB_DEPS_DIR}/export-codecs" CACHE PATH "Pinned export codec source directory")
foreach(pair "libjpeg-turbo-3.2.0/CMakeLists.txt" "libpng-1.6.59/CMakeLists.txt" "zlib-ng-2.3.3/CMakeLists.txt" "libwebp-1.6.0/CMakeLists.txt")
    if(NOT EXISTS "${SPEKTRALAB_CODECS_DIR}/${pair}")
        message(FATAL_ERROR "Export codecs missing: run engine/setup-codecs.ps1 or engine/setup-codecs.sh, then set SPEKTRALAB_CODECS_DIR")
    endif()
endforeach()
set(codec_prefix "${CMAKE_CURRENT_BINARY_DIR}/codec-install")
file(MAKE_DIRECTORY "${codec_prefix}/include")
set(codec_args -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${codec_prefix}
    -DCMAKE_INSTALL_LIBDIR=lib -DCMAKE_C_COMPILER=${CMAKE_C_COMPILER}
    -DCMAKE_MAKE_PROGRAM=${CMAKE_MAKE_PROGRAM} -DCMAKE_POSITION_INDEPENDENT_CODE=ON)
if(CMAKE_TOOLCHAIN_FILE)
    list(APPEND codec_args -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE})
endif()
if(MSVC)
    set(codec_jpeg "${codec_prefix}/lib/jpeg-static.lib")
    set(codec_png "${codec_prefix}/lib/libpng16_static.lib")
    set(codec_zlib "${codec_prefix}/lib/zlibstatic.lib")
    set(codec_webp "${codec_prefix}/lib/webp.lib")
    set(codec_sharpyuv "${codec_prefix}/lib/sharpyuv.lib")
else()
    set(codec_jpeg "${codec_prefix}/lib/libjpeg.a")
    set(codec_png "${codec_prefix}/lib/libpng16.a")
    set(codec_zlib "${codec_prefix}/lib/libz.a")
    set(codec_webp "${codec_prefix}/lib/libwebp.a")
    set(codec_sharpyuv "${codec_prefix}/lib/libsharpyuv.a")
endif()
find_program(SPEKTRALAB_NASM nasm HINTS "${SPEKTRALAB_CODECS_DIR}/nasm-2.16.03")
set(jpeg_args -DENABLE_SHARED=OFF -DENABLE_STATIC=ON -DWITH_TURBOJPEG=OFF
    -DWITH_TOOLS=OFF -DWITH_TESTS=OFF -DWITH_SIMD=ON -DREQUIRE_SIMD=ON)
if(SPEKTRALAB_NASM)
    list(APPEND jpeg_args -DCMAKE_ASM_NASM_COMPILER=${SPEKTRALAB_NASM})
endif()
ExternalProject_Add(spk_jpeg_build SOURCE_DIR "${SPEKTRALAB_CODECS_DIR}/libjpeg-turbo-3.2.0"
    DOWNLOAD_COMMAND "" UPDATE_COMMAND "" CMAKE_ARGS ${codec_args} ${jpeg_args}
    BUILD_BYPRODUCTS "${codec_jpeg}" LOG_CONFIGURE ON LOG_BUILD ON LOG_INSTALL ON)
ExternalProject_Add(spk_zlib_build SOURCE_DIR "${SPEKTRALAB_CODECS_DIR}/zlib-ng-2.3.3"
    DOWNLOAD_COMMAND "" UPDATE_COMMAND "" CMAKE_ARGS ${codec_args}
        -DBUILD_SHARED_LIBS=OFF -DZLIB_COMPAT=ON -DBUILD_TESTING=OFF -DWITH_GTEST=OFF
    BUILD_BYPRODUCTS "${codec_zlib}" LOG_CONFIGURE ON LOG_BUILD ON LOG_INSTALL ON)
ExternalProject_Add(spk_png_build SOURCE_DIR "${SPEKTRALAB_CODECS_DIR}/libpng-1.6.59"
    DEPENDS spk_zlib_build DOWNLOAD_COMMAND "" UPDATE_COMMAND ""
    CMAKE_ARGS ${codec_args} -DPNG_SHARED=OFF -DPNG_STATIC=ON -DPNG_TESTS=OFF -DPNG_TOOLS=OFF
        -DZLIB_LIBRARY=${codec_zlib} -DZLIB_INCLUDE_DIR=${codec_prefix}/include
    BUILD_BYPRODUCTS "${codec_png}" LOG_CONFIGURE ON LOG_BUILD ON LOG_INSTALL ON)
ExternalProject_Add(spk_webp_build SOURCE_DIR "${SPEKTRALAB_CODECS_DIR}/libwebp-1.6.0"
    DOWNLOAD_COMMAND "" UPDATE_COMMAND "" CMAKE_ARGS ${codec_args}
        -DBUILD_SHARED_LIBS=OFF -DWEBP_BUILD_ANIM_UTILS=OFF -DWEBP_BUILD_CWEBP=OFF
        -DWEBP_BUILD_DWEBP=OFF -DWEBP_BUILD_GIF2WEBP=OFF -DWEBP_BUILD_IMG2WEBP=OFF
        -DWEBP_BUILD_VWEBP=OFF -DWEBP_BUILD_WEBPINFO=OFF -DWEBP_BUILD_WEBPMUX=OFF
        -DWEBP_BUILD_LIBWEBPMUX=OFF -DWEBP_BUILD_EXTRAS=OFF -DWEBP_BUILD_TESTS=OFF
    BUILD_BYPRODUCTS "${codec_webp}" "${codec_sharpyuv}" LOG_CONFIGURE ON LOG_BUILD ON LOG_INSTALL ON)
foreach(codec jpeg png zlib webp sharpyuv)
    add_library(spk_codec_${codec} STATIC IMPORTED GLOBAL)
    set_target_properties(spk_codec_${codec} PROPERTIES IMPORTED_LOCATION "${codec_${codec}}"
        INTERFACE_INCLUDE_DIRECTORIES "${codec_prefix}/include")
    if(codec STREQUAL "sharpyuv")
        add_dependencies(spk_codec_${codec} spk_webp_build)
    else()
        add_dependencies(spk_codec_${codec} spk_${codec}_build)
    endif()
endforeach()
set_property(TARGET spk_codec_png PROPERTY INTERFACE_LINK_LIBRARIES spk_codec_zlib)
set_property(TARGET spk_codec_webp PROPERTY INTERFACE_LINK_LIBRARIES spk_codec_sharpyuv)
file(MAKE_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/third-party/codecs")
foreach(notice "libjpeg-turbo-3.2.0/LICENSE.md" "libjpeg-turbo-3.2.0/README.ijg"
               "libpng-1.6.59/LICENSE" "zlib-ng-2.3.3/LICENSE.md" "libwebp-1.6.0/COPYING" "libwebp-1.6.0/PATENTS")
    string(REPLACE "/" "-" destination "${notice}")
    configure_file("${SPEKTRALAB_CODECS_DIR}/${notice}" "third-party/codecs/${destination}" COPYONLY)
endforeach()
