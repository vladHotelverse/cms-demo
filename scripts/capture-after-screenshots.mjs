import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

const base = "http://localhost:3000"
const outDir = join(process.cwd(), "audit-screenshots", "after")

const shots = [
  { name: "front-desk-upsell-loaded.png", url: "/ventas/front-desk-upsell", wait: 2000 },
  { name: "sales-analytics-camelcase.png", url: "/ventas/sales-analytics", wait: 1000 },
  { name: "gestion-solicitudes-loaded.png", url: "/ventas/gestion-solicitudes", wait: 2000 },
  { name: "usuarios-comisiones-layout.png", url: "/ventas/usuarios-comisiones", wait: 1000 },
  { name: "hydration-error-sidebar.png", url: "/ventas/front-desk-upsell", wait: 1500 },
]

async function main() {
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const shot of shots) {
    await page.goto(`${base}${shot.url}`, { waitUntil: "networkidle" })
    await page.waitForTimeout(shot.wait)
    await page.screenshot({
      path: join(outDir, shot.name),
      fullPage: shot.name.includes("loaded") || shot.name.includes("camelcase"),
    })
    console.log("Captured", shot.name)
  }

  // Reservation agent view
  await page.goto(`${base}/ventas/front-desk-upsell`, { waitUntil: "networkidle" })
  await page.waitForTimeout(2000)
  const recommend = page.getByRole("button", { name: "Recommend" }).first()
  if (await recommend.isVisible()) {
    await recommend.click()
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: join(outDir, "reservation-agent-mismatch.png"),
      fullPage: false,
    })
    console.log("Captured reservation-agent-mismatch.png")
  }

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
