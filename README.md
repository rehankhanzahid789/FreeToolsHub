# FreeToolsHub

A static collection of free browser-based tools. No frameworks, no build tools, no npm — just HTML, CSS and vanilla JavaScript. Ready to deploy to **GitHub Pages** as-is.

## Deploy

1. Push this folder to a GitHub repo.
2. In **Settings → Pages**, set the source to the `main` branch, folder `/`.
3. Wait a minute — done.

All paths in the project are **relative**, so the site works from any subpath.

## Project structure

```
/
├── index.html
├── css/
│   ├── style.css        Shared site styles
│   └── tool.css         Shared styles for tool pages
├── js/
│   ├── main.js          Homepage — renders cards from tools.json
│   ├── layout.js        Injects shared header/footer on tool pages
│   └── tools.json       Registry of all tools (see below)
├── tools/
│   └── <slug>/
│       ├── index.html
│       └── script.js
├── assets/
│   └── icons/           Optional per-tool SVGs (filename must match tools.json)
└── README.md
```

## `js/tools.json` format

Each entry is an object:

```json
{
  "name":        "Tool display name",
  "slug":        "url-safe-slug",
  "description": "One-line description shown on the card",
  "icon":        "my-icon.svg",
  "folder":      "tools/my-tool/"
}
```

The homepage renders the cards **dynamically** from this file — you never edit `index.html` to add a tool.

## Adding a new tool (3 steps)

1. **Create the folder** `tools/my-tool/` with two files:
   - `index.html` — copy an existing tool's HTML as a starting point. Keep the `<div id="site-header"></div>` / `<div id="site-footer"></div>` placeholders and the three `.ad-slot` divs.
   - `script.js` — your tool logic.
2. **(Optional) Add an icon** at `assets/icons/my-tool.svg` (any 24×24 SVG using `currentColor`).
3. **Register it** in `js/tools.json` by appending one entry with `folder: "tools/my-tool/"`.

Reload the homepage — your card appears automatically.

## Ad slots (Adsterra)

Every page reserves three ad containers with fixed min-heights so inserting real ad code causes **no layout shift**:

```html
<!-- Adsterra: paste banner ad code below this comment -->
<div class="ad-slot ad-slot--top"></div>

<!-- Adsterra: paste sidebar/native ad code below this comment -->
<div class="ad-slot ad-slot--sidebar"></div>

<!-- Adsterra: paste bottom banner ad code below this comment -->
<div class="ad-slot ad-slot--bottom"></div>
```

To activate: paste your Adsterra ad snippet directly **inside** each `.ad-slot` div (or right before it). The placeholder styling disappears once real content is inside.

## Theming

All colors live as CSS variables in `css/style.css` under `:root`. Change them there to re-theme the whole site.
