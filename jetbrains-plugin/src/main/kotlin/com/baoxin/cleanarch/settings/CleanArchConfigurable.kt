package com.baoxin.cleanarch.settings

import com.intellij.openapi.options.Configurable
import com.intellij.openapi.ui.Messages
import com.intellij.ui.components.JBScrollPane
import com.intellij.ui.components.JBTabbedPane
import com.baoxin.cleanarch.model.DirectoryStructure
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.*

/**
 * 插件配置界面
 */
class CleanArchConfigurable : Configurable {
    
    private var mainPanel: JPanel? = null
    private var baseStructureTextArea: JTextArea? = null
    private var featureStructureTextArea: JTextArea? = null
    private val settings = CleanArchSettings.getInstance()
    
    override fun getDisplayName(): String {
        return "Clean Architecture Helper"
    }
    
    override fun createComponent(): JComponent? {
        mainPanel = JPanel(BorderLayout())
        
        // 创建选项卡面板
        val tabbedPane = JBTabbedPane()
        
        // 基础结构配置选项卡
        val basePanel = createStructurePanel("基础结构配置").also { panel ->
            baseStructureTextArea = panel.components
                .filterIsInstance<JBScrollPane>()
                .firstOrNull()?.viewport?.view as? JTextArea
        }
        tabbedPane.addTab("基础结构", basePanel)
        
        // Feature 结构配置选项卡
        val featurePanel = createStructurePanel("Feature 结构配置").also { panel ->
            featureStructureTextArea = panel.components
                .filterIsInstance<JBScrollPane>()
                .firstOrNull()?.viewport?.view as? JTextArea
        }
        tabbedPane.addTab("Feature 结构", featurePanel)
        
        mainPanel!!.add(tabbedPane, BorderLayout.CENTER)
        
        // 加载当前配置
        reset()
        
        return mainPanel
    }
    
    private fun createStructurePanel(title: String): JPanel {
        val panel = JPanel(BorderLayout())
        
        // 标题
        val titleLabel = JLabel(title)
        titleLabel.border = BorderFactory.createEmptyBorder(10, 10, 10, 10)
        panel.add(titleLabel, BorderLayout.NORTH)
        
        // 文本编辑区域
        val textArea = JTextArea()
        textArea.font = JLabel().font
        textArea.tabSize = 2
        textArea.lineWrap = false
        textArea.wrapStyleWord = false
        
        val scrollPane = JBScrollPane(textArea)
        scrollPane.preferredSize = Dimension(600, 400)
        panel.add(scrollPane, BorderLayout.CENTER)
        
        // 按钮面板
        val buttonPanel = JPanel()
        
        val resetButton = JButton("重置为默认")
        resetButton.addActionListener {
            val result = Messages.showYesNoDialog(
                "确定要重置为默认配置吗？这将丢失当前的自定义配置。",
                "确认重置",
                Messages.getQuestionIcon()
            )
            if (result == Messages.YES) {
                if (title.contains("基础")) {
                    textArea.text = DirectoryStructure.DEFAULT_BASE_STRUCTURE.toPrettyJson()
                } else {
                    textArea.text = DirectoryStructure.DEFAULT_FEATURE_STRUCTURE.toPrettyJson()
                }
            }
        }
        
        val formatButton = JButton("格式化 JSON")
        formatButton.addActionListener {
            try {
                val structure = DirectoryStructure.fromJson(textArea.text)
                textArea.text = structure.toPrettyJson()
            } catch (e: Exception) {
                Messages.showErrorDialog(
                    "JSON 格式错误：${e.message}",
                    "格式化失败"
                )
            }
        }
        
        buttonPanel.add(resetButton)
        buttonPanel.add(formatButton)
        panel.add(buttonPanel, BorderLayout.SOUTH)
        
        return panel
    }
    
    override fun isModified(): Boolean {
        val currentConfig = settings.getPluginConfig()
        
        val baseModified = try {
            val newBase = DirectoryStructure.fromJson(baseStructureTextArea?.text ?: "")
            newBase.toJson() != currentConfig.baseStructure.toJson()
        } catch (e: Exception) {
            true
        }
        
        val featureModified = try {
            val newFeature = DirectoryStructure.fromJson(featureStructureTextArea?.text ?: "")
            newFeature.toJson() != currentConfig.featureStructure.toJson()
        } catch (e: Exception) {
            true
        }
        
        return baseModified || featureModified
    }
    
    override fun apply() {
        try {
            val baseStructure = DirectoryStructure.fromJson(baseStructureTextArea?.text ?: "")
            val featureStructure = DirectoryStructure.fromJson(featureStructureTextArea?.text ?: "")
            
            settings.updateBaseStructure(baseStructure)
            settings.updateFeatureStructure(featureStructure)
            
        } catch (e: Exception) {
            Messages.showErrorDialog(
                "保存配置失败：${e.message}",
                "配置错误"
            )
            throw e
        }
    }
    
    override fun reset() {
        val config = settings.getPluginConfig()
        baseStructureTextArea?.text = config.baseStructure.toPrettyJson()
        featureStructureTextArea?.text = config.featureStructure.toPrettyJson()
    }
}
