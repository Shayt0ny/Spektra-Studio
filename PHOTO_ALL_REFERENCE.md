# Photo-All reference and attribution

Spektra Studio's independent Lighttable workflow was informed by
[YZH2006517/Photo-All](https://github.com/YZH2006517/Photo-All).

- Author / repository owner: **YZH2006517** and the contributors credited by that repository.
- Reviewed revision: `0ad5af2319090eafcc1efe11f7467b6abacc5fe4`, retrieved 2026-10-31.
- Upstream application source headers: **SPDX-License-Identifier: GPL-3.0-or-later**.
- [Upstream license](https://github.com/YZH2006517/Photo-All/blob/0ad5af2319090eafcc1efe11f7467b6abacc5fe4/LICENSE).
- Reference files: `product/ui/Lighttable.tsx`, `FilmTable.tsx`, `Preview.tsx`, `model.ts`,
  `validation/lighttable_smoke.cjs`, and `product/README.md` at that revision.

## Scope of the reference

The reference informed the physical lightbox with movable film pieces,
display-only lamp brightness, tiling, placement sizing/rotation and a loupe,
as well as contact-sheet / single-photo / film-roll review,
keep / reject / unmark and automatic advance, a fixed review range,
independent save ordering, shared decoded previews, cancelling offscreen work,
and respecting reduced motion. These are acknowledged as workflow and design
references, not claimed as original product ideas.

The new `desktop/src/lighttable/` implementation was written for Spektra
Studio's existing React/Tauri app. It uses Spektra's file metadata, immutable
frame snapshots, native proof renderer, display cache and color conversion.
It does not bundle or execute Photo-All, copy its UI source files, use its
Python service, RawTherapee runtime, CLIP model, LUT assets or Motion dependency,
or reproduce its refractive optical simulation. No additional runtime library
or model download is introduced by this integration.

The independent implementation remains GPL-3.0-or-later, consistent with this
repository. Any future direct source or asset reuse must preserve upstream
headers and the relevant asset's separate license, provenance and notices.
Spektrafilm's existing profiles retain their existing CC BY-SA attribution;
this reference does not change that attribution or any user's photo rights.

## 中文说明

观片台的工作流参考了 **YZH2006517 / Photo-All**：实体灯箱式台面、可摆放胶片、
台灯亮度、平铺与摆放缩放／旋转、放大镜，以及接触表、单张与胶卷浏览、
保留／排除标记、固定审阅范围、自动下一张、顺序保存和图片缓存复用。
仓库 README、Windows 署名、应用“关于”和许可证保留来源入口。
观片台画面不叠加 Photo-All 水印或页脚链接（用户要求移除界面标记）。

此处的“参考”是产品流程与设计参考；没有把对方整个应用作为依赖安装，
也没有引入另一套显影引擎。Spektra Studio 的新界面、存储与性能调度独立实现，
照片显影、蒙版、颜色和导出继续使用原有原生管线。
