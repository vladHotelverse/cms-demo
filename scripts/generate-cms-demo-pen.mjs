#!/usr/bin/env node
/**
 * Generates cms-demo.pen design file from Hotelverse CMS UI structure.
 * Uses shadcn-style tokens matching app/globals.css
 */

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "cms-demo.pen");

let _id = 0;
const uid = (label = "n") => `hv-${label}-${(++_id).toString(36)}`;

const FILE_TOKEN = "163f1aff-e286-45e6-a59a-7f3adb27af75";

const tokens = {
  "--background": {
    type: "color",
    value: [
      { value: "#ffffff", theme: { mode: "light" } },
      { value: "#0a0a0a", theme: { mode: "dark" } },
    ],
  },
  "--foreground": {
    type: "color",
    value: [
      { value: "#0a0a0a", theme: { mode: "light" } },
      { value: "#fafafa", theme: { mode: "dark" } },
    ],
  },
  "--card": {
    type: "color",
    value: [
      { value: "#ffffff", theme: { mode: "light" } },
      { value: "#0a0a0a", theme: { mode: "dark" } },
    ],
  },
  "--card-foreground": {
    type: "color",
    value: [
      { value: "#0a0a0a", theme: { mode: "light" } },
      { value: "#fafafa", theme: { mode: "dark" } },
    ],
  },
  "--primary": {
    type: "color",
    value: [
      { value: "#171717", theme: { mode: "light" } },
      { value: "#fafafa", theme: { mode: "dark" } },
    ],
  },
  "--primary-foreground": {
    type: "color",
    value: [
      { value: "#fafafa", theme: { mode: "light" } },
      { value: "#171717", theme: { mode: "dark" } },
    ],
  },
  "--secondary": {
    type: "color",
    value: [
      { value: "#f5f5f5", theme: { mode: "light" } },
      { value: "#262626", theme: { mode: "dark" } },
    ],
  },
  "--muted": {
    type: "color",
    value: [
      { value: "#f5f5f5", theme: { mode: "light" } },
      { value: "#262626", theme: { mode: "dark" } },
    ],
  },
  "--muted-foreground": {
    type: "color",
    value: [
      { value: "#737373", theme: { mode: "light" } },
      { value: "#a3a3a3", theme: { mode: "dark" } },
    ],
  },
  "--accent": {
    type: "color",
    value: [
      { value: "#f5f5f5", theme: { mode: "light" } },
      { value: "#262626", theme: { mode: "dark" } },
    ],
  },
  "--accent-foreground": {
    type: "color",
    value: [
      { value: "#171717", theme: { mode: "light" } },
      { value: "#fafafa", theme: { mode: "dark" } },
    ],
  },
  "--destructive": {
    type: "color",
    value: [
      { value: "#ef4444", theme: { mode: "light" } },
      { value: "#7f1d1d", theme: { mode: "dark" } },
    ],
  },
  "--border": {
    type: "color",
    value: [
      { value: "#e5e5e5", theme: { mode: "light" } },
      { value: "#262626", theme: { mode: "dark" } },
    ],
  },
  "--sidebar": {
    type: "color",
    value: [
      { value: "#fafafa", theme: { mode: "light" } },
      { value: "#171717", theme: { mode: "dark" } },
    ],
  },
  "--sidebar-foreground": {
    type: "color",
    value: [
      { value: "#3f3f46", theme: { mode: "light" } },
      { value: "#f4f4f5", theme: { mode: "dark" } },
    ],
  },
  "--radius": { type: "number", value: 8 },
  "--radius-sm": { type: "number", value: 4 },
  "--radius-md": { type: "number", value: 6 },
  "--radius-lg": { type: "number", value: 8 },
  "--ring": {
    type: "color",
    value: [
      { value: "#0a0a0a", theme: { mode: "light" } },
      { value: "#d4d4d4", theme: { mode: "dark" } },
    ],
  },
  "--input": {
    type: "color",
    value: [
      { value: "#e5e5e5", theme: { mode: "light" } },
      { value: "#262626", theme: { mode: "dark" } },
    ],
  },
  "--popover": {
    type: "color",
    value: [
      { value: "#ffffff", theme: { mode: "light" } },
      { value: "#0a0a0a", theme: { mode: "dark" } },
    ],
  },
  "--chart-1": { type: "color", value: "#e76e50" },
  "--chart-2": { type: "color", value: "#2a9d90" },
  "--chart-3": { type: "color", value: "#274754" },
};

function text(content, opts = {}) {
  return {
    type: "text",
    id: opts.id ?? uid("text"),
    content,
    fontSize: opts.size ?? 14,
    fontWeight: opts.weight ?? "400",
    fill: opts.fill ?? "$--foreground",
    fontFamily: "Inter",
    textGrowth: opts.width ? "fixed-width" : "auto",
    ...(opts.width ? { width: opts.width } : {}),
  };
}

function icon(name, size = 16, nodeId) {
  return {
    type: "icon",
    id: nodeId ?? uid("icon"),
    library: "lucide",
    icon: name,
    width: size,
    height: size,
    fill: "$--muted-foreground",
  };
}

function frame(props, children = []) {
  const node = {
    type: "frame",
    id: props.id ?? uid("frame"),
    ...props,
  };
  if (children.length) node.children = children;
  return node;
}

/** Column widths for front-desk upsell table — never use fill_container on every column in one row */
const UPSELL_COL_WIDTHS = [96, "fill_container", 64, 110, 96, 56, 140];

function tableCol(width, child) {
  const props = { layout: "horizontal", alignItems: "center" };
  if (width === "fill_container") props.width = "fill_container";
  else props.width = width;
  return frame(props, [child]);
}

/** Clip wide organisms inside catalog tiles; refs accept width override */
function previewViewport(node, width) {
  const preview =
    node?.type === "ref"
      ? { ...node, width }
      : node;
  return frame(
    {
      layout: "vertical",
      width: "fill_container",
      clip: true,
      alignItems: "stretch",
    },
    [preview]
  );
}

function ref(componentId, props = {}) {
  return { type: "ref", id: uid("ref"), ref: componentId, ...props };
}

function note(content, props = {}) {
  return {
    type: "note",
    id: uid("note"),
    content,
    width: props.width ?? 360,
    fontSize: props.size ?? 12,
    fontFamily: "Inter",
    ...props,
  };
}

/** Top-level canvas section with border, title, and generous padding */
function sectionFrame({ name, subtitle, x, y, width, fill = "$--background", accent = false, children }) {
  return frame(
    {
      name,
      layout: "vertical",
      x,
      y,
      width,
      gap: 56,
      padding: [64, 72],
      fill,
      stroke: { type: "color", color: accent ? "#3b82f6" : "$--border" },
      strokeWidth: accent ? 2 : 1,
      cornerRadius: 24,
    },
    [
      frame(
        {
          layout: "vertical",
          gap: 12,
          width: "fill_container",
          padding: [0, 0, 40, 0],
          stroke: { type: "color", color: "$--border" },
          strokeWidth: { bottom: 1 },
        },
        [
          text(name, { size: 36, weight: "700" }),
          text(subtitle, { size: 15, fill: "$--muted-foreground" }),
        ]
      ),
      ...children,
    ]
  );
}

/** Numbered subsection inside a section */
function subsection(number, title, description, children, { fill = "$--background", border = "$--border" } = {}) {
  return frame(
    {
      name: `${number} · ${title}`,
      layout: "vertical",
      gap: 28,
      width: "fill_container",
      padding: [32, 36],
      cornerRadius: 16,
      fill,
      stroke: { type: "color", color: border },
      strokeWidth: 1,
    },
    [
      frame({ layout: "horizontal", gap: 16, alignItems: "center", width: "fill_container" }, [
        frame(
          {
            layout: "horizontal",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            cornerRadius: 10,
            fill: "$--primary",
          },
          [text(number, { size: 14, weight: "700", fill: "#ffffff" })]
        ),
        frame({ layout: "vertical", gap: 4, width: "fill_container" }, [
          text(title, { size: 20, weight: "600" }),
          ...(description ? [text(description, { size: 13, fill: "$--muted-foreground" })] : []),
        ]),
      ]),
      ...children,
    ]
  );
}

/** Labeled component cell for the library grid */
function componentTile(label, node, { width = 300 } = {}) {
  return frame(
    {
      layout: "vertical",
      gap: 12,
      width,
      padding: 20,
      cornerRadius: 12,
      fill: "$--background",
      stroke: { type: "color", color: "$--border" },
      strokeWidth: 1,
    },
    [
      frame(
        {
          layout: "vertical",
          width: "fill_container",
          minHeight: 72,
          alignItems: "stretch",
          justifyContent: "center",
          clip: true,
        },
        [node]
      ),
      frame({ layout: "vertical", gap: 2, width: "fill_container", stroke: { type: "color", color: "$--border" }, strokeWidth: { top: 1 }, padding: [12, 0, 0, 0] }, [
        text(label, { size: 12, weight: "600" }),
      ]),
    ]
  );
}

/** 2–4 column component grid */
function componentGrid(items, columns = 3) {
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(
      frame({ layout: "horizontal", gap: 20, width: "fill_container", alignItems: "start" }, items.slice(i, i + columns))
    );
  }
  return frame({ layout: "vertical", gap: 20, width: "fill_container" }, rows);
}

/** Atomic Design layer tokens */
const ATOMIC = {
  foundations: { label: "Foundations", fill: "#fafafa", border: "#e5e5e5", accent: "#525252" },
  atom: { label: "Atom", fill: "#fefce8", border: "#fde047", accent: "#ca8a04" },
  molecule: { label: "Molecule", fill: "#f0fdf4", border: "#86efac", accent: "#16a34a" },
  organism: { label: "Organism", fill: "#eff6ff", border: "#93c5fd", accent: "#2563eb" },
  template: { label: "Template", fill: "#faf5ff", border: "#d8b4fe", accent: "#9333ea" },
  page: { label: "Page", fill: "#fff1f2", border: "#fda4af", accent: "#e11d48" },
};

/** Tile with atomic layer badge — ref() registry cell */
function atomicTile(label, node, layer, { width = 300, file, previewWidth } = {}) {
  const cfg = ATOMIC[layer];
  const viewportWidth = previewWidth ?? width;
  return frame(
    {
      layout: "vertical",
      gap: 10,
      width,
      padding: 16,
      cornerRadius: 12,
      fill: cfg.fill,
      stroke: { type: "color", color: cfg.border },
      strokeWidth: 1,
    },
    [
      frame({ layout: "horizontal", gap: 8, alignItems: "center", width: "fill_container" }, [
        frame({ padding: [2, 8], cornerRadius: 4, fill: cfg.accent }, [
          text(cfg.label, { size: 9, weight: "700", fill: "#ffffff" }),
        ]),
        text(label, { size: 12, weight: "600", width: "fill_container" }),
      ]),
      frame(
        {
          layout: "vertical",
          width: "fill_container",
          minHeight: 64,
          alignItems: "stretch",
          justifyContent: "start",
          padding: [8, 0],
          clip: true,
        },
        [previewViewport(node, viewportWidth)]
      ),
      ...(file
        ? [
            text(file, {
              size: 10,
              fill: "$--muted-foreground",
              width: "fill_container",
            }),
          ]
        : []),
    ]
  );
}

/** Build a subsection grid from [label, node, opts?] tuples */
function atomicGrid(layer, items, columns = 3) {
  return componentGrid(
    items.map(([label, node, opts = {}]) => atomicTile(label, node, layer, opts)),
    columns
  );
}

/** Atomic layer section wrapper */
function atomicSection(layer, { name, subtitle, x, y, width, children }) {
  const cfg = ATOMIC[layer];
  return sectionFrame({
    name,
    subtitle,
    x,
    y,
    width,
    fill: cfg.fill,
    accent: layer === "organism" || layer === "page",
    children: [
      note(
        `ATOMIC ${cfg.label.toUpperCase()} · ${layer === "atom" ? "Indivisible UI primitives — buttons, inputs, badges" : layer === "molecule" ? "Simple combinations of atoms — form fields, table rows, tab lists" : layer === "organism" ? "Distinct interface sections — headers, tables, modals, sidebars" : layer === "template" ? "Page-level layout without real content — shell, list scaffold" : layer === "page" ? "Full screens with real content and navigation state" : "Design tokens and typography"}`,
        { width: 560 }
      ),
      ...children,
    ],
  });
}

/** Screen card: header bar + meta sidebar + preview viewport */
function screenCard({ route, screen, description, codeFile, highlighted = false, step }) {
  const routeClean = route.split(" ·")[0];
  return frame(
    {
      layout: "vertical",
      gap: 0,
      width: 1640,
      cornerRadius: 20,
      fill: highlighted ? "#ffffff" : "$--card",
      stroke: { type: "color", color: highlighted ? "#3b82f6" : "$--border" },
      strokeWidth: highlighted ? 2 : 1,
      clip: true,
    },
    [
      frame(
        {
          layout: "horizontal",
          gap: 16,
          alignItems: "center",
          width: "fill_container",
          padding: [20, 28],
          fill: highlighted ? "#dbeafe" : "$--muted",
          stroke: { type: "color", color: "$--border" },
          strokeWidth: { bottom: 1 },
        },
        [
          ...(step
            ? [
                frame(
                  { layout: "horizontal", alignItems: "center", justifyContent: "center", width: 32, height: 32, cornerRadius: 8, fill: highlighted ? "#1d4ed8" : "$--primary" },
                  [text(String(step), { size: 13, weight: "700", fill: "#ffffff" })]
                ),
              ]
            : []),
          frame({ layout: "vertical", gap: 4, width: "fill_container" }, [
            frame({ layout: "horizontal", gap: 10, alignItems: "center" }, [
              text(screen.name.replace("Screen / ", ""), { size: 20, weight: "700" }),
              ...(highlighted
                ? [frame({ padding: [3, 10], cornerRadius: 9999, fill: "#1d4ed8" }, [text("PRIMARY", { size: 9, weight: "700", fill: "#ffffff" })])]
                : []),
            ]),
            text(`http://localhost:3000${routeClean === "/" ? "" : routeClean}`, { size: 12, fill: "#2563eb" }),
          ]),
          frame({ padding: [6, 14], cornerRadius: 9999, fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }, [
            text(route, { size: 11, weight: "500" }),
          ]),
        ]
      ),
      frame({ layout: "horizontal", gap: 0, width: "fill_container", alignItems: "start" }, [
        frame(
          {
            layout: "vertical",
            gap: 16,
            width: 320,
            padding: 24,
            fill: "#f8fafc",
            stroke: { type: "color", color: "$--border" },
            strokeWidth: { right: 1 },
          },
          [
            text("Documentation", { size: 11, weight: "600", fill: "$--muted-foreground" }),
            ...(codeFile ? [note(codeFile, { width: 272 })] : []),
            ...(description ? [note(description, { width: 272 })] : []),
          ]
        ),
        frame(
          {
            layout: "vertical",
            gap: 12,
            width: "fill_container",
            padding: 28,
            fill: "#e2e8f0",
          },
          [
            text("Live preview frame", { size: 10, weight: "600", fill: "$--muted-foreground" }),
            frame(
              {
                layout: "vertical",
                width: "fill_container",
                cornerRadius: 12,
                clip: true,
                stroke: { type: "color", color: "$--border" },
                strokeWidth: 1,
                fill: "$--background",
              },
              [screen]
            ),
          ]
        ),
      ]),
    ]
  );
}

// ─── Canvas layout coordinates (single source of truth) ─────────────────────

const CANVAS = {
  index: 0,
  foundations: 480,
  catalog: 2400,
  gapAudit: 3600,
  atoms: 4800,
  molecules: 6800,
  organisms: 9200,
  templates: 12800,
  pagesFrontDesk: 15600,
  pagesOther: 19800,
};

function catalogRow(component, file, status, notes = "") {
  return frame(
    {
      layout: "horizontal",
      gap: 12,
      width: "fill_container",
      padding: [10, 12],
      alignItems: "center",
      stroke: { type: "color", color: "$--border" },
      strokeWidth: { bottom: 1 },
    },
    [
      text(component, { size: 13, weight: "500", width: 180 }),
      text(file, { size: 11, fill: "$--muted-foreground", width: 240 }),
      frame(
        {
          layout: "horizontal",
          alignItems: "center",
          justifyContent: "center",
          height: 22,
          padding: [0, 8],
          cornerRadius: "$--radius-sm",
          fill: status === "Designed" ? "$--accent" : "$--muted",
          width: 88,
        },
        [text(status, { size: 10, weight: "600" })]
      ),
      text(notes, { size: 12, width: "fill_container" }),
    ]
  );
}

// ─── Design System Components ───────────────────────────────────────────────

const btnPrimary = frame(
  {
    id: "btnPrimary",
    name: "Button / Primary",
    reusable: true,
    context: "components/ui/button.tsx · variant=default · Primary CTAs, form submits",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: [0, 16],
    cornerRadius: "$--radius-md",
    fill: "$--primary",
  },
  [{ ...text("Button", { size: 14, weight: "500", fill: "$--primary-foreground" }), id: "btnPrimaryLabel" }]
);

const btnDestructive = frame(
  {
    id: "btnDestructive",
    name: "Button / Destructive",
    reusable: true,
    context: "components/ui/button.tsx · variant=destructive · Delete, cancel booking",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: [0, 16],
    cornerRadius: "$--radius-md",
    fill: "$--destructive",
  },
  [{ ...text("Delete", { size: 14, weight: "500", fill: "#ffffff" }), id: "btnDestructiveLabel" }]
);

const btnSecondary = frame(
  {
    id: "btnSecondary",
    name: "Button / Secondary",
    reusable: true,
    context: "components/ui/button.tsx · variant=secondary · Secondary actions",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: [0, 16],
    cornerRadius: "$--radius-md",
    fill: "$--secondary",
  },
  [{ ...text("Secondary", { size: 14, weight: "500" }), id: "btnSecondaryLabel" }]
);

const btnOutline = frame(
  {
    id: "btnOutline",
    name: "Button / Outline",
    reusable: true,
    context: "components/ui/button.tsx · variant=outline · Secondary actions, filters",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: [0, 16],
    cornerRadius: "$--radius-md",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [{ ...text("Button", { size: 14, weight: "500" }), id: "btnOutlineLabel" }]
);

const btnGhost = frame(
  {
    id: "btnGhost",
    name: "Button / Ghost",
    reusable: true,
    context: "components/ui/button.tsx · variant=ghost · Icon buttons, language toggle",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
  },
  [icon("languages", 16, "btnGhostIcon")]
);

const inputBase = frame(
  {
    id: "inputBase",
    name: "Input",
    reusable: true,
    context: "components/ui/input.tsx · Text fields, search boxes",
    layout: "horizontal",
    alignItems: "center",
    height: 40,
    padding: [0, 12],
    cornerRadius: "$--radius-md",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 320,
  },
  [text("Search...", { size: 14, fill: "$--muted-foreground", id: "inputPlaceholder" })]
);

const textareaBase = frame(
  {
    id: "textareaBase",
    name: "Textarea",
    reusable: true,
    context: "components/ui/textarea.tsx · Multi-line text input",
    layout: "vertical",
    gap: 4,
    padding: 12,
    cornerRadius: "$--radius-md",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 320,
    height: 96,
  },
  [text("Enter description...", { size: 14, fill: "$--muted-foreground" })]
);

const labelBase = frame(
  {
    id: "labelBase",
    name: "Label",
    reusable: true,
    context: "components/ui/label.tsx · Form field labels",
    layout: "horizontal",
    height: 20,
  },
  [text("Label", { size: 14, weight: "500" })]
);

const badgeDefault = frame(
  {
    id: "badgeDefault",
    name: "Badge / Default",
    reusable: true,
    context: "components/ui/badge.tsx · variant=default · Status, rank labels",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    height: 22,
    padding: [0, 10],
    cornerRadius: "$--radius-md",
    fill: "$--primary",
  },
  [{ ...text("Badge", { size: 12, weight: "500", fill: "$--primary-foreground" }), id: "badgeDefaultLabel" }]
);

const badgeSecondary = frame(
  {
    id: "badgeSecondary",
    name: "Badge / Secondary",
    reusable: true,
    context: "components/ui/badge.tsx · variant=secondary · Table status chips",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    height: 22,
    padding: [0, 10],
    cornerRadius: "$--radius-md",
    fill: "$--secondary",
  },
  [text("Badge", { size: 12, weight: "500", fill: "$--foreground" })]
);

const badgeOutline = frame(
  {
    id: "badgeOutline",
    name: "Badge / Outline",
    reusable: true,
    context: "components/ui/badge.tsx · variant=outline",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    height: 22,
    padding: [0, 10],
    cornerRadius: "$--radius-md",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [text("Outline", { size: 12, weight: "500" })]
);

const cardBase = frame(
  {
    id: "cardBase",
    name: "Card",
    reusable: true,
    context: "components/ui/card.tsx · Card, CardHeader, CardTitle, CardDescription, CardContent",
    layout: "vertical",
    gap: 16,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 360,
    effect: { type: "shadow", shadowType: "outer", blur: 2, offset: { x: 0, y: 1 }, color: "#00000010" },
  },
  [
    frame({ id: "cardHeader", name: "CardHeader", layout: "vertical", gap: 4, width: "fill_container" }, [
      { ...text("Card Title", { size: 18, weight: "600", fill: "$--card-foreground" }), id: "cardTitle" },
      { ...text("Card description text", { size: 14, fill: "$--muted-foreground" }), id: "cardDesc" },
    ]),
    frame({ id: "cardContent", name: "CardContent", layout: "vertical", gap: 12, width: "fill_container", slot: ["inputBase", "btnPrimary", "btnOutline"] }, []),
  ]
);

const statCard = frame(
  {
    id: "statCard",
    name: "Stat Card",
    reusable: true,
    context: "Pattern · Dashboard KPI tile · Used on Home, Usuarios, Sales Analytics",
    layout: "vertical",
    gap: 8,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 280,
  },
  [
    { ...text("Metric Label", { size: 14, weight: "500", fill: "$--muted-foreground" }), id: "statLabel" },
    { ...text("€18,457", { size: 24, weight: "700" }), id: "statValue" },
    { ...text("+15.8% vs last month", { size: 12, fill: "$--muted-foreground" }), id: "statHint" },
  ]
);

const selectTrigger = frame(
  {
    id: "selectTrigger",
    name: "Select",
    reusable: true,
    context: "components/ui/select.tsx · Dropdown selects in forms and filters",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space_between",
    height: 40,
    padding: [0, 12],
    cornerRadius: "$--radius-md",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: "fill_container",
  },
  [
    text("Select...", { size: 14, fill: "$--muted-foreground" }),
    icon("chevron-down", 16),
  ]
);

const tabsList = frame(
  {
    id: "tabsList",
    name: "Tabs List",
    reusable: true,
    context: "components/ui/tabs.tsx · TabsList + TabsTrigger · Calendar, Atributos, Analytics",
    layout: "horizontal",
    gap: 4,
    padding: 4,
    cornerRadius: "$--radius-md",
    fill: "$--muted",
    height: 40,
  },
  [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", height: 32, padding: [0, 12], cornerRadius: "$--radius-sm", fill: "$--background", width: "fill_container" }, [
      { ...text("Tab 1", { size: 14, weight: "500" }), id: "tabLabel1" },
    ]),
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", height: 32, padding: [0, 12], cornerRadius: "$--radius-sm", width: "fill_container" }, [
      { ...text("Tab 2", { size: 14, fill: "$--muted-foreground" }), id: "tabLabel2" },
    ]),
  ]
);

const alertDefault = frame(
  {
    id: "alertDefault",
    name: "Alert / Default",
    reusable: true,
    context: "components/ui/alert.tsx · variant=default · Inline notices",
    layout: "horizontal",
    gap: 12,
    padding: 16,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 400,
    alignItems: "start",
  },
  [
    icon("info", 16, "alertDefaultIcon"),
    frame({ layout: "vertical", gap: 4, width: "fill_container" }, [
      text("Heads up!", { size: 14, weight: "500" }),
      text("You can add components to your app using the CLI.", { size: 13, fill: "$--muted-foreground" }),
    ]),
  ]
);

const skeletonBase = frame(
  {
    id: "skeletonBase",
    name: "Skeleton",
    reusable: true,
    context: "components/ui/skeleton.tsx · Loading placeholders",
    layout: "vertical",
    gap: 8,
    width: 280,
  },
  [
    frame({ width: "fill_container", height: 16, cornerRadius: "$--radius-sm", fill: "$--muted" }),
    frame({ width: 200, height: 12, cornerRadius: "$--radius-sm", fill: "$--muted" }),
    frame({ width: "fill_container", height: 80, cornerRadius: "$--radius-md", fill: "$--muted" }),
  ]
);

const switchOn = frame(
  {
    id: "switchOn",
    name: "Switch / On",
    reusable: true,
    context: "components/ui/switch.tsx · Boolean toggles",
    layout: "horizontal",
    alignItems: "center",
    width: 44,
    height: 24,
    cornerRadius: 9999,
    fill: "$--primary",
    padding: 2,
    justifyContent: "end",
  },
  [frame({ width: 20, height: 20, cornerRadius: 9999, fill: "$--background" })]
);

const checkboxChecked = frame(
  {
    id: "checkboxChecked",
    name: "Checkbox / Checked",
    reusable: true,
    context: "components/ui/checkbox.tsx · Multi-select forms",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    cornerRadius: 4,
    fill: "$--primary",
  },
  [icon("check", 12, "checkboxCheckIcon")]
);

const separatorH = frame(
  {
    id: "separatorH",
    name: "Separator",
    reusable: true,
    context: "components/ui/separator.tsx · Visual dividers",
    layout: "horizontal",
    width: 200,
    height: 1,
    fill: "$--border",
  },
  []
);

const progressBar = frame(
  {
    id: "progressBar",
    name: "Progress",
    reusable: true,
    context: "components/ui/progress.tsx · Completion indicators",
    layout: "horizontal",
    width: 200,
    height: 8,
    cornerRadius: 9999,
    fill: "$--muted",
    clip: true,
  },
  [frame({ width: 120, height: 8, fill: "$--primary" })]
);

const viewModeButtons = frame(
  {
    id: "viewModeButtons",
    name: "View Mode Buttons",
    reusable: true,
    context: "components/ui/view-mode-buttons.tsx · Check In / Call Center / In-Stay / Simulation",
    layout: "horizontal",
    gap: 8,
  },
  [
    viewModeBtn("Check In", "hotel", true),
    viewModeBtn("Call Center", "phone"),
    viewModeBtn("In-Stay", "users"),
    viewModeBtn("Simulation", "settings"),
  ]
);

const dateRangePicker = frame(
  {
    id: "dateRangePicker",
    name: "Date Range Picker",
    reusable: true,
    context: "components/ui/date-range-picker.tsx · react-day-picker + popover",
    layout: "horizontal",
    alignItems: "center",
    gap: 8,
    height: 40,
    padding: [0, 12],
    cornerRadius: "$--radius-md",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 300,
  },
  [icon("calendar", 16, "dateRangeIcon"), text("Jun 1 – Jun 30, 2026", { size: 14 })]
);

const dialogContent = frame(
  {
    id: "dialogContent",
    name: "Dialog Content",
    reusable: true,
    context: "components/ui/dialog.tsx · Modal overlays · Room selection, confirmations",
    layout: "vertical",
    gap: 16,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 480,
    effect: { type: "shadow", shadowType: "outer", blur: 24, offset: { x: 0, y: 8 }, color: "#00000040" },
  },
  [
    frame({ layout: "horizontal", alignItems: "start", justifyContent: "space_between", width: "fill_container" }, [
      frame({ layout: "vertical", gap: 4 }, [
        text("Dialog Title", { size: 18, weight: "600" }),
        text("Dialog description goes here.", { size: 14, fill: "$--muted-foreground" }),
      ]),
      icon("x", 16, "dialogCloseIcon"),
    ]),
    frame({ layout: "vertical", gap: 12, width: "fill_container" }, [
      ref("inputBase", { width: "fill_container" }),
    ]),
    frame({ layout: "horizontal", gap: 8, justifyContent: "end", width: "fill_container" }, [
      ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Cancel" } } }),
      ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Confirm" } } }),
    ]),
  ]
);

const sheetPanel = frame(
  {
    id: "sheetPanel",
    name: "Sheet / Right",
    reusable: true,
    context: "components/ui/sheet.tsx · side=right · Addon forms, detail panels",
    layout: "vertical",
    gap: 16,
    padding: 24,
    width: 400,
    height: "fill_container",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { left: 1 },
    effect: { type: "shadow", shadowType: "outer", blur: 16, offset: { x: -4, y: 0 }, color: "#00000020" },
  },
  [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container" }, [
      text("Edit Addon", { size: 18, weight: "600" }),
      icon("x", 16, "sheetCloseIcon"),
    ]),
    frame({ layout: "vertical", gap: 12, width: "fill_container" }, [
      frame({ layout: "vertical", gap: 6 }, [text("Name", { size: 14, weight: "500" }), ref("inputBase", { width: "fill_container" })]),
      frame({ layout: "vertical", gap: 6 }, [text("Description", { size: 14, weight: "500" }), ref("textareaBase", { width: "fill_container" })]),
    ]),
    frame({ layout: "horizontal", gap: 8, width: "fill_container" }, [
      ref("btnPrimary", { width: "fill_container", descendants: { btnPrimaryLabel: { content: "Save" } } }),
    ]),
  ]
);

const emptyState = frame(
  {
    id: "emptyState",
    name: "Empty State",
    reusable: true,
    context: "Pattern · No results / empty lists",
    layout: "vertical",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    width: "fill_container",
  },
  [
    icon("inbox", 40, "emptyStateIcon"),
    text("No results found", { size: 16, weight: "600" }),
    text("Try adjusting your search or filters.", { size: 14, fill: "$--muted-foreground" }),
    ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Clear filters" } } }),
  ]
);

function menuItem(label, opts = {}) {
  return frame(
    {
      layout: "horizontal",
      alignItems: "center",
      height: 32,
      padding: [0, 8],
      cornerRadius: "$--radius-sm",
      width: "fill_container",
      fill: opts.destructive ? "$--background" : "$--background",
    },
    [text(label, { size: 13, fill: opts.destructive ? "$--destructive" : "$--foreground" })]
  );
}

const calendarMonth = frame(
  {
    id: "calendarMonth",
    name: "Calendar / Month",
    reusable: true,
    context: "components/ui/calendar.tsx · react-day-picker month grid",
    layout: "vertical",
    gap: 8,
    padding: 12,
    width: 280,
    cornerRadius: "$--radius-lg",
    fill: "$--popover",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    frame({ layout: "horizontal", justifyContent: "space_between", alignItems: "center", width: "fill_container" }, [
      icon("chevron-left", 16, "calPrevIcon"),
      text("June 2026", { size: 14, weight: "500" }),
      icon("chevron-right", 16, "calNextIcon"),
    ]),
    frame(
      { layout: "horizontal", gap: 4, width: "fill_container" },
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) =>
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 34, height: 24 }, [
          text(d, { size: 10, weight: "500", fill: "$--muted-foreground" }),
        ])
      )
    ),
    ...Array.from({ length: 5 }, (_, row) =>
      frame(
        { layout: "horizontal", gap: 4 },
        Array.from({ length: 7 }, (_, col) => {
          const day = row * 7 + col + 1;
          const show = day <= 30;
          const selected = day === 15;
          return frame(
            {
              layout: "horizontal",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              cornerRadius: "$--radius-sm",
              fill: selected ? "$--primary" : "$--background",
            },
            [
              text(show ? String(day) : "", {
                size: 12,
                weight: selected ? "500" : "400",
                fill: selected ? "$--primary-foreground" : show ? "$--foreground" : "$--muted-foreground",
              }),
            ]
          );
        })
      )
    ),
  ]
);

const chartBar = frame(
  {
    id: "chartBar",
    name: "Chart / Bar",
    reusable: true,
    context: "components/ui/chart.tsx · Recharts BarChart · chart-1…5 tokens",
    layout: "vertical",
    gap: 12,
    padding: 16,
    width: 420,
    height: 240,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    text("Revenue by Product", { size: 14, weight: "600" }),
    frame({ layout: "horizontal", gap: 10, alignItems: "end", height: 160, width: "fill_container" }, [
      ...[
        ["Spa", 100, "$--chart-1"],
        ["Tours", 140, "$--chart-2"],
        ["Dining", 90, "$--chart-3"],
        ["Transfer", 120, "$--chart-4"],
        ["Room", 75, "$--chart-5"],
      ].map(([label, h, color]) =>
        frame({ layout: "vertical", gap: 6, alignItems: "center", width: "fill_container", justifyContent: "end", height: "fill_container" }, [
          frame({ width: 48, height: h, cornerRadius: "$--radius-sm", fill: color }),
          text(label, { size: 10, fill: "$--muted-foreground" }),
        ])
      ),
    ]),
  ]
);

const chartLine = frame(
  {
    id: "chartLine",
    name: "Chart / Line",
    reusable: true,
    context: "components/ui/chart.tsx · Recharts LineChart · trend KPIs",
    layout: "vertical",
    gap: 12,
    padding: 16,
    width: 420,
    height: 200,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    text("Conversion Trend", { size: 14, weight: "600" }),
    frame({ layout: "horizontal", alignItems: "end", gap: 8, height: 120, width: "fill_container", padding: [8, 0] }, [
      frame({ width: "fill_container", height: 100, stroke: { type: "color", color: "$--chart-2" }, strokeWidth: 2, fill: "$--background" }),
    ]),
    frame({ layout: "horizontal", justifyContent: "space_between", width: "fill_container" }, [
      text("Mon", { size: 10, fill: "$--muted-foreground" }),
      text("Wed", { size: 10, fill: "$--muted-foreground" }),
      text("Fri", { size: 10, fill: "$--muted-foreground" }),
      text("Sun", { size: 10, fill: "$--muted-foreground" }),
    ]),
  ]
);

const dropdownMenu = frame(
  {
    id: "dropdownMenu",
    name: "Dropdown Menu",
    reusable: true,
    context: "components/ui/dropdown-menu.tsx · Radix DropdownMenuContent",
    layout: "vertical",
    gap: 2,
    padding: 4,
    width: 200,
    cornerRadius: "$--radius-md",
    fill: "$--popover",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    effect: { type: "shadow", shadowType: "outer", blur: 12, offset: { x: 0, y: 4 }, color: "#00000020" },
  },
  [
    menuItem("Edit"),
    menuItem("Duplicate"),
    menuItem("Export"),
    frame({ width: "fill_container", height: 1, fill: "$--border" }),
    menuItem("Delete", { destructive: true }),
  ]
);

const popoverContent = frame(
  {
    id: "popoverContent",
    name: "Popover",
    reusable: true,
    context: "components/ui/popover.tsx · Radix PopoverContent · date picker host",
    layout: "vertical",
    gap: 8,
    padding: 8,
    width: 296,
    cornerRadius: "$--radius-lg",
    fill: "$--popover",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    effect: { type: "shadow", shadowType: "outer", blur: 16, offset: { x: 0, y: 4 }, color: "#00000025" },
  },
  [ref("calendarMonth", { width: "fill_container" })]
);

const tooltipContent = frame(
  {
    id: "tooltipContent",
    name: "Tooltip",
    reusable: true,
    context: "components/ui/tooltip.tsx · Radix TooltipContent",
    layout: "horizontal",
    alignItems: "center",
    padding: [6, 10],
    cornerRadius: "$--radius-md",
    fill: "$--popover",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    effect: { type: "shadow", shadowType: "outer", blur: 8, offset: { x: 0, y: 2 }, color: "#00000018" },
  },
  [text("Additional information", { size: 12 })]
);

const toastBase = frame(
  {
    id: "toastBase",
    name: "Toast / Sonner",
    reusable: true,
    context: "components/ui/sonner.tsx · Sonner toast notification",
    layout: "horizontal",
    gap: 12,
    alignItems: "center",
    padding: 16,
    width: 380,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    effect: { type: "shadow", shadowType: "outer", blur: 16, offset: { x: 0, y: 4 }, color: "#00000030" },
  },
  [
    icon("circle-check", 18, "toastIcon"),
    frame({ layout: "vertical", gap: 2, width: "fill_container" }, [
      text("Saved successfully", { size: 14, weight: "500" }),
      text("Your changes have been applied.", { size: 12, fill: "$--muted-foreground" }),
    ]),
    icon("x", 14, "toastCloseIcon"),
  ]
);

const formField = frame(
  {
    id: "formField",
    name: "Form Field",
    reusable: true,
    context: "components/ui/form.tsx · FormItem + Label + FormMessage",
    layout: "vertical",
    gap: 6,
    width: 320,
  },
  [
    text("Email address", { size: 14, weight: "500" }),
    ref("inputBase", { width: "fill_container", descendants: {} }),
    text("Enter a valid email address.", { size: 12, fill: "$--destructive" }),
  ]
);

const breadcrumbNav = frame(
  {
    id: "breadcrumbNav",
    name: "Breadcrumb",
    reusable: true,
    context: "components/ui/breadcrumb.tsx · BreadcrumbList navigation",
    layout: "horizontal",
    gap: 6,
    alignItems: "center",
  },
  [
    text("Home", { size: 13, fill: "$--muted-foreground" }),
    icon("chevron-right", 12, "bcSep1"),
    text("Ventas", { size: 13, fill: "$--muted-foreground" }),
    icon("chevron-right", 12, "bcSep2"),
    text("Call Center", { size: 13, weight: "500" }),
  ]
);

const paginationNav = frame(
  {
    id: "paginationNav",
    name: "Pagination",
    reusable: true,
    context: "components/ui/pagination.tsx · Table page navigation",
    layout: "horizontal",
    gap: 4,
    alignItems: "center",
  },
  [
    frame(
      {
        layout: "horizontal",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        cornerRadius: "$--radius-md",
        stroke: { type: "color", color: "$--border" },
        strokeWidth: 1,
      },
      [icon("chevron-left", 14, "pagePrevIcon")]
    ),
    ...[1, 2, 3].map((n) =>
      frame(
        {
          layout: "horizontal",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          cornerRadius: "$--radius-md",
          fill: n === 1 ? "$--primary" : "$--background",
          stroke: n === 1 ? undefined : { type: "color", color: "$--border" },
          strokeWidth: n === 1 ? 0 : 1,
        },
        [text(String(n), { size: 13, weight: "500", fill: n === 1 ? "$--primary-foreground" : "$--foreground" })]
      )
    ),
    icon("more-horizontal", 14, "pageMoreIcon"),
    frame(
      {
        layout: "horizontal",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        cornerRadius: "$--radius-md",
        stroke: { type: "color", color: "$--border" },
        strokeWidth: 1,
      },
      [icon("chevron-right", 14, "pageNextIcon")]
    ),
  ]
);

const alertDialogContent = frame(
  {
    id: "alertDialogContent",
    name: "Alert Dialog",
    reusable: true,
    context: "components/ui/alert-dialog.tsx · Destructive action confirmation",
    layout: "vertical",
    gap: 16,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 420,
    effect: { type: "shadow", shadowType: "outer", blur: 24, offset: { x: 0, y: 8 }, color: "#00000040" },
  },
  [
    frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
      text("Are you absolutely sure?", { size: 18, weight: "600" }),
      text("This action cannot be undone. This will permanently delete the addon.", {
        size: 14,
        fill: "$--muted-foreground",
      }),
    ]),
    frame({ layout: "horizontal", gap: 8, justifyContent: "end", width: "fill_container" }, [
      ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Cancel" } } }),
      ref("btnDestructive"),
    ]),
  ]
);

const drawerPanel = frame(
  {
    id: "drawerPanel",
    name: "Drawer / Bottom",
    reusable: true,
    context: "components/ui/drawer.tsx · vaul bottom sheet · mobile actions",
    layout: "vertical",
    gap: 16,
    padding: 24,
    width: 400,
    height: 260,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { top: 1 },
    effect: { type: "shadow", shadowType: "outer", blur: 20, offset: { x: 0, y: -4 }, color: "#00000025" },
  },
  [
    frame({ layout: "horizontal", justifyContent: "center", width: "fill_container" }, [
      frame({ width: 40, height: 4, cornerRadius: 9999, fill: "$--muted" }),
    ]),
    text("Quick Actions", { size: 18, weight: "600" }),
    frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
      menuItem("New Reservation"),
      menuItem("Search Guest"),
      menuItem("View Reports"),
    ]),
  ]
);

const roomSelectionModal = frame(
  {
    id: "roomSelectionModal",
    name: "Room Selection Modal",
    reusable: true,
    context: "components/ui/room-selection-modal.tsx · Call center room picker dialog",
    layout: "vertical",
    gap: 16,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 500,
    effect: { type: "shadow", shadowType: "outer", blur: 24, offset: { x: 0, y: 8 }, color: "#00000040" },
  },
  [
    frame({ layout: "horizontal", alignItems: "start", justifyContent: "space_between", width: "fill_container" }, [
      frame({ layout: "vertical", gap: 4, width: "fill_container" }, [
            frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
              text("Select Rooms", { size: 18, weight: "600" }),
              frame({ layout: "horizontal", alignItems: "center", height: 22, padding: [0, 8], cornerRadius: "$--radius-md", fill: "$--secondary" }, [
                text("3 available", { size: 12, weight: "500" }),
              ]),
            ]),
        text("Choose from the available rooms below:", { size: 14, fill: "$--muted-foreground" }),
      ]),
      icon("x", 16, "roomModalCloseIcon"),
    ]),
    frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
      ...[
        ["101", true],
        ["205", false],
        ["312", true],
      ].map(([num, available], i) =>
        frame(
          {
            layout: "horizontal",
            alignItems: "center",
            justifyContent: "space_between",
            padding: 12,
            cornerRadius: "$--radius-lg",
            fill: i === 0 ? "$--accent" : "$--background",
            stroke: { type: "color", color: i === 0 ? "$--primary" : "$--border" },
            strokeWidth: 1,
            width: "fill_container",
          },
          [
            frame({ layout: "horizontal", gap: 12, alignItems: "center" }, [
              frame(
                {
                  layout: "horizontal",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  cornerRadius: 9999,
                  fill: i === 0 ? "$--primary" : "$--background",
                  stroke: { type: "color", color: i === 0 ? "$--primary" : "$--border" },
                  strokeWidth: 2,
                },
                i === 0 ? [icon("check", 12, `roomCheck${num}`)] : []
              ),
              text(`Room ${num}`, { size: 14, weight: "500" }),
            ]),
            available
              ? frame({ width: 1, height: 1 })
              : frame(
                  { layout: "horizontal", alignItems: "center", height: 22, padding: [0, 8], cornerRadius: "$--radius-md", fill: "$--secondary" },
                  [text("Unavailable", { size: 12, weight: "500" })]
                ),
          ]
        )
      ),
    ]),
    frame(
      {
        layout: "horizontal",
        alignItems: "center",
        justifyContent: "space_between",
        width: "fill_container",
        padding: [16, 0, 0, 0],
        stroke: { type: "color", color: "$--border" },
        strokeWidth: { top: 1 },
      },
      [
        text("1 of 1 selected", { size: 13, fill: "$--muted-foreground" }),
        frame({ layout: "horizontal", gap: 8 }, [
          ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Cancel" } } }),
          ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Accept (1)" } } }),
        ]),
      ]
    ),
  ]
);

const tableHeader = frame(
  {
    id: "tableHeader",
    name: "Table Header Row",
    reusable: true,
    context: "components/ui/table.tsx · TableHeader + TableRow + TableHead",
    layout: "horizontal",
    alignItems: "center",
    height: 48,
    padding: [0, 16],
    fill: "$--muted",
    width: "fill_container",
  },
  ["Locator", "Guest", "Room", "Check-in", "Nights", "Status"].map((h) =>
    frame({ layout: "horizontal", alignItems: "center", width: "fill_container" }, [
      text(h, { size: 12, weight: "500", fill: "$--muted-foreground" }),
    ])
  )
);

const tableRow = frame(
  {
    id: "tableRow",
    name: "Table Row",
    reusable: true,
    context: "components/ui/table.tsx · TableBody row with badges and actions",
    layout: "horizontal",
    alignItems: "center",
    height: 52,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { top: 0, right: 0, bottom: 1, left: 0 },
    width: "fill_container",
  },
  [
    frame({ width: "fill_container" }, [text("HV-2847", { size: 14, weight: "500" })]),
    frame({ width: "fill_container" }, [text("Maria Garcia", { size: 14 })]),
    frame({ width: "fill_container" }, [text("Deluxe Ocean", { size: 14 })]),
    frame({ width: "fill_container" }, [text("2026-07-15", { size: 14 })]),
    frame({ width: "fill_container" }, [text("5", { size: 14 })]),
    frame({ width: "fill_container" }, [ref("badgeSecondary")]),
  ]
);

const sidebarItem = frame(
  {
    id: "sidebarItem",
    name: "Sidebar / Nav Item",
    reusable: true,
    context: "components/ui/sidebar.tsx · SidebarMenuButton default state",
    layout: "horizontal",
    alignItems: "center",
    gap: 12,
    height: 40,
    padding: [0, 12],
    cornerRadius: "$--radius-lg",
    width: "fill_container",
  },
  [icon("home", 16), text("Nav Item", { size: 14, weight: "500" })]
);

const sidebarItemActive = frame(
  {
    id: "sidebarItemActive",
    name: "Sidebar / Nav Item Active",
    reusable: true,
    context: "components/ui/sidebar.tsx · SidebarMenuButton active / accent state",
    layout: "horizontal",
    alignItems: "center",
    gap: 12,
    height: 40,
    padding: [0, 12],
    cornerRadius: "$--radius-lg",
    fill: "$--accent",
    width: "fill_container",
  },
  [icon("phone", 16), text("Call Center", { size: 14, weight: "500", fill: "$--accent-foreground" })]
);

function navRow(label, iconName, opts = {}) {
  return frame(
    {
      layout: "horizontal",
      alignItems: "center",
      gap: 12,
      height: opts.sub ? 36 : 40,
      padding: [0, 12, 0, opts.sub ? 36 : 12],
      cornerRadius: opts.sub ? "$--radius-md" : "$--radius-lg",
      width: "fill_container",
      fill: opts.active ? "$--accent" : "$--background",
    },
    [
      icon(iconName, 16),
      text(label, {
        size: 14,
        weight: opts.active ? "500" : "400",
        fill: opts.disabled ? "$--muted-foreground" : "$--foreground",
      }),
      ...(opts.chevron
        ? [frame({ layout: "horizontal", width: "fill_container", justifyContent: "end" }, [icon(opts.chevron, 14)])]
        : []),
    ]
  );
}

function tabChip(label, { active = false, disabled = false, closable = false } = {}) {
  return frame(
    {
      layout: "horizontal",
      alignItems: "center",
      justifyContent: "center",
      gap: closable ? 6 : 0,
      height: 36,
      padding: [0, 12],
      cornerRadius: "$--radius-md",
      fill: active ? "$--background" : "transparent",
      stroke: active ? { type: "color", color: "$--border" } : undefined,
      strokeWidth: active ? 1 : 0,
    },
    [
      text(label, {
        size: 13,
        weight: active ? "500" : "400",
        fill: disabled && !active ? "$--muted-foreground" : "$--foreground",
      }),
      ...(closable ? [icon("x", 12, `tabClose-${label.replace(/\s/g, "")}`)] : []),
    ]
  );
}

function frontDeskTabStrip({ active = "upsell", includeDynamic = null } = {}) {
  const chips = [
    tabChip("Front Desk Upsell", { active: active === "upsell", disabled: active === "upsell-disabled" }),
    tabChip("Dashboard", { disabled: true }),
    tabChip("Request Management", { disabled: true }),
  ];
  if (includeDynamic) chips.push(tabChip(includeDynamic.label, { active: true, closable: true }));
  return frame(
    { layout: "horizontal", alignItems: "center", gap: 4, height: 40, padding: 4, cornerRadius: "$--radius-md", fill: "$--muted" },
    chips
  );
}

function agentCommissionWidget(amount) {
  return frame({ layout: "horizontal", alignItems: "center", gap: 8, shrink: 0 }, [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 32, height: 32, cornerRadius: 9999, fill: "#dbeafe" }, [
      text("MG", { size: 11, weight: "600", fill: "#2563eb" }),
    ]),
    frame({ layout: "vertical", gap: 0 }, [
      text("María García", { size: 13, weight: "500" }),
      text("Front Desk Agent", { size: 11, fill: "$--muted-foreground" }),
    ]),
    frame({ layout: "vertical", gap: 0, alignItems: "end" }, [
      text("Commission:", { size: 10, fill: "$--muted-foreground" }),
      frame({ layout: "horizontal", alignItems: "center", gap: 4 }, [
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 20, height: 20, cornerRadius: 9999, fill: "#dcfce7" }, [
          icon("coins", 12, uid("coins")),
        ]),
        text(amount, { size: 13, weight: "600", fill: "#16a34a" }),
      ]),
    ]),
  ]);
}

function viewModeBtn(label, iconName, active = false) {
  return frame(
    {
      layout: "horizontal",
      alignItems: "center",
      gap: 6,
      height: 36,
      padding: [0, 12],
      cornerRadius: "$--radius-md",
      fill: active ? "$--primary" : "$--background",
      stroke: active ? undefined : { type: "color", color: "$--border" },
      strokeWidth: active ? 0 : 1,
    },
    [
      icon(iconName, 16),
      text(label, { size: 13, weight: "500", fill: active ? "#ffffff" : "$--foreground" }),
    ]
  );
}

function upsellExtrasButton(label, variant = "primary") {
  const isGhost = variant === "ghost";
  return frame(
    {
      layout: "horizontal",
      alignItems: "center",
      justifyContent: "center",
      height: 32,
      padding: [0, 12],
      cornerRadius: "$--radius-md",
      fill: isGhost ? "transparent" : "$--primary",
      stroke: isGhost ? { type: "color", color: "$--border" } : undefined,
      strokeWidth: isGhost ? 1 : 0,
    },
    [text(label, { size: 12, weight: "500", fill: isGhost ? "$--foreground" : "#ffffff" })]
  );
}

function upsellTableRow({ locator, name, email, aci, roomType, checkIn, nights, extrasLabel, extrasVariant }) {
  return frame(
    {
      layout: "horizontal",
      alignItems: "center",
      height: 56,
      padding: [0, 16],
      width: "fill_container",
      stroke: { type: "color", color: "$--border" },
      strokeWidth: { bottom: 1 },
    },
    [
      frame({ width: UPSELL_COL_WIDTHS[0] }, [text(locator, { size: 13, weight: "500" })]),
      frame({ layout: "vertical", gap: 2, width: UPSELL_COL_WIDTHS[1] }, [
        text(name, { size: 13, weight: "500" }),
        text(email, { size: 12, fill: "$--muted-foreground" }),
      ]),
      frame({ width: UPSELL_COL_WIDTHS[2] }, [text(aci, { size: 13 })]),
      frame({ width: UPSELL_COL_WIDTHS[3] }, [text(roomType, { size: 13, weight: "500" })]),
      frame({ width: UPSELL_COL_WIDTHS[4] }, [text(checkIn, { size: 13 })]),
      frame({ width: UPSELL_COL_WIDTHS[5] }, [text(nights, { size: 13 })]),
      frame({ width: UPSELL_COL_WIDTHS[6] }, [upsellExtrasButton(extrasLabel, extrasVariant)]),
    ]
  );
}

function summaryItemsCard(title, iconName, accentColor, count, headers, rowCells) {
  const SUMMARY_COL_WIDTHS = [120, 90, "fill_container", 88];
  return frame(
    {
      layout: "vertical",
      width: "fill_container",
      cornerRadius: "$--radius-lg",
      fill: "$--card",
      stroke: { type: "color", color: "$--border" },
      strokeWidth: 1,
      clip: true,
    },
    [
      frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", padding: 16, width: "fill_container" }, [
        frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
          icon(iconName, 18),
          text(title, { size: 15, weight: "600" }),
          frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", height: 22, padding: [0, 8], cornerRadius: 9999, fill: "$--secondary" }, [
            text(String(count), { size: 11, weight: "500" }),
          ]),
        ]),
        icon("more-horizontal", 16),
      ]),
      frame({ layout: "horizontal", padding: [0, 16], height: 40, fill: "$--muted", width: "fill_container", alignItems: "center" }, [
        ...headers.map((h, i) =>
          tableCol(SUMMARY_COL_WIDTHS[i] ?? 100, text(h, { size: 11, weight: "600", fill: "$--muted-foreground" }))
        ),
      ]),
      frame({ layout: "horizontal", alignItems: "center", padding: [0, 16], height: 48, width: "fill_container" }, [
        ...rowCells.map((cell, i) =>
          tableCol(
            SUMMARY_COL_WIDTHS[i] ?? 100,
            typeof cell === "string"
              ? text(cell, { size: 12, weight: i === 0 ? "500" : "400" })
              : cell
          )
        ),
      ]),
    ]
  );
}

const frontDeskHeader = frame(
  {
    id: "frontDeskHeader",
    name: "Front Desk Header",
    reusable: true,
    context: "components/layout/front-desk-header.tsx · Default list state · 3 static tabs only (no openTabs)",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space_between",
    height: 61,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { bottom: 1 },
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12, minWidth: 0, width: "fill_container" }, [
      icon("panel-left", 20),
      frontDeskTabStrip({ active: "upsell" }),
    ]),
    agentCommissionWidget("€163.50"),
  ]
);

const frontDeskHeaderDetailsOpen = frame(
  {
    id: "frontDeskHeaderDetailsOpen",
    name: "Front Desk Header / Details Tab",
    reusable: true,
    context: "front-desk-header.tsx · details_* · Lisa Anderson tab · isInReservationMode",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space_between",
    height: 61,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { bottom: 1 },
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12 }, [
      icon("panel-left", 20),
      frontDeskTabStrip({ active: "upsell-disabled", includeDynamic: { label: "Lisa Anderson" } }),
    ]),
    agentCommissionWidget("€163.50"),
  ]
);

const frontDeskHeaderReservationOpen = frame(
  {
    id: "frontDeskHeaderReservationOpen",
    name: "Front Desk Header / Open Tab",
    reusable: true,
    context:
      "components/layout/front-desk-header.tsx · openTabs[] renders guest name + X · isInReservationMode disables main tab",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space_between",
    height: 61,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { bottom: 1 },
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12 }, [
      icon("panel-left", 20, "fdOpenSidebarIcon"),
      frontDeskTabStrip({ active: "upsell-disabled", includeDynamic: { label: "Maria Garcia" } }),
    ]),
    agentCommissionWidget("€163.50"),
  ]
);

const reservationDetailsContent = frame(
  {
    id: "reservationDetailsContent",
    name: "Reservation Details Panel",
    reusable: true,
    context:
      "components/features/reservations/reservation-details-tab.tsx · TabsContent for details_* tab · isInReservationMode=true",
    layout: "vertical",
    gap: 20,
    padding: [16, 24, 24, 24],
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12, width: "fill_container" }, [
      frame({ layout: "horizontal", alignItems: "center", gap: 8, height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--primary" }, [
        icon("arrow-left", 16),
        text("Back", { size: 13, weight: "500", fill: "#ffffff" }),
      ]),
      text("Recommended Services", { size: 24, weight: "700" }),
    ]),
    frame(
      {
        layout: "horizontal",
        alignItems: "center",
        justifyContent: "space_between",
        padding: 16,
        cornerRadius: "$--radius-lg",
        fill: "$--card",
        stroke: { type: "color", color: "$--border" },
        strokeWidth: 1,
        width: "fill_container",
      },
      [
        frame({ layout: "horizontal", gap: 24, width: "fill_container" }, [
          ...[
            ["LOCATOR", "LOC1002"],
            ["GUEST", "Maria Garcia"],
            ["ROOM TYPE", "Doble Deluxe"],
            ["CHECK-IN", "20/05/2026"],
            ["NIGHTS", "3 nights"],
          ].map(([label, value], i) =>
            frame({ layout: "vertical", gap: 4, width: i === 1 ? "fill_container" : 108 }, [
              text(label, { size: 10, weight: "600", fill: "$--muted-foreground" }),
              text(value, { size: 13, weight: "600" }),
            ])
          ),
        ]),
        frame({ layout: "horizontal", gap: 12 }, [
          frame({ layout: "vertical", gap: 4, padding: [8, 16], cornerRadius: "$--radius-md", fill: "$--muted", alignItems: "center" }, [
            text("TOTAL ORDER", { size: 10, weight: "600", fill: "$--muted-foreground" }),
            text("€0", { size: 20, weight: "700" }),
          ]),
        ]),
      ]
    ),
    ref("cardBase", {
      width: "fill_container",
      descendants: {
        cardTitle: { content: "configuration" },
        cardDesc: { content: "" },
        cardContent: {
          children: [
            frame({ layout: "horizontal", gap: 24, width: "fill_container", alignItems: "center" }, [
              frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
                text("View as:", { size: 13, fill: "$--muted-foreground" }),
                ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "List" } } }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Blocks" } } }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "3D Map View" } } }),
              ]),
              frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
                text("Segment:", { size: 13, fill: "$--muted-foreground" }),
                ref("selectTrigger", { width: 160 }),
              ]),
              frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
                text("Agent:", { size: 13, fill: "$--muted-foreground" }),
                ref("selectTrigger", { width: 140 }),
              ]),
            ]),
          ],
        },
      },
    }),
    frame(
      {
        layout: "vertical",
        width: "fill_container",
        cornerRadius: "$--radius-lg",
        clip: true,
        stroke: { type: "color", color: "$--border" },
        strokeWidth: 1,
      },
      [
        frame({ layout: "horizontal", padding: [0, 16], height: 44, fill: "$--muted", width: "fill_container", alignItems: "center" }, [
          frame({ width: "fill_container" }, [text("Service", { size: 12, weight: "600" })]),
          frame({ width: 100 }, [text("Price", { size: 12, weight: "600" })]),
          frame({ width: 100 }, [text("Type", { size: 12, weight: "600" })]),
          frame({ width: 80 }, [text("Action", { size: 12, weight: "600" })]),
        ]),
        ...[
          ["Spa Treatment", "€85", "perStay"],
          ["Room Upgrade", "€120", "perNight"],
          ["Airport Transfer", "€45", "oneTime"],
        ].map(([name, price, type]) =>
          frame(
            {
              layout: "horizontal",
              alignItems: "center",
              height: 48,
              padding: [0, 16],
              stroke: { type: "color", color: "$--border" },
              strokeWidth: { bottom: 1 },
              width: "fill_container",
            },
            [
              frame({ width: "fill_container" }, [text(name, { size: 13, weight: "500" })]),
              frame({ width: 100 }, [text(price, { size: 13 })]),
              frame({ width: 100 }, [text(type, { size: 12, fill: "$--muted-foreground" })]),
              frame({ width: 80 }, [ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Add" } } })]),
            ]
          )
        ),
      ]
    ),
    frame({ layout: "vertical", gap: 12, width: "fill_container" }, [
      frame({ layout: "vertical", gap: 4 }, [
        text("Selection Summary", { size: 18, weight: "600" }),
        text("Review and confirm selected items", { size: 13, fill: "$--muted-foreground" }),
      ]),
      frame(
        {
          layout: "horizontal",
          gap: 16,
          width: "fill_container",
          padding: 16,
          cornerRadius: "$--radius-lg",
          fill: "$--card",
          stroke: { type: "color", color: "$--border" },
          strokeWidth: 1,
        },
        [
          frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
            text("Rooms (1)", { size: 13, weight: "600" }),
            text("Deluxe Ocean View — €180/night", { size: 12, fill: "$--muted-foreground" }),
          ]),
          frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
            text("Extras (2)", { size: 13, weight: "600" }),
            text("Spa Treatment · Airport Transfer", { size: 12, fill: "$--muted-foreground" }),
          ]),
          frame({ layout: "vertical", gap: 4, alignItems: "end" }, [
            text("Total", { size: 12, fill: "$--muted-foreground" }),
            text("€1,045.00", { size: 18, weight: "700" }),
          ]),
        ]
      ),
      frame({ layout: "horizontal", gap: 8, justifyContent: "end", width: "fill_container" }, [
        ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Clear All" } } }),
        ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Confirm Selection" } } }),
      ]),
    ]),
  ]
);

function blocksColumn(title, subtitle, children) {
  return frame({ layout: "vertical", gap: 12, width: "fill_container" }, [
    frame({ layout: "vertical", gap: 4 }, [
      text(title, { size: 16, weight: "600" }),
      text(subtitle, { size: 12, fill: "$--muted-foreground" }),
    ]),
    ...children,
  ]);
}

function blocksRoomCard(title, suiteName, price, tags = []) {
  return frame(
    {
      layout: "vertical",
      gap: 10,
      padding: 12,
      cornerRadius: "$--radius-lg",
      fill: "$--card",
      stroke: { type: "color", color: "$--border" },
      strokeWidth: 1,
      width: "fill_container",
    },
    [
      frame(
        {
          layout: "vertical",
          height: 130,
          cornerRadius: "$--radius-md",
          fill: "#1e293b",
          width: "fill_container",
          padding: 12,
          justifyContent: "end",
        },
        [
          frame({ layout: "horizontal", gap: 6, width: "fill_container" }, [
            ...tags.map((t) =>
              frame(
                { layout: "horizontal", padding: [4, 8], cornerRadius: 9999, fill: "#ffffff22" },
                [text(t, { size: 10, weight: "500", fill: "#ffffff" })]
              )
            ),
          ]),
        ]
      ),
      text(title, { size: 13, weight: "600" }),
      text(suiteName, { size: 12, weight: "700" }),
      text("• Spacious living area with separate bedroom\n• Premium amenities: minibar & coffee machine\n• VIP concierge and priority service", {
        size: 11,
        fill: "$--muted-foreground",
      }),
      text(price, { size: 14, weight: "700" }),
      ref("btnPrimary", { width: "fill_container", descendants: { btnPrimaryLabel: { content: "Book Now" } } }),
    ]
  );
}

const reservationDetailsBlocksContent = frame(
  {
    id: "reservationDetailsBlocksContent",
    name: "Reservation Details / Blocks Mode",
    reusable: true,
    context:
      "reservation-details-tab.tsx · ReservationBlocksSection · default viewMode=blocks in live app",
    layout: "vertical",
    gap: 16,
    padding: [16, 24, 24, 24],
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12 }, [
      frame({ layout: "horizontal", alignItems: "center", gap: 8, height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--primary" }, [
        icon("arrow-left", 16),
        text("Back", { size: 13, weight: "500", fill: "#ffffff" }),
      ]),
      text("Recommended Services", { size: 24, weight: "700" }),
      frame({ layout: "horizontal", gap: 12, width: "fill_container", justifyContent: "end" }, [
        frame({ layout: "vertical", gap: 2, padding: [8, 16], cornerRadius: "$--radius-md", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, alignItems: "center" }, [
          text("TOTAL ORDER", { size: 10, weight: "600", fill: "$--muted-foreground" }),
          text("€0", { size: 18, weight: "700" }),
        ]),
        frame({ layout: "vertical", gap: 2, padding: [8, 16], cornerRadius: "$--radius-md", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, alignItems: "center" }, [
          text("EST. COMMISSION", { size: 10, weight: "600", fill: "$--muted-foreground" }),
          text("€0.00", { size: 16, weight: "700", fill: "#16a34a" }),
        ]),
      ]),
    ]),
    frame(
      {
        layout: "horizontal",
        gap: 20,
        padding: 16,
        cornerRadius: "$--radius-lg",
        fill: "$--card",
        stroke: { type: "color", color: "$--border" },
        strokeWidth: 1,
        width: "fill_container",
      },
      [
        ...[
          ["LOCATOR", "LOC1008"],
          ["GUEST", "Lisa Anderson"],
          ["ROOMTYPE", "Junior Suite"],
          ["CHECK-IN", "15/05/2026"],
          ["NIGHTS", "4 nights"],
        ].map(([label, value], i) =>
          frame({ layout: "vertical", gap: 4, width: i === 1 ? "fill_container" : 108 }, [
            text(label, { size: 10, weight: "600", fill: "$--muted-foreground" }),
            text(value, { size: 13, weight: "600" }),
          ])
        ),
      ]
    ),
    ref("cardBase", {
      width: "fill_container",
      descendants: {
        cardTitle: { content: "configuration" },
        cardDesc: { content: "" },
        cardContent: {
          children: [
            frame({ layout: "vertical", gap: 12, width: "fill_container" }, [
              frame({ layout: "horizontal", gap: 8, alignItems: "center", flexWrap: "wrap", width: "fill_container" }, [
                text("View as:", { size: 13, fill: "$--muted-foreground" }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "List" } } }),
                ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Blocks" } } }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "3D Map View" } } }),
              ]),
              frame({ layout: "horizontal", gap: 16, alignItems: "center", flexWrap: "wrap", width: "fill_container" }, [
                frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
                  text("Segment:", { size: 13, fill: "$--muted-foreground" }),
                  frame(
                    { layout: "horizontal", height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: 180, alignItems: "center" },
                    [text("Loyalty 2 (10%)", { size: 13 })]
                  ),
                ]),
                frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
                  text("Agent:", { size: 13, fill: "$--muted-foreground" }),
                  frame(
                    { layout: "horizontal", height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: 140, alignItems: "center" },
                    [text("Ana García", { size: 13 })]
                  ),
                ]),
              ]),
            ]),
          ],
        },
      },
    }),
    frame({ layout: "horizontal", gap: 16, width: "fill_container", alignItems: "start" }, [
      blocksColumn("Superior Rooms", "Choose from our selection of premium rooms and suites", [
        blocksRoomCard("80s nostalgia unleashed", "80S SUITE", "€480 Total", [
          "King Size Bed",
          "80s Themed Decor",
          "Music System",
        ]),
      ]),
      blocksColumn("Room Customization", "Elevate your stay with premium amenities and luxury upgrades", [
        frame({ layout: "horizontal", gap: 8 }, [
          ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Beds" } } }),
          ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Room Features" } } }),
        ]),
        frame({ layout: "vertical", gap: 8, padding: 12, cornerRadius: "$--radius-lg", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: "fill_container" }, [
          text("2 x Twin Beds", { size: 13, weight: "600" }),
          text("Two separate single beds", { size: 12, fill: "$--muted-foreground" }),
          text("0.00 /night", { size: 12 }),
          ref("btnOutline", { width: "fill_container", descendants: { btnOutlineLabel: { content: "3 available" } } }),
        ]),
      ]),
      blocksColumn("Stay Enhancements", "Enhance your stay with these exclusive offers", [
        frame({ layout: "vertical", gap: 8, padding: 12, cornerRadius: "$--radius-lg", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: "fill_container" }, [
          frame({ layout: "vertical", height: 100, cornerRadius: "$--radius-md", fill: "#cbd5e1", width: "fill_container", padding: 8, alignItems: "end" }, [
            frame({ layout: "horizontal", gap: 4, padding: [4, 8], cornerRadius: 9999, fill: "$--primary" }, [
              icon("star", 12),
              text("Popular", { size: 10, weight: "600", fill: "#ffffff" }),
            ]),
          ]),
          text("All inclusive package", { size: 13, weight: "600" }),
          text("Enjoy unlimited access to all amenities, meals and beverages.", { size: 11, fill: "$--muted-foreground" }),
          frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
            text("€50.00 per person", { size: 13, weight: "700" }),
            frame({ layout: "horizontal", gap: 4, padding: [2, 6], cornerRadius: 9999, fill: "#dcfce7", alignItems: "center" }, [
              icon("coins", 10),
              text("5.00 EUR", { size: 10, weight: "600", fill: "#16a34a" }),
            ]),
          ]),
          frame({ layout: "horizontal", gap: 4, alignItems: "center" }, [
            icon("info", 12),
            text("What's included?", { size: 11, fill: "$--muted-foreground" }),
          ]),
          ref("btnPrimary", { width: "fill_container", descendants: { btnPrimaryLabel: { content: "Book Now" } } }),
        ]),
      ]),
    ]),
    frame({ layout: "vertical", gap: 8, width: "fill_container", padding: [16, 0, 0, 0] }, [
      text("Selection Summary", { size: 18, weight: "600" }),
      text("Review and confirm selected items", { size: 13, fill: "$--muted-foreground" }),
      frame({ layout: "vertical", gap: 8, padding: 24, cornerRadius: "$--radius-lg", fill: "$--muted", width: "fill_container", alignItems: "center" }, [
        text("No items selected", { size: 14, weight: "500" }),
        text("Select rooms and services from the available options", { size: 12, fill: "$--muted-foreground" }),
        text("Total €0.00", { size: 16, weight: "700" }),
      ]),
    ]),
  ]
);

const frontDeskHeaderSummaryOpen = frame(
  {
    id: "frontDeskHeaderSummaryOpen",
    name: "Front Desk Header / Summary Tab",
    reusable: true,
    context: "front-desk-header.tsx · summary_* tab shows guest name before opening details",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space_between",
    height: 61,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { bottom: 1 },
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12 }, [
      icon("panel-left", 20),
      frontDeskTabStrip({ active: "none", includeDynamic: { label: "Kenneth Collins" } }),
    ]),
    agentCommissionWidget("€163.50"),
  ]
);

const statusBanner = frame(
  {
    id: "statusBanner",
    name: "Status Banner",
    reusable: true,
    context: "components/ui/alert.tsx · Blue info banner on front-desk-upsell",
    layout: "horizontal",
    alignItems: "center",
    padding: [10, 16],
    width: "fill_container",
    fill: "#eff6ff",
    stroke: { type: "color", color: "#bfdbfe" },
    strokeWidth: 1,
    cornerRadius: "$--radius-md",
  },
  [text("Showing reservations for the next 7 days (50 reservations)", { size: 13, fill: "#1d4ed8" })]
);

const upsellTableHeader = frame(
  {
    id: "upsellTableHeader",
    name: "Upsell Table Header",
    reusable: true,
    context: "app/ventas/front-desk-upsell · Sortable columns",
    layout: "horizontal",
    alignItems: "center",
    height: 48,
    padding: [0, 16],
    fill: "$--muted",
    width: "fill_container",
  },
  ["Booking ID", "Guest", "A / C / I", "Room Type", "Check-in ↑", "Nights", "Extras"].map((h, i) =>
    tableCol(UPSELL_COL_WIDTHS[i], text(h, { size: 12, weight: "500", fill: "$--muted-foreground" }))
  )
);

const frontDeskReservationsTable = frame(
  {
    id: "frontDeskReservationsTable",
    name: "Front Desk Reservations Table",
    reusable: true,
    context: "app/ventas/front-desk-upsell/page.tsx · Loaded state with sortable columns + extras buttons",
    layout: "vertical",
    width: "fill_container",
    cornerRadius: "$--radius-lg",
    clip: true,
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    ref("upsellTableHeader"),
    ...[
      { locator: "LOC1001", name: "John Smith", email: "john.smith@gmail.com", aci: "2/0/0", roomType: "Doble", checkIn: "18/05/2026", nights: "4", extrasLabel: "2 reserved items", extrasVariant: "ghost" },
      { locator: "LOC1002", name: "Maria Garcia", email: "maria.garcia@hotmail.com", aci: "2/1/0", roomType: "Doble Deluxe", checkIn: "20/05/2026", nights: "3", extrasLabel: "Recommend", extrasVariant: "primary" },
      { locator: "LOC1003", name: "David Wilson", email: "david.wilson@yahoo.com", aci: "1/0/0", roomType: "Junior Suite", checkIn: "19/05/2026", nights: "5", extrasLabel: "Recommend", extrasVariant: "primary" },
      { locator: "LOC1004", name: "Sarah Johnson", email: "sarah.johnson@outlook.com", aci: "3/0/0", roomType: "Doble", checkIn: "21/05/2026", nights: "2", extrasLabel: "5 reserved items", extrasVariant: "ghost" },
      { locator: "LOC1005", name: "Michael Brown", email: "michael.brown@gmail.com", aci: "2/2/0", roomType: "Doble Deluxe", checkIn: "17/05/2026", nights: "6", extrasLabel: "Recommend", extrasVariant: "primary" },
      { locator: "LOC1006", name: "Emma Davis", email: "emma.davis@icloud.com", aci: "2/0/0", roomType: "Doble", checkIn: "22/05/2026", nights: "3", extrasLabel: "3 reserved items", extrasVariant: "ghost" },
    ].map((row) => upsellTableRow(row)),
  ]
);

const frontDeskSuccessToast = frame(
  {
    id: "frontDeskSuccessToast",
    name: "Front Desk Success Toast",
    reusable: true,
    context: "app/ventas/front-desk-upsell · fixed top-center Alert on filter/view change",
    layout: "horizontal",
    gap: 10,
    alignItems: "center",
    padding: [12, 16],
    width: 420,
    cornerRadius: "$--radius-lg",
    fill: "#f0fdf4",
    stroke: { type: "color", color: "#22c55e" },
    strokeWidth: 1,
  },
  [
    icon("circle-check", 16),
    text("Filtering reservations for check-in dates: May 17 – May 22", { size: 13, fill: "#166534" }),
  ]
);

const yearCalendarTable = frame(
  {
    id: "yearCalendarTable",
    name: "Year Calendar Table",
    reusable: true,
    context: "components/year-calendar.tsx · Month × Weekdays/Weekends grid",
    layout: "vertical",
    width: "fill_container",
    cornerRadius: "$--radius-lg",
    clip: true,
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    frame({ layout: "horizontal", padding: [12, 16], fill: "$--muted", width: "fill_container" }, [
      frame({ width: 120 }, [text("Month", { size: 12, weight: "600" })]),
      frame({ width: "fill_container" }, [text("Weekdays", { size: 12, weight: "600" })]),
      frame({ width: "fill_container" }, [text("Weekends", { size: 12, weight: "600" })]),
    ]),
    ...[
      ["January", { label: "Cleaning", sub: "Regular cleaning", color: "#3b82f6" }, { label: "Special Event", sub: "New Year's event", color: "#a855f7" }],
      ["February", null, null],
      ["March", null, null],
      ["April", null, null],
      ["May", null, null],
    ].map(([month, wd, we]) =>
      frame({ layout: "horizontal", padding: 12, stroke: { type: "color", color: "$--border" }, strokeWidth: { bottom: 1 }, width: "fill_container", gap: 12 }, [
        frame({ width: 120, alignItems: "center", layout: "horizontal" }, [text(month, { size: 13, weight: "500" })]),
        frame({ layout: "vertical", gap: 8, width: "fill_container", minHeight: 80 }, [
          wd
            ? frame({ layout: "vertical", gap: 4, padding: 10, cornerRadius: "$--radius-md", fill: wd.color, width: "fill_container" }, [
                text(wd.label, { size: 12, weight: "600", fill: "#ffffff" }),
                text(wd.sub, { size: 11, fill: "#ffffffcc" }),
              ])
            : frame({ layout: "vertical", gap: 8, alignItems: "center", justifyContent: "center", height: 80 }, [
                text("+ Add", { size: 11, fill: "$--muted-foreground" }),
                text("No item", { size: 12, fill: "$--muted-foreground" }),
              ]),
        ]),
        frame({ layout: "vertical", gap: 8, width: "fill_container", minHeight: 80 }, [
          we
            ? frame({ layout: "vertical", gap: 4, padding: 10, cornerRadius: "$--radius-md", fill: we.color, width: "fill_container" }, [
                text(we.label, { size: 12, weight: "600", fill: "#ffffff" }),
                text(we.sub, { size: 11, fill: "#ffffffcc" }),
              ])
            : frame({ layout: "vertical", gap: 8, alignItems: "center", justifyContent: "center", height: 80 }, [
                text("+ Add", { size: 11, fill: "$--muted-foreground" }),
                text("No item", { size: 12, fill: "$--muted-foreground" }),
              ]),
        ]),
      ])
    ),
  ]
);

const equipmentCategoryCard = frame(
  {
    id: "equipmentCategoryCard",
    name: "Equipment Category Card",
    reusable: true,
    context: "app/contenido/atributos · Category grid card with item list",
    layout: "vertical",
    gap: 12,
    padding: 16,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 360,
  },
  [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container" }, [
      frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
        text("Bathroom", { size: 16, weight: "600" }),
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 22, height: 22, cornerRadius: 9999, fill: "$--muted" }, [
          text("3", { size: 11, weight: "500" }),
        ]),
      ]),
      text("Select", { size: 13, weight: "500" }),
    ]),
    ...["Towels", "Hairdryer", "Toiletries"].map((item) =>
      frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container", padding: [6, 0] }, [
        text(item, { size: 13 }),
        icon("trash-2", 14),
      ])
    ),
  ]
);

const kpiCardTrend = frame(
  {
    id: "kpiCardTrend",
    name: "KPI Card with Trend",
    reusable: true,
    context: "app/ventas/sales-analytics · Icon + value + trend badge",
    layout: "vertical",
    gap: 8,
    padding: 20,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 260,
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 8 }, [
      frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 32, height: 32, cornerRadius: "$--radius-md", fill: "#dbeafe" }, [
        icon("users", 16),
      ]),
      text("Total Requests", { size: 13, fill: "$--muted-foreground" }),
    ]),
    text("2,847", { size: 28, weight: "700" }),
    frame({ layout: "horizontal", alignItems: "center", gap: 4, padding: [4, 8], cornerRadius: "$--radius-sm", fill: "$--primary" }, [
      text("↑ +12.5% vs last month", { size: 11, fill: "$--primary-foreground" }),
    ]),
  ]
);

const revenueGoalCard = frame(
  {
    id: "revenueGoalCard",
    name: "Revenue Goal Card",
    reusable: true,
    context: "app/ventas/sales-analytics · Progress toward revenue target",
    layout: "vertical",
    gap: 12,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: "fill_container",
    alignItems: "center",
  },
  [
    text("Revenue Goal", { size: 14, weight: "500" }),
    text("85%", { size: 48, weight: "700" }),
    text("Target achievement", { size: 13, fill: "$--muted-foreground" }),
    frame({ layout: "horizontal", width: "fill_container", height: 12, cornerRadius: 9999, fill: "$--muted", clip: true }, [
      frame({ width: "85%", height: 12, fill: "$--primary" }),
    ]),
    frame({ layout: "horizontal", justifyContent: "space_between", width: "fill_container" }, [
      text("Progress", { size: 12, fill: "$--muted-foreground" }),
      text("$38,908 / $45,750", { size: 12, fill: "$--muted-foreground" }),
    ]),
  ]
);

const addonCardRich = frame(
  {
    id: "addonCardRich",
    name: "Addon Card (full)",
    reusable: true,
    context: "app/addons · Badge + metadata footer + Edit button",
    layout: "vertical",
    gap: 0,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 300,
    clip: true,
  },
  [
    frame({ width: "fill_container", height: 140, fill: "$--muted" }, [
      frame({ layout: "horizontal", justifyContent: "end", padding: 8, width: "fill_container" }, [
        frame({ layout: "horizontal", padding: [2, 8], cornerRadius: "$--radius-sm", fill: "$--secondary" }, [
          text("Extra", { size: 11, weight: "500" }),
        ]),
      ]),
    ]),
    frame({ layout: "vertical", gap: 8, padding: 16, width: "fill_container" }, [
      text("Spa Treatment", { size: 16, weight: "600" }),
      text("Wellness & Spa", { size: 12, fill: "$--muted-foreground" }),
      text("Relaxing spa treatment with professional therapists", { size: 13, fill: "$--muted-foreground" }),
      frame({ layout: "horizontal", justifyContent: "space_between", alignItems: "center", width: "fill_container", padding: [8, 0, 0, 0] }, [
        text("2 email(s)", { size: 11, fill: "$--muted-foreground" }),
        ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Edit" } } }),
      ]),
    ]),
  ]
);

const skeletonTable = frame(
  {
    id: "skeletonTable",
    name: "Skeleton Table",
    reusable: true,
    context: "components/ui/skeleton.tsx · Loading table placeholder",
    layout: "vertical",
    gap: 12,
    padding: 16,
    width: "fill_container",
    cornerRadius: "$--radius-lg",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  Array.from({ length: 8 }, () =>
    frame({ layout: "horizontal", gap: 12, width: "fill_container" }, [
      frame({ width: 60, height: 12, cornerRadius: "$--radius-sm", fill: "$--muted" }),
      frame({ width: "fill_container", height: 12, cornerRadius: "$--radius-sm", fill: "$--muted" }),
      frame({ width: 120, height: 12, cornerRadius: "$--radius-sm", fill: "$--muted" }),
      frame({ width: 80, height: 12, cornerRadius: "$--radius-sm", fill: "$--muted" }),
    ])
  )
);

const ADDON_CATEGORIES = [
  "All Categories",
  "Wellness & Spa",
  "Tours & Activities",
  "Transportation",
  "Food & Beverage",
  "Room Amenities",
  "Business Services",
];

const categorySidebarPanel = frame(
  {
    id: "categorySidebarPanel",
    name: "Category Sidebar Panel",
    reusable: true,
    context: "components/features/addons/addon-category-list.tsx · 7 categories in card",
    layout: "vertical",
    gap: 8,
    padding: 16,
    width: 240,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    text("Categories", { size: 14, weight: "600" }),
    ...ADDON_CATEGORIES.map((cat, i) =>
      frame(
        {
          layout: "horizontal",
          alignItems: "center",
          height: 36,
          padding: [0, 12],
          cornerRadius: "$--radius-md",
          fill: i === 0 ? "$--accent" : "$--background",
          width: "fill_container",
        },
        [text(cat, { size: 14, weight: i === 0 ? "500" : "400" })]
      )
    ),
  ]
);

const addonCardPricing = frame(
  {
    id: "addonCardPricing",
    name: "Addon Card / Pricing",
    reusable: true,
    context: "app/addons-pricing · Click to manage pricing footer",
    layout: "vertical",
    gap: 0,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 300,
    clip: true,
  },
  [
    frame({ width: "fill_container", height: 140, fill: "$--muted" }, [
      frame({ layout: "horizontal", justifyContent: "end", padding: 8, width: "fill_container" }, [
        frame({ layout: "horizontal", padding: [2, 8], cornerRadius: "$--radius-sm", fill: "$--secondary" }, [
          text("Extra", { size: 11, weight: "500" }),
        ]),
      ]),
    ]),
    frame({ layout: "vertical", gap: 8, padding: 16, width: "fill_container" }, [
      text("Spa Treatment", { size: 16, weight: "600" }),
      text("Wellness & Spa", { size: 12, fill: "$--muted-foreground" }),
      text("Relaxing spa treatment with professional therapists", { size: 13, fill: "$--muted-foreground" }),
      text("Click to manage pricing", { size: 11, fill: "$--muted-foreground" }),
    ]),
  ]
);

const addonCardExperience = frame(
  {
    id: "addonCardExperience",
    name: "Addon Card / Experience",
    reusable: true,
    context: "app/addons · type=experience · black badge + Has link",
    layout: "vertical",
    gap: 0,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 300,
    clip: true,
  },
  [
    frame({ width: "fill_container", height: 140, fill: "$--muted" }, [
      frame({ layout: "horizontal", justifyContent: "end", padding: 8, width: "fill_container" }, [
        frame({ layout: "horizontal", padding: [2, 8], cornerRadius: "$--radius-sm", fill: "$--primary" }, [
          text("Experience", { size: 11, weight: "500", fill: "$--primary-foreground" }),
        ]),
      ]),
    ]),
    frame({ layout: "vertical", gap: 8, padding: 16, width: "fill_container" }, [
      text("City Tour", { size: 16, weight: "600" }),
      text("Tours & Activities", { size: 12, fill: "$--muted-foreground" }),
      text("Guided tour around the city's main attractions", { size: 13, fill: "$--muted-foreground" }),
      frame({ layout: "horizontal", justifyContent: "space_between", alignItems: "center", width: "fill_container", padding: [8, 0, 0, 0] }, [
        text("Has link", { size: 11, fill: "$--muted-foreground" }),
        ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Edit" } } }),
      ]),
    ]),
  ]
);

const bandsTable = frame(
  {
    id: "bandsTable",
    name: "Bands Table",
    reusable: true,
    context: "components/bands-table.tsx · Search + sortable Name/Description + row menu",
    layout: "vertical",
    width: "fill_container",
    cornerRadius: "$--radius-lg",
    clip: true,
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", padding: 16, width: "fill_container" }, [
      frame({ layout: "horizontal", alignItems: "center", gap: 8, width: 280, height: 40, padding: [0, 12], cornerRadius: "$--radius-md", stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }, [
        icon("search", 14, "bandsSearchIcon"),
        text("Search bands...", { size: 14, fill: "$--muted-foreground" }),
      ]),
      text("5 bands", { size: 13, fill: "$--muted-foreground" }),
    ]),
    frame({ layout: "horizontal", padding: [0, 16], height: 44, fill: "$--muted", width: "fill_container", alignItems: "center" }, [
      frame({ width: "fill_container" }, [text("Name ↑", { size: 12, weight: "600" })]),
      frame({ width: "fill_container" }, [text("Description", { size: 12, weight: "600" })]),
      frame({ width: 80 }, [text("Actions", { size: 12, weight: "600" })]),
    ]),
    ...[
      ["business", "specializedAddonsPackage"],
      ["family", "familyFriendlyAddonsPackage"],
      ["luxury", "comprehensiveAddonsPackage"],
      ["premium", "enhancedAddonsPackage"],
      ["standard", "basicAddonsPackage"],
    ].map(([name, desc]) =>
      frame(
        {
          layout: "horizontal",
          alignItems: "center",
          height: 52,
          padding: [0, 16],
          stroke: { type: "color", color: "$--border" },
          strokeWidth: { bottom: 1 },
          width: "fill_container",
        },
        [
          frame({ width: "fill_container" }, [text(name, { size: 14, weight: "500" })]),
          frame({ width: "fill_container" }, [text(desc, { size: 14, fill: "$--muted-foreground" })]),
          frame({ width: 80, layout: "horizontal", justifyContent: "end" }, [icon("chevron-down", 16)]),
        ]
      )
    ),
  ]
);

const exceptionsTable = frame(
  {
    id: "exceptionsTable",
    name: "Exceptions Table",
    reusable: true,
    context: "components/exceptions-manager.tsx · Calendar exceptions tab",
    layout: "vertical",
    width: "fill_container",
    cornerRadius: "$--radius-lg",
    clip: true,
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
  },
  [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", padding: 16, width: "fill_container" }, [
      text("Exceptions", { size: 16, weight: "600" }),
      ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "+ Add Exception" } } }),
    ]),
    frame({ layout: "horizontal", padding: [0, 16], height: 44, fill: "$--muted", width: "fill_container", alignItems: "center" }, [
      frame({ width: 100 }, [text("From", { size: 12, weight: "600" })]),
      frame({ width: 100 }, [text("To", { size: 12, weight: "600" })]),
      frame({ width: "fill_container" }, [text("Name", { size: 12, weight: "600" })]),
      frame({ width: 120 }, [text("Type", { size: 12, weight: "600" })]),
      frame({ width: 80 }, [text("Actions", { size: 12, weight: "600" })]),
    ]),
    frame({ layout: "horizontal", alignItems: "center", height: 52, padding: [0, 16], stroke: { type: "color", color: "$--border" }, strokeWidth: { bottom: 1 }, width: "fill_container" }, [
      frame({ width: 100 }, [text("May", { size: 13 })]),
      frame({ width: 100 }, [text("September", { size: 13 })]),
      frame({ width: "fill_container" }, [text("Summer Schedule", { size: 13, weight: "500" })]),
      frame({ width: 120 }, [
        frame({ layout: "horizontal", padding: [2, 8], cornerRadius: "$--radius-sm", fill: "#3b82f6" }, [
          text("Cleaning", { size: 11, weight: "500", fill: "#ffffff" }),
        ]),
      ]),
      frame({ width: 80, layout: "horizontal", gap: 4 }, [icon("pencil", 14), icon("trash-2", 14)]),
    ]),
    frame({ layout: "horizontal", alignItems: "center", height: 52, padding: [0, 16], width: "fill_container" }, [
      frame({ width: 100 }, [text("November", { size: 13 })]),
      frame({ width: 100 }, [text("December", { size: 13 })]),
      frame({ width: "fill_container" }, [text("Holiday Schedule", { size: 13, weight: "500" })]),
      frame({ width: 120 }, [
        frame({ layout: "horizontal", padding: [2, 8], cornerRadius: "$--radius-sm", fill: "#a855f7" }, [
          text("Special Event", { size: 11, weight: "500", fill: "#ffffff" }),
        ]),
      ]),
      frame({ width: 80, layout: "horizontal", gap: 4 }, [icon("pencil", 14), icon("trash-2", 14)]),
    ]),
  ]
);

const callCenterHeader = frame(
  {
    id: "callCenterHeader",
    name: "Call Center Header",
    reusable: true,
    context: "components/layout/call-center-header.tsx · Tabs: Call Center / Dashboard",
    layout: "horizontal",
    alignItems: "center",
    height: 61,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { bottom: 1 },
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 16 }, [
      icon("panel-left", 20),
      ref("tabsList", { width: 280, descendants: { tabLabel1: { content: "Call Center" }, tabLabel2: { content: "Dashboard" } } }),
    ]),
  ]
);

const loadingSpinner = frame(
  {
    id: "loadingSpinner",
    name: "Loading Spinner",
    reusable: true,
    context: "components/shared/loading-spinner.tsx · Centered loading state",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    width: "fill_container",
    height: 120,
    gap: 12,
  },
  [
    frame({ width: 24, height: 24, cornerRadius: 9999, stroke: { type: "color", color: "$--border" }, strokeWidth: 3 }),
    text("Loading...", { size: 14, fill: "$--muted-foreground" }),
  ]
);

const reservationSummaryModal = frame(
  {
    id: "reservationSummaryModal",
    name: "Reservation Summary Modal",
    reusable: true,
    context: "components/features/reservations/reservation-summary-modal.tsx",
    layout: "vertical",
    gap: 16,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 520,
    effect: { type: "shadow", shadowType: "outer", blur: 24, offset: { x: 0, y: 8 }, color: "#00000040" },
  },
  [
    frame({ layout: "horizontal", justifyContent: "space_between", width: "fill_container" }, [
      text("Reservation Summary", { size: 18, weight: "600" }),
      icon("x", 16),
    ]),
    frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
      ...[
        ["Locator", "HV-2847"],
        ["Guest", "Maria García"],
        ["Room", "Deluxe Ocean View"],
        ["Check-in", "2026-07-15"],
        ["Nights", "5"],
      ].map(([k, v]) =>
        frame({ layout: "horizontal", justifyContent: "space_between", width: "fill_container" }, [
          text(k, { size: 13, fill: "$--muted-foreground" }),
          text(v, { size: 13, weight: "500" }),
        ])
      ),
    ]),
    frame({ layout: "horizontal", gap: 8, justifyContent: "end", width: "fill_container" }, [
      ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Close" } } }),
      ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "View Details" } } }),
    ]),
  ]
);

const reservationSummaryTabContent = frame(
  {
    id: "reservationSummaryTabContent",
    name: "Reservation Summary Tab",
    reusable: true,
    context:
      "requested-items-view.tsx · summary_* TabsContent inline · Rooms/Extras/Bidding tables + action footer",
    layout: "vertical",
    gap: 20,
    padding: [16, 24, 24, 24],
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12 }, [
      frame({ layout: "horizontal", alignItems: "center", gap: 8, height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--primary" }, [
        icon("arrow-left", 16),
        text("Back", { size: 13, weight: "500", fill: "#ffffff" }),
      ]),
      text("Request Summary", { size: 24, weight: "700" }),
    ]),
    frame({ layout: "horizontal", justifyContent: "space_between", width: "fill_container", gap: 16 }, [
      frame(
        {
          layout: "horizontal",
          gap: 24,
          padding: 16,
          cornerRadius: "$--radius-lg",
          fill: "$--card",
          stroke: { type: "color", color: "$--border" },
          strokeWidth: 1,
          width: "fill_container",
        },
        [
          ...[
            ["LOCATOR", "LOC1041"],
            ["GUEST", "Kenneth Collins"],
            ["ROOM TYPE", "Junior Suite"],
            ["CHECK-IN", "15/05/2026"],
            ["REQUEST DATE", "15/05/2026"],
          ].map(([label, value], i) =>
            frame({ layout: "vertical", gap: 4, width: i === 1 ? "fill_container" : 108 }, [
              text(label, { size: 10, weight: "600", fill: "$--muted-foreground" }),
              text(value, { size: 13, weight: "600" }),
            ])
          ),
        ]
      ),
      frame({ layout: "horizontal", gap: 12 }, [
        frame({ layout: "vertical", gap: 4, padding: [12, 20], cornerRadius: "$--radius-lg", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, alignItems: "center" }, [
          text("TOTAL ORDER", { size: 10, weight: "600", fill: "$--muted-foreground" }),
          text("€1146", { size: 22, weight: "700" }),
        ]),
        frame({ layout: "vertical", gap: 4, padding: [12, 20], cornerRadius: "$--radius-lg", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, alignItems: "center" }, [
          text("EST. COMMISSION", { size: 10, weight: "600", fill: "$--muted-foreground" }),
          frame({ layout: "horizontal", gap: 4, alignItems: "center" }, [
            frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 20, height: 20, cornerRadius: 9999, fill: "#dcfce7" }, [
              icon("coins", 12),
            ]),
            text("€114.60", { size: 18, weight: "700", fill: "#16a34a" }),
          ]),
        ]),
      ]),
    ]),
    frame(
      {
        layout: "horizontal",
        gap: 16,
        padding: 16,
        cornerRadius: "$--radius-lg",
        fill: "$--muted",
        width: "fill_container",
        alignItems: "center",
      },
      [
        frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
          frame({ width: 8, height: 8, cornerRadius: 9999, fill: "#22c55e" }),
          text("3 confirmed", { size: 13, weight: "500" }),
        ]),
        frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
          frame({ width: 8, height: 8, cornerRadius: 9999, fill: "#f59e0b" }),
          text("2 Pending Hotel", { size: 13, weight: "500" }),
        ]),
        frame({ layout: "horizontal", gap: 6, alignItems: "center", width: "fill_container", justifyContent: "end" }, [
          icon("package", 16),
          text("5 total services", { size: 13, fill: "$--muted-foreground" }),
        ]),
      ]
    ),
    summaryItemsCard("Room", "user", "#2563eb", 1, ["Agents", "Commission", "Room Type", "Status"], ["Maria Thompson", "84 EUR", "Junior Suite", "confirmed"]),
    summaryItemsCard("Extra", "dollar-sign", "#16a34a", 3, ["Agents", "Commission", "Extras", "Status"], ["Maria Thompson", "14.4 EUR", "Wine Tasting", "confirmed"]),
    summaryItemsCard("Bidding", "calendar", "#9333ea", 2, ["Agents", "Preference", "Status", "Amount"], ["Maria Thompson", "Ocean View", "Pending Hotel", "€25.00"]),
    frame(
      {
        layout: "horizontal",
        alignItems: "center",
        justifyContent: "space_between",
        padding: 20,
        cornerRadius: "$--radius-lg",
        width: "fill_container",
        stroke: { type: "color", color: "$--border" },
        strokeWidth: 1,
        fill: "$--muted",
      },
      [
        frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
          frame({ width: 8, height: 8, cornerRadius: 9999, fill: "$--muted-foreground" }),
          text("Last update: 5 minutes ago", { size: 13, fill: "$--muted-foreground" }),
        ]),
        frame({ layout: "horizontal", gap: 8 }, [
          frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 36, height: 36, cornerRadius: "$--radius-md", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, fill: "$--background" }, [
            icon("refresh-cw", 16),
          ]),
          frame({ layout: "horizontal", alignItems: "center", gap: 6, height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--primary" }, [
            icon("sparkles", 16),
            text("Recommend", { size: 13, weight: "500", fill: "#ffffff" }),
          ]),
          frame({ layout: "horizontal", alignItems: "center", gap: 6, height: 36, padding: [0, 12], cornerRadius: "$--radius-md", fill: "$--primary" }, [
            icon("settings-2", 16),
            text("Manage order", { size: 13, weight: "500", fill: "#ffffff" }),
          ]),
        ]),
      ]
    ),
  ]
);

const callCenterDateRangeDialog = frame(
  {
    id: "callCenterDateRangeDialog",
    name: "Call Center Date Range Dialog",
    reusable: true,
    context: "view-mode-buttons.tsx · Call Center mode opens date range picker dialog",
    layout: "vertical",
    gap: 16,
    padding: 24,
    cornerRadius: "$--radius-lg",
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 560,
    effect: { type: "shadow", shadowType: "outer", blur: 24, offset: { x: 0, y: 8 }, color: "#00000040" },
  },
  [
    frame({ layout: "horizontal", justifyContent: "space_between", width: "fill_container" }, [
      text("Select Check-in Date Range", { size: 18, weight: "600" }),
      icon("x", 16),
    ]),
    text("May 17, 2026 – May 22, 2026", { size: 13, fill: "$--muted-foreground" }),
    frame({ layout: "horizontal", gap: 12, width: "fill_container", height: 200, cornerRadius: "$--radius-md", fill: "$--muted", alignItems: "center", justifyContent: "center" }, [
      text("Dual-month calendar picker", { size: 13, fill: "$--muted-foreground" }),
    ]),
    frame({ layout: "horizontal", gap: 8, justifyContent: "end", width: "fill_container" }, [
      ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Cancel" } } }),
      ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Apply Date Range" } } }),
    ]),
  ]
);

const appSidebar = frame(
  {
    id: "appSidebar",
    name: "App Sidebar",
    reusable: true,
    context: "components/layout/app-sidebar.tsx · Main navigation shell",
    layout: "vertical",
    width: 256,
    height: "fill_container",
    fill: "$--sidebar",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { top: 0, right: 1, bottom: 0, left: 0 },
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 12, padding: 16, width: "fill_container", stroke: { type: "color", color: "$--border" }, strokeWidth: { bottom: 1 } }, [
      frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 36, height: 36, cornerRadius: "$--radius-lg", fill: "$--foreground" }, [
        text("H", { size: 18, weight: "700", fill: "$--background" }),
      ]),
      frame({ layout: "vertical", gap: 2 }, [
        text("Hotelverse", { size: 16, weight: "600" }),
        text("Sales", { size: 12, fill: "$--muted-foreground" }),
      ]),
    ]),
    frame({ id: "sidebarNav", name: "SidebarNav", layout: "vertical", gap: 2, padding: 8, width: "fill_container" }, [
      navRow("Home", "home", { active: false }),
      navRow("Admin", "file-text", { disabled: true }),
      navRow("Masters", "database", { disabled: true }),
      navRow("Initial Price Config.", "trending-up", { disabled: true }),
      navRow("Sales", "book-open", { chevron: "chevron-down" }),
      navRow("Call Center", "phone", { sub: true, active: false }),
      navRow("Front Desk Upsell", "users", { sub: true, active: true }),
      navRow("Request Management", "clipboard-list", { sub: true }),
      navRow("Sales Analytics", "bar-chart-3", { sub: true }),
      navRow("Users & Commissions", "user-check", { sub: true }),
      frame({ layout: "vertical", gap: 4, padding: [8, 12, 0, 12], width: "fill_container" }, [
        text("HOTELVERSE BEACH", { size: 10, weight: "600", fill: "$--muted-foreground" }),
      ]),
      navRow("Hotel", "building-2", { disabled: true }),
      navRow("Map", "map", { disabled: true }),
      navRow("Management", "clipboard-list", { chevron: "chevron-right" }),
      navRow("Content", "image", { chevron: "chevron-down" }),
      navRow("Atributos", "file-text", { sub: true }),
      navRow("Extras", "file-text", { sub: true, active: false }),
      navRow("Pricing", "dollar-sign", { chevron: "chevron-down" }),
      navRow("Room Pricing", "file-text", { sub: true }),
      navRow("Extras Pricing", "file-text", { sub: true }),
      navRow("Segmentos", "file-text", { sub: true }),
    ]),
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", padding: 16, width: "fill_container", stroke: { type: "color", color: "$--border" }, strokeWidth: { top: 1 } }, [
      icon("sun", 16),
      frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", height: 24, padding: [0, 8], cornerRadius: "$--radius-sm", fill: "$--muted" }, [
        text("ES", { size: 12, weight: "500", fill: "$--muted-foreground" }),
      ]),
      ref("btnGhost"),
    ]),
  ]
);

const appHeader = frame(
  {
    id: "appHeader",
    name: "App Header",
    reusable: true,
    context: "components/layout/app-header.tsx · Page title + action slot",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space_between",
    height: 61,
    padding: [0, 16],
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: { bottom: 1 },
    width: "fill_container",
  },
  [
    frame({ layout: "horizontal", alignItems: "center", gap: 16 }, [
      icon("panel-left", 20),
      { ...text("Page Title", { size: 18, weight: "600" }), id: "headerTitle" },
    ]),
    frame({ id: "headerActions", name: "HeaderActions", layout: "horizontal", gap: 8, slot: ["btnPrimary", "btnOutline"] }, []),
  ]
);

const avatarBase = frame(
  {
    id: "avatarBase",
    name: "Avatar",
    reusable: true,
    context: "components/ui/avatar.tsx · User initials in lists",
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    cornerRadius: 9999,
    fill: "$--muted",
  },
  [text("MR", { size: 14, weight: "500" })]
);

const addonCard = frame(
  {
    id: "addonCard",
    name: "Addon Card",
    reusable: true,
    context: "Pattern · Addon grid tile · app/addons, addons-pricing pages",
    layout: "vertical",
    gap: 12,
    cornerRadius: "$--radius-lg",
    fill: "$--card",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    width: 260,
    clip: true,
  },
  [
    frame({ width: "fill_container", height: 140, fill: "$--muted" }, [
      frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: "fill_container", height: "fill_container" }, [
        icon("image", 32),
      ]),
    ]),
    frame({ layout: "vertical", gap: 4, padding: 16, width: "fill_container" }, [
      { ...text("Spa Treatment", { size: 16, weight: "600" }), id: "addonTitle" },
      text("Relaxing spa treatment...", { size: 13, fill: "$--muted-foreground" }),
    ]),
  ]
);

// Fix tableRow badge ref - use inline badge instead
tableRow.children[5] = frame({ width: "fill_container" }, [
  frame({ layout: "horizontal", alignItems: "center", height: 22, padding: [0, 8], cornerRadius: "$--radius-md", fill: "$--secondary" }, [
    text("Confirmed", { size: 12, weight: "500" }),
  ]),
]);

// Fix sidebar first item
sidebarItem.children[0] = icon("home", 16);
sidebarItem.children[1] = text("Inicio", { size: 14, weight: "500" });

function appShell(screenName, contentChildren, headerTitle, headerActions = []) {
  const headerDescendants = { headerTitle: { content: headerTitle } };
  if (headerActions.length) headerDescendants.headerActions = { children: headerActions };
  return frame(
    {
      name: screenName,
      layout: "horizontal",
      width: 1440,
      height: 900,
      fill: "$--background",
      clip: true,
    },
    [
      ref("appSidebar"),
      frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
        ref("appHeader", { descendants: headerDescendants }),
        frame({ layout: "vertical", gap: 24, padding: 32, width: "fill_container", height: "fill_container" }, contentChildren),
      ]),
    ]
  );
}

// ─── Screens ────────────────────────────────────────────────────────────────

const screenHome = appShell("Screen / Home", [
  frame({ layout: "horizontal", gap: 24, width: "fill_container" }, [
    ref("statCard", { width: "fill_container", descendants: { statLabel: { content: "Quick Stats" }, statValue: { content: "—" }, statHint: { content: "Overview of hotel operations" } } }),
    ref("statCard", { width: "fill_container", descendants: { statLabel: { content: "Recent Activity" }, statValue: { content: "—" }, statHint: { content: "Latest updates" } } }),
    ref("statCard", { width: "fill_container", descendants: { statLabel: { content: "System Status" }, statValue: { content: "OK" }, statHint: { content: "All systems operational" } } }),
  ]),
], "Welcome to Hotelverse");

const screenCallCenter = frame(
  { name: "Screen / Call Center", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("callCenterHeader"),
      frame({ layout: "vertical", alignItems: "center", justifyContent: "center", width: "fill_container", height: "fill_container", padding: 32 }, [
        ref("cardBase", {
          width: 420,
          descendants: {
            cardTitle: { content: "chooseYourRoom" },
            cardDesc: { content: "createNewRequest" },
            cardContent: {
              children: [
                frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
                  text("Hotel", { size: 14, weight: "500" }),
                  ref("selectTrigger", { width: "fill_container", descendants: {} }),
                ]),
                frame({ layout: "vertical", gap: 8, width: "fill_container" }, [
                  text("segment", { size: 14, weight: "500" }),
                  ref("selectTrigger", { width: "fill_container" }),
                ]),
                frame({ layout: "horizontal", gap: 16, width: "fill_container", padding: [16, 0, 0, 0] }, [
                  ref("btnOutline", { width: "fill_container", descendants: { btnOutlineLabel: { content: "cancel" } } }),
                  ref("btnPrimary", { width: "fill_container", descendants: { btnPrimaryLabel: { content: "start" } } }),
                ]),
              ],
            },
          },
        }),
      ]),
    ]),
  ]
);

const screenGestionSolicitudes = frame(
  { name: "Screen / Gestión Solicitudes", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", { descendants: { headerTitle: { content: "Request Management" } } }),
      frame({ layout: "vertical", gap: 16, padding: 32, width: "fill_container", height: "fill_container" }, [
        text("Request Management", { size: 24, weight: "700" }),
        ref("inputBase", { width: 360 }),
        frame(
          {
            layout: "vertical",
            width: "fill_container",
            height: 400,
            cornerRadius: "$--radius-lg",
            stroke: { type: "color", color: "$--border" },
            strokeWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          },
          [ref("loadingSpinner")]
        ),
      ]),
    ]),
  ]
);

const screenUsuariosComisiones = appShell("Screen / Usuarios y Comisiones", [
  frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
    ref("statCard", { width: "fill_container" }),
    ref("statCard", { width: "fill_container", descendants: { statLabel: { content: "Active Agents" }, statValue: { content: "6" }, statHint: { content: "Sales team members" } } }),
    ref("statCard", { width: "fill_container", descendants: { statLabel: { content: "Avg. Conversion" }, statValue: { content: "54.8%" }, statHint: { content: "+3.2% improvement" } } }),
  ]),
  ref("cardBase", {
    width: "fill_container",
    descendants: {
      cardTitle: { content: "Usuarios y Comisiones" },
      cardDesc: { content: "" },
      cardContent: {
        children: [1, 2, 3].map((n) =>
          frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", padding: 16, cornerRadius: "$--radius-lg", fill: "$--card", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: "fill_container" }, [
            frame({ layout: "horizontal", alignItems: "center", gap: 16 }, [
              ref("badgeDefault", { descendants: { badgeDefaultLabel: { content: `#${n}` } } }),
              ref("avatarBase"),
              frame({ layout: "vertical", gap: 2 }, [
                text(["Maria Rodriguez", "Carlos Martinez", "Ana Garcia"][n - 1], { size: 14, weight: "500" }),
                text("Sales: €45,230 · Conv: 62%", { size: 13, fill: "$--muted-foreground" }),
              ]),
            ]),
            frame({ layout: "vertical", gap: 2, alignItems: "end" }, [
              text("€4,523", { size: 16, weight: "600" }),
              text("Commission", { size: 12, fill: "$--muted-foreground" }),
            ]),
          ])
        ),
      },
    },
  }),
], "Usuarios y Comisiones");

const screenSalesAnalytics = frame(
  { name: "Screen / Sales Analytics", layout: "vertical", width: 1440, height: 900, fill: "$--background", clip: true, padding: 32, gap: 24 },
  [
    frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container" }, [
      frame({ layout: "vertical", gap: 4 }, [
        text("Sales Analytics", { size: 36, weight: "700" }),
        text("Comprehensive sales performance overview", { size: 14, fill: "$--muted-foreground" }),
      ]),
      frame({ layout: "horizontal", gap: 8 }, [
        ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Refresh" } } }),
        ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Export" } } }),
      ]),
    ]),
    ref("cardBase", {
      width: "fill_container",
      descendants: {
        cardTitle: { content: "Filters" },
        cardDesc: { content: "" },
        cardContent: {
          children: [
            frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
              frame({ layout: "vertical", gap: 8, width: "fill_container" }, [text("Check-in", { size: 14, weight: "500" }), ref("btnOutline", { width: "fill_container" })]),
              frame({ layout: "vertical", gap: 8, width: "fill_container" }, [text("Agent", { size: 14, weight: "500" }), ref("selectTrigger")]),
              frame({ layout: "vertical", gap: 8, width: "fill_container" }, [text("Product", { size: 14, weight: "500" }), ref("selectTrigger")]),
              frame({ layout: "vertical", gap: 8, width: "fill_container" }, [text("Date Range", { size: 14, weight: "500" }), ref("selectTrigger")]),
            ]),
          ],
        },
      },
    }),
    ref("tabsList", { width: 480, descendants: { tabLabel1: { content: "Revenue" }, tabLabel2: { content: "Management" }, tabLabel3: { content: "Commission" } } }),
    frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
      ref("kpiCardTrend"),
      ref("kpiCardTrend", { descendants: {} }),
      ref("kpiCardTrend", { descendants: {} }),
      ref("kpiCardTrend", { descendants: {} }),
    ]),
    ref("revenueGoalCard"),
  ]
);

const screenAddons = frame(
  { name: "Screen / Addons", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", {
        descendants: {
          headerTitle: { content: "Addons Management" },
          headerActions: { children: [ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "+ Create Addon" } } })] },
        },
      }),
      frame({ layout: "horizontal", gap: 24, padding: 32, width: "fill_container", height: "fill_container" }, [
        ref("categorySidebarPanel"),
        frame({ layout: "vertical", gap: 16, width: "fill_container" }, [
          frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
            ref("addonCardRich"),
            ref("addonCardExperience"),
            ref("addonCardRich"),
          ]),
          frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
            ref("addonCardPricing"),
            ref("addonCardRich"),
          ]),
        ]),
      ]),
    ]),
  ]
);

const screenAddonsPricing = frame(
  { name: "Screen / Addons Pricing", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", { descendants: { headerTitle: { content: "addonsPricing" } } }),
      frame({ layout: "horizontal", gap: 24, padding: 32, width: "fill_container", height: "fill_container" }, [
        ref("categorySidebarPanel"),
        frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
          ref("addonCardPricing"),
          ref("addonCardPricing"),
          ref("addonCardPricing"),
        ]),
      ]),
    ]),
  ]
);

const screenCalendar = frame(
  { name: "Screen / Calendar", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", { descendants: { headerTitle: { content: "Calendar Management" } } }),
      frame({ layout: "vertical", gap: 24, padding: 32, width: "fill_container", height: "fill_container" }, [
        ref("tabsList", { width: 360, descendants: { tabLabel1: { content: "Year Calendar" }, tabLabel2: { content: "Exceptions" } } }),
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container" }, [
          text("Year Calendar", { size: 18, weight: "600" }),
          ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Save Changes" } } }),
        ]),
        ref("yearCalendarTable"),
      ]),
    ]),
  ]
);

const screenAtributos = frame(
  { name: "Screen / Atributos", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", { descendants: { headerTitle: { content: "Attributes Management" } } }),
      frame({ layout: "vertical", gap: 16, padding: 32, width: "fill_container", height: "fill_container" }, [
        ref("tabsList", { width: 400, descendants: { tabLabel1: { content: "Equipment Categories" }, tabLabel2: { content: "Translations" } } }),
        frame({ layout: "horizontal", gap: 12, width: "fill_container" }, [
          ref("selectTrigger", { width: 220 }),
          ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Cancel" } } }),
          ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Save" } } }),
        ]),
        frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
          ref("equipmentCategoryCard"),
          ref("equipmentCategoryCard", { descendants: {} }),
          ref("equipmentCategoryCard", { descendants: {} }),
        ]),
      ]),
    ]),
  ]
);

const screenFrontDeskUpsell = frame(
  { name: "Screen / Front Desk Upsell", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("frontDeskHeader"),
      frame({ layout: "vertical", gap: 16, padding: 24, width: "fill_container", height: "fill_container" }, [
        ref("statusBanner"),
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container" }, [
          ref("inputBase", {
            width: 320,
            descendants: { inputPlaceholder: { content: "Search by locator or name..." } },
          }),
          ref("viewModeButtons"),
        ]),
        ref("frontDeskReservationsTable"),
      ]),
    ]),
  ]
);

const screenFrontDeskUpsellLoading = frame(
  { name: "Screen / Front Desk — Loading", layout: "horizontal", width: 1440, height: 600, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("frontDeskHeader"),
      frame({ layout: "vertical", gap: 16, padding: 24, width: "fill_container", height: "fill_container" }, [
        ref("statusBanner", { descendants: {} }),
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "space_between", width: "fill_container" }, [
          ref("inputBase", { width: 320 }),
          ref("viewModeButtons"),
        ]),
        frame({ layout: "vertical", width: "fill_container", cornerRadius: "$--radius-md", clip: true, stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }, [
          ref("upsellTableHeader"),
          frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", height: 120, width: "fill_container" }, [
            text("Loading orders...", { size: 14, fill: "$--muted-foreground" }),
          ]),
        ]),
      ]),
    ]),
  ]
);

const screenFrontDeskCallCenterFilter = frame(
  { name: "Screen / Front Desk — Call Center Filter", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("frontDeskHeader"),
      frame({ layout: "vertical", gap: 16, padding: 24, width: "fill_container", height: "fill_container", alignItems: "center" }, [
        ref("frontDeskSuccessToast"),
        frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: "fill_container", height: "fill_container" }, [
          ref("callCenterDateRangeDialog"),
        ]),
      ]),
    ]),
  ]
);

const screenFrontDeskReservationOpen = frame(
  {
    name: "Screen / Front Desk — Blocks / Recommend",
    layout: "horizontal",
    width: 1440,
    height: 1280,
    fill: "$--background",
    clip: false,
  },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("frontDeskHeaderDetailsOpen"),
      ref("reservationDetailsBlocksContent"),
    ]),
  ]
);

const screenFrontDeskSummaryOpen = frame(
  {
    name: "Screen / Front Desk — Summary Tab",
    layout: "horizontal",
    width: 1440,
    height: 1100,
    fill: "$--background",
    clip: true,
  },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("frontDeskHeaderSummaryOpen"),
      frame({ layout: "vertical", width: "fill_container", height: "fill_container", clip: true }, [
        ref("reservationSummaryTabContent"),
      ]),
    ]),
  ]
);

const screenAddonsBands = frame(
  { name: "Screen / Addons Bands", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", {
        descendants: {
          headerTitle: { content: "addonsBands" },
          headerActions: { children: [ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "+ addBand" } } })] },
        },
      }),
      frame({ padding: 32, width: "fill_container", height: "fill_container" }, [ref("bandsTable")]),
    ]),
  ]
);

const screenCalendarExceptions = frame(
  { name: "Screen / Calendar — Exceptions Tab", layout: "horizontal", width: 1440, height: 600, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      ref("appHeader", { descendants: { headerTitle: { content: "calendarManagement" } } }),
      frame({ layout: "vertical", gap: 16, padding: 32, width: "fill_container" }, [
        ref("tabsList", { width: 360, descendants: { tabLabel1: { content: "yearCalendar" }, tabLabel2: { content: "exceptions" } } }),
        ref("exceptionsTable"),
      ]),
    ]),
  ]
);

const screenMgmtFrontDesk = frame(
  { name: "Screen / Management Front Desk", layout: "horizontal", width: 1440, height: 900, fill: "$--background", clip: true },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
      frame({ layout: "vertical", gap: 8, padding: 32, width: "fill_container" }, [
        text("Front Desk", { size: 30, weight: "700" }),
        text("Manage your guests room requests", { size: 14, fill: "$--muted-foreground" }),
      ]),
      frame({ padding: [0, 32, 32, 32], width: "fill_container", height: "fill_container" }, [
        ref("skeletonTable"),
      ]),
    ]),
  ]
);

const screenDatePickerDemo = frame(
  {
    name: "Screen / Date Picker Demo",
    layout: "horizontal",
    width: 1440,
    height: 900,
    fill: "$--background",
    clip: true,
  },
  [
    ref("appSidebar"),
    frame({ layout: "vertical", width: "fill_container", height: "fill_container", padding: 32, gap: 24 }, [
      frame({ layout: "vertical", gap: 8 }, [
        text("Date Range Picker & Simulation Demo", { size: 30, weight: "700" }),
        text("Interactive components for selecting date ranges and simulation parameters", {
          size: 14,
          fill: "$--muted-foreground",
        }),
      ]),
      ref("cardBase", {
        width: "fill_container",
        descendants: {
          cardTitle: { content: "View Mode Buttons" },
          cardDesc: { content: "Click on 'Call Center' to open date range picker or 'Simulation' for the full form" },
          cardContent: {
            children: [
              frame({ layout: "horizontal", gap: 8 }, [
                ref("btnPrimary", { descendants: { btnPrimaryLabel: { content: "Check In" } } }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Call Center" } } }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "In-Stay" } } }),
                ref("btnOutline", { descendants: { btnOutlineLabel: { content: "Simulation" } } }),
              ]),
            ],
          },
        },
      }),
      ref("cardBase", {
        width: "fill_container",
        descendants: {
          cardTitle: { content: "Standalone Date Range Picker" },
          cardDesc: { content: "A reusable date range picker component with automatic closing and night count display" },
          cardContent: {
            children: [
              ref("dateRangePicker", { descendants: {} }),
            ],
          },
        },
      }),
      ref("cardBase", {
        width: "fill_container",
        descendants: {
          cardTitle: { content: "Features" },
          cardDesc: { content: "" },
          cardContent: {
            children: [
              frame({ layout: "vertical", gap: 6, width: "fill_container" }, [
                ...[
                  "Date range selection with visual feedback",
                  "Auto-close on selection completion",
                  "Night count calculation",
                  "Form validation with required field indicators",
                  "Responsive modal design with proper headers",
                  "Room type selection with realistic options",
                  "Guest count selector with proper pluralization",
                ].map((f) =>
                  frame({ layout: "horizontal", gap: 8, alignItems: "center" }, [
                    text("✓", { size: 13, fill: "#16a34a" }),
                    text(f, { size: 13 }),
                  ])
                ),
              ]),
            ],
          },
        },
      }),
    ]),
  ]
);

// ─── Component Catalog (code ↔ design mapping) ─────────────────────────────

const UI_CATALOG = [
  ["Button", "components/ui/button.tsx", "Designed", "default, outline, ghost, secondary, destructive"],
  ["Input", "components/ui/input.tsx", "Designed", "Search, forms"],
  ["Textarea", "components/ui/textarea.tsx", "Designed", "Multi-line input"],
  ["Label", "components/ui/label.tsx", "Designed", "Form labels"],
  ["Badge", "components/ui/badge.tsx", "Designed", "default, secondary, outline"],
  ["Card", "components/ui/card.tsx", "Designed", "Header + content pattern"],
  ["Select", "components/ui/select.tsx", "Designed", "Filters, forms"],
  ["Tabs", "components/ui/tabs.tsx", "Designed", "Section navigation"],
  ["Table", "components/ui/table.tsx", "Designed", "Data lists across ventas/management"],
  ["Avatar", "components/ui/avatar.tsx", "Designed", "User lists"],
  ["Alert", "components/ui/alert.tsx", "Designed", "Inline notices"],
  ["Dialog", "components/ui/dialog.tsx", "Designed", "Modal pattern"],
  ["Sheet", "components/ui/sheet.tsx", "Designed", "Right panel pattern"],
  ["Skeleton", "components/ui/skeleton.tsx", "Designed", "Loading states"],
  ["Switch", "components/ui/switch.tsx", "Designed", "Boolean toggles"],
  ["Checkbox", "components/ui/checkbox.tsx", "Designed", "Multi-select"],
  ["Separator", "components/ui/separator.tsx", "Designed", "Dividers"],
  ["Progress", "components/ui/progress.tsx", "Designed", "Progress bars"],
  ["Sidebar", "components/ui/sidebar.tsx", "Designed", "Via appSidebar component"],
  ["Date Range Picker", "components/ui/date-range-picker.tsx", "Designed", "Analytics filters"],
  ["View Mode Buttons", "components/ui/view-mode-buttons.tsx", "Designed", "Call center demo"],
  ["Calendar", "components/ui/calendar.tsx", "Designed", "Month grid + year view on /calendar"],
  ["Chart", "components/ui/chart.tsx", "Designed", "Bar + line charts on sales analytics"],
  ["Dropdown Menu", "components/ui/dropdown-menu.tsx", "Designed", "Row actions on tables"],
  ["Popover", "components/ui/popover.tsx", "Designed", "Date picker calendar host"],
  ["Tooltip", "components/ui/tooltip.tsx", "Designed", "Icon hints on hover"],
  ["Toast / Sonner", "components/ui/sonner.tsx", "Designed", "Global toast notifications"],
  ["Form", "components/ui/form.tsx", "Designed", "Label + input + error message"],
  ["Breadcrumb", "components/ui/breadcrumb.tsx", "Designed", "Page hierarchy navigation"],
  ["Pagination", "components/ui/pagination.tsx", "Designed", "Table page controls"],
  ["Alert Dialog", "components/ui/alert-dialog.tsx", "Designed", "Destructive confirmations"],
  ["Drawer", "components/ui/drawer.tsx", "Designed", "Mobile bottom sheet"],
  ["Room Selection Modal", "components/ui/room-selection-modal.tsx", "Designed", "Call center room picker"],
];

const LAYOUT_CATALOG = [
  ["App Sidebar", "components/layout/app-sidebar.tsx", "Designed", "Main nav, hotel switcher, theme/lang"],
  ["App Header", "components/layout/app-header.tsx", "Designed", "Title + actions slot"],
  ["Front Desk Header", "components/layout/front-desk-header.tsx", "Designed", "Static tabs + agent commission widget"],
  ["Front Desk Header (open tab)", "components/layout/front-desk-header.tsx", "Designed", "Dynamic guest tab + X close · isInReservationMode"],
  ["Reservation Details Panel", "components/features/reservations/reservation-details-tab.tsx", "Designed", "details_* tab content · config + services + summary"],
  ["Reservation Details / Blocks", "components/features/reservations/reservation-details-tab.tsx", "Designed", "Blocks mode · Superior Rooms + Customization + Enhancements"],
  ["Reservation Summary Tab", "components/features/reservations/reservation-summary/requested-items-view.tsx", "Designed", "summary_* inline · Room/Extra/Bidding tables"],
  ["Call Center Header", "components/layout/call-center-header.tsx", "Designed", "Tab bar on call center screen"],
  ["Client Layout", "app/ClientLayout.tsx", "Designed", "SidebarProvider + shell wrapper"],
];

const componentCatalogSection = frame(
  {
    name: "📋 Component Catalog",
    layout: "vertical",
    x: 0,
    y: CANVAS.catalog,
    width: 4400,
    gap: 24,
    padding: 48,
    fill: "$--background",
    stroke: { type: "color", color: "$--border" },
    strokeWidth: 1,
    cornerRadius: 24,
  },
  [
    text("Component Catalog", { size: 28, weight: "700" }),
    text("Maps design components to codebase files · Regenerate: node scripts/generate-cms-demo-pen.mjs", {
      size: 13,
      fill: "$--muted-foreground",
    }),
    note(
      "Best practice: every reusable frame has a context field linking to its source file and usage. All 33 UI components are now visualized in the design system.",
      { width: 480 }
    ),
    frame({ layout: "vertical", gap: 0, width: "fill_container" }, [
      frame(
        {
          layout: "horizontal",
          gap: 12,
          width: "fill_container",
          padding: [8, 12],
          fill: "$--muted",
        },
        [
          text("Component", { size: 11, weight: "600", width: 180 }),
          text("Source file", { size: 11, weight: "600", width: 240 }),
          text("Status", { size: 11, weight: "600", width: 88 }),
          text("Notes", { size: 11, weight: "600", width: "fill_container" }),
        ]
      ),
      ...UI_CATALOG.map(([c, f, s, n]) => catalogRow(c, f, s, n)),
    ]),
    text("Layout & Shell", { size: 20, weight: "600" }),
    frame({ layout: "vertical", gap: 0, width: "fill_container" }, [
      ...LAYOUT_CATALOG.map(([c, f, s, n]) => catalogRow(c, f, s, n)),
    ]),
    text("Routes (18 screens)", { size: 20, weight: "600" }),
    frame({ layout: "vertical", gap: 4, width: "fill_container" }, [
      ...[
        ["/", "Home dashboard"],
        ["/ventas/call-center", "Room request wizard"],
        ["/ventas/front-desk-upsell", "Guest search + loaded reservations table"],
        ["/ventas/front-desk-upsell · loading", "Initial loading state"],
        ["/ventas/front-desk-upsell · call center filter", "View mode date range dialog"],
        ["/ventas/front-desk-upsell · details tab", "Reservation open (details_*)"],
        ["/ventas/front-desk-upsell · summary tab", "Reserved items (summary_*)"],
        ["/ventas/gestion-solicitudes", "Request management"],
        ["/ventas/sales-analytics", "KPIs + charts"],
        ["/ventas/usuarios-comisiones", "Agents + commissions"],
        ["/addons", "Addon catalog CRUD"],
        ["/addons-pricing", "Per-extra pricing"],
        ["/addons-bands", "Pricing bands / segmentos"],
        ["/calendar", "Year pricing calendar"],
        ["/contenido/atributos", "Equipment categories"],
        ["/management/front-desk", "Room blocks management"],
        ["/demo/date-picker-demo", "Component playground"],
      ].map(([route, desc]) =>
        frame({ layout: "horizontal", gap: 12, width: "fill_container" }, [
          text(route, { size: 12, weight: "500", width: 220 }),
          text(desc, { size: 12, fill: "$--muted-foreground" }),
        ])
      ),
    ]),
  ]
);

// ─── UI Patterns ─────────────────────────────────────────────────────────────

const templatesSection = atomicSection("template", {
  name: "📐 Templates",
  subtitle: "Page layouts without real content — compose organisms via ref()",
  x: 0,
  y: CANVAS.templates,
  width: 4400,
  children: [
    subsection("01", "App Shell", "Sidebar + header + content slot", [
      note("ClientLayout → SidebarProvider\n256px sidebar + header (61px) + padded content (32px)", { width: 440 }),
      frame({ layout: "horizontal", width: 520, height: 300, clip: true, cornerRadius: "$--radius-lg", stroke: { type: "color", color: ATOMIC.template.border }, strokeWidth: 2 }, [
        ref("appSidebar", { height: "fill_container" }),
        frame({ layout: "vertical", width: "fill_container", height: "fill_container" }, [
          ref("appHeader", { descendants: { headerTitle: { content: "Page Title" } } }),
          frame({ padding: 12, width: "fill_container", height: "fill_container" }, [ref("statCard", { width: "fill_container" })]),
        ]),
      ]),
    ], { fill: ATOMIC.template.fill, border: ATOMIC.template.border }),
    subsection("02", "List & Grid Layouts", "Table list · Category sidebar + cards", [
      frame({ layout: "horizontal", gap: 32, width: "fill_container", alignItems: "start" }, [
        frame({ layout: "vertical", gap: 12, width: 480 }, [
          text("Data Table List", { size: 16, weight: "600" }),
          note("Search + bordered table · gestion-solicitudes, front-desk", { width: 440 }),
          frame({ layout: "vertical", gap: 8, width: 440, padding: 12, cornerRadius: "$--radius-lg", fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }, [
            ref("inputBase", { width: "fill_container" }),
            frame({ layout: "vertical", cornerRadius: "$--radius-md", clip: true, stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: "fill_container" }, [
              ref("tableHeader"),
              ref("tableRow"),
              ref("tableRow"),
            ]),
          ]),
        ]),
        frame({ layout: "vertical", gap: 12, width: 480 }, [
          text("Category Sidebar + Grid", { size: 16, weight: "600" }),
          note("240px nav + addon grid · /addons, /addons-pricing", { width: 440 }),
          frame({ layout: "horizontal", gap: 12, width: 440, height: 200, padding: 12, cornerRadius: "$--radius-lg", fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }, [
            frame({ layout: "vertical", gap: 4, width: 100 }, [
              text("All", { size: 12, weight: "500" }),
              text("Wellness", { size: 12, fill: "$--muted-foreground" }),
            ]),
            frame({ layout: "horizontal", gap: 8, width: "fill_container" }, [ref("addonCard", { width: 120 }), ref("addonCard", { width: 120 })]),
          ]),
        ]),
      ]),
    ]),
    subsection("03", "Overlay Templates", "Dialog · Sheet · Modal scaffolds", [
      frame({ layout: "horizontal", gap: 32, width: "fill_container", alignItems: "start" }, [
        frame({ layout: "vertical", gap: 12, width: 400 }, [
          text("Dialog Overlay", { size: 16, weight: "600" }),
          frame({ layout: "horizontal", alignItems: "center", justifyContent: "center", width: 380, height: 280, cornerRadius: "$--radius-lg", fill: "#000000CC" }, [
            ref("dialogContent"),
          ]),
        ]),
        frame({ layout: "vertical", gap: 12, width: 400 }, [
          text("Sheet Panel", { size: 16, weight: "600" }),
          frame({ layout: "horizontal", justifyContent: "end", width: 380, height: 280, cornerRadius: "$--radius-lg", fill: "#00000066", clip: true }, [
            ref("sheetPanel", { height: "fill_container" }),
          ]),
        ]),
        frame({ layout: "vertical", gap: 12, width: 400 }, [
          text("Empty & Loading", { size: 16, weight: "600" }),
          frame({ layout: "vertical", gap: 16, width: 360 }, [
            frame({ cornerRadius: "$--radius-lg", fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: "fill_container" }, [ref("emptyState")]),
            frame({ padding: 16, cornerRadius: "$--radius-lg", fill: "$--background", stroke: { type: "color", color: "$--border" }, strokeWidth: 1, width: "fill_container" }, [ref("skeletonBase")]),
          ]),
        ]),
      ]),
    ]),
    subsection("04", "Front Desk Template", "Dynamic tabs + content slot", [
      note("front-desk-header.tsx · openTabs · details_* / summary_* slots", { width: 520 }),
      frame({ layout: "vertical", gap: 0, width: 560, cornerRadius: "$--radius-lg", clip: true, stroke: { type: "color", color: "#3b82f6" }, strokeWidth: 2 }, [
        ref("frontDeskHeaderDetailsOpen"),
        frame({ padding: 12, width: "fill_container", fill: "$--background" }, [
          ref("reservationDetailsBlocksContent", { width: "fill_container" }),
        ]),
      ]),
    ], { fill: "#eff6ff", border: "#93c5fd" }),
  ],
});

// ─── Canvas Index (navigation map) ───────────────────────────────────────────

function indexCard(num, title, desc, yPos) {
  return frame(
    {
      layout: "vertical",
      gap: 10,
      width: 300,
      padding: 24,
      cornerRadius: 14,
      fill: "#1e293b",
      stroke: { type: "color", color: "#334155" },
      strokeWidth: 1,
    },
    [
      text(num, { size: 11, weight: "600", fill: "#64748b" }),
      text(title, { size: 17, weight: "600", fill: "#f8fafc" }),
      text(desc, { size: 12, fill: "#94a3b8" }),
      text(`Scroll to y ≈ ${yPos}`, { size: 10, fill: "#475569" }),
    ]
  );
}

const canvasIndexSection = sectionFrame({
  name: "🗺️ Canvas Index — Atomic Design",
  subtitle: "Foundations → Atoms → Molecules → Organisms → Templates → Pages · node scripts/generate-cms-demo-pen.mjs",
  x: 0,
  y: CANVAS.index,
  width: 4400,
  fill: "#0f172a",
  children: [
    frame({ layout: "horizontal", gap: 10, alignItems: "center", width: "fill_container", padding: [0, 0, 8, 0] }, [
      ...[
        ["Foundations", ATOMIC.foundations],
        ["Atoms", ATOMIC.atom],
        ["Molecules", ATOMIC.molecule],
        ["Organisms", ATOMIC.organism],
        ["Templates", ATOMIC.template],
        ["Pages", ATOMIC.page],
      ].flatMap(([label, cfg], i, arr) => [
        frame({ padding: [8, 14], cornerRadius: 8, fill: cfg.accent }, [
          text(label, { size: 11, weight: "600", fill: "#ffffff" }),
        ]),
        ...(i < arr.length - 1 ? [text("→", { size: 14, fill: "#64748b" })] : []),
      ]),
    ]),
    frame({ layout: "horizontal", gap: 20, width: "fill_container" }, [
      indexCard("01", "Foundations", "Tokens · Typography · Radius", CANVAS.foundations),
      indexCard("02", "Atoms", "Buttons · Inputs · Badges", CANVAS.atoms),
      indexCard("03", "Molecules", "Form fields · Rows · Tabs", CANVAS.molecules),
      indexCard("04", "Organisms", "Headers · Tables · Modals", CANVAS.organisms),
    ]),
    frame({ layout: "horizontal", gap: 20, width: "fill_container" }, [
      indexCard("05", "Templates", "Shell · List · Overlay layouts", CANVAS.templates),
      indexCard("06", "Pages · Front Desk", "★ /ventas/front-desk-upsell", CANVAS.pagesFrontDesk),
      indexCard("07", "Pages · Other", "Sales · Content · Pricing", CANVAS.pagesOther),
      frame({ layout: "vertical", gap: 10, width: 300, padding: 24, cornerRadius: 14, fill: "#1c1917", stroke: { type: "color", color: "#fde047" }, strokeWidth: 1 }, [
        text("Meta", { size: 11, weight: "600", fill: "#fde047" }),
        text("Sections stack vertically on canvas (scroll ↓)\nCatalog · Gap Audit below Foundations", { size: 12, fill: "#fef9c3" }),
      ]),
    ]),
    frame({ layout: "horizontal", gap: 20, width: "fill_container" }, [
      frame({ layout: "vertical", gap: 10, width: 620, padding: 24, cornerRadius: 14, fill: "#172554", stroke: { type: "color", color: "#3b82f6" }, strokeWidth: 1 }, [
        text("Compare workflow", { size: 17, weight: "600", fill: "#93c5fd" }),
        text("1. vp run dev → localhost:3000\n2. Open Pages · Front Desk (section 06)\n3. Compare PRIMARY screen vs browser\n4. node scripts/design-browser-compare.mjs", { size: 12, fill: "#bfdbfe" }),
      ]),
    ]),
  ],
});

// ─── Foundations (tokens + typography) ─────────────────────────────────────

const foundationsSection = atomicSection("foundations", {
  name: "🎨 Foundations",
  subtitle: "Design tokens · Inter type scale · Spacing & radius — not components",
  x: 0,
  y: CANVAS.foundations,
  width: 4400,
  children: [
    subsection("01", "Color Tokens", "Semantic colors — light mode values", [
      frame({ layout: "horizontal", gap: 16, width: "fill_container" }, [
        ...[
          ["Background", "$--background"],
          ["Primary", "$--primary"],
          ["Secondary", "$--secondary"],
          ["Muted", "$--muted"],
          ["Accent", "$--accent"],
          ["Destructive", "$--destructive"],
          ["Border", "$--border"],
          ["Sidebar", "$--sidebar"],
        ].map(([name, bg]) =>
          frame({ layout: "vertical", gap: 8, width: 110 }, [
            frame({ width: 110, height: 72, cornerRadius: "$--radius-md", fill: bg, stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }),
            text(name, { size: 11, weight: "500" }),
            text(bg.replace("$--", ""), { size: 10, fill: "$--muted-foreground" }),
          ])
        ),
      ]),
    ]),
    subsection("02", "Typography", "Inter type scale", [
      frame({ layout: "vertical", gap: 14, width: "fill_container" }, [
        ...[
          [48, "700", "Display"],
          [36, "700", "Heading 1"],
          [24, "600", "Heading 2"],
          [18, "600", "Heading 3"],
          [14, "400", "Body"],
          [12, "400", "Caption"],
        ].map(([size, weight, label]) =>
          frame({ layout: "horizontal", alignItems: "center", gap: 24, width: "fill_container", padding: [8, 0] }, [
            text(label, { size: 11, fill: "$--muted-foreground", width: 100 }),
            text("The quick brown fox", { size, weight }),
          ])
        ),
      ]),
    ], { fill: "#ffffff" }),
    subsection("03", "Radius & Spacing", "Tailwind scale · corner radii", [
      frame({ layout: "horizontal", gap: 24, alignItems: "end", width: "fill_container" }, [
        ...[
          ["sm", "$--radius-sm", 4],
          ["md", "$--radius-md", 6],
          ["lg", "$--radius-lg", 8],
        ].map(([name, token, px]) =>
          frame({ layout: "vertical", gap: 8, alignItems: "center" }, [
            frame({ width: 64, height: 64, cornerRadius: token, fill: "$--muted", stroke: { type: "color", color: "$--border" }, strokeWidth: 1 }),
            text(`${name} (${px}px)`, { size: 12, fill: "$--muted-foreground" }),
          ])
        ),
        frame({ layout: "vertical", gap: 8 }, [
          text("Spacing scale", { size: 12, weight: "500" }),
          text("4 · 8 · 12 · 16 · 24 · 32 · 48", { size: 12, fill: "$--muted-foreground" }),
        ]),
      ]),
    ]),
  ],
});

// ─── Atoms ───────────────────────────────────────────────────────────────────

const atomsSection = atomicSection("atom", {
  name: "⚛️ Atoms",
  subtitle: "Indivisible primitives · components/ui/* · ref() registry",
  x: 0,
  y: CANVAS.atoms,
  width: 4400,
  children: [
    subsection("01", "Actions", "Button variants", [atomicGrid("atom", [
      ["Primary", btnPrimary, { file: "components/ui/button.tsx" }],
      ["Outline", btnOutline],
      ["Secondary", btnSecondary],
      ["Destructive", btnDestructive],
      ["Ghost", btnGhost],
    ], 3)], { fill: ATOMIC.atom.fill, border: ATOMIC.atom.border }),
    subsection("02", "Form Controls", "Inputs · Labels · Selects", [atomicGrid("atom", [
      ["Input", inputBase, { file: "components/ui/input.tsx" }],
      ["Label", labelBase],
      ["Textarea", textareaBase],
      ["Select Trigger", selectTrigger],
    ], 2)], { fill: "#ffffff", border: ATOMIC.atom.border }),
    subsection("03", "Indicators", "Badges · Avatar · Progress", [atomicGrid("atom", [
      ["Badge", badgeDefault],
      ["Badge Secondary", badgeSecondary],
      ["Badge Outline", badgeOutline],
      ["Avatar", avatarBase],
      ["Progress", progressBar],
      ["Separator", separatorH],
    ], 3)]),
    subsection("04", "Toggles & Feedback", "Switch · Checkbox · Alert · Skeleton", [atomicGrid("atom", [
      ["Switch", switchOn],
      ["Checkbox", checkboxChecked],
      ["Alert", alertDefault],
      ["Skeleton", skeletonBase],
      ["Spinner", loadingSpinner],
    ], 3)]),
  ],
});

// ─── Molecules ───────────────────────────────────────────────────────────────

const moleculesSection = atomicSection("molecule", {
  name: "🧬 Molecules",
  subtitle: "Atom combinations · simple functional groups",
  x: 0,
  y: CANVAS.molecules,
  width: 4400,
  children: [
    subsection("01", "Forms & Navigation", "Form field · Tabs · Breadcrumb · Pagination", [
      atomicGrid("molecule", [
        ["Form Field", formField, { file: "components/ui/form.tsx" }],
        ["Tabs List", tabsList],
        ["Breadcrumb", breadcrumbNav],
        ["Pagination", paginationNav],
        ["Date Range Picker", dateRangePicker, { width: 340 }],
      ], 3),
    ], { fill: ATOMIC.molecule.fill, border: ATOMIC.molecule.border }),
    subsection("02", "Data Display", "Table parts · Cards · Stats", [
      atomicGrid("molecule", [
        ["Table Header", tableHeader],
        ["Table Row", tableRow],
        ["Upsell Table Header", upsellTableHeader],
        ["Card Shell", cardBase],
        ["Stat Card", statCard],
        ["Sidebar Item", sidebarItem],
        ["Sidebar Item Active", sidebarItemActive],
      ], 3),
    ]),
    subsection("03", "Overlays & Menus", "Dropdown · Tooltip · Toast", [
      atomicGrid("molecule", [
        ["Dropdown Menu", dropdownMenu],
        ["Tooltip", tooltipContent],
        ["Toast", toastBase],
        ["Empty State", emptyState],
      ], 2),
    ]),
    subsection("04", "Domain Molecules", "Front desk · Addons · Charts", [
      atomicGrid("molecule", [
        ["View Mode Buttons", viewModeButtons, { width: 340 }],
        ["Status Banner", statusBanner, { width: 340 }],
        ["Addon Tile", addonCard],
        ["Chart Bar", chartBar],
        ["Chart Line", chartLine],
        ["Calendar Month", calendarMonth, { width: 280 }],
      ], 3),
    ]),
  ],
});

// ─── Organisms ───────────────────────────────────────────────────────────────

const organismsSection = atomicSection("organism", {
  name: "🦠 Organisms",
  subtitle: "Complex UI sections · layout + feature components",
  x: 0,
  y: CANVAS.organisms,
  width: 4400,
  children: [
    frame(
      {
        name: "Front desk organism registry",
        layout: "vertical",
        width: 1,
        height: 1,
        clip: true,
        gap: 0,
      },
      [
        frontDeskHeader,
        frontDeskHeaderDetailsOpen,
        frontDeskHeaderSummaryOpen,
        frontDeskReservationsTable,
        reservationDetailsBlocksContent,
        reservationSummaryTabContent,
        reservationDetailsContent,
        frontDeskSuccessToast,
        callCenterDateRangeDialog,
      ]
    ),
    subsection("01", "App Shell", "Sidebar · Header · Call center header", [
      atomicGrid("organism", [
        ["App Sidebar", appSidebar, { width: 280, file: "components/layout/app-sidebar.tsx" }],
        ["App Header", appHeader, { width: 280 }],
        ["Call Center Header", callCenterHeader, { width: 340 }],
        ["Category Sidebar", categorySidebarPanel],
      ], 2),
    ], { fill: ATOMIC.organism.fill, border: ATOMIC.organism.border }),
    subsection("02", "Front Desk", "Headers · Table · Tab content · Dialogs", [
      atomicGrid(
        "organism",
        [
          ["Header (default)", ref("frontDeskHeader"), { width: 520, previewWidth: 520 }],
          ["Header (details)", ref("frontDeskHeaderDetailsOpen"), { width: 520, previewWidth: 520 }],
          ["Header (summary)", ref("frontDeskHeaderSummaryOpen"), { width: 520, previewWidth: 520 }],
        ],
        2
      ),
      frame({ layout: "vertical", gap: 24, width: "fill_container" }, [
        atomicTile("Reservations Table", ref("frontDeskReservationsTable"), "organism", {
          width: 1280,
          previewWidth: 1280,
          file: "app/ventas/front-desk-upsell/page.tsx",
        }),
        frame({ layout: "horizontal", gap: 24, width: "fill_container", alignItems: "start" }, [
          atomicTile("Blocks Content", ref("reservationDetailsBlocksContent"), "organism", {
            width: 900,
            previewWidth: 900,
          }),
          atomicTile("Summary Tab", ref("reservationSummaryTabContent"), "organism", {
            width: 900,
            previewWidth: 900,
          }),
        ]),
        atomicGrid(
          "organism",
          [
            ["List Content", ref("reservationDetailsContent"), { width: 420, previewWidth: 420 }],
            ["Success Toast", ref("frontDeskSuccessToast"), { width: 420 }],
            ["Call Center Dialog", ref("callCenterDateRangeDialog"), { width: 420, previewWidth: 420 }],
          ],
          3
        ),
      ]),
    ], { fill: "#ffffff", border: "#3b82f6" }),
    subsection("03", "Overlays", "Dialogs · Sheets · Drawers · Modals", [
      atomicGrid("organism", [
        ["Dialog", dialogContent, { width: 280 }],
        ["Sheet Panel", sheetPanel, { width: 280 }],
        ["Alert Dialog", alertDialogContent, { width: 280 }],
        ["Drawer", drawerPanel, { width: 280 }],
        ["Room Selection", roomSelectionModal, { width: 340 }],
        ["Reservation Summary", reservationSummaryModal, { width: 340 }],
      ], 3),
    ]),
    subsection("04", "Domain Tables & Cards", "Calendar · Addons · Analytics", [
      atomicGrid("organism", [
        ["Year Calendar", yearCalendarTable, { width: 340 }],
        ["Bands Table", bandsTable, { width: 340 }],
        ["Exceptions Table", exceptionsTable, { width: 340 }],
        ["Skeleton Table", skeletonTable, { width: 340 }],
        ["KPI Card", kpiCardTrend],
        ["Revenue Goal", revenueGoalCard],
        ["Addon Card Rich", addonCardRich],
        ["Experience Card", addonCardExperience],
        ["Pricing Card", addonCardPricing],
        ["Equipment Card", equipmentCategoryCard],
      ], 3),
    ]),
  ],
});

// ─── Live UI Gap Audit (browser review 2026-06-29) ─────────────────────────

const gapAuditSection = sectionFrame({
  name: "🔍 Live UI Gap Audit",
  subtitle: "Compared against http://localhost:3000 — close Pencil tab before regenerating",
  x: 0,
  y: CANVAS.gapAudit,
  width: 4400,
  fill: "#fff7ed",
  children: [
    subsection("01", "Global Gaps", "Sidebar · Header · i18n keys in EN mode", [
      note(
        "• Sidebar: 15+ nav items with disabled states, collapsible Sales/Management/Content/Pricing\n• AppHeader: icon + i18n title (not generic Page Title)\n• ModeToggle dropdown + EN language chip in sidebar footer\n• Many labels use i18n keys in EN mode (chooseYourRoom, addonsManagement)",
        { width: 520 }
      ),
    ]),
    subsection("02", "Critical Screen Gaps", "Routes needing design parity", [
      note(
        "• /ventas/front-desk-upsell: FrontDeskHeader, agent widget, status banner, ViewModeButtons, sortable table, loading state\n• /calendar: yearCalendar table (Month/Weekdays/Weekends), colored event cards, Save Changes\n• /contenido/atributos: equipment category CARD grid (not table), Save/Cancel toolbar\n• /ventas/sales-analytics: 4 KPI cards w/ trend badges + revenue goal progress bar\n• /addons: Extra/Experience badges, Edit btn, email metadata, 6 categories\n• /addons-bands: search + sortable Name/Description/Actions dropdown\n• /management/front-desk: skeleton loading table (no filters in empty state)\n• /ventas/gestion-solicitudes: loading spinner, no breadcrumb in live UI",
        { width: 520 }
      ),
    ], { fill: "#ffedd5", border: "#fdba74" }),
    subsection("03", "Comparison Workflow", "Run after every design change", [
      note(
        "1. vp run dev → http://localhost:3000\n2. Open cms-demo.pen beside browser (Pencil side-by-side)\n3. For each route: snapshot live UI vs design screen\n4. Log gaps in this section · Fix generator · Regenerate pen\n5. Re-compare until parity",
        { width: 520 }
      ),
      note(
        "FINAL SIGN-OFF (2026-07-02)\n✅ Layout fix: table columns use explicit widths (not all fill_container)\n✅ Organism previews: wider tiles + clip viewport + refs\n✅ Canvas sections stack vertically (no horizontal overlap)\n✅ Browser UI parity confirmed on localhost:3000",
        { width: 520 }
      ),
    ]),
  ],
});

// ─── Screens Grid ───────────────────────────────────────────────────────────

// ─── Front Desk Flow (priority screens) ──────────────────────────────────────

const frontDeskScreens = [
  {
    route: "/ventas/front-desk-upsell · blocks / recommend",
    screen: screenFrontDeskReservationOpen,
    highlighted: true,
    codeFile: "app/ventas/front-desk-upsell/page.tsx → ReservationDetailsTab (details_* tab)\ncomponents/features/reservations/reservation-details-tab.tsx",
    description:
      "LIVE STATE: Click Recommend on any row → Lisa Anderson tab opens.\nShows: Back + Recommended Services, booking bar, configuration (Blocks active),\nSuperior Rooms | Room Customization | Stay Enhancements columns.\nCompare with http://localhost:3000/ventas/front-desk-upsell",
  },
  {
    route: "/ventas/front-desk-upsell",
    screen: screenFrontDeskUpsell,
    codeFile: "app/ventas/front-desk-upsell/page.tsx · default list tab",
    description: "Loaded reservations table · 50 rows · search · 4 view-mode buttons · status banner",
  },
  {
    route: "/ventas/front-desk-upsell · summary tab",
    screen: screenFrontDeskSummaryOpen,
    codeFile: "reservation-summary/requested-items-view.tsx · summary_* tab",
    description: "Click N reserved items → Request Summary with Room/Extra/Bidding tables",
  },
  {
    route: "/ventas/front-desk-upsell · loading",
    screen: screenFrontDeskUpsellLoading,
    description: "Initial 1s loading state before mock data loads",
  },
  {
    route: "/ventas/front-desk-upsell · call center filter",
    screen: screenFrontDeskCallCenterFilter,
    description: "Call Center view button → date range dialog",
  },
];

const otherScreens = [
  { route: "/", screen: screenHome, codeFile: "app/page.tsx" },
  { route: "/ventas/call-center", screen: screenCallCenter, codeFile: "app/ventas/call-center/page.tsx" },
  { route: "/ventas/gestion-solicitudes", screen: screenGestionSolicitudes, codeFile: "app/ventas/gestion-solicitudes/page.tsx" },
  { route: "/ventas/sales-analytics", screen: screenSalesAnalytics, codeFile: "app/ventas/sales-analytics/page.tsx" },
  { route: "/ventas/usuarios-comisiones", screen: screenUsuariosComisiones, codeFile: "app/ventas/usuarios-comisiones/page.tsx" },
  { route: "/addons", screen: screenAddons, codeFile: "app/addons/page.tsx" },
  { route: "/addons-pricing", screen: screenAddonsPricing, codeFile: "app/addons-pricing/page.tsx" },
  { route: "/addons-bands", screen: screenAddonsBands, codeFile: "app/addons-bands/page.tsx" },
  { route: "/calendar", screen: screenCalendar, codeFile: "app/calendar/page.tsx" },
  { route: "/calendar · exceptions tab", screen: screenCalendarExceptions },
  { route: "/contenido/atributos", screen: screenAtributos, codeFile: "app/contenido/atributos/page.tsx" },
  { route: "/management/front-desk", screen: screenMgmtFrontDesk, codeFile: "app/management/front-desk/page.tsx" },
  { route: "/demo/date-picker-demo", screen: screenDatePickerDemo, codeFile: "app/demo/date-picker-demo/page.tsx" },
];

function flowChip(label, accent = false) {
  return frame(
    {
      padding: [10, 18],
      cornerRadius: 8,
      fill: accent ? "#1d4ed8" : "$--background",
      stroke: { type: "color", color: accent ? "#1d4ed8" : "$--border" },
      strokeWidth: 1,
    },
    [text(label, { size: 12, weight: accent ? "600" : "500", fill: accent ? "#ffffff" : "$--foreground" })]
  );
}

const frontDeskFlowSection = atomicSection("page", {
  name: "📄 Pages · Front Desk",
  subtitle: "Full screens with real content — http://localhost:3000/ventas/front-desk-upsell",
  x: 0,
  y: CANVAS.pagesFrontDesk,
  width: 4400,
  children: [
    subsection(
      "00",
      "Flow Overview",
      "How users navigate front desk upsell",
      [
        frame({ layout: "horizontal", gap: 12, alignItems: "center", width: "fill_container", flexWrap: "wrap" }, [
          flowChip("① List (default)"),
          text("→", { size: 18, fill: "$--muted-foreground" }),
          flowChip("② Recommend click", true),
          text("→", { size: 18, fill: "$--muted-foreground" }),
          flowChip("③ Blocks view"),
          text("→", { size: 18, fill: "$--muted-foreground" }),
          flowChip("④ Summary tab"),
        ]),
        note(
          "1. List tab (default) → search + 50-row table + view-mode buttons\n2. Click Recommend → Lisa Anderson tab opens → Blocks mode (PRIMARY)\n3. Click N reserved items → Request Summary tab (Kenneth Collins)\n4. View-mode buttons filter list or open Call Center date dialog",
          { width: 720 }
        ),
      ],
      { fill: "#dbeafe", border: "#93c5fd" }
    ),
    subsection(
      "01",
      "Blocks / Recommend View",
      "PRIMARY screen — matches live browser after clicking Recommend",
      [screenCard({ ...frontDeskScreens[0], step: 1 })],
      { fill: "#eff6ff", border: "#3b82f6" }
    ),
    subsection("02", "List View", "Default tab · loaded reservations table", [
      screenCard({ ...frontDeskScreens[1], step: 2 }),
    ]),
    subsection("03", "Summary Tab", "Request Summary after clicking reserved items", [
      screenCard({ ...frontDeskScreens[2], step: 3 }),
    ]),
    subsection("04", "Alternate States", "Loading · Call Center filter", [
      frame({ layout: "vertical", gap: 40, width: "fill_container" }, [
        screenCard({ ...frontDeskScreens[3], step: 4 }),
        screenCard({ ...frontDeskScreens[4], step: 5 }),
      ]),
    ], { fill: "#fafafa" }),
  ],
});

const otherScreensSection = atomicSection("page", {
  name: "📄 Pages · Other Routes",
  subtitle: "Full application screens grouped by domain",
  x: 0,
  y: CANVAS.pagesOther,
  width: 4400,
  children: [
    subsection("01", "Sales", "/ventas/* routes", [
      frame({ layout: "vertical", gap: 40, width: "fill_container" }, [
        ...otherScreens
          .filter((s) => s.route.startsWith("/ventas"))
          .map((item, i) => screenCard({ ...item, description: item.codeFile, step: i + 1 })),
      ]),
    ]),
    subsection("02", "Content & Pricing", "Addons · Calendar · Atributos", [
      frame({ layout: "vertical", gap: 40, width: "fill_container" }, [
        ...otherScreens
          .filter((s) => s.route.startsWith("/addons") || s.route.startsWith("/contenido") || s.route.startsWith("/calendar"))
          .map((item, i) => screenCard({ ...item, description: item.codeFile, step: i + 1 })),
      ]),
    ], { fill: "#fafafa" }),
    subsection("03", "Home · Management · Demo", "Misc routes", [
      frame({ layout: "vertical", gap: 40, width: "fill_container" }, [
        ...otherScreens
          .filter(
            (s) =>
              !s.route.startsWith("/ventas") &&
              !s.route.startsWith("/addons") &&
              !s.route.startsWith("/contenido") &&
              !s.route.startsWith("/calendar")
          )
          .map((item, i) => screenCard({ ...item, description: item.codeFile, step: i + 1 })),
      ]),
    ]),
  ],
});

const screens = [...frontDeskScreens, ...otherScreens];

const doc = {
  version: "2.14",
  variables: tokens,
  themes: { mode: ["light", "dark"] },
  imports: { Y: "pencil:shadcn.lib.pen" },
  fileToken: FILE_TOKEN,
  children: [
    canvasIndexSection,
    foundationsSection,
    atomsSection,
    moleculesSection,
    organismsSection,
    templatesSection,
    componentCatalogSection,
    gapAuditSection,
    frontDeskFlowSection,
    otherScreensSection,
  ],
};

writeFileSync(OUT, JSON.stringify(doc, null, 2));

// Validate: every node with an id must have a type; ids must be globally unique
const seenIds = new Map();
function validate(n, path = "root") {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) {
    n.forEach((c, i) => validate(c, `${path}[${i}]`));
    return;
  }
  if (n.id) {
    if (!n.type) throw new Error(`Node '${n.id}' at ${path} has no type`);
    if (seenIds.has(n.id)) throw new Error(`Duplicate id '${n.id}' at ${path} and ${seenIds.get(n.id)}`);
    seenIds.set(n.id, path);
  }
  if (n.children) validate(n.children, `${path}.children`);
  if (n.descendants) {
    for (const [key, val] of Object.entries(n.descendants)) {
      if (val && typeof val === "object" && val.type) validate(val, `${path}.descendants.${key}`);
    }
  }
}
doc.children.forEach((c, i) => validate(c, `children[${i}]`));

console.log(`✓ Generated ${OUT}`);
console.log(`  - ${Object.keys(tokens).length} design tokens (light + dark)`);
console.log(`  - 47 reusable shadcn-style components with context docs`);
console.log(`  - Component catalog (${UI_CATALOG.length} UI + ${LAYOUT_CATALOG.length} layout entries, all designed)`);
console.log(`  - UI patterns → Templates section (atomic layout scaffolds)`);

// Post-generation integrity checks
const refTargets = new Set();
const reusableIds = new Set();
function collectRefsAndReusable(n) {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) return n.forEach(collectRefsAndReusable);
  if (n.reusable && n.id) reusableIds.add(n.id);
  if (n.type === "ref" && n.ref) refTargets.add(n.ref);
  if (n.children) n.children.forEach(collectRefsAndReusable);
  if (n.descendants) Object.values(n.descendants).forEach(collectRefsAndReusable);
}
doc.children.forEach(collectRefsAndReusable);
for (const refId of refTargets) {
  if (!reusableIds.has(refId)) throw new Error(`Broken ref: '${refId}' has no reusable component definition`);
}
console.log(`✓ Validated: ${doc.children.length} sections, ${seenIds.size} unique node ids, ${reusableIds.size} reusable components, ${refTargets.size} refs`);
const parsed = JSON.parse(readFileSync(OUT, "utf8"));
if (!parsed.children?.length) throw new Error("Generated file has no top-level children");
if (parsed.children.length < 10) throw new Error("Expected 10 sections: index, foundations, atoms, molecules, organisms, templates, catalog, audit, pages front desk, pages other");
const iconFontNodes = JSON.stringify(parsed).includes('"type": "icon_font"');
if (iconFontNodes) throw new Error("Found deprecated icon_font nodes — use type: icon");
if (JSON.stringify(parsed).includes('"id": "i3"')) throw new Error("Found short id i3 — likely shadcn import collision");
console.log(`  - ${parsed.children.length} canvas sections (atomic: foundations → atoms → molecules → organisms → templates → pages)`);
console.log(`  - ${screens.length} application screens (${frontDeskScreens.length} front desk + ${otherScreens.length} other)`);
