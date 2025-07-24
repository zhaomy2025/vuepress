---
title: 常用命令
date: 2025-07-10T01:51:23.722Z
category:
  - linux
  - command
tags:
  - linux
  - bash
  - command
---

# 常用命令
[[toc]]

## 文件内容

### grep 查找文件内容

```bash
grep "search_str" file_name [option]
```
参数说明：
- -A, --after-context=NUM：打印匹配行之后的N行
- -B, --before-context=NUM：打印匹配行之前的N行
- -C, --context=NUM：打印匹配行前后各N行
- -H, --with-filename：显示文件名
- -h, --no-filename：不显示文件名  
- -i, --ignore-case：忽略字符大小写
- -l, --files-with-matches：只显示匹配的文件名
- -L, --files-without-match：只显示不匹配的文件名  
- -n, --line-number：显示行号
- -r：递归匹配当前目录下的所有文件
  
- --color=auto：显示颜色
- -e PATTERN, --regexp=PATTERN：指定搜索的模式  
- --exclude=PATTERN：排除匹配的文件名
- --exclude-dir=PATTERN：排除匹配的目录名  
- -f FILE, --file=FILE：从文件中读取搜索模式  
- -F, --fixed-strings：将模式视为固定字符串（禁用正则）
- --include=PATTERN：只搜索匹配的文件名
- -o, --only-matching：只显示匹配到的部分
- -P, --perl-regexp：使用Perl正则表达式  
- -R, --dereference-recursive：递归搜索，并跟随符号链接（比 -r 更强） 
- -v, --invert-match：反向显示,显示未匹配到的行
- -E, --extended-regexp：支持使用扩展的正则表达式
- -q, --quiet, --silent：静默模式,即不输出任何信息
- -w, --word-regexp：整行匹配整个单词
- -c, --count：统计匹配到的行数

**示例：**
```bash
# 递归查找当前目录下文件，显示行号
grep 'search_str' /home/admin -r -n 
# 指定文件后缀
grep 'KeyWord' /home/admin -r -n --include *.{vm,java} 
# 反匹配
grep 'KeyWord' /home/admin -r -n --exclude *.{vm,java} 
# 统计个数 
grep 'KeyWord' fileName -c 
```

## 压缩包

### 保留源文件解压

```bash
gunzip -c zip_file > target_file
gunzip -k zip_file
```
- -c 保留源文件，但会将解压缩后的文件内容输出到标准输出，因此需要添加 > target
- -k 保留源文件，解压后的文件会放到同级目录下
- 如需自定义文件名，使用-c，否则推荐使用-k

### zcat 查看压缩文件内容
```bash
zcat zip_file | grep "search_string" > target_file
```

### zgrep 查找压缩文件内容

参数说明参考grep命令，仅列出与grep命令不同的参数。
- --gzexe

```bash
zgrep  "search_str" zip_file
# 只显示文件名
zgrep -l "search_str" zip_file
# -c 统计匹配的行数，-n 显示匹配的行号
zgrep -c -n "search_str" zip_file > target_file
```