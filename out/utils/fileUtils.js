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
exports.directoryExists = exports.normalizeFeatureName = exports.isFlutterProject = exports.getSelectedPath = exports.getWorkspaceRoot = exports.createDirectoryStructure = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * 创建目录结构
 */
async function createDirectoryStructure(options) {
    const { targetPath, structure, createFiles = false } = options;
    const createdPaths = [];
    try {
        await createDirectoriesRecursively(targetPath, structure, createdPaths, createFiles);
        return {
            success: true,
            message: `成功创建目录结构，共创建 ${createdPaths.length} 个目录`,
            createdPaths
        };
    }
    catch (error) {
        return {
            success: false,
            message: `创建目录结构失败: ${error}`,
            createdPaths
        };
    }
}
exports.createDirectoryStructure = createDirectoryStructure;
/**
 * 递归创建目录
 */
async function createDirectoriesRecursively(basePath, structure, createdPaths, createFiles) {
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
            await createDirectoriesRecursively(fullPath, subStructure, createdPaths, createFiles);
        }
    }
}
/**
 * 获取工作区根目录
 */
function getWorkspaceRoot() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return workspaceFolders && workspaceFolders.length > 0
        ? workspaceFolders[0].uri.fsPath
        : undefined;
}
exports.getWorkspaceRoot = getWorkspaceRoot;
/**
 * 获取选中的目录路径
 */
function getSelectedPath(uri) {
    if (uri) {
        const stat = fs.statSync(uri.fsPath);
        return stat.isDirectory() ? uri.fsPath : path.dirname(uri.fsPath);
    }
    return getWorkspaceRoot() || '';
}
exports.getSelectedPath = getSelectedPath;
/**
 * 验证是否为 Flutter 项目
 */
function isFlutterProject(projectPath) {
    const pubspecPath = path.join(projectPath, 'pubspec.yaml');
    if (!fs.existsSync(pubspecPath)) {
        return false;
    }
    try {
        const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
        return pubspecContent.includes('flutter:');
    }
    catch {
        return false;
    }
}
exports.isFlutterProject = isFlutterProject;
/**
 * 规范化 Feature 名称
 */
function normalizeFeatureName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}
exports.normalizeFeatureName = normalizeFeatureName;
/**
 * 检查目录是否存在
 */
function directoryExists(dirPath) {
    try {
        const stat = fs.statSync(dirPath);
        return stat.isDirectory();
    }
    catch {
        return false;
    }
}
exports.directoryExists = directoryExists;
//# sourceMappingURL=fileUtils.js.map