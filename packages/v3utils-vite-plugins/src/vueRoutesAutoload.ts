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

export default function(): Plugin {
  const VID = '@vue-routes'
  const VIEWS_DIR = resolve(root, 'src/views')

  return {
    name: 'vue-routes-autoload-plugin',
    resolveId: (id: string) => id === VID ? VID : undefined,
    load(id: string) {
      if (id === VID) {
        if (!isDir(VIEWS_DIR)) {
          return 'export default {}'
        }

        const imports: string[] = []
        const routes = createRoutes(VIEWS_DIR, imports, true)

        return `
          ${imports.join('\n')}
          export default ${routes}
        `
      }
    }
  }
}
