"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const utils_1 = require("./utils");
const path_1 = require("path");
// @ts-ignore
const vite_1 = require("vite");
function default_1({ modules, store } = {
    modules: vite_1.normalizePath(path_1.resolve(utils_1.root, 'src/store/modules')),
    store: vite_1.normalizePath(path_1.resolve(utils_1.root, 'src/store/index.js'))
}) {
    let server;
    return {
        name: 'vuex-modules-autoload-plugin',
        configureServer(_server) {
            const declarationFile = path_1.resolve(path_1.dirname(store), 'autoModules.d.ts');
            if (!fs_extra_1.pathExistsSync(declarationFile)) {
                fs_extra_1.writeFileSync(declarationFile, 'declare const __VITE_PLUGIN_AUTO_MODULES__: any');
            }
            server = _server;
            server.watcher.on('add', (file) => {
                if (vite_1.normalizePath(file).startsWith(modules)) {
                    utils_1.reloadFile(server, store);
                }
            });
            server.watcher.on('unlink', (file) => {
                if (vite_1.normalizePath(file).startsWith(modules)) {
                    utils_1.reloadFile(server, store);
                }
            });
        },
        transform(code, id) {
            if (id === store) {
                if (!utils_1.isDir(modules)) {
                    return code;
                }
                const dir = fs_extra_1.readdirSync(modules);
                const imports = dir.map((moduleName) => `import ${utils_1.replaceExt(moduleName)} from '${vite_1.normalizePath(path_1.resolve(modules, moduleName))}'`).join('\n');
                const moduleNames = dir.map((moduleName) => utils_1.replaceExt(moduleName)).toString();
                code = `${imports}\n${code}`;
                code = code.replace('__VITE_PLUGIN_AUTO_MODULES__', `{ ${moduleNames} }`);
                return code;
            }
        }
    };
}
exports.default = default_1;
