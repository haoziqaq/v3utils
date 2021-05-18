"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const ora_1 = __importDefault(require("ora"));
// @ts-ignore
const chalk_1 = __importDefault(require("chalk"));
// @ts-ignore
const globby_1 = __importDefault(require("globby"));
// @ts-ignore
const ali_oss_1 = __importDefault(require("ali-oss"));
const path_1 = require("path");
const utils_1 = require("./utils");
const SECOND_DOMAIN = 'aliyuncs.com';
const PROTOCOL = 'https';
function default_1({ region = '', accessKeyId = '', accessKeySecret = '', bucket = '', path = './dist/', remotePath = '/' } = {}) {
    return {
        name: 'ali-oss-plugin',
        closeBundle() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!remotePath.startsWith('/') || !remotePath.endsWith('/')) {
                    console.error('remotePath必须以/开头,以/结尾');
                    return;
                }
                path = path_1.resolve(utils_1.root, path);
                const spinner = ora_1.default();
                const client = new ali_oss_1.default({
                    region,
                    accessKeyId,
                    accessKeySecret,
                    bucket
                });
                const domain = `${PROTOCOL}://${bucket}.${region}.${SECOND_DOMAIN}`;
                const filePaths = yield globby_1.default(path);
                for (const filePath of filePaths) {
                    const remoteFilePath = path_1.resolve(remotePath, filePath.replace(`${path}/`, ''));
                    spinner.start(chalk_1.default.green(`正在发布文件到${domain}${remoteFilePath}`));
                    yield client.put(remoteFilePath, filePath);
                    spinner.succeed(chalk_1.default.green(`成功发布文件${domain}${remoteFilePath}`));
                }
                spinner.succeed(chalk_1.default.green('全部发布成功'));
            });
        }
    };
}
exports.default = default_1;
