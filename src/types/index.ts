/**
 * 目录结构配置类型定义
 */
export interface DirectoryStructure {
  [key: string]: DirectoryStructure | {};
}

/**
 * 插件配置类型
 */
export interface PluginConfig {
  baseStructure: DirectoryStructure;
  featureStructure: DirectoryStructure;
}

/**
 * 创建目录的选项
 */
export interface CreateDirectoryOptions {
  targetPath: string;
  structure: DirectoryStructure;
  createFiles?: boolean;
}

/**
 * Feature 创建选项
 */
export interface CreateFeatureOptions {
  featureName: string;
  targetPath: string;
  structure?: DirectoryStructure;
}

/**
 * 文件模板类型
 */
export interface FileTemplate {
  fileName: string;
  content: string;
  extension: string;
}

/**
 * 目录创建结果
 */
export interface CreateResult {
  success: boolean;
  message: string;
  createdPaths: string[];
}
