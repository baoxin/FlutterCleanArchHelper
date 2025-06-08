package com.baoxin.cleanarch.utils

import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.openapi.vfs.VfsUtil
import com.intellij.openapi.application.WriteAction
import com.baoxin.cleanarch.model.DirectoryStructure
import com.baoxin.cleanarch.model.CreateResult
import java.io.IOException

/**
 * 文件操作工具类
 */
object FileUtils {
    
    /**
     * 创建目录结构
     */
    fun createDirectoryStructure(
        project: Project,
        targetDir: VirtualFile,
        structure: DirectoryStructure,
        createGitKeep: Boolean = false
    ): CreateResult {
        val createdPaths = mutableListOf<String>()
        
        return try {
            WriteAction.computeAndWait<CreateResult, Exception> {
                createDirectoriesRecursively(
                    targetDir, 
                    structure.directories, 
                    createdPaths, 
                    createGitKeep
                )
                
                // 刷新文件系统
                targetDir.refresh(false, true)
                
                CreateResult(
                    success = true,
                    message = "成功创建目录结构，共创建 ${createdPaths.size} 个目录",
                    createdPaths = createdPaths
                )
            }
        } catch (e: Exception) {
            CreateResult(
                success = false,
                message = "创建目录结构失败: ${e.message}",
                createdPaths = createdPaths
            )
        }
    }
    
    /**
     * 递归创建目录
     */
    private fun createDirectoriesRecursively(
        parentDir: VirtualFile,
        structure: Map<String, Any>,
        createdPaths: MutableList<String>,
        createGitKeep: Boolean
    ) {
        for ((name, subStructure) in structure) {
            try {
                // 创建目录
                val dir = parentDir.findChild(name) ?: parentDir.createChildDirectory(null, name)
                createdPaths.add(dir.path)
                
                // 如果需要创建 .gitkeep 文件
                if (createGitKeep && dir.children.isEmpty()) {
                    try {
                        dir.createChildData(null, ".gitkeep")
                    } catch (e: IOException) {
                        // 忽略 .gitkeep 创建失败
                    }
                }
                
                // 递归创建子目录
                if (subStructure is Map<*, *>) {
                    @Suppress("UNCHECKED_CAST")
                    val subMap = subStructure as Map<String, Any>
                    if (subMap.isNotEmpty()) {
                        createDirectoriesRecursively(dir, subMap, createdPaths, createGitKeep)
                    }
                }
            } catch (e: IOException) {
                throw IOException("创建目录 '$name' 失败: ${e.message}", e)
            }
        }
    }
    
    /**
     * 规范化 Feature 名称
     */
    fun normalizeFeatureName(name: String): String {
        return name
            .lowercase()
            .replace(Regex("[^a-z0-9]"), "_")
            .replace(Regex("_+"), "_")
            .replace(Regex("^_|_$"), "")
    }
    
    /**
     * 检查是否为 Flutter 项目
     */
    fun isFlutterProject(projectDir: VirtualFile): Boolean {
        val pubspecFile = projectDir.findChild("pubspec.yaml")
        return if (pubspecFile != null && pubspecFile.exists()) {
            try {
                val content = String(pubspecFile.contentsToByteArray())
                content.contains("flutter:")
            } catch (e: IOException) {
                false
            }
        } else {
            false
        }
    }
    
    /**
     * 检查目录是否存在且不为空
     */
    fun isDirectoryNotEmpty(dir: VirtualFile): Boolean {
        return dir.exists() && dir.isDirectory && dir.children.isNotEmpty()
    }
    
    /**
     * 获取相对于项目根目录的路径
     */
    fun getRelativePath(project: Project, file: VirtualFile): String {
        val projectDir = project.baseDir
        return if (projectDir != null) {
            VfsUtil.getRelativePath(file, projectDir) ?: file.path
        } else {
            file.path
        }
    }
    
    /**
     * 查找或创建 features 目录
     */
    fun findOrCreateFeaturesDir(projectDir: VirtualFile): VirtualFile? {
        return try {
            WriteAction.computeAndWait<VirtualFile?, Exception> {
                // 首先查找 lib/features
                val libDir = projectDir.findChild("lib")
                if (libDir != null) {
                    libDir.findChild("features") ?: libDir.createChildDirectory(null, "features")
                } else {
                    // 如果没有 lib 目录，在项目根目录创建 features
                    projectDir.findChild("features") ?: projectDir.createChildDirectory(null, "features")
                }
            }
        } catch (e: Exception) {
            null
        }
    }
}
