const { readSettingsFile } = require("./idiotontime-configs")
const { BrowserWindow, app, dialog, Menu } = require("electron")
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const yaml = require("js-yaml")
const idontimeAttrs = require("./idontime-attributes")
const { parse, format, eachDayOfInterval, isWeekend, isValid } = require("date-fns")
const Holidays = require("date-holidays")
const UserHolidays = require("./user-holidays")
const { goTo, findByIdAndFillIn, click, waitForNetwork, createEntry } = require("./utils")

const loadUserSettings = () => {
  const fileContent = readSettingsFile()
  return yaml.load(fileContent)
}

const getDatesToClockIn = (userSettings) => {
  const todayDate = new Date()
  const defaltStartDateString = format(todayDate, "dd-MM-yyyy")
  const startDate = parse(userSettings.start_date || defaltStartDateString, "dd-MM-yyyy", todayDate)
  const defaltEndDateString = format(startDate, "dd-MM-yyyy")
  const endDate = parse(userSettings.end_date || defaltEndDateString, "dd-MM-yyyy", todayDate)
  const holidays = new Holidays(userSettings.contry)
  const userHolidays = new UserHolidays()

  return eachDayOfInterval({ start: startDate, end: endDate })
    .filter(date => !isWeekend(date))
    .filter(date => !holidays.isHoliday(date))
    .filter(date => !userHolidays.isHoliday(date))
}

const getPage = async (app) => {
  await pie.initialize(app)
  const browser = await pie.connect(app, puppeteer)
  const window = new BrowserWindow()

  return pie.getPage(browser, window)
}

const finalDialog = async (userSettings, datesToClockIn) => {
  const message = () => {
    if (isValid(datesToClockIn[0])) {
      const startDate = format(datesToClockIn[0], "dd-MM-yyyy")
      const endDate = format(datesToClockIn.pop(), "dd-MM-yyyy")
      return `You are clocked in and out from ${startDate} ${userSettings.time_in} to ${endDate} ${userSettings.time_out}`
    }
    return "No need to clock in, maybe it's the weekend or a holiday"
  }

  const options = {
    buttons: ["Thanks"],
    title: "We are done",
    message: message()
  }
  return dialog.showMessageBox(options)
}

const main = async () => {
  try {
    const attrs = idontimeAttrs
    const userSettings = loadUserSettings()
    const datesToClockIn = getDatesToClockIn(userSettings)

    const page = await getPage(app)
    await goTo(page, attrs.homeUrl)
    await findByIdAndFillIn(page, attrs.userInput, userSettings.user)
    await findByIdAndFillIn(page, attrs.passwordInput, userSettings.password)
    await click(page, attrs.loginButton)
    await waitForNetwork(page)
    await datesToClockIn.reduce(
      async (tasks, date) => {
        const formatedDate = format(date, "dd-MM-yyyy")

        return tasks
          .then(() => createEntry(page, attrs, attrs.entryIn, `${formatedDate} ${userSettings.time_in}`))
          .then(() => createEntry(page, attrs, attrs.entryOut, `${formatedDate} ${userSettings.time_out}`))
      }
      ,
      Promise.resolve(null)
    )

    await finalDialog(userSettings, datesToClockIn).then( () => app.exit(0))
  } catch (err) {
    dialog.showErrorBox("Oops! Something went wrong!", err.message)
    app.exit(1)
  }
}

Menu.setApplicationMenu(null)
main()