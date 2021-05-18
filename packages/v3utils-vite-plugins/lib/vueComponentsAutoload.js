import { resolve } from 'path'
import { isDir, replaceExt, root } from './utils'
import { pathExistsSync, readdirSync } from 'fs-extra'
import { normalizePath } from 'vite'

const isSFC = (path) => pathExistsSync(path) && path.endsWith('.vue')

const searchComponents = (dirPath, imports, componentNames) => {
  const dir = readdirSync(dirPath)

  dir.forEach((path) => {
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
    resolveId: (id) => id === VID ? VID : undefined,
    load(id) {
      if (id === VID) {
        if (!isDir(COMPONENTS_DIR)) {
          return 'export default function(app) {}'
        }

        const imports = []
        const componentNames= []
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