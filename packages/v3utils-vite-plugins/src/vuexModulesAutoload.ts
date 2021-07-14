// @ts-ignore
import { readdirSync, pathExistsSync, writeFileSync } from 'fs-extra'
import { root, isDir, replaceExt, reloadFile } from './utils'
import { dirname, resolve } from 'path'
// @ts-ignore
import { normalizePath, ViteDevServer } from 'vite'

interface VuexModulesAutoLoadOptions {
  store: string
  modules: string
}

export default function({ modules, store }: VuexModulesAutoLoadOptions = {
  modules: normalizePath(resolve(root, 'src/store/modules')),
  store: normalizePath(resolve(root, 'src/store/index.js'))
}) {
  let server: ViteDevServer

  return {
    name: 'vuex-modules-autoload-plugin',
    configureServer(_server: ViteDevServer) {
      const declarationFile = resolve(dirname(store), 'autoModules.d.ts')

      if (!pathExistsSync(declarationFile)) {
        writeFileSync(declarationFile, 'declare const __VITE_PLUGIN_AUTO_MODULES__: any')
      }

      server = _server
      server.watcher.on('add', (file) => {
        if (normalizePath(file).startsWith(modules)) {
          reloadFile(server, store)
        }
      })

      server.watcher.on('unlink', (file) => {
        if (normalizePath(file).startsWith(modules)) {
          reloadFile(server, store)
        }
      })
    },
    transform(code: string, id: string) {
      if (id === store) {
        if (!isDir(modules)) {
          return code
        }

        const dir = readdirSync(modules)
        const imports = dir.map((moduleName: string) =>
          `import ${replaceExt(moduleName)} from '${normalizePath(resolve(modules, moduleName))}'`
        ).join('\n')
        const moduleNames = dir.map((moduleName: string) => replaceExt(moduleName)).toString()
        code = `${imports}\n${code}`
        code = code.replace('__VITE_PLUGIN_AUTO_MODULES__', `{ ${moduleNames} }`)

        return code
      }
    }
  }
}
