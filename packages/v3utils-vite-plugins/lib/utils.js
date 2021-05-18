"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = exports.replaceExt = exports.isDir = void 0;
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const isDir = (path) => fs_extra_1.pathExistsSync(path) && fs_extra_1.lstatSync(path).isDirectory();
exports.isDir = isDir;
const replaceExt = (path) => path.slice(0, path.lastIndexOf('.'));
exports.replaceExt = replaceExt;
exports.root = process.cwd();
