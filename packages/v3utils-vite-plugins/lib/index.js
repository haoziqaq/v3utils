"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vueComponentsAutoload = exports.vueRoutesAutoload = exports.vuexModulesAutoload = exports.deploy = exports.aliOss = void 0;
const aliOss_1 = __importDefault(require("./aliOss"));
exports.aliOss = aliOss_1.default;
const deploy_1 = __importDefault(require("./deploy"));
exports.deploy = deploy_1.default;
const vueComponentsAutoload_1 = __importDefault(require("./vueComponentsAutoload"));
exports.vueComponentsAutoload = vueComponentsAutoload_1.default;
const vueRoutesAutoload_1 = __importDefault(require("./vueRoutesAutoload"));
exports.vueRoutesAutoload = vueRoutesAutoload_1.default;
const vuexModulesAutoload_1 = __importDefault(require("./vuexModulesAutoload"));
exports.vuexModulesAutoload = vuexModulesAutoload_1.default;
