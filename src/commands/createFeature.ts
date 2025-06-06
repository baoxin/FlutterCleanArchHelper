import * as vscode from 'vscode';
import * as path from 'path';
import { getPluginConfig } from '../config/structureConfig';
import { createDirectoryStructure, getSelectedPath, normalizeFeatureName, directoryExists } from '../utils/fileUtils';
import { CreateFeatureOptions } from '../types';

/**
 * 创建 Feature 模块命令
 */
export async function createFeatureCommand(uri?: vscode.Uri): Promise<void> {
  try {
    // 获取目标路径
    const targetPath = getSelectedPath(uri);
    if (!targetPath) {
      vscode.window.showErrorMessage('无法确定目标路径，请确保打开了工作区');
      return;
    }

    // 输入 Feature 名称
    const featureName = await vscode.window.showInputBox({
      prompt: '请输入 Feature 名称',
      placeHolder: '例如: user_profile, authentication, home',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Feature 名称不能为空';
        }
        
        const normalized = normalizeFeatureName(value.trim());
        if (normalized.length === 0) {
          return 'Feature 名称格式不正确';
        }
        
        return null;
      }
    });

    if (!featureName) {
      return;
    }

    const normalizedName = normalizeFeatureName(featureName.trim());
    
    // 确定创建路径
    let featurePath: string;
    
    // 检查是否在 features 目录中
    if (path.basename(targetPath) === 'features') {
      featurePath = path.join(targetPath, normalizedName);
    } else {
      // 查找 features 目录
      const featuresPath = path.join(targetPath, 'lib', 'features');
      if (directoryExists(featuresPath)) {
        featurePath = path.join(featuresPath, normalizedName);
      } else {
        // 询问用户选择创建位置
        const choice = await vscode.window.showQuickPick(
          [
            { 
              label: '在当前目录创建', 
              description: `在 ${path.basename(targetPath)} 目录下创建 Feature`,
              value: 'current' 
            },
            { 
              label: '创建 features 目录', 
              description: '先创建 lib/features 目录，然后在其中创建 Feature',
              value: 'create_features' 
            }
          ],
          {
            placeHolder: '选择 Feature 创建位置'
          }
        );

        if (!choice) {
          return;
        }

        if (choice.value === 'current') {
          featurePath = path.join(targetPath, normalizedName);
        } else {
          featurePath = path.join(targetPath, 'lib', 'features', normalizedName);
        }
      }
    }

    // 检查目录是否已存在
    if (directoryExists(featurePath)) {
      const overwrite = await vscode.window.showWarningMessage(
        `Feature "${normalizedName}" 已存在，是否覆盖？`,
        '覆盖',
        '取消'
      );
      
      if (overwrite !== '覆盖') {
        return;
      }
    }

    // 获取配置
    const config = getPluginConfig();

    // 创建 Feature 结构
    await createFeatureStructure({
      featureName: normalizedName,
      targetPath: featurePath,
      structure: config.featureStructure
    });

  } catch (error) {
    vscode.window.showErrorMessage(`创建 Feature 失败: ${error}`);
  }
}

/**
 * 创建 Feature 结构
 */
export async function createFeatureStructure(options: CreateFeatureOptions): Promise<void> {
  const { featureName, targetPath, structure } = options;
  const config = getPluginConfig();
  const featureStructure = structure || config.featureStructure;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `正在创建 Feature "${featureName}"...`,
      cancellable: false
    },
    async (progress) => {
      progress.report({ increment: 0, message: '准备创建 Feature 结构' });

      // 创建目录结构
      const result = await createDirectoryStructure({
        targetPath,
        structure: featureStructure,
        createFiles: true
      });

      progress.report({ increment: 100, message: '完成' });

      if (result.success) {
        vscode.window.showInformationMessage(`成功创建 Feature "${featureName}"`);
        
        // 刷新文件资源管理器
        vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
      } else {
        vscode.window.showErrorMessage(result.message);
      }
    }
  );
}
