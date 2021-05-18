// @ts-ignore
import ora from 'ora'
// @ts-ignore
import chalk from 'chalk'
// @ts-ignore
import globby from 'globby'
// @ts-ignore
import OSS from 'ali-oss'
import { resolve } from 'path'
import { root } from './utils'

const SECOND_DOMAIN = 'aliyuncs.com'
const PROTOCOL = 'https'

export default function({
  region = '',
  accessKeyId = '',
  accessKeySecret = '',
  bucket = '',
  path = './dist/',
  remotePath = '/'
} = {}) {
  return {
    name: 'ali-oss-plugin',
    async closeBundle() {
      if (!remotePath.startsWith('/') || !remotePath.endsWith('/')) {
        console.error('remotePath必须以/开头,以/结尾')
        return
      }

      path = resolve(root, path)

      const spinner = ora()
      const client = new OSS({
        region,
        accessKeyId,
        accessKeySecret,
        bucket
      })

      const domain = `${PROTOCOL}://${bucket}.${region}.${SECOND_DOMAIN}`
      const filePaths = await globby(path)

      for (const filePath of filePaths) {
        const remoteFilePath = resolve(remotePath, filePath.replace(`${path}/`, ''))

        spinner.start(chalk.green(`正在发布文件到${domain}${remoteFilePath}`))
        await client.put(remoteFilePath, filePath)
        spinner.succeed(chalk.green(`成功发布文件${domain}${remoteFilePath}`))
      }

      spinner.succeed(chalk.green('全部发布成功'))
    }
  }
}
