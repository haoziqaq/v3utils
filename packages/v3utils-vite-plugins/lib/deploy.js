"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const scp2_1 = __importDefault(require("scp2"));
// @ts-ignore
const ora_1 = __importDefault(require("ora"));
// @ts-ignore
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("./utils");
const path_1 = require("path");
function default_1({ host = '', username = '', password = '', path = './dist/', remotePath = '', port = '' } = {}) {
    return {
        name: 'deploy-plugin',
        closeBundle() {
            path = path_1.resolve(utils_1.root, path);
            const spinner = ora_1.default();
            spinner.start(chalk_1.default.green(`正在发布应用到${host}:${port}${remotePath}`));
            scp2_1.default.scp(path, {
                port,
                host,
                username,
                password,
                path: remotePath
            }, (err) => {
                if (err) {
                    spinner.fail(chalk_1.default.red(`发布失败, 目标:${host}:${port}${remotePath}`));
                }
                else {
                    spinner.succeed(chalk_1.default.green(`成功发布应用到${host}:${port}${remotePath}`));
                }
            });
        }
    };
}
exports.default = default_1;
