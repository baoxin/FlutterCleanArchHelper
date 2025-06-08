# 开发指南

本文档介绍如何开发和维护 Clean Architecture Helper JetBrains 插件。

## 环境要求

### 必需软件
- **JDK 17+** - 插件开发和运行需要
- **IntelliJ IDEA 2023.2+** - 推荐使用 Ultimate 版本
- **Gradle 8.4+** - 构建工具（通过 Gradle Wrapper 自动管理）

### 推荐工具
- **Git** - 版本控制
- **Kotlin** - 主要开发语言

## 项目结构

```
jetbrains-plugin/
├── src/main/kotlin/com/baoxin/cleanarch/
│   ├── actions/           # Action 类 - 处理用户操作
│   │   ├── CreateBaseStructureAction.kt
│   │   ├── CreateFeatureAction.kt
│   │   └── ConfigureStructureAction.kt
│   ├── model/            # 数据模型
│   │   └── DirectoryStructure.kt
│   ├── settings/         # 设置相关
│   │   ├── CleanArchSettings.kt
│   │   └── CleanArchConfigurable.kt
│   └── utils/           # 工具类
│       └── FileUtils.kt
├── src/main/resources/META-INF/
│   └── plugin.xml       # 插件配置文件
├── src/test/kotlin/     # 测试代码
├── build.gradle.kts     # Gradle 构建配置
└── gradle.properties    # Gradle 属性配置
```

## 开发流程

### 1. 克隆项目
```bash
git clone <repository-url>
cd jetbrains-plugin
```

### 2. 导入到 IntelliJ IDEA
1. 打开 IntelliJ IDEA
2. 选择 "Open" 或 "Import Project"
3. 选择项目根目录
4. 选择 "Import project from external model" -> "Gradle"
5. 使用默认设置完成导入

### 3. 运行插件
```bash
# 在开发环境中运行插件
./gradlew runIde
```

### 4. 构建插件
```bash
# 构建插件
./gradlew buildPlugin

# 运行测试
./gradlew test

# 验证插件
./gradlew verifyPlugin
```

## 核心组件说明

### Actions
Actions 是用户交互的入口点，每个 Action 对应一个用户操作：

- **CreateBaseStructureAction** - 创建基础目录结构
- **CreateFeatureAction** - 创建 Feature 模块
- **ConfigureStructureAction** - 配置目录结构

### Settings
设置系统管理插件的配置：

- **CleanArchSettings** - 持久化设置服务
- **CleanArchConfigurable** - 设置界面

### Models
数据模型定义：

- **DirectoryStructure** - 目录结构数据模型
- **PluginConfig** - 插件配置模型
- **CreateResult** - 操作结果模型

### Utils
工具类提供通用功能：

- **FileUtils** - 文件操作工具

## 开发规范

### 代码风格
- 使用 Kotlin 官方代码风格
- 类名使用 PascalCase
- 函数名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### 注释规范
- 所有公共类和函数必须有 KDoc 注释
- 复杂逻辑需要添加行内注释
- 使用中文注释（与用户界面保持一致）

### 测试
- 为工具类编写单元测试
- 测试文件命名为 `*Test.kt`
- 使用 JUnit 和 Kotlin Test

## 调试技巧

### 1. 日志输出
```kotlin
import com.intellij.openapi.diagnostic.Logger

class MyClass {
    companion object {
        private val LOG = Logger.getInstance(MyClass::class.java)
    }
    
    fun myMethod() {
        LOG.info("这是一条信息日志")
        LOG.warn("这是一条警告日志")
        LOG.error("这是一条错误日志")
    }
}
```

### 2. 断点调试
在 `runIde` 任务中，可以直接在 IntelliJ IDEA 中设置断点进行调试。

### 3. 插件日志
插件运行时的日志可以在以下位置查看：
- **macOS**: `~/Library/Logs/JetBrains/IntelliJIdea2023.2/idea.log`
- **Windows**: `%APPDATA%\JetBrains\IntelliJIdea2023.2\log\idea.log`
- **Linux**: `~/.cache/JetBrains/IntelliJIdea2023.2/log/idea.log`

## 发布流程

### 1. 版本更新
1. 更新 `gradle.properties` 中的版本号
2. 更新 `CHANGELOG.md`
3. 更新 `plugin.xml` 中的版本信息

### 2. 构建和测试
```bash
./gradlew clean test buildPlugin verifyPlugin
```

### 3. 发布到 JetBrains Marketplace
```bash
# 需要设置 PUBLISH_TOKEN 环境变量
export PUBLISH_TOKEN=your_token_here
./gradlew publishPlugin
```

## 常见问题

### Q: 插件无法加载
A: 检查 `plugin.xml` 配置是否正确，确保所有引用的类都存在。

### Q: Action 不显示在菜单中
A: 检查 `plugin.xml` 中的 action 配置，确保 group 和 anchor 设置正确。

### Q: 设置界面不显示
A: 检查 `CleanArchConfigurable` 是否正确注册到 `plugin.xml` 中。

### Q: 文件操作失败
A: 确保在 `WriteAction` 中执行文件操作，并正确处理异常。

## 参考资源

- [IntelliJ Platform SDK 文档](https://plugins.jetbrains.com/docs/intellij/)
- [Kotlin 官方文档](https://kotlinlang.org/docs/)
- [Gradle IntelliJ Plugin](https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html)
- [JetBrains Marketplace](https://plugins.jetbrains.com/)
