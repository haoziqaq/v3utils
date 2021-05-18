import { lstatSync, pathExistsSync } from 'fs-extra'

export const isDir = (path) => pathExistsSync(path) && lstatSync(path).isDirectory()

export const replaceExt = (path) => path.slice(0, path.lastIndexOf('.'))

export const root = process.cwd()
