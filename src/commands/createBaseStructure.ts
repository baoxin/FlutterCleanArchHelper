import * as vscode from 'vscode';
import * as path from 'path';
import { getPluginConfig } from '../config/structureConfig';
import { createDirectoryStructure, getSelectedPath, isFlutterProject } from '../utils/fileUtils';

/**
 * 创建 Clean Architecture 基础结构命令
 */
export async function createBaseStructureCommand(uri?: vscode.Uri): Promise<void> {
  try {
    // 获取目标路径
    const targetPath = getSelectedPath(uri);
    if (!targetPath) {
      vscode.window.showErrorMessage('无法确定目标路径，请确保打开了工作区');
      return;
    }

    // 验证是否为 Flutter 项目
    if (!isFlutterProject(targetPath)) {
      const choice = await vscode.window.showWarningMessage(
        '当前目录似乎不是 Flutter 项目，是否继续创建目录结构？',
        '继续',
        '取消'
      );
      
      if (choice !== '继续') {
        return;
      }
    }

    // 获取配置
    const config = getPluginConfig();
    
    // 询问是否创建 .gitkeep 文件
    const createFiles = await vscode.window.showQuickPick(
      [
        { label: '是', description: '在空目录中创建 .gitkeep 文件', value: true },
        { label: '否', description: '只创建目录结构', value: false }
      ],
      {
        placeHolder: '是否在空目录中创建 .gitkeep 文件？'
      }
    );

    if (createFiles === undefined) {
      return;
    }

    // 显示进度
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '正在创建 Clean Architecture 基础结构...',
        cancellable: false
      },
      async (progress) => {
        progress.report({ increment: 0, message: '准备创建目录结构' });

        // 创建目录结构
        const result = await createDirectoryStructure({
          targetPath,
          structure: config.baseStructure,
          createFiles: createFiles.value
        });

        progress.report({ increment: 100, message: '完成' });

        if (result.success) {
          vscode.window.showInformationMessage(result.message);
          
          // 刷新文件资源管理器
          vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
        } else {
          vscode.window.showErrorMessage(result.message);
        }
      }
    );

  } catch (error) {
    vscode.window.showErrorMessage(`创建基础结构失败: ${error}`);
  }
}

/**
 * 在指定路径创建基础结构（用于其他命令调用）
 */
export async function createBaseStructureAtPath(targetPath: string, showProgress = true): Promise<boolean> {
  try {
    const config = getPluginConfig();
    
    const createAction = async () => {
      const result = await createDirectoryStructure({
        targetPath,
        structure: config.baseStructure,
        createFiles: true
      });
      
      return result.success;
    };

    if (showProgress) {
      return await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: '正在创建基础结构...',
          cancellable: false
        },
        createAction
      );
    } else {
      return await createAction();
    }

  } catch (error) {
    console.error('创建基础结构失败:', error);
    return false;
  }
}
