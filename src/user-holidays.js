
const fs = require('fs')
const { parse, isValid } = require('date-fns')

class UserHolidays {
  constructor(holidaysPath) {
    this.dates = fs.readFileSync(holidaysPath, "utf-8")
      .split(/\r?\n/)
      .map((line) => parse(line, "dd-MM-yyyy", new Date()))
      .filter(isValid)
      .map((date) => date.getTime())
  }

  isHoliday(date) {
    if (!isValid(date)) return false

    const dateTime = date.getTime()
    return this.dates.includes(dateTime)
  }
}

module.exports = UserHolidays