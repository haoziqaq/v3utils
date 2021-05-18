"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const utils_1 = require("./utils");
const path_1 = require("path");
// @ts-ignore
const vite_1 = require("vite");
function default_1() {
    const VID = '@vuex-modules';
    const MODULES_DIR = path_1.resolve(utils_1.root, 'src/store/modules');
    return {
        name: 'vuex-modules-autoload-plugin',
        resolveId: (id) => id === VID ? VID : undefined,
        load(id) {
            if (id === VID) {
                if (!utils_1.isDir(MODULES_DIR)) {
                    return 'export default {}';
                }
                const dir = fs_extra_1.readdirSync(MODULES_DIR);
                const imports = dir.map((moduleName) => `import ${utils_1.replaceExt(moduleName)} from '${vite_1.normalizePath(path_1.resolve(MODULES_DIR, moduleName))}'`).join('\n');
                const exports = `export default { ${dir.map(utils_1.replaceExt).join(',')} }`;
                return `\
${imports}
${exports}
        `;
            }
        }
    };
}
exports.default = default_1;
