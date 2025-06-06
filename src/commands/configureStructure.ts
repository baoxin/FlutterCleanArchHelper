import * as vscode from 'vscode';
import { getPluginConfig, updatePluginConfig, resetToDefaultConfig, validateStructureConfig } from '../config/structureConfig';
import { DirectoryStructure } from '../types';

/**
 * 配置目录结构命令
 */
export async function configureStructureCommand(): Promise<void> {
  try {
    const choice = await vscode.window.showQuickPick(
      [
        {
          label: '编辑基础结构配置',
          description: '修改 Clean Architecture 基础目录结构',
          value: 'editBase'
        },
        {
          label: '编辑 Feature 结构配置',
          description: '修改 Feature 模块目录结构',
          value: 'editFeature'
        },
        {
          label: '查看当前配置',
          description: '查看当前的目录结构配置',
          value: 'view'
        },
        {
          label: '重置为默认配置',
          description: '恢复到插件默认的目录结构',
          value: 'reset'
        }
      ],
      {
        placeHolder: '选择配置操作'
      }
    );

    if (!choice) {
      return;
    }

    switch (choice.value) {
      case 'editBase':
        await editBaseStructureConfig();
        break;
      case 'editFeature':
        await editFeatureStructureConfig();
        break;
      case 'view':
        await viewCurrentConfig();
        break;
      case 'reset':
        await resetConfigToDefault();
        break;
    }

  } catch (error) {
    vscode.window.showErrorMessage(`配置操作失败: ${error}`);
  }
}

/**
 * 编辑基础结构配置
 */
async function editBaseStructureConfig(): Promise<void> {
  const config = getPluginConfig();
  const currentConfig = JSON.stringify(config.baseStructure, null, 2);

  const newConfigText = await vscode.window.showInputBox({
    prompt: '编辑基础结构配置 (JSON 格式)',
    value: currentConfig,
    validateInput: (value) => {
      try {
        const parsed = JSON.parse(value);
        if (!validateStructureConfig(parsed)) {
          return '配置格式不正确';
        }
        return null;
      } catch {
        return '无效的 JSON 格式';
      }
    }
  });

  if (newConfigText) {
    try {
      const newConfig = JSON.parse(newConfigText);
      await updatePluginConfig({ baseStructure: newConfig });
      vscode.window.showInformationMessage('基础结构配置已更新');
    } catch (error) {
      vscode.window.showErrorMessage(`更新配置失败: ${error}`);
    }
  }
}

/**
 * 编辑 Feature 结构配置
 */
async function editFeatureStructureConfig(): Promise<void> {
  const config = getPluginConfig();
  const currentConfig = JSON.stringify(config.featureStructure, null, 2);

  const newConfigText = await vscode.window.showInputBox({
    prompt: '编辑 Feature 结构配置 (JSON 格式)',
    value: currentConfig,
    validateInput: (value) => {
      try {
        const parsed = JSON.parse(value);
        if (!validateStructureConfig(parsed)) {
          return '配置格式不正确';
        }
        return null;
      } catch {
        return '无效的 JSON 格式';
      }
    }
  });

  if (newConfigText) {
    try {
      const newConfig = JSON.parse(newConfigText);
      await updatePluginConfig({ featureStructure: newConfig });
      vscode.window.showInformationMessage('Feature 结构配置已更新');
    } catch (error) {
      vscode.window.showErrorMessage(`更新配置失败: ${error}`);
    }
  }
}

/**
 * 查看当前配置
 */
async function viewCurrentConfig(): Promise<void> {
  const config = getPluginConfig();
  
  const configText = `当前配置:

基础结构配置:
${JSON.stringify(config.baseStructure, null, 2)}

Feature 结构配置:
${JSON.stringify(config.featureStructure, null, 2)}`;

  // 创建一个新的文档来显示配置
  const doc = await vscode.workspace.openTextDocument({
    content: configText,
    language: 'json'
  });
  
  await vscode.window.showTextDocument(doc);
}

/**
 * 重置配置为默认值
 */
async function resetConfigToDefault(): Promise<void> {
  const confirm = await vscode.window.showWarningMessage(
    '确定要重置所有配置为默认值吗？此操作不可撤销。',
    '确定',
    '取消'
  );

  if (confirm === '确定') {
    try {
      await resetToDefaultConfig();
      vscode.window.showInformationMessage('配置已重置为默认值');
    } catch (error) {
      vscode.window.showErrorMessage(`重置配置失败: ${error}`);
    }
  }
}
