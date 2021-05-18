// @ts-ignore
import client from 'scp2'
// @ts-ignore
import ora from 'ora'
// @ts-ignore
import chalk from 'chalk'
import { root } from './utils';
import { resolve } from 'path';

export default function({
  host = '',
  username = '',
  password = '',
  path = './dist/',
  remotePath = '',
  port = ''
} = {}) {
  return {
    name: 'deploy-plugin',
    closeBundle() {
      path = resolve(root, path)

      const spinner = ora()
      spinner.start(chalk.green(`正在发布应用到${host}:${port}${remotePath}`))
      client.scp(path, {
        port,
        host,
        username,
        password,
        path: remotePath
      }, (err: Error) => {
        if (err) {
          spinner.fail(chalk.red(`发布失败, 目标:${host}:${port}${remotePath}`))
        } else {
          spinner.succeed(chalk.green(`成功发布应用到${host}:${port}${remotePath}`))
        }
      })
    }
  }
}
