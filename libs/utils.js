'use strict'

const os = require('os')
const chalk = require('chalk')
const crypto = require('crypto-js')
const fs = require('fs-extra')

const appUserPath = os.homedir() + '/' + '.blynkcli'
const configPath = appUserPath + '/blynkcli.json'
const serverFolder = appUserPath + '/server'
const PIDFile = appUserPath + '/blynk.pid'

const config = fs.readJsonSync(configPath)

let utils = {
  appUserPath,
  configPath,
  serverFolder,
  PIDFile,

  config,

  error: (message) => {
    console.error(chalk.red.bold('[ERR] '), message)
    process.exit(1)
  },
  info: (message) => {
    console.info(chalk.bold('[INFO] ') + message)
  },
  success: (message) => {
    console.log(chalk.green.bold('[OK] ') + message)
  },
  warning: (message) => {
    console.warn(chalk.yellow.bold('[WARN] ') + message)
  },

  ensureBlynkCLIDir: () => {
    fs.ensureDirSync(appUserPath)

    if (!fs.existsSync(configPath)) {
      let version = '0.24.6'
      let filename = 'server-' + version + '.jar'
      let config = {
        'server': {
          'filename': filename,
          'version': 'v' + version,
          'folder': serverFolder,
          'path': serverFolder + '/' + filename,
          'data': serverFolder + '/data',
          'properties': serverFolder + '/server.properties',
          'logs': serverFolder + '/logs',
          'backup': appUserPath + '/backup'
        }
      }

      fs.outputJsonSync(configPath, config, {
        spaces: 2
      })
    }
  },

  hashPassword: (email, password) => {
    var algo = crypto.algo.SHA256.create()
    algo.update(password, 'utf-8')
    algo.update(crypto.SHA256(email.toLowerCase()), 'utf-8')
    var hash = algo.finalize()

    return hash.toString(crypto.enc.Base64)
  }
}

utils.ensureBlynkCLIDir()

module.exports = utils