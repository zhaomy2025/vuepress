# Github 65.6k star，一款断网也能狂传文件的神器，比蓝牙快10倍！

在日常生活和工作中，我们常常需要在不同设备之间传输文件，比如把手机里的照片传到电脑，或者在平板和笔记本之间分享文档。很多传统的文件传输方式要么依赖互联网，要么需要第三方服务器，存在着安全风险和传输限制。

今天，我要给大家介绍一款开源的跨平台文件传输工具------LocalSend，它能让设备间的文件和消息共享变得更加安全、便捷。
![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2Foa2exq9t5MIKJmaZXc7LryPoLDU5BKK9HEvaJKFeCBYuqfAH6lrMiaKLib9FX6kKfSlyYNcSPRrCfd4MYYLRWyYA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26tp%3Dwebp%26wxfrom%3D5%26wx_lazy%3D1&valid=false)

## 项目简介

LocalSend 是一款免费开源的应用程序，它可以在没有互联网连接的情况下，通过本地网络安全地与附近的设备共享文件和消息。与其他依赖外部服务器的消息应用不同，LocalSend 不需要互联网连接或第三方服务器，这使得它成为本地通信的快速且可靠的解决方案。它采用 REST API 和 HTTPS 加密技术，确保设备之间的通信安全。

## 功能特点

### 跨平台支持

LocalSend 支持多种操作系统，包括 Windows、macOS、Linux、Android、iOS 和 Fire OS。无论你使用的是手机、平板还是电脑，都能轻松实现设备间的文件传输。

### 安全通信

LocalSend 使用安全的通信协议，所有数据通过 HTTPS 进行安全传输，并且在每个设备上动态生成 TLS/SSL 证书，确保最大程度的安全性。

### 无需互联网

不需要连接互联网，只需在同一本地网络下，设备之间就能直接进行通信和文件传输。

### 多种文件类型支持

支持传输各种类型的文件，如图片、视频、文档、音频等，满足你在不同场景下的文件传输需求。

## 安装与使用

### 安装方法

LocalSend 提供了多种安装方式，你可以根据自己的设备类型选择合适的安装途径。

+ **Windows** ：可以通过 Winget、Scoop、Chocolatey 等包管理器进行安装，也可以下载 EXE 安装程序或便携版 ZIP 文件。
+ **macOS** ：可以从 App Store 下载，或者使用 Homebrew 包管理器安装，也可以下载 DMG 安装程序。
+ **Linux** ：支持 FlatHub、Nixpkgs、Snap、AUR、TAR、DEB 和 AppImage 等多种安装方式。
+ **Android** ：可以从 Play Store 或 F-Droid 下载安装，也可以直接下载 APK 文件。
+ **iOS** ：可以从 App Store 下载。
+ **Fire OS** ：可以从 Amazon 应用商店下载。

### 兼容性要求

不同平台对 LocalSend 有不同的最低版本要求：

+ **Android** ：最低版本 5.0。
+ **iOS** ：最低版本 12.0。
+ **macOS** ：最低版本 11 Big Sur，对于旧版本的 macOS，可能需要使用 OpenCore Legacy Patcher。
+ **Windows** ：最低版本 10，Windows 7 最后支持的版本是 v1.15.4，未来可能会有针对 Windows 7 的新版本回溯。
+ **Linux** ：无特定最低版本要求。

### 基本设置

在大多数情况下，LocalSend 可以直接使用。

如果你在发送或接收文件时遇到问题，可能需要配置防火墙，允许 LocalSend 在本地网络上进行通信。

具体来说，需要允许传入的 TCP 和 UDP 流量通过端口 53317，传出的 TCP 和 UDP 流量可以通过任意端口。

确保路由器上禁用了 AP 隔离功能，因为某些路由器（尤其是访客网络）可能默认启用了该功能。

### 便携模式

从 v1.13.0 版本开始，LocalSend 引入了便携模式。你可以在可执行文件所在的目录中创建一个名为 settings.json 的文件，该文件可以为空。应用程序将使用此文件来存储设置，而不是默认位置。

## 开始使用

如果想从源代码编译 LocalSend，可以按照以下步骤进行：

1. 安装 Flutter（直接安装或使用 fvm，需注意所需版本）。
1. 安装 Rust。
1. 克隆 LocalSend 代码仓库。
1. 运行 cd app 进入应用目录。
1. 运行 flutter pub get 下载依赖项。
1. 运行 flutter run 启动应用。

注意：LocalSend 当前需要较旧的 Flutter 版本，因此如果系统范围内安装的 Flutter 版本与要求的版本不匹配，可能会导致构建问题。

## 总结

LocalSend 是一款功能强大、安全可靠的开源跨平台文件传输工具，它为用户提供了一种在本地网络环境下无需互联网和第三方服务器的文件和消息共享方式。无论你是普通用户还是开发者，都能从 LocalSend 中受益。如果你正在寻找一种更加自由、安全的文件传输解决方案，不妨试试 LocalSend，相信它会给你带来不一样的体验。
> 项目地址：https://github.com/localsend/localsend
