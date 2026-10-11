# Tool Bar Clock

这是一个在浏览器工具栏显示时钟的 Firefox 扩展。

## 功能

- 支持浏览器 IANA 时区数据中的全部时区。
- 通过输入框实时过滤时区。
- 默认使用浏览器检测到的本地时区。
- 保存用户选择的时区，并在工具栏时钟中显示对应时间。
- 支持自定义图标文字颜色和字体。
- 默认跟随 Firefox 的日间/夜间模式切换图标文字颜色，也可以关闭自动模式并手动选择颜色。

## Fork 来源

本项目 fork 自 Firefox Add-ons 上 Tool Bar Clock 的版本页面：

<https://addons.mozilla.org/en-US/firefox/addon/tool-bar-clock/versions/>

本 fork 版本的 Firefox Add-ons 页面：

<https://addons.mozilla.org/en-US/firefox/addon/tool-bar-clock-fork-version/>

## 许可证

本 fork 遵循 Mozilla Public License Version 2.0（MPL-2.0）发布。
完整许可证文本请参阅 [LICENSE](./LICENSE)。

项目源文件包含以下 SPDX 许可证标识：

```text
SPDX-License-Identifier: MPL-2.0
```

英文说明请参阅 [README.md](./README.md)。

## 打包

在项目目录中执行以下命令：

```sh
rm -f tool-bar-clock.zip
zip tool-bar-clock.zip \
  LICENSE README.md README.zh-CN.md \
  background.js icon.png manifest.json \
  options.html options.js popup.html popup.js
```

生成的 `tool-bar-clock.zip` 即为扩展安装包。该 ZIP 文件已在
`.gitignore` 中忽略。

## 数据收集

本扩展不会收集或传输用户数据。manifest 中已声明
`browser_specific_settings.gecko.data_collection_permissions.required` 为
`["none"]`。
