const { writeFileSync, copyFileSync } = require('fs')
const { resolve } = require('path')
const packageJson = require('../package.json')
const toMjs = require('./toMJS')

main()

async function main() {
  const projectRoot = resolve(__dirname, '..')
  const srcPath = resolve(projectRoot, 'src')
  const distPath = resolve(projectRoot, 'dist')
  const typesPath = resolve(distPath, 'types')
  const distPackageJson = createDistPackageJson(packageJson)

  try {
    copyFileSync(
      resolve(projectRoot, 'README.md'),
      resolve(distPath, 'README.md')
    )
    copyFileSync(
      resolve(projectRoot, 'README.en.md'),
      resolve(distPath, 'README.en.md')
    )
    copyFileSync(resolve(projectRoot, 'LICENSE'), resolve(distPath, 'LICENSE'))
    copyFileSync(
      resolve(projectRoot, '.npmignore'),
      resolve(distPath, '.npmignore')
    )
    writeFileSync(resolve(distPath, 'package.json'), distPackageJson)
    await toMjs({ inputDir: 'dist/esm2015', outputDir: `dist/jsnext` })
    copyFileSync(
      resolve(projectRoot, 'CHANGELOG.md'),
      resolve(distPath, 'CHANGELOG.md')
    )
    copyFileSync(
      resolve(srcPath, 'types.d.ts'),
      resolve(typesPath, 'types.d.ts')
    )
  } catch (error) {
    console.error(error.message)
  }
}

/**
 * @param {typeof packageJson} packageConfig
 * @return {string}
 */
function createDistPackageJson(packageConfig) {
  const {
    devDependencies,
    scripts,
    engines,
    config,
    husky,
    'lint-staged': lintStaged,
    ...distPackageJson
  } = packageConfig

  return JSON.stringify(distPackageJson, null, 2)
}
