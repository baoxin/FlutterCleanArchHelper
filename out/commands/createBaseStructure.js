"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseStructureAtPath = exports.createBaseStructureCommand = void 0;
const vscode = __importStar(require("vscode"));
const structureConfig_1 = require("../config/structureConfig");
const fileUtils_1 = require("../utils/fileUtils");
/**
 * 创建 Clean Architecture 基础结构命令
 */
async function createBaseStructureCommand(uri) {
    try {
        // 获取目标路径
        const targetPath = (0, fileUtils_1.getSelectedPath)(uri);
        if (!targetPath) {
            vscode.window.showErrorMessage('无法确定目标路径，请确保打开了工作区');
            return;
        }
        // 验证是否为 Flutter 项目
        if (!(0, fileUtils_1.isFlutterProject)(targetPath)) {
            const choice = await vscode.window.showWarningMessage('当前目录似乎不是 Flutter 项目，是否继续创建目录结构？', '继续', '取消');
            if (choice !== '继续') {
                return;
            }
        }
        // 获取配置
        const config = (0, structureConfig_1.getPluginConfig)();
        // 询问是否创建 .gitkeep 文件
        const createFiles = await vscode.window.showQuickPick([
            { label: '是', description: '在空目录中创建 .gitkeep 文件', value: true },
            { label: '否', description: '只创建目录结构', value: false }
        ], {
            placeHolder: '是否在空目录中创建 .gitkeep 文件？'
        });
        if (createFiles === undefined) {
            return;
        }
        // 显示进度
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '正在创建 Clean Architecture 基础结构...',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: '准备创建目录结构' });
            // 创建目录结构
            const result = await (0, fileUtils_1.createDirectoryStructure)({
                targetPath,
                structure: config.baseStructure,
                createFiles: createFiles.value
            });
            progress.report({ increment: 100, message: '完成' });
            if (result.success) {
                vscode.window.showInformationMessage(result.message);
                // 刷新文件资源管理器
                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
            }
            else {
                vscode.window.showErrorMessage(result.message);
            }
        });
    }
    catch (error) {
        vscode.window.showErrorMessage(`创建基础结构失败: ${error}`);
    }
}
exports.createBaseStructureCommand = createBaseStructureCommand;
/**
 * 在指定路径创建基础结构（用于其他命令调用）
 */
async function createBaseStructureAtPath(targetPath, showProgress = true) {
    try {
        const config = (0, structureConfig_1.getPluginConfig)();
        const createAction = async () => {
            const result = await (0, fileUtils_1.createDirectoryStructure)({
                targetPath,
                structure: config.baseStructure,
                createFiles: true
            });
            return result.success;
        };
        if (showProgress) {
            return await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: '正在创建基础结构...',
                cancellable: false
            }, createAction);
        }
        else {
            return await createAction();
        }
    }
    catch (error) {
        console.error('创建基础结构失败:', error);
        return false;
    }
}
exports.createBaseStructureAtPath = createBaseStructureAtPath;
//# sourceMappingURL=createBaseStructure.js.map