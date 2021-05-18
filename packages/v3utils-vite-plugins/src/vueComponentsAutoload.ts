import { resolve } from 'path'
import { isDir, replaceExt, root } from './utils'
// @ts-ignore
import { pathExistsSync, readdirSync } from 'fs-extra'
// @ts-ignore
import { normalizePath } from 'vite'

const isSFC = (path: string) => pathExistsSync(path) && path.endsWith('.vue')

const searchComponents = (dirPath: string, imports: string[], componentNames: string[]) => {
  const dir = readdirSync(dirPath)

  dir.forEach((path: string) => {
    const fullPath = resolve(dirPath, path)

    if (isSFC(fullPath)) {
      const componentName = replaceExt(path)
      imports.push(`import ${componentName} from '${normalizePath(fullPath)}'`)
      componentNames.push(componentName)
    }

    if (isDir(fullPath)) {
      searchComponents(fullPath, imports, componentNames)
    }
  })
}

export default function() {
  const VID = '@vue-components'
  const COMPONENTS_DIR = resolve(root, 'src/components')

  return {
    name: 'vue-components-autoload-plugin',
    resolveId: (id: string) => id === VID ? VID : undefined,
    load(id: string) {
      if (id === VID) {
        if (!isDir(COMPONENTS_DIR)) {
          return 'export default function(app) {}'
        }

        const imports: string[] = []
        const componentNames: string[] = []
        searchComponents(COMPONENTS_DIR, imports, componentNames)

        return `
          ${imports.join('\n')}
          export default function(app) {
            ${componentNames.map(componentName => `app.component('${componentName}', ${componentName})`)}
          }
        `
      }
    }
  }
}
