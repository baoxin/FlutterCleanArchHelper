# Clean Architecture Helper - JetBrains Plugin 项目概览

## 项目简介

这是一个功能对等的 JetBrains 插件，基于原有的 VSCode 插件 "Clean Architecture Helper" 开发。插件旨在帮助开发者快速创建符合 Clean Architecture 原则的项目目录结构。

## 功能对比

| 功能 | VSCode 插件 | JetBrains 插件 | 状态 |
|------|-------------|----------------|------|
| 创建基础结构 | ✅ | ✅ | 完成 |
| 创建 Feature 模块 | ✅ | ✅ | 完成 |
| 配置目录结构 | ✅ | ✅ | 完成 |
| 右键菜单集成 | ✅ | ✅ | 完成 |
| 命令面板支持 | ✅ | ✅ | 完成 |
| 快捷键支持 | ✅ | ✅ | 完成 |
| 可视化配置界面 | ✅ | ✅ | 完成 |
| Flutter 项目检测 | ✅ | ✅ | 完成 |
| 进度指示器 | ✅ | ✅ | 完成 |
| 错误处理 | ✅ | ✅ | 完成 |

## 技术架构

### VSCode 插件架构
```
VSCode Extension
├── TypeScript
├── Node.js APIs
├── VSCode Extension API
└── JSON 配置
```

### JetBrains 插件架构
```
JetBrains Plugin
├── Kotlin
├── IntelliJ Platform SDK
├── Gradle 构建系统
└── XML 配置
```

## 核心组件映射

| VSCode 组件 | JetBrains 组件 | 说明 |
|-------------|----------------|------|
| `extension.ts` | `plugin.xml` + Actions | 插件入口和命令注册 |
| `createBaseStructure.ts` | `CreateBaseStructureAction.kt` | 创建基础结构 |
| `createFeature.ts` | `CreateFeatureAction.kt` | 创建 Feature 模块 |
| `configureStructure.ts` | `ConfigureStructureAction.kt` | 配置结构 |
| `structureConfig.ts` | `CleanArchSettings.kt` | 配置管理 |
| `fileUtils.ts` | `FileUtils.kt` | 文件操作工具 |
| `types/index.ts` | `DirectoryStructure.kt` | 类型定义 |

## 用户界面对比

### VSCode 插件
- 命令面板 (Ctrl+Shift+P)
- 右键菜单
- 输入框和选择框
- 设置页面 (JSON 编辑)

### JetBrains 插件
- Find Action (Ctrl+Shift+A)
- 右键菜单
- 对话框和输入框
- 设置页面 (可视化界面)

## 配置系统

### VSCode 配置
```json
{
  "cleanArch.baseStructure": { ... },
  "cleanArch.featureStructure": { ... }
}
```

### JetBrains 配置
```xml
<application>
  <component name="CleanArchSettings">
    <option name="baseStructureJson" value="..." />
    <option name="featureStructureJson" value="..." />
  </component>
</application>
```

## 文件操作对比

### VSCode
- 使用 Node.js `fs` 模块
- 异步操作 (Promise/async-await)
- 手动刷新文件资源管理器

### JetBrains
- 使用 IntelliJ Platform VFS API
- WriteAction 包装的同步操作
- 自动文件系统刷新

## 构建和部署

### VSCode 插件
```bash
npm install
npm run compile
vsce package
vsce publish
```

### JetBrains 插件
```bash
./gradlew buildPlugin
./gradlew verifyPlugin
./gradlew publishPlugin
```

## 兼容性

### VSCode 插件
- VSCode 1.74.0+
- Node.js 16+

### JetBrains 插件
- IntelliJ Platform 2023.2+
- JDK 17+
- 支持所有基于 IntelliJ 的 IDE

## 测试策略

### VSCode 插件
- 单元测试 (Jest)
- 集成测试 (VSCode Test Runner)

### JetBrains 插件
- 单元测试 (JUnit + Kotlin Test)
- 插件测试 (IntelliJ Platform Test Framework)

## 发布渠道

### VSCode 插件
- Visual Studio Code Marketplace
- Open VSX Registry

### JetBrains 插件
- JetBrains Marketplace
- 私有仓库部署

## 维护和更新

### 版本同步
- 保持功能特性同步
- 版本号统一管理
- 同步发布新功能

### 文档维护
- README 文档同步
- 用户指南更新
- 开发文档维护

## 未来规划

### 短期目标
- [ ] 添加更多项目类型支持 (React, Vue, Angular)
- [ ] 增强配置验证
- [ ] 添加模板文件生成

### 长期目标
- [ ] 可视化目录结构编辑器
- [ ] 项目模板市场
- [ ] 团队配置共享
- [ ] 代码生成功能

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request
5. 代码审查
6. 合并到主分支

## 许可证

MIT License - 与原 VSCode 插件保持一致
