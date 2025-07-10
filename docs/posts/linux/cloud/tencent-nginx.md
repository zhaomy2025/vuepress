---
title: 宝塔面板安装 Nginx
date: 2025-07-10T02:57:50.122Z
category:
  - linux
  - cloud
  - nginx
tags:
  - linux
  - cloud
  - nginx
---

## 宝塔面板安装 Nginx

选择宝塔面板镜像并不会自动安装 Nginx，需要登录宝塔面板安装 Nginx。
::: tip
- 不推荐手动安装 Nginx，会与宝塔面板安装的Nginx冲突，yum安装软件也会排除Nginx。
  推荐LNMP一键安装包，安装Nginx、MySQL、PHP、phpMyAdmin。
:::

### 默认目录

在 宝塔面板（BT Panel） 中，Nginx 的默认安装路径和配置文件目录与手动编译或 yum 安装的有所不同。

#### 安装目录
- 安装目录：/www/server/nginx/

#### 配置文件目录
- ~~配置文件目录：/www/server/nginx/conf/~~
  + ~~默认配置文件：/www/server/nginx/conf/nginx.conf~~
- 站点配置文件目录：/www/server/panel/vhost/nginx/
  + 每个站点一个文件：/www/server/panel/vhost/nginx/your_domain.conf
  + ~~默认IP访问配置文件：/www/server/panel/vhost/nginx/0.websocket.conf~~

::: warning 
宝塔面板的Nginx默认配置文件目录不存在。
:::


#### 默认网站根目录
- 默认网站根目录：/www/wwwroot/
  + 网站域名对应目录：/www/wwwroot/your_domain/

#### 日志目录
- 日志目录：/www/wwwlogs/
  + ~~访问日志：/www/wwwlogs/your_domain.access.log~~
  + ~~错误日志：/www/wwwlogs/your_domain.error.log~~

#### 其他关键目录
- Nginx模块目录：/www/server/nginx/modules/
- SSL证书目录：/www/server/panel/vhost/ssl/
- 宝塔面板配置：/www/server/panel/data

### 常用命令
检查配置文件是否正确：
```bash
/www/server/nginx/sbin/nginx -t
```

::: warning 注意
/www/server/nginx/sbin/nginx文件不存在，执行上述命令会提示找不到文件。
:::

### 总结
宝塔面板的 Nginx 目录集中存放在 /www/server/nginx/ 下，与常规 Linux 系统的 /usr/local/nginx/ 或 /etc/nginx/ 不同。如果需要修改配置或排查问题，优先通过宝塔面板操作，避免手动修改导致服务异常。
