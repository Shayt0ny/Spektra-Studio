# Photo-All／SpektraLab 最新发布采用审查

审查日期：2026-11-02，中国标准时间。仅审查最新发布及对应源码差异，未整包合并。

## 固定参照

| 项目 | 最新发布 | 中国标准时间 | 对应提交 |
|---|---|---|---|
| Photo-All | [0.10.6，预发布](https://github.com/YZH2006517/Photo-All/releases/tag/v0.10.6) | 11-02 17:24 | `276cc50e0a2128141fc9ea91654fd022a8654ac0` |
| SpektraLab | [1.3.5，macOS 正式版](https://github.com/JamesQiu2005/SpektraLab/releases/tag/spektralab-v1.3.5) | 11-02 20:48 | `02d82b56cf65f0f8e802a708612edc4e9a4790af` |

Photo-All 全部当前发布都是预发布，GitHub `/releases/latest` 因而返回 404；本轮用
完整 releases API 确认 0.10.6，不能把缓存发布列表里的 0.10.5 当作最新。
SpektraLab 最新 Windows 包仍是 1.3.4 beta.2；1.3.5 是 Apple silicon/macOS 发布。

对比：[Photo-All 0.10.5 → 0.10.6](https://github.com/YZH2006517/Photo-All/compare/v0.10.5...v0.10.6)、
[SpektraLab 1.3.4 → 1.3.5](https://github.com/JamesQiu2005/SpektraLab/compare/spektralab-v1.3.4...spektralab-v1.3.5)。
API 原始比较结果保存在本地忽略目录 `build/precision-fp64/release-audit/`。

## 可以采用什么

| 项目／修复 | 本地对照和采用结论 | 优先级 |
|---|---|---|
| SpektraLab：原图和后期编辑时刷新直方图，保留拖动最后一步 | **最值得先适配。** Windows `Canvas.tsx` 的屏幕绘制会跟随 `showingOriginal`，但输出／直方图 effect 的 `compare` 和依赖列表没有该状态；此外异步直方图回调没有当前画面代次检查。应以 TS／Web Worker 的代次及原图来源修复，不能复制 Metal 的纹理身份判断。 | P1 |
| SpektraLab：外部 sidecar 改动实时显示 | 本地已有 agent journal、自动重载、revision/CAS 保护及未保存编辑冲突提示。macOS 采用外部写入优先；本地保留冲突保护，不能直接改成覆盖当前未保存编辑。 | 已有，补边界验证 |
| SpektraLab：将自己的保存误判为外部写入，codec 非恒等时回滚编辑 | 本地 `sidecarContent` 已按 `encodeSidecar(decodeSidecar(raw))` 比较，并过滤保存修订标记；与上游最终修复的原则相同。保留该机制，针对未知嵌套字段／空 camera 的回归有价值。 | 已有原则 |
| SpektraLab：从缓存重启后原图为空、点击原图立刻请求全尺寸 | 本地 `setOriginal(true)` 已调用 `refreshOriginal`，主动走 `render_source`。可增加重启＋缓存命中专用验收，不需要移植 Swift display-cache 代码。 | 已有，补场景 |
| SpektraLab：片边期间禁用原图并说明原因 | 本地 TopBar 已依据 `sourceGeometryFor` 禁用，提示使用取景查看源图；日期进入负片几何的情况也覆盖。 | 已有 |
| SpektraLab Windows beta.2：固定曝光位置及胶片条滚轮 | 本地已有固定曝光字段、测光切换和滚轮浏览，不重复覆盖。对应前端及原生曝光测试保留。 | 已有 |
| Photo-All：缓存图已加载却未标为 ready、原尺寸候选切换 | 可以借鉴请求／资源身份校验和缓存命中确认。本地 ReviewImagePool 返回已解码 ImageBitmap 的 Promise/lease，不使用该版本的 HTMLImageElement `onLoad` 路径，不能机械套入其 useLayoutEffect。 | P2，按本地复现适配 |
| Photo-All：RAW 先用内嵌预览浏览／分析、限制并发 | 本地原生 thumbnail 已优先内嵌 JPEG、失败才半尺寸解码；浏览池已串行并有取消与内存上限。其双任务 Python 分析器不直接引入。JPEG 代理继续限定浏览，不能输入物理胶片或代替原片导出。 | 已有部分，按需优化 |
| Photo-All：独立临时目录组装更新包 | 值得采用原则。本地 package.mjs 仍会清理固定 release 组装目录；应改为唯一临时工作目录生成包，避免运行中的便携构建被覆盖。无需引入其 Python 打包器。 | P2 |
| Photo-All：V 键在鼠标处开镜 | 本地 FilmDesk 已有 V、指针位置和命中胶片的放大镜，避免重复实现。 | 已有 |
| Photo-All：关灯底色、准备区拖片收纳、图集空名称／彻底删除确认 | 可按现有 Lighttable、图集状态和记录撤销设计独立适配。这些是工作流／交互扩展，不应和当前色彩管线修复混在一起。 | 可选 P2 |
| Photo-All：最多 16 层 style/LUT，开关／排序／强度／旧配方迁移 | 可以作为 Layer 2 新功能设计。后端需要有序色彩映射、资源与配方身份、预览／导出一致及撤销；不能把“叠滤镜”实现成多次叠物理胶片模型。LUT 资源另核对随附许可与署名。 | 可选 P3 |
| Photo-All：WebGL2 即时屏幕代理、停止拖动后换精细结果 | 只参考响应调度。它自己说明 RAW 临时响应、颗粒和空间滤波可能近似；本地已有 Vulkan 后期和最终输出颜色契约，直接搬代理着色器会引入不同颜色、颗粒或片边／日期再次染色的问题。 | 需单独设计、验证 |
| Photo-All：旋转／拉直自动覆盖画布 | 本地 `straightened`／`constrained` 已计算可容纳的裁剪范围；语义是保留构图并限制裁剪，不直接替换为对方自动放大的坐标公式。 | 先比较具体边界 |

## 与本轮颗粒／片边修复的关系

SpektraLab 1.3.5 的差异没有 `engine/` 文件，主要是 Swift Session、Renderer、sidecar、
测试与文档。它不包含本轮 Windows Vulkan 颗粒输出／FP32 光谱积分的等价修复。
Photo-All 0.10.6 修改 Python 图层、几何、分析和代理预览；新增屏幕着色器是可丢弃
的近似代理，也不能替代本轮已经验证的真实负片颗粒＋输出色度分离。

本轮已完成并单独记录的修复继续保留：
[光谱精度](WINDOWS_SPECTRAL_PRECISION.md)、[日期／片边](WINDOWS_DATE_BORDER_FIX.md)、
[颗粒彩斑](WINDOWS_GRAIN_CHROMA_FIX.md)。本次更新审查没有覆盖或重新引入另一套渲染引擎。

## 采用方式和验证边界

两项目应用源码的 GPL-3.0-or-later 与本项目当前代码许可一致；直接复用仍需保留
源码头、来源、修改说明及相应分发材料。照片配置／LUT 等资源按各自许可证处理。
SpektraLab 1.3.5 README 新增公开分发使用自有名称／图标及明确非官方来源的说明，
代码许可证并不等同于品牌授权。本地应用已使用 Spektra Studio 名称，仍应保留来源。

Photo-All 0.10.6 发布说明明确只做针对性检查，未运行完整测试和安装升级测试；
SpektraLab 1.3.5 的应用测试是 macOS 测试。任何新适配都要在我们的 Windows 路径
验证，不能将这些上游结果当成本地验收。

结论：**可以选择性采用，优先直方图状态与缓存／保存边界；已有等价实现的保留本地
机制，新滤镜层和近似实时预览独立排期。** 未批量合并最新上游代码。

## 2026-11-03 采用记录

- 已修复直方图／导航图的原图、对比分割状态同步，以及异步直方图晚到覆盖最后一步编辑／空画面。
  Playwright 在真实 WebGL 回读与 Worker 之间控制完成顺序，覆盖原图往返、乱序完成和清空画面。
- 已补浏览 Hook 缓存命中与高分辨率候选切换测试；缓存无需新的 load 事件，旧图晚到会释放。
  保留原有内嵌预览、串行生产、取消及内存上限，不引入 Python 分析器。
- 已补缓存重启、原图首次读回失败后重试全尺寸的测试。
- 已补保存后回读的空 camera、未知嵌套字段、codec 默认值、修订／元数据变化测试；
  journal 溢出不会重开未变化的照片或丢失撤销。真实外部编辑仍保留 CAS 和冲突保护。
- 已将安装包的 host、资源、CLI、Tauri config 组装迁到唯一工作目录，输出也使用每次独立的子目录；
  保留先前构建，不再递归清理共享 binaries、host-staging、release。CI 搜索路径同步更新。
  Node 文件系统测试覆盖两个版本相同的构建、缺失结果、已有运行目录和独立 host 资源。

此处是本地独立适配；上游发布本身没有本轮 Vulkan 颗粒／片边修复。打包说明、
验证结果及限制见 [1.0.6](WINDOWS_STUDIO_1.0.6.md)。
