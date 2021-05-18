import { readdirSync } from 'fs-extra'
import { root, isDir, replaceExt } from './utils'
import { resolve } from 'path'
import { normalizePath } from 'vite'

export default function() {
  const VID = '@vuex-modules'
  const MODULES_DIR = resolve(root, 'src/store/modules')

  return {
    name: 'vuex-modules-autoload-plugin',
    resolveId: (id) => id === VID ? VID : undefined,
    load(id) {
      if (id === VID) {
        if (!isDir(MODULES_DIR)) {
          return 'export default {}'
        }

        const dir = readdirSync(MODULES_DIR)
        const imports = dir.map(moduleName =>
          `import ${replaceExt(moduleName)} from '${normalizePath(resolve(MODULES_DIR, moduleName))}'`
        ).join('\n')
        const exports = `export default { ${dir.map(replaceExt).join(',')} }`
        return `\
${imports}
${exports}
        `
      }
    }
  }
}