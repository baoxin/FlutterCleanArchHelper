import * as vscode from 'vscode';
import { DirectoryStructure, PluginConfig } from '../types';

/**
 * 默认的 Clean Architecture 基础结构
 */
export const DEFAULT_BASE_STRUCTURE: DirectoryStructure = {
  lib: {
    core: {
      constants: {},
      errors: {},
      network: {},
      usecases: {},
      utils: {}
    },
    features: {},
    shared: {
      data: {
        datasources: {},
        models: {},
        repositories: {}
      },
      domain: {
        entities: {},
        repositories: {},
        usecases: {}
      },
      presentation: {
        bloc: {},
        pages: {},
        widgets: {}
      }
    }
  }
};

/**
 * 默认的 Feature 结构
 */
export const DEFAULT_FEATURE_STRUCTURE: DirectoryStructure = {
  data: {
    datasources: {},
    models: {},
    repositories: {}
  },
  domain: {
    entities: {},
    repositories: {},
    usecases: {}
  },
  presentation: {
    bloc: {},
    pages: {},
    widgets: {}
  }
};

/**
 * 获取插件配置
 */
export function getPluginConfig(): PluginConfig {
  const config = vscode.workspace.getConfiguration('flutterCleanArch');
  
  return {
    baseStructure: config.get('baseStructure') || DEFAULT_BASE_STRUCTURE,
    featureStructure: config.get('featureStructure') || DEFAULT_FEATURE_STRUCTURE
  };
}

/**
 * 更新插件配置
 */
export async function updatePluginConfig(newConfig: Partial<PluginConfig>): Promise<void> {
  const config = vscode.workspace.getConfiguration('flutterCleanArch');
  
  if (newConfig.baseStructure) {
    await config.update('baseStructure', newConfig.baseStructure, vscode.ConfigurationTarget.Global);
  }
  
  if (newConfig.featureStructure) {
    await config.update('featureStructure', newConfig.featureStructure, vscode.ConfigurationTarget.Global);
  }
}

/**
 * 重置配置为默认值
 */
export async function resetToDefaultConfig(): Promise<void> {
  const config = vscode.workspace.getConfiguration('flutterCleanArch');
  
  await config.update('baseStructure', DEFAULT_BASE_STRUCTURE, vscode.ConfigurationTarget.Global);
  await config.update('featureStructure', DEFAULT_FEATURE_STRUCTURE, vscode.ConfigurationTarget.Global);
}

/**
 * 验证目录结构配置
 */
export function validateStructureConfig(structure: any): boolean {
  if (!structure || typeof structure !== 'object') {
    return false;
  }
  
  // 递归验证结构
  function validateRecursively(obj: any): boolean {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof key !== 'string') {
        return false;
      }
      
      if (value !== null && typeof value === 'object') {
        if (!validateRecursively(value)) {
          return false;
        }
      }
    }
    return true;
  }
  
  return validateRecursively(structure);
}
