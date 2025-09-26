---
title: 部署VuePress到云服务器
date: 2025-07-09T07:32:26.463Z
category:
  - vuepress
  - cloud
tags:
  - vuepress
  - cloud
---

# 部署VuePress到云服务器
[[toc]]
## 编写workflow文档
在项目根目录下创建.github/workflows/deploy.yml文件，内容如下所示，这里给出了同时部署到云服务器和Github Pages的workflow文档，可以根据需要选择其中一个：
@[code](../../code/github/workflows/deploy-docs.yml)

::: warning
npm ci 命令会严格依照 package-lock.json 安装依赖，比 npm install 更严格，不容许任何版本偏差。因此需要将本地的 package-lock.json 文件上传到云服务器，以确保部署时使用相同的依赖版本。
:::

## 准备需要的Secrets
在仓库的Settings中，点击Secrets，添加以下Secrets：
  - HOST：云服务器的域名或IP地址
  - USERNAME：SSH登录用户名
  - KEY：SSH私钥(完整内容)

## 云服务器配置
宝塔面板默认配置文件：
  - 配置文件目录：/www/server/nginx/conf/
    + 默认配置文件：/www/server/nginx/conf/nginx.conf <Tip>默认配置文件是 Nginx 的主配置文件，一般情况下，不需要修改。</Tip>
  - 站点配置文件目录：/www/server/panel/vhost/nginx/
    + 默认站点配置文件：/www/server/panel/vhost/nginx/0.default.conf <Tip>如果没有找到默认站点配置文件，可以手动创建。</Tip>
    + 每个站点一个文件：/www/server/panel/vhost/nginx/vuepress.conf

vuepress.conf 配置文件内容：
```bash
cat > /www/server/panel/vhost/nginx/vuepress.conf <<EOF
server {
    listen 80 default_server; # 监听 80 端口
    # 指定域名，_匹配所有未定义的请求，在新版Nginx中，更推荐显式使用 default_server，可以不设置server_name 或设为空
    server_name _; 
    root /www/wwwroot/;# 
    index index.html index.php;
    access_log /www/wwwlogs/vuepress.log;
    error_log /www/wwwlogs/vuepress.error.log;
}
EOF
```

::: warning

root配置为/www/wwwroot/，而不是/www/wwwroot/vuepress/，这是因为vuepress访问路径为http://ip/vuepress，若配置根目录为/www/wwwroot/vuepress/，就会从/www/wwwroot/vuepress/vuepress/目录下找index.html文件，导致找不到。

其实这里的配置放在0.default.conf中也行，但同样注意root不能配置为/www/wwwroot/default，否则会出现和上面一样的错误（或者把vuepress目录放到/www/wwwroot/default/目录下也行，两种方式任选其一）。

vuepress.conf和0.default.conf的配置，如果使用完全相同的`server_name`和`listen`指令会冲突，导致nginx启动失败。

站点的区分可以基于：域名、端口、IP地址、路径等：
 - 域名（最常用）：  通过 server_name 指令区分 `server_name www.example.com`
 - 端口：  通过 listen 指令区分 `listen 8080`
 - IP地址（较少使用）：  通过 listen 绑定不同IP `listen 192.168.1.100:80`
 - 路径：通过location指令区分 `location /vuepress{ alias /www/wwwroot/vuepress; }`

<!-- 虽然DeepSeek不推荐路径区分站点，但这种方式真的是单域名、单IP、想使用默认端口的情况下唯一的办法。为啥不推荐呢？ -->

:::

## 注意事项
- 如果md文件格式有错误，会导致云端部署失败（本地运行`vuepress dev docs`时不会报错，只会在访问到该页面时报错，所以部署后需要查看日志排查错误）
