// @ts-ignore
import { lstatSync, pathExistsSync } from 'fs-extra'

export const isDir = (path: string) => pathExistsSync(path) && lstatSync(path).isDirectory()

export const replaceExt = (path: string) => path.slice(0, path.lastIndexOf('.'))

export const root = process.cwd()
