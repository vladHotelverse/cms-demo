const { chromium } = require("playwright")
const { join } = require("node:path")

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto("http://localhost:3000/ventas/front-desk-upsell", { waitUntil: "networkidle" })
  await page.waitForTimeout(2500)
  await page.getByRole("button", { name: "Recommend" }).first().click()
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: join(__dirname, "../audit-screenshots/after/reservation-agent-mismatch.png"),
  })
  await browser.close()
  console.log("Captured reservation-agent-mismatch.png")
})()
