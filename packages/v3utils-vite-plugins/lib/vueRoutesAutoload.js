"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const hash_sum_1 = __importDefault(require("hash-sum"));
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const utils_1 = require("./utils");
const path_1 = require("path");
// @ts-ignore
const vite_1 = require("vite");
const isRouteDir = (path) => utils_1.isDir(path) && fs_extra_1.readdirSync(path).includes('index.vue');
const createRoutes = (dirPath, imports, root = false) => {
    let routes = [];
    const dir = fs_extra_1.readdirSync(dirPath);
    dir.forEach((path) => {
        const fullPath = path_1.resolve(dirPath, path);
        if (isRouteDir(fullPath)) {
            let route = `{
        path: '${root ? '/' : ''}${path}',
        component: () => import('${vite_1.normalizePath(path_1.resolve(fullPath, 'index.vue'))}'),
        children: ${createRoutes(fullPath)}
      `;
            const META_JS = path_1.resolve(fullPath, 'meta.js');
            if (fs_extra_1.pathExistsSync(META_JS)) {
                const metaName = `meta${hash_sum_1.default(META_JS)}`;
                imports === null || imports === void 0 ? void 0 : imports.push(`import ${metaName} from '${vite_1.normalizePath(META_JS)}'`);
                route = `${route}\n, meta: ${metaName}`;
            }
            route = route + '}';
            routes.push(route);
        }
    });
    return `[${routes.toString()}]`;
};
function default_1(options) {
    const views = options.views || path_1.resolve(utils_1.root, 'src/views');
    const file = options.file || path_1.resolve(utils_1.root, 'src/router/index.js');
    return {
        name: 'vue-routes-autoload-plugin',
        transform(code, id) {
            if (id === file) {
                if (!utils_1.isDir(views)) {
                    return code;
                }
                const imports = [];
                const routes = createRoutes(views, imports, true);
                code += `const autoRoutes = ${routes}\n routes.unshift(...autoRoutes)`;
                return code;
            }
            return code;
        }
    };
}
exports.default = default_1;
