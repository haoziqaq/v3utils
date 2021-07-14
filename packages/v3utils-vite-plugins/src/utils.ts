// @ts-ignore
import { lstatSync, pathExistsSync } from 'fs-extra'
import { ModuleNode, ViteDevServer } from 'vite'

export const isDir = (path: string) => pathExistsSync(path) && lstatSync(path).isDirectory()

export const replaceExt = (path: string) => path.slice(0, path.lastIndexOf('.'))

export const root = process.cwd()

export const reloadFile = (server: ViteDevServer, file: string) => {
  const mods = server.moduleGraph.getModulesByFile(file) ?? []
  const seen = new Set<ModuleNode>()
  mods.forEach((mod: ModuleNode) => server.moduleGraph.invalidateModule(mod, seen))
  server.ws.send({
    type: 'full-reload',
    path: '*'
  })
}
