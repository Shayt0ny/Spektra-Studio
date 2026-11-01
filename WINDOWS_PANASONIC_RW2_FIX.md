# Panasonic DC-ZS300 RW2 编辑修复

指定 P1013265.RW2 的旧原生结果：probe 可读 5488×3664 与机型；open 失败，
稳定与候选解码器均报没有三通道 camera-to-ProPhoto 转换。可见的只是机内预览。

修复仅对精确 Panasonic DC-ZS300／DC-TZ300／DC-TX3、三通道、非 DNG，且
原 LibRaw 未找到标定时，复用已有 DC-ZS200 的系数查询。RawSpeed 对这些机型
标注的标定矩阵与该条目完全一致；不改原文件机型、黑白电平、尺寸或胶片／相纸。
原生已有标定始终优先。来源和许可证见 engine/resources/io/Panasonic-ZS300-profile-NOTICE.txt。

`engine/tests/host_panasonic_raw.py` 在用户指定的 DC-ZS300 实际样片验证：
真正 RAW 打开、胶片曝光可改变、RAW 影调生效、自定义白平衡生效、自动影调／
白平衡可用、TIFF16／软打样返回有效图像、还原后原图预览逐字节一致，输入文件
SHA256 不变。其他同系列型号为标定名称兼容，未冒充逐型号实拍测试。

旧失败记录 build/rw2-diagnosis.log；新通过记录 build/panasonic-raw-after.log。
实际测试照片和这些本机日志均不放进发布源码包。
