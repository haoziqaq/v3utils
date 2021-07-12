// @ts-ignore
import hash from 'hash-sum'
// @ts-ignore
import { pathExistsSync, readdirSync } from 'fs-extra'
import { root, isDir } from './utils'
import { resolve } from 'path'
// @ts-ignore
import { normalizePath, Plugin, ResolvedConfig, ViteDevServer } from 'vite'

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
  file: string
  views: string
}

export default function(options: VueRoutesAutoLoadOptions): Plugin {
  const views = options.views || resolve(root, 'src/views')
  const file = options.file || resolve(root, 'src/router/index.js')

  return {
    name: 'vue-routes-autoload-plugin',
    transform(code: string, id: string) {
      if (id === file) {
        if (!isDir(views)) {
          return code
        }

        const imports: string[] = []
        const routes = createRoutes(views, imports, true)

        code += `const autoRoutes = ${routes}\n routes.unshift(...autoRoutes)`
        return code
      }

      return code
    }
  }
}
