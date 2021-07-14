// @ts-ignore
import hash from 'hash-sum'
// @ts-ignore
import { pathExistsSync, readdirSync, writeFileSync } from 'fs-extra'
import { root, isDir, reloadFile } from './utils'
import { resolve, dirname } from 'path'
// @ts-ignore
import { ModuleNode, normalizePath, Plugin, ResolvedConfig, ViteDevServer } from 'vite'

const isRouteDir = (path: string) => isDir(path) && readdirSync(path).includes('index.vue')

const createRoutes = (dirPath: string, imports?: string[], root = false) => {
  let routes: string[] = []

  const dir = readdirSync(dirPath)

  dir.forEach((path: string) => {
    const fullPath = resolve(dirPath, path)
    if (isRouteDir(fullPath)) {
      let route = `{
        path: '${root ? '/' : '' }${path}',
        component: () => import('${normalizePath(resolve(fullPath, 'index.vue'))}'),
        children: ${createRoutes(fullPath)}
      `

      const META_JS = resolve(fullPath, 'meta.js')
      if (pathExistsSync(META_JS)) {
        const metaName = `meta${hash(META_JS)}`
        imports?.push(`import ${metaName} from '${normalizePath(META_JS)}'`)
        route = `${route}\n, meta: ${metaName}`
      }

      route = route + '}'
      routes.push(route)
    }
  })

  return `[${routes.toString()}]`
}

interface VueRoutesAutoLoadOptions {
  router: string
  views: string
}



export default function({ views, router }: VueRoutesAutoLoadOptions = {
  views: normalizePath(resolve(root, 'src/views')),
  router: normalizePath(resolve(root, 'src/router/index.js'))
}): Plugin {
  let server: ViteDevServer

  return {
    name: 'vue-routes-autoload-plugin',
    configureServer(_server) {
      const declarationFile = resolve(dirname(router), 'autoRouter.d.ts')

      if (!pathExistsSync(declarationFile)) {
        writeFileSync(declarationFile, 'declare const __VITE_PLUGIN_AUTO_ROUTES__: Array<any>')
      }

      server = _server
      server.watcher.on('add', (file) => {
        if (normalizePath(file).startsWith(views)) {
          reloadFile(server, router)
        }
      })

      server.watcher.on('unlink', (file) => {
        if (normalizePath(file).startsWith(views)) {
          reloadFile(server, router)
        }
      })
    },
    transform(code: string, id: string) {
      if (id === router) {
        if (!isDir(views)) {
          return code
        }

        const imports: string[] = []
        const routes = createRoutes(views, imports, true);
        code = `${imports.join('\n')}\n${code}`
        code = code.replace('__VITE_PLUGIN_AUTO_ROUTES__', `${routes}`)

        return code
      }

      return code
    }
  }
}
