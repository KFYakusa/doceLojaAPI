const tsConfigPaths = require('tsconfig-paths')

const tsConfig = require('./tsconfig.json')

let { baseUrl, paths } = tsConfig.compilerOptions

for (const path in paths) {
  console.log(path);
  paths[path][0] = paths[path][0].replace('src', 'build/src').replace('.ts', '.js')
}

tsConfigPaths.register({ baseUrl, paths })
