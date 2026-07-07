const { chromium } = require("playwright")
const { join } = require("node:path")

const projectRoot = join(__dirname, "..")
const base = "http://localhost:3000"
const outDir = join(projectRoot, "audit-screenshots/after")

const shots = [
  {
    name: "front-desk-upsell-loaded.png",
    url: "/ventas/front-desk-upsell",
    waitFor: '[data-testid^="reservation-row-"]',
    fullPage: true,
  },
  {
    name: "gestion-solicitudes-loaded.png",
    url: "/ventas/gestion-solicitudes",
    waitFor: "table tbody tr td",
    fullPage: true,
  },
  {
    name: "sales-analytics-camelcase.png",
    url: "/ventas/sales-analytics",
    waitFor: "text=Total Revenue",
    fullPage: true,
  },
  {
    name: "usuarios-comisiones-layout.png",
    url: "/ventas/usuarios-comisiones",
    waitFor: "text=María García",
    fullPage: true,
  },
  {
    name: "hydration-error-sidebar.png",
    url: "/ventas/front-desk-upsell",
    waitFor: '[data-testid^="reservation-row-"]',
    fullPage: false,
  },
]

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const shot of shots) {
    await page.goto(`${base}${shot.url}`, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(shot.waitFor, { timeout: 20000 })
    await page.waitForTimeout(500)
    await page.screenshot({
      path: join(outDir, shot.name),
      fullPage: shot.fullPage,
    })
    console.log("Captured", shot.name)
  }

  // Reservation agent — wait for data, then open recommend flow
  await page.goto(`${base}/ventas/front-desk-upsell`, { waitUntil: "domcontentloaded" })
  await page.waitForSelector('[data-testid^="reservation-row-"]', { timeout: 20000 })
  const recommend = page.getByRole("button", { name: "Recommend" }).first()
  await recommend.waitFor({ state: "visible", timeout: 10000 })
  await recommend.click()
  await page.waitForSelector("text=Recommended Services", { timeout: 10000 })
  await page.waitForTimeout(800)
  await page.screenshot({
    path: join(outDir, "reservation-agent-mismatch.png"),
    fullPage: false,
  })
  console.log("Captured reservation-agent-mismatch.png")

  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
