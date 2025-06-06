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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const createBaseStructure_1 = require("./commands/createBaseStructure");
const createFeature_1 = require("./commands/createFeature");
const configureStructure_1 = require("./commands/configureStructure");
/**
 * 插件激活函数
 */
function activate(context) {
    console.log('Flutter Clean Architecture Helper 插件已激活');
    // 注册命令：创建基础结构
    const createBaseStructureDisposable = vscode.commands.registerCommand('flutter-clean-arch.createBaseStructure', createBaseStructure_1.createBaseStructureCommand);
    // 注册命令：创建 Feature
    const createFeatureDisposable = vscode.commands.registerCommand('flutter-clean-arch.createFeature', createFeature_1.createFeatureCommand);
    // 注册命令：配置结构
    const configureStructureDisposable = vscode.commands.registerCommand('flutter-clean-arch.configureStructure', configureStructure_1.configureStructureCommand);
    // 添加到订阅列表
    context.subscriptions.push(createBaseStructureDisposable, createFeatureDisposable, configureStructureDisposable);
    // 显示激活消息
    vscode.window.showInformationMessage('Flutter Clean Architecture Helper 已准备就绪！');
}
exports.activate = activate;
/**
 * 插件停用函数
 */
function deactivate() {
    console.log('Flutter Clean Architecture Helper 插件已停用');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map