package com.baoxin.cleanarch.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.InputValidator
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.vfs.VirtualFile
import com.baoxin.cleanarch.settings.CleanArchSettings
import com.baoxin.cleanarch.utils.FileUtils
import com.baoxin.cleanarch.model.DirectoryStructure

/**
 * 创建 Feature 模块的 Action
 */
class CreateFeatureAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val selectedFile = e.getData(CommonDataKeys.VIRTUAL_FILE) ?: project.baseDir ?: return
        
        // 确保选择的是目录
        val targetDir = if (selectedFile.isDirectory) selectedFile else selectedFile.parent
        
        // 输入 Feature 名称
        val featureName = Messages.showInputDialog(
            project,
            "请输入 Feature 名称:",
            "创建 Feature 模块",
            Messages.getQuestionIcon(),
            "",
            object : InputValidator {
                override fun checkInput(inputString: String): Boolean {
                    return inputString.isNotBlank()
                }
                
                override fun canClose(inputString: String): Boolean {
                    return checkInput(inputString)
                }
            }
        ) ?: return
        
        // 规范化 Feature 名称
        val normalizedName = FileUtils.normalizeFeatureName(featureName)
        if (normalizedName.isEmpty()) {
            Messages.showErrorDialog(
                project,
                "Feature 名称无效，请使用字母、数字或下划线",
                "名称错误"
            )
            return
        }
        
        // 确定创建位置
        val featureDir = determineFeatureLocation(project, targetDir, normalizedName) ?: return
        
        // 检查目录是否已存在
        if (featureDir.exists() && FileUtils.isDirectoryNotEmpty(featureDir)) {
            val result = Messages.showYesNoDialog(
                project,
                "Feature \"$normalizedName\" 已存在，是否覆盖？",
                "确认覆盖",
                Messages.getWarningIcon()
            )
            if (result != Messages.YES) {
                return
            }
        }
        
        // 获取配置
        val settings = CleanArchSettings.getInstance()
        val config = settings.getPluginConfig()
        
        // 在后台任务中创建 Feature 结构
        ProgressManager.getInstance().run(object : Task.Backgroundable(
            project, 
            "正在创建 Feature \"$normalizedName\"...", 
            false
        ) {
            override fun run(indicator: ProgressIndicator) {
                indicator.text = "准备创建 Feature 结构"
                indicator.fraction = 0.0
                
                val result = FileUtils.createDirectoryStructure(
                    project,
                    featureDir.parent,
                    DirectoryStructure(mapOf(normalizedName to config.featureStructure.directories)),
                    true
                )
                
                indicator.fraction = 1.0
                
                // 在 EDT 中显示结果
                com.intellij.openapi.application.ApplicationManager.getApplication().invokeLater {
                    if (result.success) {
                        Messages.showInfoMessage(
                            project,
                            "成功创建 Feature \"$normalizedName\"",
                            "创建成功"
                        )
                    } else {
                        Messages.showErrorDialog(
                            project,
                            result.message,
                            "创建失败"
                        )
                    }
                }
            }
        })
    }
    
    /**
     * 确定 Feature 的创建位置
     */
    private fun determineFeatureLocation(
        project: com.intellij.openapi.project.Project,
        selectedDir: VirtualFile,
        featureName: String
    ): VirtualFile? {
        val projectDir = project.baseDir ?: return null
        
        // 检查当前选择的目录是否在 features 目录中
        val relativePath = FileUtils.getRelativePath(project, selectedDir)
        
        return if (relativePath.contains("features")) {
            // 如果在 features 目录中，直接在当前目录创建
            try {
                com.intellij.openapi.application.WriteAction.computeAndWait<VirtualFile, Exception> {
                    selectedDir.findChild(featureName) ?: selectedDir.createChildDirectory(null, featureName)
                }
            } catch (e: Exception) {
                Messages.showErrorDialog(
                    project,
                    "无法在当前位置创建目录: ${e.message}",
                    "创建失败"
                )
                null
            }
        } else {
            // 否则询问用户选择位置
            val options = arrayOf("当前目录", "lib/features 目录")
            val choice = Messages.showChooseDialog(
                project,
                "选择 Feature 创建位置:",
                "选择位置",
                options,
                options[1],
                Messages.getQuestionIcon()
            )
            
            when (choice) {
                0 -> { // 当前目录
                    try {
                        com.intellij.openapi.application.WriteAction.computeAndWait<VirtualFile, Exception> {
                            selectedDir.findChild(featureName) ?: selectedDir.createChildDirectory(null, featureName)
                        }
                    } catch (e: Exception) {
                        Messages.showErrorDialog(
                            project,
                            "无法在当前位置创建目录: ${e.message}",
                            "创建失败"
                        )
                        null
                    }
                }
                1 -> { // lib/features 目录
                    val featuresDir = FileUtils.findOrCreateFeaturesDir(projectDir)
                    if (featuresDir != null) {
                        try {
                            com.intellij.openapi.application.WriteAction.computeAndWait<VirtualFile, Exception> {
                                featuresDir.findChild(featureName) ?: featuresDir.createChildDirectory(null, featureName)
                            }
                        } catch (e: Exception) {
                            Messages.showErrorDialog(
                                project,
                                "无法在 features 目录创建: ${e.message}",
                                "创建失败"
                            )
                            null
                        }
                    } else {
                        Messages.showErrorDialog(
                            project,
                            "无法创建或找到 features 目录",
                            "创建失败"
                        )
                        null
                    }
                }
                else -> null
            }
        }
    }
    
    override fun update(e: AnActionEvent) {
        val project = e.project
        val selectedFile = e.getData(CommonDataKeys.VIRTUAL_FILE)
        
        // 只有在项目打开且选择了文件/目录时才启用
        e.presentation.isEnabledAndVisible = project != null && selectedFile != null
    }
}
