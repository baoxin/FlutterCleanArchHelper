package com.baoxin.cleanarch.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.vfs.VirtualFile
import com.baoxin.cleanarch.settings.CleanArchSettings
import com.baoxin.cleanarch.utils.FileUtils

/**
 * 创建 Clean Architecture 基础结构的 Action
 */
class CreateBaseStructureAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val selectedFile = e.getData(CommonDataKeys.VIRTUAL_FILE) ?: project.baseDir ?: return
        
        // 确保选择的是目录
        val targetDir = if (selectedFile.isDirectory) selectedFile else selectedFile.parent
        
        // 检查是否为 Flutter 项目
        val isFlutter = FileUtils.isFlutterProject(project.baseDir ?: targetDir)
        if (!isFlutter) {
            val result = Messages.showYesNoDialog(
                project,
                "当前目录似乎不是 Flutter 项目，是否继续创建目录结构？",
                "确认创建",
                Messages.getQuestionIcon()
            )
            if (result != Messages.YES) {
                return
            }
        }
        
        // 询问是否创建 .gitkeep 文件
        val createGitKeep = Messages.showYesNoDialog(
            project,
            "是否在空目录中创建 .gitkeep 文件？",
            "创建选项",
            "是",
            "否",
            Messages.getQuestionIcon()
        ) == Messages.YES
        
        // 获取配置
        val settings = CleanArchSettings.getInstance()
        val config = settings.getPluginConfig()
        
        // 在后台任务中创建目录结构
        ProgressManager.getInstance().run(object : Task.Backgroundable(
            project, 
            "正在创建 Clean Architecture 基础结构...", 
            false
        ) {
            override fun run(indicator: ProgressIndicator) {
                indicator.text = "准备创建目录结构"
                indicator.fraction = 0.0
                
                val result = FileUtils.createDirectoryStructure(
                    project,
                    targetDir,
                    config.baseStructure,
                    createGitKeep
                )
                
                indicator.fraction = 1.0
                
                // 在 EDT 中显示结果
                com.intellij.openapi.application.ApplicationManager.getApplication().invokeLater {
                    if (result.success) {
                        Messages.showInfoMessage(
                            project,
                            result.message,
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
    
    override fun update(e: AnActionEvent) {
        val project = e.project
        val selectedFile = e.getData(CommonDataKeys.VIRTUAL_FILE)
        
        // 只有在项目打开且选择了文件/目录时才启用
        e.presentation.isEnabledAndVisible = project != null && selectedFile != null
    }
}
