# Flutter Clean Architecture Helper - 使用指南

## 安装和开发

### 1. 开发环境设置

```bash
# 克隆或下载项目到本地
cd FlutterCleanArchHelper

# 安装依赖
npm install

# 编译 TypeScript
npm run compile
```

### 2. 在 VSCode 中测试插件

1. 在 VSCode 中打开项目目录
2. 按 `F5` 启动调试模式
3. 这会打开一个新的 VSCode 窗口（Extension Development Host）
4. 在新窗口中打开一个 Flutter 项目或创建一个测试目录

### 3. 使用插件功能

#### 创建基础 Clean Architecture 结构

**方法一：右键菜单**
1. 在文件资源管理器中右键点击目录
2. 选择 "创建 Clean Architecture 基础结构"

**方法二：命令面板**
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
2. 输入 "Flutter Clean Arch: 创建 Clean Architecture 基础结构"
3. 按回车执行

#### 创建 Feature 模块

**方法一：右键菜单**
1. 在 `lib/features` 目录中右键点击
2. 选择 "创建 Feature 模块"
3. 输入 Feature 名称（如：user_profile, authentication）

**方法二：命令面板**
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
2. 输入 "Flutter Clean Arch: 创建 Feature 模块"
3. 输入 Feature 名称

#### 配置目录结构

1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
2. 输入 "Flutter Clean Arch: 配置目录结构"
3. 选择要执行的操作：
   - 编辑基础结构配置
   - 编辑 Feature 结构配置
   - 查看当前配置
   - 重置为默认配置

## 配置说明

### 默认基础结构

```
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   ├── usecases/
│   └── utils/
├── features/
└── shared/
    ├── data/
    │   ├── datasources/
    │   ├── models/
    │   └── repositories/
    ├── domain/
    │   ├── entities/
    │   ├── repositories/
    │   └── usecases/
    └── presentation/
        ├── bloc/
        ├── pages/
        └── widgets/
```

### 默认 Feature 结构

```
feature_name/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── bloc/
    ├── pages/
    └── widgets/
```

### 自定义配置

可以通过 VSCode 设置或插件配置命令来自定义目录结构。配置格式为 JSON 对象，支持多层级嵌套。

示例自定义配置：
```json
{
  "data": {
    "datasources": {
      "local": {},
      "remote": {}
    },
    "models": {},
    "repositories": {}
  },
  "domain": {
    "entities": {},
    "repositories": {},
    "usecases": {}
  },
  "presentation": {
    "bloc": {},
    "pages": {},
    "widgets": {
      "common": {},
      "specific": {}
    }
  }
}
```

## 打包插件

```bash
# 安装 vsce（如果还没有安装）
npm install -g vsce

# 打包插件
vsce package

# 这会生成一个 .vsix 文件，可以手动安装到 VSCode 中
```

## 故障排除

### 常见问题

1. **插件没有激活**
   - 确保在 Dart/Flutter 项目中使用
   - 检查 VSCode 输出面板中的错误信息

2. **目录创建失败**
   - 检查目标目录的写入权限
   - 确保目录路径有效

3. **配置无效**
   - 验证 JSON 格式是否正确
   - 使用"重置为默认配置"功能恢复

### 调试

在开发模式下，可以在 VSCode 的开发者工具中查看控制台输出：
1. 在 Extension Development Host 窗口中
2. 按 `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (Mac)
3. 查看 Console 标签页中的日志信息
