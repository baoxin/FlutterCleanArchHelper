# Clean Architecture Helper - JetBrains Plugin

一个用于快速创建 Clean Architecture 目录结构的 JetBrains 插件，支持 Flutter、React、Node.js 等项目。

## 功能特性

### 🏗️ 创建基础结构
- 快速创建完整的 Clean Architecture 基础目录结构
- 包含 `core`、`features`、`shared` 等标准目录
- 支持多种项目类型（Flutter、React、Node.js 等）

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
- 在项目视图中右键点击目录
- 选择 "Clean Architecture" -> "创建 Clean Architecture 基础结构"
- 或使用快捷键：`Ctrl+Shift+Alt+B`
- 或通过 Tools 菜单访问

### 2. 创建 Feature 模块
- 在项目视图中右键点击目录（推荐在 `features` 目录中）
- 选择 "Clean Architecture" -> "创建 Feature 模块"
- 输入 Feature 名称
- 或使用快捷键：`Ctrl+Shift+Alt+F`

### 3. 配置目录结构
- 使用 Tools -> Clean Architecture -> 配置目录结构
- 或使用快捷键：`Ctrl+Shift+Alt+C`
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

插件支持通过 IDE 设置进行配置：

1. 打开 Settings/Preferences
2. 导航到 Tools -> Clean Architecture Helper
3. 在这里可以编辑基础结构和 Feature 结构的配置
4. 支持 JSON 格式的配置编辑

## 安装

### 从 JetBrains Marketplace 安装
1. 打开 IDE 的 Settings/Preferences
2. 选择 Plugins
3. 搜索 "Clean Architecture Helper"
4. 点击 Install

### 手动安装
1. 下载插件的 .zip 文件
2. 打开 IDE 的 Settings/Preferences
3. 选择 Plugins
4. 点击齿轮图标，选择 "Install Plugin from Disk..."
5. 选择下载的 .zip 文件

## 开发

### 环境要求
- JDK 17+
- IntelliJ IDEA 2023.2+
- Gradle 8.4+

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd jetbrains-plugin

# 运行插件
./gradlew runIde

# 构建插件
./gradlew buildPlugin

# 运行测试
./gradlew test
```

### 项目结构
```
src/main/kotlin/com/baoxin/cleanarch/
├── actions/           # Action 类
├── model/            # 数据模型
├── settings/         # 设置相关
└── utils/           # 工具类
```

## 兼容性

- IntelliJ IDEA 2023.2+
- Android Studio 2023.2+
- WebStorm 2023.2+
- PhpStorm 2023.2+
- PyCharm 2023.2+
- 其他基于 IntelliJ 平台的 IDE

## 贡献

欢迎提交 Issue 和 Pull Request！

## 作者

**baoxin** - [v-baoxin@foxmail.com](mailto:v-baoxin@foxmail.com)

## 许可证

MIT License
