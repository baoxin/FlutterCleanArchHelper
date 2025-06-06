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
exports.validateStructureConfig = exports.resetToDefaultConfig = exports.updatePluginConfig = exports.getPluginConfig = exports.DEFAULT_FEATURE_STRUCTURE = exports.DEFAULT_BASE_STRUCTURE = void 0;
const vscode = __importStar(require("vscode"));
/**
 * 默认的 Clean Architecture 基础结构
 */
exports.DEFAULT_BASE_STRUCTURE = {
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
exports.DEFAULT_FEATURE_STRUCTURE = {
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
function getPluginConfig() {
    const config = vscode.workspace.getConfiguration('cleanArch');
    return {
        baseStructure: config.get('baseStructure') || exports.DEFAULT_BASE_STRUCTURE,
        featureStructure: config.get('featureStructure') || exports.DEFAULT_FEATURE_STRUCTURE
    };
}
exports.getPluginConfig = getPluginConfig;
/**
 * 更新插件配置
 */
async function updatePluginConfig(newConfig) {
    const config = vscode.workspace.getConfiguration('cleanArch');
    if (newConfig.baseStructure) {
        await config.update('baseStructure', newConfig.baseStructure, vscode.ConfigurationTarget.Global);
    }
    if (newConfig.featureStructure) {
        await config.update('featureStructure', newConfig.featureStructure, vscode.ConfigurationTarget.Global);
    }
}
exports.updatePluginConfig = updatePluginConfig;
/**
 * 重置配置为默认值
 */
async function resetToDefaultConfig() {
    const config = vscode.workspace.getConfiguration('cleanArch');
    await config.update('baseStructure', exports.DEFAULT_BASE_STRUCTURE, vscode.ConfigurationTarget.Global);
    await config.update('featureStructure', exports.DEFAULT_FEATURE_STRUCTURE, vscode.ConfigurationTarget.Global);
}
exports.resetToDefaultConfig = resetToDefaultConfig;
/**
 * 验证目录结构配置
 */
function validateStructureConfig(structure) {
    if (!structure || typeof structure !== 'object') {
        return false;
    }
    // 递归验证结构
    function validateRecursively(obj) {
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
exports.validateStructureConfig = validateStructureConfig;
//# sourceMappingURL=structureConfig.js.map