;(async () => {
  const execa = require('execa')
  const ora = require('ora')
  const { resolve } = require('path')
  const CWD = process.cwd()
  const PKG_AXIOS = resolve(CWD, './packages/v3utils-axios')

  const buildAxios = execa('yarn', ['build'], {
    cwd: PKG_AXIOS,
  })

  let spinner = ora('Start build @v3utils/axios').start()
  await buildAxios
  spinner.succeed('@v3utils/axios build success')
})()
