const { existsSync } = require('fs')
const { join } = require('path')
const { spawnSync } = require('child_process')

const packages = [
  '@hyperledger/anoncreds-react-native',
  '@openwallet-foundation/askar-react-native',
  '@hyperledger/indy-vdr-react-native',
]

for (const packageName of packages) {
  const installScript = join(__dirname, '..', 'node_modules', packageName, 'scripts', 'install.js')

  if (!existsSync(installScript)) {
    console.warn(`[native-binaries] Skipping ${packageName}; install script not found`)
    continue
  }

  console.log(`[native-binaries] Ensuring ${packageName}`)
  const result = spawnSync(process.execPath, [installScript], {
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}
