# 观片台后无法关闭窗口

此修复已包含于 1.0.3 及 1.0.4 Windows 运行包。

1.0.2-win.1 引入了 `Window.onCloseRequested`。Tauri SDK 在回调返回且未取消时，
执行 `Window.destroy()`，而能力清单当时只有 `core:window:allow-close`，缺少
`core:window:allow-destroy`。原生标题栏 ×、任务栏关闭与程序请求关闭均可能
经过该监听，因此不能只测试返回编辑器按钮或模拟 `window.close()`。

修复为主窗口增加所需的 destroy 权限；保存拦截改为等待记录落盘，成功后直接
交回 SDK 完成销毁，不再在关闭回调中递归调用 `window.close()`。保存失败会
取消当前关闭、恢复可操作状态并显示错误，允许重试。

`nativeClose.test.ts` 调用真实 Tauri SDK 的关闭监听包装器，以当前能力清单
校验最终命令。旧行为已复现 `window.destroy not allowed`；修复后验证清洁状态、
待保存状态、失败后重试，且成功路径不递归发起 close 请求。

观片台右下角 Photo-All 标记／链接已移除；来源继续放在关于、README、
来源说明和许可证，不覆盖照片或台面。

现有 `output/` 中的 1.0.2 二进制、安装包及 Source.zip 不会自行获得此修复；
该阶段只更新源码和内部验证。随后用户已授权全部检查后打包；修复纳入 1.0.3-win.1。
独立原生窗口已验证右上角 × 以及记录保存后的 Alt+F4 均能退出；本轮同时加入
关闭前等待照片配方／持久撤销写入。实际任务栏右键菜单不作为已点击验证的证据。
