# IDiotONTIME

A IDiot bot made on electron to clock you in and out on IDONTIME.

This project was based on the [IDONTIME bot](https://github.com/HelgeG/idontime-bot) and it has the same goal and functionalities (until the moment).

It does not replace the bot. Instead aims to enable anyone that has fear of its terminal, to automate its timesheets filling.

## How does it work?

### Setting up:
- Download the application for your operating system from the [releases](https://github.com/fofinho666/idiotontime/releases) page.

- Run IDiotONTIME for the first time (warnings should pop up, but it's fine trust me 😉 ), it should show you IDONTIME login page.

  It will fail, but it will also create the files (on your **home folder**) that you needed to modify. 
  
  See the following links to figure out your home folder: 
  - [windows](https://www.computerhope.com/issues/ch000109.htm#where)
  - [macOs](https://www.cnet.com/how-to/how-to-find-your-macs-home-folder-and-add-it-to-finder/)

- Add your IDONTIME credentials in the "**home folder**/IDiotONTIME-configs/settings.yml" file.

- Run IDiotONTIME again and you'll be clocked in for today!

- Run IDiot whenever you feel like clock-in.

### - settings.yml file explained
This file is where you'll control your bot. It is something like this:
```yaml
---
user: <your user email goes here>
password: <your password goes here>
country: pt
time_in: 08:30
time_out: 17:30
# start_date: 01-02-2021
# end_date: 28-02-2021
```
`user` - Your email to access IDONTIME.

`password` - Your password to access IDONTIME.

`country` - The country where you work, this is important to figure out your **bank holidays**.

`time_in` - The hour that you start working.

`time_out` - The hour that you leave work.

The following field will allow you to clock-in for multiple dates.

**It is important to disable (add `# ` on the begining of the line) or update these fields if you expect a diferent behaviour!**

`start_date` - The date from the past that you want to start clocking in. Until today or to the `end_date`, if defined.

`end_date` - The date in the future that you want to stop clocking in.

### - holidays.txt file explained
This file is where you'll set your personal holidays, in order to not clock-in on those days. It is something like this:
```txt
01-03-2021
02-03-2021
03-03-2021
04-03-2021
05-03-2021
```
Each line should represent a holiday. If the line does not have the "dd-mm-yyyy" format the date will be ignored.

It would be nice if you could clean this file from time to time 🙃
