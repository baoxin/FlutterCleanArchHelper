# Git 多账号配置指南

## 问题说明

Git 通过 HTTPS 提交时，账号识别机制：
1. **URL 中的用户名**：`https://username@github.com/repo.git`
2. **macOS Keychain 中存储的凭据**
3. **交互式输入的用户名和密码/Token**

## 当前项目配置

已将远程仓库 URL 修改为包含用户名的格式：
```bash
origin  https://baoxin@github.com/baoxin/FlutterCleanArchHelper.git
```

## 解决方案

### 方案一：使用 Personal Access Token（推荐）

1. **创建 GitHub Personal Access Token**
   - 访问 GitHub Settings > Developer settings > Personal access tokens
   - 生成新的 token，选择适当的权限（repo 权限）
   - 复制生成的 token

2. **配置 Git 使用 Token**
   ```bash
   # 当 Git 提示输入密码时，输入 Personal Access Token 而不是密码
   git push origin main
   ```

### 方案二：清除特定账号的凭据

```bash
# 清除 GitHub 的所有存储凭据
git credential-osxkeychain erase
# 然后输入：
# protocol=https
# host=github.com
# [按两次回车]

# 或者清除特定用户的凭据
git credential-osxkeychain erase
# 然后输入：
# protocol=https
# host=github.com
# username=旧用户名
# [按两次回车]
```

### 方案三：使用 Git Credential Manager

```bash
# 安装 Git Credential Manager（如果没有）
brew install git-credential-manager

# 配置使用 credential manager
git config --global credential.helper manager
```

### 方案四：项目级别的凭据配置

```bash
# 为当前项目设置特定的凭据助手
git config credential.helper store
git config credential.https://github.com.username baoxin

# 或者使用 cache 方式（临时存储）
git config credential.helper 'cache --timeout=3600'
```

## 多账号管理最佳实践

### 1. 使用不同的 SSH 密钥（推荐）

```bash
# 生成新的 SSH 密钥
ssh-keygen -t ed25519 -C "v-baoxin@foxmail.com" -f ~/.ssh/id_ed25519_baoxin

# 添加到 SSH agent
ssh-add ~/.ssh/id_ed25519_baoxin

# 配置 ~/.ssh/config
Host github-baoxin
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_baoxin

# 修改远程仓库为 SSH
git remote set-url origin git@github-baoxin:baoxin/FlutterCleanArchHelper.git
```

### 2. 使用 Git 配置文件

创建 `~/.gitconfig-baoxin`：
```ini
[user]
    name = baoxin
    email = v-baoxin@foxmail.com
[credential]
    helper = osxkeychain
```

在项目中使用：
```bash
git config --local include.path ~/.gitconfig-baoxin
```

## 当前推荐操作

1. **立即尝试推送**（已配置用户名在 URL 中）：
   ```bash
   git push origin main
   ```

2. **如果提示输入密码**：
   - 使用 GitHub Personal Access Token 作为密码
   - 不要使用 GitHub 账号密码

3. **如果仍有问题**：
   - 清除 keychain 中的旧凭据
   - 重新输入正确的用户名和 Token

## 验证配置

```bash
# 检查远程仓库配置
git remote -v

# 检查当前用户配置
git config user.name
git config user.email

# 测试连接
git ls-remote origin
```
