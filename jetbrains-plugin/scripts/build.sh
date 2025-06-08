#!/bin/bash

# Clean Architecture Helper JetBrains Plugin Build Script

set -e

echo "🏗️  开始构建 Clean Architecture Helper JetBrains Plugin..."

# 检查 Java 版本
echo "📋 检查 Java 版本..."
java -version

# 清理之前的构建
echo "🧹 清理之前的构建..."
./gradlew clean

# 运行测试
echo "🧪 运行测试..."
./gradlew test

# 构建插件
echo "🔨 构建插件..."
./gradlew buildPlugin

# 验证插件
echo "✅ 验证插件..."
./gradlew verifyPlugin

echo "🎉 构建完成！"
echo "📦 插件文件位置: build/distributions/"
ls -la build/distributions/

echo ""
echo "🚀 要运行插件进行测试，请执行:"
echo "   ./gradlew runIde"
echo ""
echo "📤 要发布插件，请执行:"
echo "   ./gradlew publishPlugin"
