package com.baoxin.cleanarch.model

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

/**
 * 目录结构数据类
 */
data class DirectoryStructure(
    val directories: Map<String, Any> = emptyMap()
) {
    companion object {
        private val gson = Gson()
        
        /**
         * 默认的 Clean Architecture 基础结构
         */
        val DEFAULT_BASE_STRUCTURE = DirectoryStructure(
            mapOf(
                "lib" to mapOf(
                    "core" to mapOf(
                        "constants" to emptyMap<String, Any>(),
                        "errors" to emptyMap<String, Any>(),
                        "network" to emptyMap<String, Any>(),
                        "usecases" to emptyMap<String, Any>(),
                        "utils" to emptyMap<String, Any>()
                    ),
                    "features" to emptyMap<String, Any>(),
                    "shared" to mapOf(
                        "data" to mapOf(
                            "datasources" to emptyMap<String, Any>(),
                            "models" to emptyMap<String, Any>(),
                            "repositories" to emptyMap<String, Any>()
                        ),
                        "domain" to mapOf(
                            "entities" to emptyMap<String, Any>(),
                            "repositories" to emptyMap<String, Any>(),
                            "usecases" to emptyMap<String, Any>()
                        ),
                        "presentation" to mapOf(
                            "bloc" to emptyMap<String, Any>(),
                            "pages" to emptyMap<String, Any>(),
                            "widgets" to emptyMap<String, Any>()
                        )
                    )
                )
            )
        )
        
        /**
         * 默认的 Feature 结构
         */
        val DEFAULT_FEATURE_STRUCTURE = DirectoryStructure(
            mapOf(
                "data" to mapOf(
                    "datasources" to emptyMap<String, Any>(),
                    "models" to emptyMap<String, Any>(),
                    "repositories" to emptyMap<String, Any>()
                ),
                "domain" to mapOf(
                    "entities" to emptyMap<String, Any>(),
                    "repositories" to emptyMap<String, Any>(),
                    "usecases" to emptyMap<String, Any>()
                ),
                "presentation" to mapOf(
                    "bloc" to emptyMap<String, Any>(),
                    "pages" to emptyMap<String, Any>(),
                    "widgets" to emptyMap<String, Any>()
                )
            )
        )
        
        /**
         * 从 JSON 字符串创建目录结构
         */
        fun fromJson(json: String): DirectoryStructure {
            return try {
                val type = object : TypeToken<Map<String, Any>>() {}.type
                val directories = gson.fromJson<Map<String, Any>>(json, type)
                DirectoryStructure(directories)
            } catch (e: Exception) {
                DEFAULT_BASE_STRUCTURE
            }
        }
    }
    
    /**
     * 转换为 JSON 字符串
     */
    fun toJson(): String {
        return gson.toJson(directories)
    }
    
    /**
     * 获取格式化的 JSON 字符串
     */
    fun toPrettyJson(): String {
        return gson.newBuilder().setPrettyPrinting().create().toJson(directories)
    }
    
    /**
     * 检查是否为空结构
     */
    fun isEmpty(): Boolean {
        return directories.isEmpty()
    }
}

/**
 * 插件配置数据类
 */
data class PluginConfig(
    val baseStructure: DirectoryStructure = DirectoryStructure.DEFAULT_BASE_STRUCTURE,
    val featureStructure: DirectoryStructure = DirectoryStructure.DEFAULT_FEATURE_STRUCTURE
)

/**
 * 目录创建结果
 */
data class CreateResult(
    val success: Boolean,
    val message: String,
    val createdPaths: List<String> = emptyList()
)
