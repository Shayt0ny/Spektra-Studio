# Windows 光谱计算精度修复与验证

日期：2026-11-02。范围：Vulkan 的密度 → 透射光 → 光谱积分。

## 修改和依据

`spk_spectral_epilogue.comp` 原先把 81 个波长响应依次累加到 FP32 总和。
弱波长的单项贡献小于当前总和的半个 ULP 时，该贡献会丢失，即使多个弱项的
合计已经可以表示。现在使用 Kahan 补偿求和，并以 GLSL `precise` 保留误差补偿
所需的运算顺序；没有要求设备提供 FP64，也没有修改胶片／相纸数据或指数公式。

回归用例：一个波长贡献为 1，另外 80 个各贡献 `2^-26`，检查线性和对数输出、
257 个像素的非整工作组及输出保护区。独立解析答案为
`1 + 80 * 2^-26`，末端按现有管线加 `1e-10`。旧着色器严格测试失败，修复后通过。

## FP64 对照的含义

新增 `engine/tests/gpu_vulkan_spectral.cpp`，不依赖 Python 或外部摄影素材。
测试加载此次构建实际携带的 34 个配置，包括派生配置和产品黑白配置；每个配置
按其自身密度范围取 11×11×11 的三维密度网格。扫描使用该材料的观察光源和 CIE
1931 色匹配函数；胶片另外经过 TH-KG3 光源及 Portra Endura 相纸感光度的冲印积分。
总计 61 组计算、487,146 个通道值，涵盖线性及对数两种输出。

CPU FP64 基线用 `pow(10.0, -density)` 及双精度累加，独立于着色器的
`exp2(-density * log2(10))`。输入像素保留公开接口的 FP32 表示，材料常数保留
原始双精度。另算两条基线：仅把常数缩窄为 FP32 后的双精度计算，以及 CPU FP32
计算，以区分常数上传与算术误差。NaN 波长沿用生产环境的准备步骤中和。

误差以 `abs(log10(GPU响应) - log10(FP64响应))` 计；对数模式直接比较输出。
这不是 ΔE，也不是最终 RGB 的误差。数值门限为 `2e-6` 个 log10 响应单位，
约允许百万分之 4.7 的相对响应差异。缺少材料文件、非有限结果、越界写入均失败。

## 本机实测

同一新建构建目录、同一可执行文件、同一组资源；前后仅替换本轮着色器。
NVIDIA 驱动 32.0.16.2101，Intel 驱动 32.0.101.8331。

| 指标 | NVIDIA RTX 5070 修改前 | 修改后 | Intel Graphics 修改前 | 修改后 |
|---|---:|---:|---:|---:|
| 材料网格平均 log10 误差 | 5.78069e-8 | 3.91845e-8 | 6.02964e-8 | 4.81589e-8 |
| 材料网格最大 log10 误差 | 6.45150e-7 | 6.45150e-7 | 7.71843e-7 | 7.71843e-7 |
| 解析累加用例最大绝对误差 | 1.19219e-6 | 3.22479e-8 | 1.19219e-6 | 1.00000e-10 |

平均误差分别下降约 32% 和 20%；最大误差没有降低，不能据此宣称指数函数或整条
管线已达到 FP64 精度。材料网格的最大相对响应差异约为百万分之 1.5／1.8，
本次阶段对照没有复现肉眼可见偏色的量级。

另外在 NVIDIA 上将同一个 1024×768 合成线性场景，经公开 C ABI 完整渲染，
Portra 400 + Portra Endura，关闭颗粒、眩光和自动曝光。前后交替各跑三次：

- 每一侧三个独立进程输出逐字节一致；各进程内完整渲染与 reprint 也一致。
- 前后 ProPhoto RGBA16 输出最大 RGB 差异为 **1 个 16 位码值**，平均 0.0045344
  个码值，没有通道超过 1 个码值，alpha 完全一致。
- 这是修改前后检查，不是原作者 FP64 整图对照。
- 小规模交替运行未显示性能退化；机器不是独占性能环境，不作加速或帧时保证。

## 复现

使用 Windows 文档中的工具链配置构建目录后：

```powershell
cmake --build build/precision-fp64 --target spk_vulkan_spectral -j 6
build/precision-fp64/engine/spk_vulkan_spectral.exe build/precision-fp64/engine/resources
# 选择另一物理设备；索引依本机枚举顺序而定：
$env:SPEKTRAFILM_VULKAN_DEVICE = '1'
build/precision-fp64/engine/spk_vulkan_spectral.exe build/precision-fp64/engine/resources
Remove-Item Env:SPEKTRAFILM_VULKAN_DEVICE
```

`--audit` 只用于记录旧着色器指标，会明确标为 AUDIT ONLY，并跳过弱波长解析
用例的严格断言。正常命令和 CTest 均不使用此选项。

本轮 6 项针对性 CTest 全部通过：`spk_vulkan_smoke`、`spk_vulkan_pointwise`、
`spk_vulkan_spectral`、`spk_vulkan_lut_di`、`spk_vulkan_no_film`、`spk_vulkan_bw`。
另在 Intel 设备上独立通过新增光谱测试；不能扩大成整个 Intel 产品验收。
原始日志与前后着色器位于本地忽略目录 `build/precision-fp64/`。

## 尚未验证

这是对原作者密度转透射光数学公式的独立 FP64 阶段对照，不是运行原作者的
完整 Python 渲染器。现有 `parity_render.py` 仍依赖带旧 service/schema 接口的
参考 fork，且其参考端固定为 FP32；当前没有运行这组外部 parity harness。

没有完成同版本、同参数、同输入与输出约定下的原作者整图 FP64 → CPU FP32 →
GPU FP32 的 ΔE00 分阶段比较。RAW 解码、色域处理、非默认参数、随机效果和
其他阶段仍可能造成差异。本轮未修改 Metal 管线。2026-11-03 纳入 1.0.6-win.1 便携包，包内资源的 spectral gate 再次通过，未替换已安装应用。
