---
title: Git
date: 2025-05-30T05:37:11.148Z
category:
  - git
tags:
  - git
---

# Git

[[toc]]

## 远程仓库

```bash

# 查看远程仓库
git remote -v

# 修改远程仓库
git remote set-url origin <new_url>

```

## 分支

### 查看分支

```bash

# 列出所有本地分支，当前分支前会有一个 * 标记。
git branch

# 查看本地分支与远程分支关联情况
git branch -vv

```

### 切换分支

```bash

# 切换到 master 分支
git checkout master

# 拉取并切换到 dependabot 分支
git checkout -b dependabot origin/dependabot

```

### 合并分支

```bash

git merge dependabot

```

### 远程分支

```bash

# 清理本地过时的远程分支引用
git remote prune origin

```

## 删除提交

```bash
git reset --soft [commit id]
```

## 强制删除提交 `git reset --hard`（慎用）

::: warning
单独列出来是因为真的要慎用！！！

会强制覆盖暂存区和工作区已追踪的内容，谨慎使用。比如：工作区有A、B两个文件，A修改为A1，B是新增文件，则执行后仅保留B，A的修改内容全部丢失。
:::

希望保持一个干净的提交记录时使用该命令，不仅仅是恢复内容，提交记录也会一并删除，基础命令：

```bash

# 保留指定提交，删除所有后续提交
git reset --hard [commit id]

# 删除最后一次提交
git reset --hard HEAD~1

```

可细分为以下场景：

场景一：本地库与远程库不一致，删除本地提交后重新拉取远程库的提交

```bash

# 删除本地提交
git reset --hard [commit id]

# 重新拉取远程库的提交
git pull

```

场景二：需要删除远程库的提交，删除本地提交后强制推送到远程库

```bash
# 删除本地提交
git reset --hard [commit id]

# 强制推送到远程库
git push -f

```

## 提交信息

### 前缀

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 代码重构（既不修复 bug 也不添加新功能的变动）
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `ci`: 持续集成相关的变动
- `revert`: 回滚到上一个版本
