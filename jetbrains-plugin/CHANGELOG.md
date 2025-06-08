# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- 🏗️ 创建 Clean Architecture 基础结构功能
  - 支持创建完整的 Clean Architecture 目录结构
  - 包含 core、features、shared 等标准目录
  - 可选择是否创建 .gitkeep 文件
  
- 🎯 创建 Feature 模块功能
  - 为功能模块创建标准的三层架构目录
  - 包含 data、domain、presentation 层
  - 自动规范化 Feature 名称
  - 智能选择创建位置
  
- ⚙️ 可配置的目录结构
  - 完全可自定义的目录结构配置
  - 支持多层级嵌套目录
  - JSON 格式配置编辑
  - 配置重置功能
  
- 🔧 用户界面
  - 右键菜单集成
  - Tools 菜单集成
  - 快捷键支持
  - 进度指示器
  - 友好的错误提示
  
- 🎨 项目检测
  - Flutter 项目自动检测
  - 智能目录位置选择
  - 目录冲突检测和处理
  
- ⚡ 性能优化
  - 后台任务执行
  - 异步文件操作
  - 智能文件系统刷新

### Technical Details
- 基于 IntelliJ Platform 2023.2
- 使用 Kotlin 开发
- 支持 JDK 17+
- Gradle 构建系统
- 兼容所有基于 IntelliJ 的 IDE

### Keyboard Shortcuts
- `Ctrl+Shift+Alt+B` - 创建基础结构
- `Ctrl+Shift+Alt+F` - 创建 Feature 模块
- `Ctrl+Shift+Alt+C` - 配置目录结构
