import * as vscode from 'vscode';
import { createBaseStructureCommand } from './commands/createBaseStructure';
import { createFeatureCommand } from './commands/createFeature';
import { configureStructureCommand } from './commands/configureStructure';

/**
 * 插件激活函数
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Flutter Clean Architecture Helper 插件已激活');

  // 注册命令：创建基础结构
  const createBaseStructureDisposable = vscode.commands.registerCommand(
    'flutter-clean-arch.createBaseStructure',
    createBaseStructureCommand
  );

  // 注册命令：创建 Feature
  const createFeatureDisposable = vscode.commands.registerCommand(
    'flutter-clean-arch.createFeature',
    createFeatureCommand
  );

  // 注册命令：配置结构
  const configureStructureDisposable = vscode.commands.registerCommand(
    'flutter-clean-arch.configureStructure',
    configureStructureCommand
  );

  // 添加到订阅列表
  context.subscriptions.push(
    createBaseStructureDisposable,
    createFeatureDisposable,
    configureStructureDisposable
  );

  // 显示激活消息
  vscode.window.showInformationMessage('Flutter Clean Architecture Helper 已准备就绪！');
}

/**
 * 插件停用函数
 */
export function deactivate() {
  console.log('Flutter Clean Architecture Helper 插件已停用');
}
