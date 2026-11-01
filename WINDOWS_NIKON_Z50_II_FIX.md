# Nikon Z50 II 可查看但无法编辑（已包含于 1.0.4-win.1）

2026-11-01，用户样片 DSC_5006.NEF，机型规范名 Z50_2，方向 8。
旧版 probe／机内预览可用，但真正 open 失败：稳定 LibRaw 报解包数据错误，
候选解码器完成读取后又因缺少 camera-to-ProPhoto 标定而拒绝进入编辑。

只在精确 Nikon Z50_2、三通道、非 DNG，且 XYZ 和相机 RGB 标定均缺失时，
复用已有 Nikon Z 50 的系数查询。RawSpeed 的 Z50_2 标定与该条目完全一致。
不改原始数据、黑白电平、尺寸或压缩检测，不忽略稳定解码器的数据错误；
自动模式继续按已有策略使用独立候选解码模块。已有标定始终优先。
来源见 engine/resources/io/Nikon-Z50-II-profile-NOTICE.txt。

实际样片回归 `engine/tests/host_z50ii.py`：自动／候选模式都能编辑胶片曝光、
RAW 影调及白平衡，裁剪＋旋转后的软打样和 TIFF8 文件像素一致，TIFF16 可用；
两种模式结果相同，还原后源预览一致，照片 SHA256 不变。53 项原生 CTest
全部通过，矩阵测试还检查现有标定、未知型号、其他品牌、DNG 和四通道的边界。

日志仅在本机 build/z50ii-before.log、z50ii-edit-regression.log 和
z50ii-native-tests.log；实际照片不纳入仓库或源码包。

初次修复时按用户要求暂未打包，现有 1.0.3-win.1 包保持不变。
随后用户授权在 RAW 面板和空间效果回归后发布，修复随 1.0.4-win.1 提供。
本修复对该样片需要 RAW 解码器选择「自动」或「候选」；固定稳定 LibRaw
仍会按原策略报告该文件的解包错误。
