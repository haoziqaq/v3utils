import hash from 'hash-sum'
import { pathExistsSync, readdirSync } from 'fs-extra'
import { root, isDir } from './utils'
import { resolve } from 'path'
import { normalizePath } from 'vite'

const isRouteDir = (path) => isDir(path) && readdirSync(path).includes('index.vue')

const createRoutes = (dirPath, imports, root = false) => {
  let routes = []

  const dir = readdirSync(dirPath)

  dir.forEach((path) => {
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
        imports.push(`import ${metaName} from '${normalizePath(META_JS)}'`)
        route = `${route}\n, meta: ${metaName}`
      }

      route = route + '}'
      routes.push(route)
    }
  })

  return `[${routes.toString()}]`
}

export default function() {
  const VID = '@vue-routes'
  const VIEWS_DIR = resolve(root, 'src/views')

  return {
    name: 'vue-routes-autoload-plugin',
    resolveId: (id) => id === VID ? VID : undefined,
    load(id) {
      if (id === VID) {
        if (!isDir(VIEWS_DIR)) {
          return 'export default {}'
        }

        const imports = []
        const routes = createRoutes(VIEWS_DIR, imports, true)

        return `
          ${imports.join('\n')}
          export default ${routes}
        `
      }
    }
  }
}