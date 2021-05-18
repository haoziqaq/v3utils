"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const utils_1 = require("./utils");
// @ts-ignore
const fs_extra_1 = require("fs-extra");
// @ts-ignore
const vite_1 = require("vite");
const isSFC = (path) => fs_extra_1.pathExistsSync(path) && path.endsWith('.vue');
const searchComponents = (dirPath, imports, componentNames) => {
    const dir = fs_extra_1.readdirSync(dirPath);
    dir.forEach((path) => {
        const fullPath = path_1.resolve(dirPath, path);
        if (isSFC(fullPath)) {
            const componentName = utils_1.replaceExt(path);
            imports.push(`import ${componentName} from '${vite_1.normalizePath(fullPath)}'`);
            componentNames.push(componentName);
        }
        if (utils_1.isDir(fullPath)) {
            searchComponents(fullPath, imports, componentNames);
        }
    });
};
function default_1() {
    const VID = '@vue-components';
    const COMPONENTS_DIR = path_1.resolve(utils_1.root, 'src/components');
    return {
        name: 'vue-components-autoload-plugin',
        resolveId: (id) => id === VID ? VID : undefined,
        load(id) {
            if (id === VID) {
                if (!utils_1.isDir(COMPONENTS_DIR)) {
                    return 'export default function(app) {}';
                }
                const imports = [];
                const componentNames = [];
                searchComponents(COMPONENTS_DIR, imports, componentNames);
                return `
          ${imports.join('\n')}
          export default function(app) {
            ${componentNames.map(componentName => `app.component('${componentName}', ${componentName})`)}
          }
        `;
            }
        }
    };
}
exports.default = default_1;
