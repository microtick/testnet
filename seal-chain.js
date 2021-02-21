(async () => {
  
  const cp = require('child_process')
  const fs = require('fs')
  
  const HOME=process.argv[2]
  const CONFIG=process.argv[3]
  const config = JSON.parse(fs.readFileSync(CONFIG))
  
  const CHAINHOME=HOME + "/" + config.executable
  
  console.log()
  console.log("Sealing chain: " + config.chain_id)
  
  const chainexec = cmd => {
    console.log("  $ " + config.executable + " --home " + CHAINHOME + " " + cmd)
    const bufs = cp.spawnSync(config.executable, [
      "--home " + CHAINHOME,
      cmd
    ],{
      shell: true
    })
    const ret = {
      stdout: bufs.stdout.toString(),
      stderr: bufs.stderr.toString()
    }
    return ret
  }
  
  const keys = Object.keys(config.gentx)
  for (var i=0; i<keys.length; i++) {
    const name = keys[i]
    const amt = config.gentx[name]
    await chainexec("gentx " + name + " " + amt + " --keyring-backend test --chain-id " + config.chain_id)
  }
  await chainexec("collect-gentxs")
  
})().catch(e => {
  
  console.error(e)
  
})
