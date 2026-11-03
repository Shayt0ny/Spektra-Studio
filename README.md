# Spektra Studio · Windows

**把 RAW 显影、胶片冲印、片边印字和观片，放进一个可以反复推敲的桌面工作流。**

Spektra Studio 是由 **shayt0ny** 维护的非官方 Windows 分支，基于
[JamesQiu2005 / SpektraLab](https://github.com/JamesQiu2005/SpektraLab) 的原生应用基础，
继承 [Andrea Volpato / spektrafilm](https://github.com/andreavolpato/spektrafilm)
的光谱胶片与印相模型，并继续完善 Windows 上的兼容性、交互、观片和导出体验。

**当前本分支版本：1.0.10-win.1 · Windows x64 · 苹果石墨暗色界面**

[下载与发布](https://github.com/YZH2006517/SpektraLab-Windows-NANATATA/releases) ·
[本次更新公告](GITHUB_RELEASE_1.0.10_zh-CN.md) ·
[使用与版本说明](WINDOWS_STUDIO_1.0.10.md) ·
[研究材料说明](WINDOWS_MATERIAL_STUDIES.md) ·
[源码构建](BUILD_WINDOWS_R4.md) ·
[作者与来源](AUTHORS_WINDOWS.md)

> 原光谱模型和原生应用的贡献属于上游作者。本分支并非官方 SpektraLab 发行，
> 版本号独立；官方项目也已有 Windows 测试版。这里记录的是本分支的维护和扩展，
> 不代表已完整合并所有 macOS 更新。

![Spektra Studio 1.0.10 苹果石墨编辑界面](screenshots/windows-studio-1.0.10-graphite.png)

*界面示意使用合成测试图像展示布局，不作为胶片色彩或实拍材料的对照样张。*

## 从照片到胶片，再到一张完成的作品

在这里，胶片与相纸是一条流程中的不同材料。你可以从 RAW 整理光线和白平衡，
选择胶片的响应，再选择印相材料，检查扫描后的结果，最后进行显影后调整。
同一张底片换一张相纸，也值得重新观察高光、黑位和色彩的变化。

| 阶段 | 你在做什么 |
| --- | --- |
| RAW 影调 | 整理输入照片的白平衡、光线、曲线和颜色 |
| 胶片／显影前 | 选择材料、曝光、颗粒、光晕与场景置位 |
| 印相／扫描 | 选择相纸或电影印片，调整冲印、扫描和锐化 |
| 显影后 | 对已经形成的画面进行曲线、色彩和局部调整 |
| 片边／即时相纸 | 确认最终画幅、图窗、日期和手写内容 |
| 观片与导出 | 对照照片、检查细节，按用途保存成片 |

例如 **5207 是 Kodak VISION3 250D 的 35mm 编号**；250D＋2383、250D＋2393
是胶卷与电影印片的不同搭配，不是把某个组合整体叫作“5207”。左栏的折叠快捷
组合可用于保存这些搭配，切换时保留你的 RAW、曝光和其他编辑。

## 1.0.10 这次更新了什么

### 拍立得终于可以自己选构图

在“拍立得相纸”中打开 **调整图窗取景**：

- 拖动照片，选择图窗内显示的位置；按指针位置缩放，支持 1–8 倍倍率。
- 90° 旋转、镜像、重置，或从整张源照片重新取景。
- 纸框与手写笔迹固定，Instax mini 和历史 T-600 分别保存取景。
- 拖动时使用本地预览；保存为一个撤销步骤，取消不修改照片。

纸框补充了两种不同的细微表面、裁切边、圆角和图窗压合接缝。这些细节属于输出
物体的外观，不改胶片的材料响应。它们仍是固定光照的程序化近似，尚未标定纸面
光泽、观察角度反射或药剂扩散。

### 新增三款研究胶片

**Ortho Plus 80 → Velvia 50 → Delta 3200** 已加入目录，名称后保留红色测试版标识，
选中后显示“Shayt0ny 创建 · 测试版，非正式版滤镜”。它们的曲线来源和未标定部分
可以直接在材料说明和教程中查看。

本轮同时移除 **FB Warmtone、ART 300** 和 Double-X＋Warmtone 入口。旧照片中
引用过这两款相纸的配方会回退到兼容相纸，并提示复查当前影调；相关已存快捷组合
不再列出。源照片不因此删除。

### 左栏更容易找，拖动少做重复工作

胶片／相纸各自提供当前选择摘要、名称搜索和限高列表。冲印／扫描参数与剪贴板
放入折叠区，导航图缩小，原有折叠偏好保留。中英文 100%、115%、130% 界面缩放
均做过排版检查。

取景页进入时只读取两张限长边快照，之后的拖动、缩放、旋转与镜像使用本地
Canvas2D／rAF。继续保留主画布纹理复用、手写缓存和观片台的队列控制，减少重复
解码、重复上传和过时渲染工作。效果与精度要求不因为性能优化而放宽。

## 可以用它完成哪些工作

### RAW 与镜头配置

独立的 **RAW 影调** 页面提供白平衡、光线、RGB／通道曲线、色彩平衡与 HSL。
RAW 编辑、胶片参数和显影后参数分开保存，可以在同一张照片上逐步比较。

可选机内曲线色彩与 DCP 配置作用于进入胶片前的照片；镜头矫正支持自动匹配，
也支持导入适用的 Adobe RAW LCP。畸变、色差、暗角与裁边使用冻结配置联动预览
和导出。配置文件本身仍需匹配相机、镜头及焦段，不能仅凭文件导入成功就认定
所有光学参数已经验收。

本分支持续修正 Panasonic RW2、Nikon 新机型／HE 编码等边界，并保留稳定解码器、
候选解码器及自动选择策略。支持范围仍以具体格式和相机样本验证为准。

### 胶片、冲印与影调调整

保留上游的光谱胶片／印相流程、颗粒、光晕、成色剂耦合与放大机配光控制。
常用组合可以收进折叠预设区，完整配方可保存、分享和恢复。

逐照片测量的 **自适应场景** 支持曝光与宽容度适配，也可保持曝光仅调整溢出。
需要你主动点击，结果可以整体撤销；它不识别照片是否安装了柔光镜，也不能恢复
输入已经截断的细节。显影后自动调整与 RAW 自动曲线则用于各自对应的编辑阶段。

### 原有物理片边、边码与日期后背

继承并恢复原版的物理片边／印字路径，保留齿孔、边码、片窗形状、半影和曝光
联动。可按 135、半格、XPan、120 等画幅组织作品，并检查最终画面与片边的关系。

本分支这部分的重点是恢复和修复已有物理路径，避免后续叠加破坏原有质感；
并不把上游已有片边或日期功能重新宣称为原创。

半格配对允许两张照片共享一个胶片画幅，各格的源图编辑和共享材料编辑分别处理。

### To 签、手写日期与完整即时相纸

即时成像有自己的图窗与相纸边缘，使用自带收像层，不再套一张额外相纸或卷片
日期后背。日期和留言可以写在外面的白边上。

手写页提供细字、油漆笔、斜头三种笔型，以及金、银、黑三色。默认只写白边，也
可主动允许画面签绘；笔迹按纸幅保存，并包含在最终输出中。金银墨水为固定光照
近似，不是随观看角度变化的真实金属反射。

### 独立观片台与放大镜

在实体灯箱式台面上摆放单张、胶片条或混合内容，也可切换接触表与单张浏览，
完成保留／排除标记、平铺、缩放、旋转和放大检查。

普通胶片按透射灯观看；拍立得以完整、不透光相纸显示，使用独立正面光，默认
中性 100%。放大镜遵守同一规则，台面摆放和照明不改变导出像素。

这一工作流参考了 **YZH2006517 / Photo-All**，在本分支的 React／Tauri、存储与原生
显影管线上独立实现。具体来源见 [Photo-All 说明](PHOTO_ALL_REFERENCE.md)。

### 导出与本地工具

提供 JPEG、8／16 位 PNG、TIFF、无损 WebP 等导出路线，以及数字中间片、RAW
显影母版和原图＋配方等用途；可选择目标色域、尺寸、命名与已有文件处理方式。
导出前可按目标配方检查软打样。

便携包附带 CLI／MCP 所需的 Node 运行时。启用“设置 → Agents”后，本地工具可以
读取配方、处理、预览和导出；访问默认关闭，调用仍受相同设置和输入规则约束。
详见 [CLI 与本地 Agent 文档](desktop/AGENTS-CLI.md)。

## 材料目录：普通配置与研究版本分开

当前目录共 **42 项材料配置：34 项普通配置＋8 项研究配置**。
按目录用途划分为 **32 个胶片／即时成像配置、10 个印相材料配置**；电影印片也属于
这里的印相材料，因此不能把总数写成“42 款胶片”或“10 种摄影相纸”。

<details>
<summary>查看普通胶片与印相材料</summary>

| 类别 | 收录配置 |
| --- | --- |
| Kodak 彩色负片 | Portra 160／400／800、800 Push 1／Push 2、Ektar 100、Gold 200、Ultramax 400 |
| Fujifilm 彩色负片 | C200、Pro 400H、X-Tra 400 |
| 电影及相关负片 | VISION3 50D／200T／250D／500T、Verita 200D、CineStill 800T |
| 彩色正片 | Provia 100F、Velvia 100、Ektachrome 100、Kodachrome 64 |
| 黑白负片 | Tri-X 400、T-Max 100、HP5 Plus 400、Neopan 100 Acros II |
| 摄影印相材料 | Crystal Archive Type II、Ilford Multigrade IV RC、Kodak Ektacolor Edge、Endura Premier／Portra／Supra／Ultra Endura |
| 电影印片 | Kodak VISION 2383、VISION Premier 2393 |

目录身份不等于所有历史批次或实物工艺均已重新测量。材料数据的来源、许可和模型
假设继续按各自 NOTICE 与配置 metadata 保留。

</details>

| 研究材料 | 使用的资料／工艺起点 | 当前限制摘要 |
| --- | --- | --- |
| Double-X 5222 | Kodak D-96，21℃ 6.5 分钟，γ0.66 | 肩部、颗粒与 MTF 未标定 |
| HARMAN Phoenix 200 第一代 | 第一代 C-41 图表 | 染料／片基借用明确标出的 Vision3 250D 数据 |
| Fujicolor Maxima | 厂家光谱图表 | H-D 曲线／模型借用 Type II，白点与中性平衡未校准 |
| Instax mini · 历史验证 | 历史资料，25℃、24 小时密度读数 | 有效反射密度原型，非完整药剂扩散模型 |
| Polaroid T-600 · 历史验证 | 原厂 pre-2008 资料 | 非现代 600／i-Type；染料形状借用 Instax |
| Ortho Plus 80 | ID-11 原液，20℃ 8 分钟，G0.62 | 楔形光谱解释、片基及颗粒未标定 |
| Velvia 50 | 独立 RVP50 E-6／CR-56 图表 | 窄带染料解混近似，片基／尾部／颗粒有假设 |
| Delta 3200 | DD-X 1+4，20℃ 图示 9 分钟 | 非 EI3200 推荐 9.5 分钟；ISO1000 与 EI3200 不同 |

研究版本采用约 0.05 D、5–10 nm、0.1 对数灵敏度精度的厂家图表粗读，**不是自行
实测标定**。试用起点会明确关闭尚未标定的颗粒等效果，并保留你的 RAW、曝光、
裁剪和显影后编辑。每项完整限制见 [材料研究说明](WINDOWS_MATERIAL_STUDIES.md)
及 [资源 NOTICE](engine/resources_research/NOTICE.md)。

## 和原版是什么关系

这里把“来源”和“本分支改动”分别列出，避免把上游能力或独立项目混成一个版本。
对比参照为本分支已记录的 SpektraLab Windows 1.3.4 beta 基础及后续选择性审查，
不代表对所有上游当前分支完成了逐功能比较。

| 内容 | 来源与本分支工作 |
| --- | --- |
| 光谱胶片、相纸与冲印思想 | 来自 Andrea Volpato／spektrafilm；继续保留模型与数据来源 |
| 原生应用、片边、日期等基础 | 来自 JamesQiu2005／SpektraLab 及既有贡献者；本分支做 Windows 维护、恢复和联动修复 |
| Windows 起点 | 继承既有 Windows beta 和早期移植工作，不是首次让该项目支持 Windows |
| RAW、显示与内存边界 | 在 Windows 路径增加相机配置、LCP、共享内存、预算回收及显示恢复修正 |
| 观片体验 | 参考 Photo-All 工作流，独立接入本分支的显影、缓存、存储和颜色流程 |
| 即时相纸与研究配置 | 本分支扩展，明确区分图表研究、代理数据与未完成的标定 |
| 1.0.10 相对 1.0.9 | 自由图窗取景、纸框细节、三款新研究胶片、两款相纸移除与左栏整理 |

Windows 采用 **C++／Vulkan 原生显影＋React／Tauri 桌面界面**，通过独立原生 host
工作；应用运行不需要安装 Python。它与上游 macOS 的 C++／Metal 打包形态不同，
不能把一侧测试通过当作另一侧逐像素一致的证明。

更多来源和审查边界：[上游审查](UPSTREAM_RELEASE_REVIEW_20261102.md)、
[原模型与 Windows 管线审查](WINDOWS_SPEKTRAFILM_PIPELINE_AUDIT.md)。

## 下载、解压与第一次使用

在仓库 [Releases](https://github.com/YZH2006517/SpektraLab-Windows-NANATATA/releases)
选择对应版本；附件是否已上传以发布页为准。本地生成包与 GitHub 上传是两个步骤。

| 文件 | 用途 | 大小 |
| --- | --- | --- |
| `Spektra-Studio-1.0.10-win.1-Windows-x64.zip` | Windows x64 便携版 | 60.9 MiB |
| `Spektra-Studio-1.0.10-win.1-Source.zip` | 本版对应源码及依赖来源 | 105.4 MiB |
| `Spektra-Studio-1.0.10-win.1-SHA256SUMS.txt` | 两个压缩包的校验值 | 文本 |

1. 完全退出旧版，将新 ZIP **完整解压到一个新目录**。
2. 双击 `Spektra Studio.exe`，保留全部 DLL、`host` 和 `agents`。
3. 导入文件或文件夹，先检查 RAW 白平衡与输入亮度。
4. 选择胶片和兼容的印相材料，固定输入后比较不同搭配。
5. 需要时使用自适应场景、显影后编辑、片边或即时相纸取景。
6. 在观片台检查细节，再按用途选择导出配方和目标色域。

Windows x64、可用的 Vulkan 显卡驱动和 WebView2 运行时是运行环境的一部分。
用户不需要另外安装 Python、Node 或 Vulkan SDK。若程序无法启动，应先检查解压
是否完整、WebView2 与显卡驱动，以及包内诊断信息；不要仅复制主 EXE。

便携运行不表示所有设置都写在程序目录。照片配方、缓存与应用设置按各自存储规则
保存。升级时保留旧目录，重要配方可先导出备份；不要同时对同一照片启动两个版本
进行编辑。

在 PowerShell 中核对下载文件：

```powershell
Get-FileHash -Algorithm SHA256 .\Spektra-Studio-1.0.10-win.1-Windows-x64.zip
Get-FileHash -Algorithm SHA256 .\Spektra-Studio-1.0.10-win.1-Source.zip
```

将结果与同版本 `SHA256SUMS.txt` 比较。便携包内另有逐文件 `FILES.sha256`、
`SOURCE.txt`、`VALIDATION.txt` 和 `RELEASE_INFO.json`。私人 RAW、Adobe DCP／LCP
及研究下载 PDF 没有放入发行包。

## 性能与画面验证

这版继续使用 **Standard 颗粒、既有彩噪修复与补偿 FP32 光谱累加**，未接入 Fotu。
补偿 FP32 不等于全程 FP64，也不意味着整个渲染管线已达到双精度误差水平。

1.0.10 发行前的检查：

| 检查 | 结果／范围 |
| --- | --- |
| 前端单元与集成测试 | 615 通过，1 项可选旧式 staged-export 用例未启用 |
| 原生 CTest | 60／60 通过 |
| 本轮选定界面／原生联动 | 10／10 通过，含真实 RAW、八项研究材料、旧配方恢复和中英文缩放 |
| 打包工具检查 | 2／2 通过 |
| 开发构建 | web／Node／agent 类型检查、源代码 ESLint、web、CLI、Rust release 通过 |
| 待发布目录检查 | 相纸、片边、proof、无胶片、曝光、CLI／MCP、真实 RAW 均通过 |
| 压缩包 | CRC、逐文件 SHA-256 与外部校验值通过 |

34 个旧材料文件与**本分支 1.0.5 源包**一致，片边／印字样张回归哈希一致。对原始
spektrafilm 数据的比较有单独范围，不能把这里的 34 个文件直接说成全部原作者配置。

拖动行为检查中，RAW／成片平移分别产生 40／41 次绘制，均未新增纹理上传、像素
读回或原生渲染请求。该结果说明测试场景下复用了已有数据，**不是通用 FPS 或加速
倍率承诺**。没有新增 macOS Metal／Python oracle 全套 parity、AMD 实机覆盖或
RF24–240 镜头光学校准验收；通过数值门限也不等于研究材料已完成实拍标定。

## 常见问题

<details>
<summary>为什么柔光镜和大光比照片更容易觉得“不对”？</summary>

柔光镜带来的光晕与雾化已经进入照片，叠加模拟光晕、扫描锐化、曝光与输出反差后，
可能进一步压缩层次或强化雾感。大光比也更容易触及胶片、印相与输出的可呈现范围。
先确认输入是否已截断，再检查场景适配和对应阶段的设置；不能靠更改某款材料的
测量曲线，替所有照片掩盖渲染问题。自适应场景是逐照片测量的辅助入口。

</details>

<details>
<summary>测试版材料为什么默认关闭一些效果？</summary>

新材料还没有完整的颗粒、光晕或空间响应标定。明确关闭未拟合效果，才能让你
知道当前比较的是哪些图表数据与假设。原有普通材料沿用自己的工作流，不会因为
试用研究版本而统一重写材料数据。

</details>

<details>
<summary>拍立得和宝丽来已经完全还原实物了吗？</summary>

目前实现了历史资料驱动的有效反射密度验证、专用纸幅／图窗、自由取景、手写与
不透光观看。药剂扩散、滚轴、纸面光泽及现代批次对应关系尚未完整标定，因此不能
称作 100% 实物或化学复刻。历史 T-600 也不是当代 600／i-Type 配方的代称。

</details>

<details>
<summary>LCP 导入成功，为什么还要看镜头和焦段？</summary>

导入、参数解析和像素变换能够运行，只证明功能链路正常。实际光学效果还依赖
文件类型、相机／镜头、焦段、光圈与距离覆盖。RF24–240 文件的功能链路已检查，
但缺少对应实拍样本，未据此宣称已验收该镜头的光学校准精度。

</details>

<details>
<summary>预览好看，为什么导出仍要检查？</summary>

显示色域、目标色域、文件尺寸与位深是不同选择。使用导出配方和软打样核对目标
结果；不能把某个预览缓存的状态当作所有输出格式的完整验收。

</details>

## 源码、构建与问题反馈

Windows 构建入口是 [BUILD_WINDOWS_R4.md](BUILD_WINDOWS_R4.md)，辅助说明见
[BUILD_WINDOWS.md](BUILD_WINDOWS.md) 与 [引擎 Windows 文档](engine/WINDOWS.md)。
前端位于 `desktop/`，原生引擎和 host 位于 `engine/`；`modern_UI/` 保留上游 macOS
来源和应用资源，不是本版 Windows 启动入口。

```text
desktop/src/                 界面、编辑状态、观片与导出流程
desktop/src-tauri/           桌面宿主、文件与原生进程边界
desktop/agent/               本地 CLI／MCP 工具
engine/src/                 原生显影与输出阶段
engine/host/                输入解码、镜头处理及文件输出
engine/resources_research/  明确标注限制的八项研究材料
```

研究 JSON 已随源码提供，常规应用构建／运行不执行研究 Python 脚本。
可选离线生成与参考验证所需环境，应按对应工具文档单独配置。

提交问题时，请说明应用版本、Windows／显卡／驱动、相机与文件格式、出现问题的
操作步骤，以及属于 RAW、胶片、纸框、预览还是导出。可提供脱敏截图或你有权分享
的样本；不要在公开 Issue 上传私人照片、凭证或无权分发的镜头／相机配置文件。

## 作者、来源与许可

| 来源 | 贡献与关系 |
| --- | --- |
| [Andrea Volpato／spektrafilm](https://github.com/andreavolpato/spektrafilm) | 光谱模型、原始胶片与印相资料及参考实现 |
| [JamesQiu2005（Hanze Qiu）／SpektraLab](https://github.com/JamesQiu2005/SpektraLab) | 原生 C++／Metal、macOS 应用与项目基础 |
| NANATATA 及既有 Windows 贡献者 | 早期 Windows 移植与维护来源链 |
| shayt0ny | 本分支 Windows 维护、兼容性修复、交互扩展与研究配置 |
| [YZH2006517／Photo-All](https://github.com/YZH2006517/Photo-All) | 独立观片台的工作流与设计参考 |
| 第三方库与资料作者 | 解码、颜色、字体、运行时与各自数据；按随附 NOTICE 保留来源 |

程序源码继续遵守 **GPL-3.0-or-later**。既有胶片／印相配置及相关衍生数据保留
各自许可，包括 **CC BY-SA 4.0**；新图表读数的 CC0 范围见研究资源 NOTICE，不能
概括为“所有材料都是 CC0”。运行时与第三方组件按 `host/licenses/` 等随包许可
处理。许可文本与修改记录见 [license/](license/)、[Windows 署名](AUTHORS_WINDOWS.md)
和 [Photo-All 来源说明](PHOTO_ALL_REFERENCE.md)。

感谢原作者和贡献者持续开放模型、数据与应用实现。这里对新增或修正工作的署名，
不改变上游作者、第三方测量数据或用户照片的权利，也不代表品牌官方授权。

---

**English:** Spektra Studio is an unofficial Windows maintenance branch built on
SpektraLab and the spektrafilm spectral film/print model. Version 1.0.10 adds
instant-photo reframing, paper appearance refinements, three explicitly
provisional film studies and a tidier material rail. It retains the existing
Standard grain and compensated-FP32 fixes. Manufacturer-chart studies and
fixed-light paper/ink illustrations are not fully calibrated physical replicas.
Please retain upstream credits and the licences shipped with the source and
portable release.
