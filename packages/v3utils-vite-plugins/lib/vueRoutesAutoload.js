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
function reloadRouter(server, routerFile) {
    var _a;
    const mods = (_a = server.moduleGraph.getModulesByFile(routerFile)) !== null && _a !== void 0 ? _a : [];
    const seen = new Set();
    mods.forEach((mod) => server.moduleGraph.invalidateModule(mod, seen));
    server.ws.send({
        type: 'full-reload',
        path: '*'
    });
}
function default_1({ views, routerFile } = {
    views: vite_1.normalizePath(path_1.resolve(utils_1.root, 'src/views')),
    routerFile: vite_1.normalizePath(path_1.resolve(utils_1.root, 'src/router/index.js'))
}) {
    let server;
    return {
        name: 'vue-routes-autoload-plugin',
        configureServer(_server) {
            const declarationFile = path_1.resolve(path_1.dirname(routerFile), 'autoRouter.d.ts');
            if (!fs_extra_1.pathExistsSync(declarationFile)) {
                fs_extra_1.writeFileSync(declarationFile, 'declare const __VITE_PLUGIN_AUTO_ROUTES__: Array<any>');
            }
            server = _server;
            server.watcher.on('add', (file) => {
                if (vite_1.normalizePath(file).startsWith(views)) {
                    reloadRouter(server, routerFile);
                }
            });
            server.watcher.on('unlink', (file) => {
                if (vite_1.normalizePath(file).startsWith(views)) {
                    reloadRouter(server, routerFile);
                }
            });
        },
        transform(code, id) {
            if (id === routerFile) {
                if (!utils_1.isDir(views)) {
                    return code;
                }
                const imports = [];
                const routes = createRoutes(views, imports, true);
                code = `${imports.join('\n')}\n${code}`;
                code = code.replace('__VITE_PLUGIN_AUTO_ROUTES__', `${routes}`);
                return code;
            }
            return code;
        }
    };
}
exports.default = default_1;
