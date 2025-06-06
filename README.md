# Flutter Clean Architecture Helper

一个用于快速创建 Flutter Clean Architecture 目录结构的 VSCode 插件。

## 功能特性

### 🏗️ 创建基础结构
- 快速创建完整的 Clean Architecture 基础目录结构
- 包含 `core`、`features`、`shared` 等标准目录
- 支持自动检测 Flutter 项目

### 🎯 创建 Feature 模块
- 为每个功能模块快速创建标准的三层架构目录
- 包含 `data`、`domain`、`presentation` 层
- 自动规范化 Feature 名称

### ⚙️ 可配置的目录结构
- 完全可自定义的目录结构配置
- 支持多层级嵌套目录
- 可以保存和重置配置

## 使用方法

### 1. 创建基础结构
- 在文件资源管理器中右键点击目录
- 选择 "创建 Clean Architecture 基础结构"
- 或使用命令面板：`Flutter Clean Arch: 创建 Clean Architecture 基础结构`

### 2. 创建 Feature 模块
- 在文件资源管理器中右键点击目录（推荐在 `features` 目录中）
- 选择 "创建 Feature 模块"
- 输入 Feature 名称
- 或使用命令面板：`Flutter Clean Arch: 创建 Feature 模块`

### 3. 配置目录结构
- 使用命令面板：`Flutter Clean Arch: 配置目录结构`
- 选择要编辑的配置类型
- 支持查看、编辑、重置配置

## 默认目录结构

### 基础结构
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

### Feature 结构
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

## 配置说明

插件支持通过 VSCode 设置进行配置：

### 基础结构配置
```json
{
  "flutterCleanArch.baseStructure": {
    "lib": {
      "core": {
        "constants": {},
        "errors": {},
        "network": {},
        "usecases": {},
        "utils": {}
      },
      "features": {},
      "shared": {
        // ... 更多配置
      }
    }
  }
}
```

### Feature 结构配置
```json
{
  "flutterCleanArch.featureStructure": {
    "data": {
      "datasources": {},
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
      "widgets": {}
    }
  }
}
```

## 安装

1. 在 VSCode 中打开扩展面板 (Ctrl+Shift+X)
2. 搜索 "Flutter Clean Architecture Helper"
3. 点击安装

## 开发

### 环境要求
- Node.js 16+
- VSCode 1.74.0+

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd flutter-clean-arch-helper

# 安装依赖
npm install

# 编译
npm run compile

# 在 VSCode 中按 F5 启动调试
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 作者

**baoxin** - [v-baoxin@foxmail.com](mailto:v-baoxin@foxmail.com)

## 许可证

MIT License
