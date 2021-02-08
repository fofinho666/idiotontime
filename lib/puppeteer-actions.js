const goTo = async (page, url) => {
  await page.goto(url, { waitUntil: "networkidle0" })
}

const findByIdAndFillIn = async (page, id, value) => {
  const selector = `input[id=${id}]`
  await page.waitForSelector(selector, { visible: true })
  await page.click(selector, { clickCount: 3 });
  await page.type(selector, value)
};

const click = async (page, id) => {
  const selector = `#${id}`
  await page.waitForSelector(selector, { visible: true })
  await page.click(selector)
}

const waitForNetwork = async (page) => {
  await page.waitForNavigation({ waitUntil: "networkidle0" })
}

const getFrame = async (page, id) => {
  const selector = `iframe[id="${id}"]`
  await page.waitForSelector(selector, { visible: true })
  const elementHandle = await page.$(selector)
  return elementHandle.contentFrame()
}

const createEntry = async (page, attrs, entryType, entryValue) => {
  await goTo(page, attrs.movUrl)
  await click(page, attrs.addButton)

  const frame = await getFrame(page, attrs.addFrame)
  await findByIdAndFillIn(frame, attrs.dateField, entryValue)

  await click(frame, attrs.entryDropdown)
  await page.waitForTimeout(200)

  await click(frame, entryType)
  await page.waitForTimeout(200)

  await click(frame, attrs.submitEntryButton)
  await page.waitForSelector(`iframe[id="${attrs.addFrame}"]`, { hidden: true })
}


module.exports = { goTo, findByIdAndFillIn, click, waitForNetwork, createEntry }