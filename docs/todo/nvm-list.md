## 步骤1：创建通用脚本目录
```
$scriptDir = "C:\Users\$env:USERNAME\Scripts"
New-Item -ItemType Directory -Path $scriptDir -Force
```
## 步骤2：复制脚本并重命名
```
Copy-Item "nvm-list.ps1" "$scriptDir\nvm-list.ps1"
```
## 步骤3：永久添加到 PowerShell 配置
### 编辑配置文件
```
notepad $PROFILE
```
### 添加以下内容：
```
function nvm-list {
    & "$HOME\Scripts\nvm-list.ps1" @args
}

Set-Alias nvml nvm-list
```