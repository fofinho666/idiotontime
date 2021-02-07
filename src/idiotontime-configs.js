require('hazardous')
const { app } = require("electron")
const isDev = require('electron-is-dev')
const fs = require('fs')
const path = require('path')

const holidaysFile = "holidays.txt"
const defaultHolidays = 'Please add your holidays here. A day per line with the following format: "day-month-year", eg.: 28-02-1904'

const settingsFile = "settings.yml"
const defaultSettings = `---
user: '<your user email goes here>'
password: '<your password goes here>'
contry: pt
time_in: '08:30'
time_out: '17:30'
# start_date: '01-02-2021'
# end_date: '28-02-2021'
`

const configFoler = "idiotontime-configs"
const configsDir = isDev ? path.join(__dirname, `../${configFoler}`) : path.join(app.getPath('home'), configFoler)

const createDefaultFile = (path, defaultContent) => {
  fs.writeFileSync(path, defaultContent)
  return defaultContent
}

const readHolidaysFile = () => {
  const holidaysPath = `${configsDir}/${holidaysFile}`

  if (!fs.existsSync(holidaysPath)) {
    if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir)
    return createDefaultFile(holidaysPath, defaultHolidays)
  }

  return fs.readFileSync(holidaysPath, "utf-8")
}

const readSettingsFile = () => {
  const settingsPath = `${configsDir}/${settingsFile}`

  if (!fs.existsSync(settingsPath)) {
    if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir)
    return createDefaultFile(settingsPath, defaultSettings)
  }

  return fs.readFileSync(settingsPath, "utf-8")
}

module.exports = { readHolidaysFile, readSettingsFile }