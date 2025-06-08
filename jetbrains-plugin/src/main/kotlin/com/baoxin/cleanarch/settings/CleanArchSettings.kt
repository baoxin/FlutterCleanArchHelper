package com.baoxin.cleanarch.settings

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage
import com.intellij.util.xmlb.XmlSerializerUtil
import com.baoxin.cleanarch.model.DirectoryStructure
import com.baoxin.cleanarch.model.PluginConfig

/**
 * 插件设置服务
 */
@State(
    name = "CleanArchSettings",
    storages = [Storage("CleanArchSettings.xml")]
)
class CleanArchSettings : PersistentStateComponent<CleanArchSettings.State> {
    
    data class State(
        var baseStructureJson: String = DirectoryStructure.DEFAULT_BASE_STRUCTURE.toJson(),
        var featureStructureJson: String = DirectoryStructure.DEFAULT_FEATURE_STRUCTURE.toJson()
    )
    
    private var myState = State()
    
    companion object {
        fun getInstance(): CleanArchSettings {
            return ApplicationManager.getApplication().getService(CleanArchSettings::class.java)
        }
    }
    
    override fun getState(): State {
        return myState
    }
    
    override fun loadState(state: State) {
        XmlSerializerUtil.copyBean(state, myState)
    }
    
    /**
     * 获取插件配置
     */
    fun getPluginConfig(): PluginConfig {
        return PluginConfig(
            baseStructure = DirectoryStructure.fromJson(myState.baseStructureJson),
            featureStructure = DirectoryStructure.fromJson(myState.featureStructureJson)
        )
    }
    
    /**
     * 更新基础结构配置
     */
    fun updateBaseStructure(structure: DirectoryStructure) {
        myState.baseStructureJson = structure.toJson()
    }
    
    /**
     * 更新 Feature 结构配置
     */
    fun updateFeatureStructure(structure: DirectoryStructure) {
        myState.featureStructureJson = structure.toJson()
    }
    
    /**
     * 重置为默认配置
     */
    fun resetToDefault() {
        myState.baseStructureJson = DirectoryStructure.DEFAULT_BASE_STRUCTURE.toJson()
        myState.featureStructureJson = DirectoryStructure.DEFAULT_FEATURE_STRUCTURE.toJson()
    }
    
    /**
     * 获取基础结构
     */
    fun getBaseStructure(): DirectoryStructure {
        return DirectoryStructure.fromJson(myState.baseStructureJson)
    }
    
    /**
     * 获取 Feature 结构
     */
    fun getFeatureStructure(): DirectoryStructure {
        return DirectoryStructure.fromJson(myState.featureStructureJson)
    }
}
