#!/usr/bin/env node
/**
 * Design ↔ Browser comparison checklist
 *
 * Run after every cms-demo.pen regeneration:
 *   1. vp run dev  (or: ./node_modules/.bin/next dev --port 3000)
 *   2. Open http://localhost:3000 routes below beside cms-demo.pen in Pencil
 *   3. Compare each screen variant · log gaps in gap audit · fix generator · regenerate
 *
 * Usage: node scripts/design-browser-compare.mjs
 */

const ROUTES = [
  {
    route: "/ventas/front-desk-upsell",
    designScreen: "Front Desk — Blocks / Recommend (PRIMARY)",
    designSection: "🏨 Front Desk Flow (scroll to y≈5200)",
    browserActions: [
      "Click Recommend on any row",
      "Verify: Lisa Anderson tab, Superior Rooms + Customization + Enhancements columns",
    ],
  },
  {
    route: "/ventas/front-desk-upsell",
    designScreen: "Front Desk Upsell (list)",
    designSection: "🏨 Front Desk Flow",
    browserActions: ["Wait ~2s for table load", "Verify 50 rows, search, 4 view-mode buttons"],
  },
  {
    route: "/ventas/front-desk-upsell",
    designScreen: "Screen / Front Desk — Call Center Filter",
    browserActions: ["Click Call Center view button", "Verify date range dialog"],
  },
  { route: "/ventas/call-center", designScreen: "Screen / Call Center" },
  { route: "/ventas/gestion-solicitudes", designScreen: "Screen / Gestión Solicitudes" },
  { route: "/ventas/sales-analytics", designScreen: "Screen / Sales Analytics" },
  { route: "/addons", designScreen: "Screen / Addons" },
  { route: "/addons-bands", designScreen: "Screen / Addons Bands" },
  { route: "/calendar", designScreen: "Screen / Calendar" },
  { route: "/contenido/atributos", designScreen: "Screen / Atributos" },
];

const BASE = "http://localhost:3000";

console.log("Design ↔ Browser comparison checklist\n");
console.log("Open Pencil (cms-demo.pen) side-by-side with the browser.\n");
console.log("CANVAS SECTIONS (top → bottom):");
console.log("  ① Design System  ② Catalog + Gap Audit  ③ Component Library");
console.log("  ④ UI Patterns  ⑤ 🏨 Front Desk Flow ← START HERE  ⑥ Other Screens\n");

for (const item of ROUTES) {
  console.log(`─ ${item.designScreen}`);
  if (item.designSection) console.log(`  Pencil: ${item.designSection}`);
  console.log(`  Browser: ${BASE}${item.route}`);
  if (item.browserActions?.length) {
    for (const action of item.browserActions) {
      console.log(`    · ${action}`);
    }
  }
  console.log("");
}

console.log("After comparing, update scripts/generate-cms-demo-pen.mjs gap audit and run:");
console.log("  node scripts/generate-cms-demo-pen.mjs\n");
