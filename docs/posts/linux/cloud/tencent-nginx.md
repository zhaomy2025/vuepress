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

- 配置文件目录：/www/server/nginx/conf/
  + 默认配置文件：/www/server/nginx/conf/nginx.conf <Tip>默认配置文件是 Nginx 的主配置文件，一般情况下，不需要修改。</Tip>
- 站点配置文件目录：/www/server/panel/vhost/nginx/
  + 默认站点配置文件：/www/server/panel/vhost/nginx/0.default.conf <Tip>如果没有找到默认站点配置文件，可以手动创建。</Tip>
  + 每个站点一个文件：/www/server/panel/vhost/nginx/your_domain.conf

::: tip
如果没有找到默认站点配置文件和默认网站根目录，可以手动创建。
:::

::: code-tabs
@tab nginx.conf
```text 
user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

stream {
    log_format tcp_format '$time_local|$remote_addr|$protocol|$status|$bytes_sent|$bytes_received|$session_time|$upstream_addr|$upstream_bytes_sent|$upstream_bytes_received|$upstream_connect_time';
  
    access_log /www/wwwlogs/tcp-access.log tcp_format;
    error_log /www/wwwlogs/tcp-error.log;
    include /www/server/panel/vhost/nginx/tcp/*.conf;
}

events
    {
        use epoll;
        worker_connections 51200;
        multi_accept on;
    }

http
    {
        include       mime.types;
                #include luawaf.conf;

                include proxy.conf;
        lua_package_path "/www/server/nginx/lib/lua/?.lua;;";

        default_type  application/octet-stream;

        server_names_hash_bucket_size 512;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 50m;

        sendfile   on;
        tcp_nopush on;

        keepalive_timeout 60;

        tcp_nodelay on;

        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 256k;
                fastcgi_intercept_errors on;

        gzip on;
        gzip_min_length  1k;
        gzip_buffers     4 16k;
        gzip_http_version 1.1;
        gzip_comp_level 2;
        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml application/json image/jpeg image/gif image/png font/ttf font/otf image/svg+xml application/xml+rss text/x-js;
        gzip_vary on;
        gzip_proxied   expired no-cache no-store private auth;
        gzip_disable   "MSIE [1-6]\.";

        limit_conn_zone $binary_remote_addr zone=perip:10m;
                limit_conn_zone $server_name zone=perserver:10m;

        server_tokens off;
        access_log off;

server
    {
        listen 888;
        server_name phpmyadmin;
        index index.html index.htm index.php;
        root  /www/server/phpmyadmin;

        #error_page   404   /404.html;
        include enable-php.conf;

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log  /www/wwwlogs/access.log;
    }
include /www/server/panel/vhost/nginx/*.conf; # 加载站点配置文件
}

```

@tab 手动创建默认站点配置文件、默认网页
```bash
cat > /www/server/panel/vhost/nginx/0.default.conf <<EOF
server {
    listen 80 default_server;
    server_name _;
    root /www/wwwroot/default;  # 替换为你的网站根目录
    index index.html index.php;
    access_log /www/wwwlogs/default.log;
}
EOF
mkdir -p /www/wwwroot/default
echo "Hello, this is default site" > /www/wwwroot/default/index.html
```

:::
#### 默认网站根目录

- 默认网站根目录：/www/wwwroot/
  + 网站域名对应目录：/www/wwwroot/your_domain/

#### 日志目录

- 日志目录：/www/wwwlogs/
  + 访问日志：/www/wwwlogs/your_domain.access.log
  + 错误日志：/www/wwwlogs/your_domain.error.log

#### 其他关键目录

- Nginx模块目录：/www/server/nginx/modules/
- SSL证书目录：/www/server/panel/vhost/ssl/
- 宝塔面板配置：/www/server/panel/data

### 总结

宝塔面板的 Nginx 目录集中存放在 /www/server/nginx/ 下，与常规 Linux 系统的 /usr/local/nginx/ 或 /etc/nginx/ 不同。如果需要修改配置或排查问题，优先通过宝塔面板操作，避免手动修改导致服务异常。
