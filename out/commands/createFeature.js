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
exports.createFeatureStructure = exports.createFeatureCommand = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const structureConfig_1 = require("../config/structureConfig");
const fileUtils_1 = require("../utils/fileUtils");
/**
 * 创建 Feature 模块命令
 */
async function createFeatureCommand(uri) {
    try {
        // 获取目标路径
        const targetPath = (0, fileUtils_1.getSelectedPath)(uri);
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
                const normalized = (0, fileUtils_1.normalizeFeatureName)(value.trim());
                if (normalized.length === 0) {
                    return 'Feature 名称格式不正确';
                }
                return null;
            }
        });
        if (!featureName) {
            return;
        }
        const normalizedName = (0, fileUtils_1.normalizeFeatureName)(featureName.trim());
        // 确定创建路径
        let featurePath;
        // 检查是否在 features 目录中
        if (path.basename(targetPath) === 'features') {
            featurePath = path.join(targetPath, normalizedName);
        }
        else {
            // 查找 features 目录
            const featuresPath = path.join(targetPath, 'lib', 'features');
            if ((0, fileUtils_1.directoryExists)(featuresPath)) {
                featurePath = path.join(featuresPath, normalizedName);
            }
            else {
                // 询问用户选择创建位置
                const choice = await vscode.window.showQuickPick([
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
                ], {
                    placeHolder: '选择 Feature 创建位置'
                });
                if (!choice) {
                    return;
                }
                if (choice.value === 'current') {
                    featurePath = path.join(targetPath, normalizedName);
                }
                else {
                    featurePath = path.join(targetPath, 'lib', 'features', normalizedName);
                }
            }
        }
        // 检查目录是否已存在
        if ((0, fileUtils_1.directoryExists)(featurePath)) {
            const overwrite = await vscode.window.showWarningMessage(`Feature "${normalizedName}" 已存在，是否覆盖？`, '覆盖', '取消');
            if (overwrite !== '覆盖') {
                return;
            }
        }
        // 获取配置
        const config = (0, structureConfig_1.getPluginConfig)();
        // 创建 Feature 结构
        await createFeatureStructure({
            featureName: normalizedName,
            targetPath: featurePath,
            structure: config.featureStructure
        });
    }
    catch (error) {
        vscode.window.showErrorMessage(`创建 Feature 失败: ${error}`);
    }
}
exports.createFeatureCommand = createFeatureCommand;
/**
 * 创建 Feature 结构
 */
async function createFeatureStructure(options) {
    const { featureName, targetPath, structure } = options;
    const config = (0, structureConfig_1.getPluginConfig)();
    const featureStructure = structure || config.featureStructure;
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `正在创建 Feature "${featureName}"...`,
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0, message: '准备创建 Feature 结构' });
        // 创建目录结构
        const result = await (0, fileUtils_1.createDirectoryStructure)({
            targetPath,
            structure: featureStructure,
            createFiles: true
        });
        progress.report({ increment: 100, message: '完成' });
        if (result.success) {
            vscode.window.showInformationMessage(`成功创建 Feature "${featureName}"`);
            // 刷新文件资源管理器
            vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
        }
        else {
            vscode.window.showErrorMessage(result.message);
        }
    });
}
exports.createFeatureStructure = createFeatureStructure;
//# sourceMappingURL=createFeature.js.map