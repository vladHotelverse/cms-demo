#!/usr/bin/env node
/**
 * Builds side-by-side before/after comparison page with embedded images
 * so it works when opened via file:// (no local path restrictions).
 */
import { readFile, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(fileURLToPath(new URL("..", import.meta.url)))
const beforeDir = join(root, "audit-screenshots")
const afterDir = join(beforeDir, "after")
const compareDir = join(beforeDir, "comparisons")

const pairs = [
  { file: "front-desk-upsell-loaded.png", title: "Front Desk Upsell" },
  { file: "sales-analytics-camelcase.png", title: "Sales Analytics" },
  { file: "reservation-agent-mismatch.png", title: "Reservation Agent" },
  { file: "gestion-solicitudes-loaded.png", title: "Request Management" },
  { file: "usuarios-comisiones-layout.png", title: "Users & Commissions" },
  { file: "hydration-error-sidebar.png", title: "Sidebar (no hydration error)" },
]

async function toDataUri(path) {
  const buf = await readFile(path)
  return `data:image/png;base64,${buf.toString("base64")}`
}

async function build() {
  await mkdir(compareDir, { recursive: true })

  const sections = []
  for (const { file, title } of pairs) {
    const beforePath = join(beforeDir, file)
    const afterPath = join(afterDir, file)
    try {
      const [beforeSrc, afterSrc] = await Promise.all([
        toDataUri(beforePath),
        toDataUri(afterPath),
      ])
      sections.push({ title, beforeSrc, afterSrc })
      console.log("Embedded", title)
    } catch (err) {
      console.warn("Skipping", file, err.message)
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>UI Audit — Before / After</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #0f1115; color: #e8eaed; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; }
    p.lead { color: #9aa0a6; margin: 0 0 32px; }
    section { margin-bottom: 48px; }
    h2 { font-size: 1rem; margin: 0 0 12px; color: #bdc1c6; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .panel { background: #1a1d23; border: 1px solid #2d3139; border-radius: 12px; overflow: hidden; }
    .label { padding: 8px 12px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .label.before { background: #3c1f1f; color: #f28b82; }
    .label.after { background: #1e3a2f; color: #81c995; }
    img { width: 100%; display: block; border-top: 1px solid #2d3139; cursor: zoom-in; }
    img.expanded { position: fixed; inset: 24px; width: auto; height: auto; max-width: calc(100vw - 48px); max-height: calc(100vh - 48px); margin: auto; z-index: 100; border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,.6); cursor: zoom-out; }
    .backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 99; }
    .backdrop.show { display: block; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <h1>UI Audit — Before / After</h1>
  <p class="lead">Side-by-side comparison of audit findings and applied fixes. Click any image to zoom.</p>
  <div class="backdrop" id="backdrop"></div>
  ${sections
    .map(
      ({ title, beforeSrc, afterSrc }) => `
  <section>
    <h2>${title}</h2>
    <div class="grid">
      <div class="panel">
        <div class="label before">Before</div>
        <img src="${beforeSrc}" alt="Before: ${title}" loading="lazy" />
      </div>
      <div class="panel">
        <div class="label after">After</div>
        <img src="${afterSrc}" alt="After: ${title}" loading="lazy" />
      </div>
    </div>
  </section>`,
    )
    .join("")}
  <script>
    const backdrop = document.getElementById('backdrop');
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        const zoomed = img.classList.toggle('expanded');
        backdrop.classList.toggle('show', zoomed);
      });
    });
    backdrop.addEventListener('click', () => {
      document.querySelectorAll('img.expanded').forEach(i => i.classList.remove('expanded'));
      backdrop.classList.remove('show');
    });
  </script>
</body>
</html>`

  const outPath = join(compareDir, "index.html")
  await writeFile(outPath, html)
  const sizeMb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1)
  console.log(`Wrote ${outPath} (${sections.length} pairs, ${sizeMb} MB)`)
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
