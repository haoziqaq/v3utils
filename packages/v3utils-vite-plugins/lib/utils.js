"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadFile = exports.root = exports.replaceExt = exports.isDir = void 0;
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const isDir = (path) => fs_extra_1.pathExistsSync(path) && fs_extra_1.lstatSync(path).isDirectory();
exports.isDir = isDir;
const replaceExt = (path) => path.slice(0, path.lastIndexOf('.'));
exports.replaceExt = replaceExt;
exports.root = process.cwd();
const reloadFile = (server, file) => {
    var _a;
    const mods = (_a = server.moduleGraph.getModulesByFile(file)) !== null && _a !== void 0 ? _a : [];
    const seen = new Set();
    mods.forEach((mod) => server.moduleGraph.invalidateModule(mod, seen));
    server.ws.send({
        type: 'full-reload',
        path: '*'
    });
};
exports.reloadFile = reloadFile;
