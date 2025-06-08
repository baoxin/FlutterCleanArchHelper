package com.baoxin.cleanarch.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.options.ShowSettingsUtil
import com.intellij.openapi.ui.Messages
import com.baoxin.cleanarch.settings.CleanArchConfigurable
import com.baoxin.cleanarch.settings.CleanArchSettings

/**
 * 配置目录结构的 Action
 */
class ConfigureStructureAction : AnAction() {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        
        // 显示配置选项
        val options = arrayOf(
            "打开设置页面",
            "查看当前配置",
            "重置为默认配置"
        )
        
        val choice = Messages.showChooseDialog(
            project,
            "选择配置操作:",
            "配置目录结构",
            options,
            options[0],
            Messages.getQuestionIcon()
        )
        
        when (choice) {
            0 -> openSettingsPage(project)
            1 -> viewCurrentConfig(project)
            2 -> resetToDefault(project)
        }
    }
    
    /**
     * 打开设置页面
     */
    private fun openSettingsPage(project: com.intellij.openapi.project.Project) {
        ShowSettingsUtil.getInstance().showSettingsDialog(
            project,
            CleanArchConfigurable::class.java
        )
    }
    
    /**
     * 查看当前配置
     */
    private fun viewCurrentConfig(project: com.intellij.openapi.project.Project) {
        val settings = CleanArchSettings.getInstance()
        val config = settings.getPluginConfig()
        
        val configText = buildString {
            appendLine("当前配置:")
            appendLine()
            appendLine("基础结构配置:")
            appendLine(config.baseStructure.toPrettyJson())
            appendLine()
            appendLine("Feature 结构配置:")
            appendLine(config.featureStructure.toPrettyJson())
        }
        
        // 创建一个临时文件来显示配置
        try {
            val tempFile = com.intellij.openapi.vfs.VfsUtil.createTempFile(
                "clean-arch-config",
                ".json",
                configText.toByteArray(),
                true
            )
            
            com.intellij.openapi.fileEditor.FileEditorManager.getInstance(project)
                .openFile(tempFile, true)
                
        } catch (e: Exception) {
            // 如果创建临时文件失败，使用对话框显示
            Messages.showInfoMessage(
                project,
                configText,
                "当前配置"
            )
        }
    }
    
    /**
     * 重置为默认配置
     */
    private fun resetToDefault(project: com.intellij.openapi.project.Project) {
        val result = Messages.showYesNoDialog(
            project,
            "确定要重置为默认配置吗？这将丢失当前的自定义配置。",
            "确认重置",
            Messages.getQuestionIcon()
        )
        
        if (result == Messages.YES) {
            val settings = CleanArchSettings.getInstance()
            settings.resetToDefault()
            
            Messages.showInfoMessage(
                project,
                "配置已重置为默认值",
                "重置成功"
            )
        }
    }
    
    override fun update(e: AnActionEvent) {
        // 只有在项目打开时才启用
        e.presentation.isEnabledAndVisible = e.project != null
    }
}
