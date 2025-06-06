import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DirectoryStructure, CreateDirectoryOptions, CreateResult } from '../types';

/**
 * 创建目录结构
 */
export async function createDirectoryStructure(options: CreateDirectoryOptions): Promise<CreateResult> {
  const { targetPath, structure, createFiles = false } = options;
  const createdPaths: string[] = [];

  try {
    await createDirectoriesRecursively(targetPath, structure, createdPaths, createFiles);
    
    return {
      success: true,
      message: `成功创建目录结构，共创建 ${createdPaths.length} 个目录`,
      createdPaths
    };
  } catch (error) {
    return {
      success: false,
      message: `创建目录结构失败: ${error}`,
      createdPaths
    };
  }
}

/**
 * 递归创建目录
 */
async function createDirectoriesRecursively(
  basePath: string,
  structure: DirectoryStructure,
  createdPaths: string[],
  createFiles: boolean
): Promise<void> {
  for (const [name, subStructure] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);
    
    // 创建目录
    if (!fs.existsSync(fullPath)) {
      await fs.promises.mkdir(fullPath, { recursive: true });
      createdPaths.push(fullPath);
    }

    // 如果需要创建文件，在每个目录中创建 .gitkeep 文件
    if (createFiles) {
      const gitkeepPath = path.join(fullPath, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        await fs.promises.writeFile(gitkeepPath, '');
      }
    }

    // 递归创建子目录
    if (typeof subStructure === 'object' && subStructure !== null && Object.keys(subStructure).length > 0) {
      await createDirectoriesRecursively(fullPath, subStructure as DirectoryStructure, createdPaths, createFiles);
    }
  }
}

/**
 * 获取工作区根目录
 */
export function getWorkspaceRoot(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  return workspaceFolders && workspaceFolders.length > 0 
    ? workspaceFolders[0].uri.fsPath 
    : undefined;
}

/**
 * 获取选中的目录路径
 */
export function getSelectedPath(uri?: vscode.Uri): string {
  if (uri) {
    const stat = fs.statSync(uri.fsPath);
    return stat.isDirectory() ? uri.fsPath : path.dirname(uri.fsPath);
  }
  
  return getWorkspaceRoot() || '';
}

/**
 * 验证是否为 Flutter 项目
 */
export function isFlutterProject(projectPath: string): boolean {
  const pubspecPath = path.join(projectPath, 'pubspec.yaml');
  if (!fs.existsSync(pubspecPath)) {
    return false;
  }

  try {
    const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
    return pubspecContent.includes('flutter:');
  } catch {
    return false;
  }
}

/**
 * 规范化 Feature 名称
 */
export function normalizeFeatureName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * 检查目录是否存在
 */
export function directoryExists(dirPath: string): boolean {
  try {
    const stat = fs.statSync(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
