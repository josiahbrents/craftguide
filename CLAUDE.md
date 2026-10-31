# CLAUDE.md: Minecraft companion

Handoff notes from the claude.ai chat where this app was built. Read this first.

## Who and what
- Owner: Josiah. Uses it on his iPhone as a Home Screen web app; his brother uses it too.
- Live site: https://craftguide.netlify.app (Netlify, free account, project `craftguide`, formerly `whimsical-rabanadas-da6ddf`, whose old URL now 404s).
- Code: private GitHub repo https://github.com/josiahbrents/minecraft-companion, branch `main`.
- Java Edition only. Bedrock is out of scope everywhere.
- Repo must stay **private**: `site/textures.js`, `site/trims_data.js`, `site/banner_data.js` and `site/fonts/mojangles.woff` are built from Mojang's default resource pack.

## Working with Josiah
- For big features, show a short plan of what the feature will include and wait for his OK before building.
- Accuracy matters a lot. Check game mechanics against minecraft.wiki before building, and say plainly when something can't be done or was simplified.
- He's mostly on his phone: keep everything mobile-first, test layouts at phone width, and keep tap targets large.
- Explain results in plain language. He doesn't need code walkthroughs.
- **No explanation text in the app.** He doesn't read it and players know the basics. No intro lines under tab titles, no tip paragraphs, no "how it works" pages. Keep only short labels and facts that change what you'd do (Too Expensive, Can't be crafted, Doesn't stack).
- **Only build what players actually use while playing.** He cut calculators nobody would stop to use (food fill-up, XP sources, Mending repair cost, smelting batch/fuel calculators, "what can I brew"), the Smelting recipe list, and the Librarian hunt and My villagers pages. Don't add things like that back.
- **It should feel like a native app**: navigation is the bottom bar only (no swiping between tabs), and there's no zooming.
- He likes the tabs working together: any item shown should be tappable to see where else it appears (see Cross-tab links).
- Ship each update as a commit; Netlify deploys from the repo.

## Architecture
No framework, no bundler. `site/index.html` loads classic scripts in this order, sharing globals:
1. `data.js`: crafting recipes (`RECIPES`, `TAGS`, helpers `sh()` shaped / `sl()` shapeless).
2. `textures.js`: generated icons. `TXK` = base64 PNGs keyed by hash, `TXN` = item name → key.
3. `app.js`: Crafting tab (search, recipe panel, `select()`, `renderPanel()`, `icon()`, `img()`, `esc()`).
4. `ench_data.js`: enchantments (`ENCH`, `EBY`, conflicts, presets), `anvil_core.js`: exact anvil optimizer (`anvilSolve`, also used by `planner_worker.js` in a Web Worker), `ench.js`: Enchanting tab.
5. `tabs_data.js`: data for Brewing, Trades, Smithing, Food, Tools, plus `SMELT`/`SMELT_NOTE`/`FUELS` (smelting has no tab: it's info lines in item cards and the fuel card in Tools) and XP level math.
6. `trims_data.js`: armor/trim textures and palettes for the trim preview.
7. `tabs_brew_trade.js`: shared tab state `TS` (saved to localStorage `mc-tabs`), `TABS`/`TAB_NAMES`, helpers (`irow`, `ilist`, `head`, `subnav`), Brewing and Trades (professions only, one page). `tabs_more.js`: Smithing (incl. 3D trim preview), Food, Tools (portal converter, saved portals with link check, XP to level, furnace fuel list). `banner_data.js` + `tabs_banner.js`: Banners. `links.js`: cross-tab links, item card, back bar, `toast()`, `undoable()`, `searchBox()`. `tabs_shell.js` (last): tab switching, pinch-zoom blocking, scroll fades, all event handlers, crafting extras (back history, phone recipe sheet, crafting tree, crafting calculator), start-up tab, service worker registration.
- Several features wrap earlier globals (e.g. `renderPanel = function(){...}` in `tabs_shell.js`), so script order matters. `links.js` functions are called at render time, so earlier files can use them.
- `style.css` is a single file (base styles, then enchanting, then tab styles, then links/toast/card at the end). Panel text color is `--on-panel`. The pixel font is `--disp` (Mojangles). Body font Atkinson Hyperlegible is self-hosted in `fonts/` (OFL), so nothing loads from Google.
- `sw.js`: cache-first offline copy. A new version precaches every file, waits, and the page shows an "Update ready · Reload" toast. **Bump `CACHE` (currently `guide-v13`) on every release** and list any new files in `FILES`, or phones keep the old version.
- localStorage keys: `mc-tabs` (most tabs, plus `TS.ui.last` = last tab opened), `mc-ench` (enchanting planner), `mc-steps` (anvil checklist). Every tab with saved state needs a key in the initial `TS` object or it won't load back (saved banners were silently lost before `banner:{}` was added).
- Tabs: craft, ench, brew, trade, smith, banner, food, tools. `OLD_TABS` maps removed tabs (`xp`, `portal`, `smelt`) to Tools for old links and a saved last tab; old saved portals were migrated. The bottom bar scrolls sideways with edge fades. There is no swipe navigation, on purpose.
- No zoom: viewport `maximum-scale=1, user-scalable=no` (iOS ignores this), so `tabs_shell.js` also blocks the `gesture*` events and two-finger `touchmove`. `html{touch-action:manipulation}` stops double-tap zoom. Long-press selection and callouts are off except in inputs. `#stage3d` drag uses pointer events and still works. Pinch blocking was only verified in code, not on a real iPhone.
- Tap targets are 44px minimum; inputs and selects use 16px or larger text so iOS doesn't zoom; hover styles sit inside `@media (hover:hover)`.

## Key features and how they work
- **Anvil planner** (`anvil_core.js`): exact search over every combine order using a multiset DP (identical books grouped), Java rules: final level × book multiplier, prior work penalty 2^n − 1, step > 39 = Too Expensive, +1 per conflicting enchantment on the target. Verified against the wiki: 7-enchant god boots = 66 levels; Soul Speed III + Mending = 2 one way, 12 the other. Exact up to ~14 books (budget 1.8M); beyond that it pre-merges identical low books and labels steps "Prep". Also: low-level book stacks with shortfall messages, "Build from lower books", one-big-book comparison, step checklist, full armor set mode.
- **3D trim preview** (`tabs_more.js`): software renderer on a canvas with a depth buffer (not CSS 3D, which flickered). Box UV layout like the game; armor inflate 1 (0.5 for leggings). Per-part priority (`PART_PRI`) breaks exact-depth ties so overlapping armor never flickers.
- **Banners**: up to 6 layers (loom limit), live preview from pattern textures, loom steps and shopping list, edit a layer's color or pattern in place. Ideas: Popular (community-inspired), Letters and numbers (role-based recipes `L`/`B` so colors can be swapped), 47 Flags, Write a word. Letters, flags and popular designs were built by hand and checked by rendering. DigMinecraft asks AI tools not to use its content, so its recipes were not copied.
- **Cross-tab links** (`links.js`): `itemInfo(name, here)` lists every place the app covers an item: recipe and uses, smelting (output and input as plain fact rows without a `tab`; fuel jumps to the Tools fuel card), brewing (potion, ingredient), villagers (sells, buys, workstation), smithing (templates, trim materials, netherite), food, banner patterns, enchantable gear, Tools. `linkItem(name, html)` wraps markup in a button only when the list has at least one jump row, so there are no dead taps. `cardRows()` renders the list for the card and the craft panel. Tapping opens the item card; its buttons call `goTo(tab, arg)`, which sets that tab's state, renders, and flashes the row with a matching `data-at`. `NAV` stores snapshots for the "← Tab" back bar. Manual tab switches call `navClear()`. When adding a new list of items, render rows with `irow()`/`linkItem()` and add a `data-at` so jumps can find the row.
- **Recipes added for links**: smithing template copies (7 diamonds + template + material → 2, materials from the minecraft.wiki duplication table) and the 6 craftable banner patterns.
- **Icons**: blocks are real 3D inventory renders made from the pack's block models at 32×32; flat items use the item texture at 16×16. Show icons at 32px (or whole multiples) to stay crisp.

## Generated files and how to rebuild them
The one-off build scripts from the chat were not kept, so these files are the source of truth now. Only regenerate if needed (new items, new game version):
- `textures.js`: for each item name used anywhere, resolve `assets/minecraft/items/<id>.json` → model → texture. Block models with `elements` are rendered isometrically (GUI rotation 30/225/0, scale 0.625, face shading top 1.0, N/S 0.8, E/W 0.6) into 32×32 PNGs; entity-based items (chests, shield, banners, heads, decorated pot) are rendered from their entity textures; flat items use the 16×16 texture (first frame of animated ones). Leather armor and vines are tinted; potions are `potion_overlay` tinted per potion color under `potion.png`. Encode as base64, dedupe into `TXK`/`TXN`.
- `trims_data.js`: armor layer textures (`entity/equipment/humanoid*/<material>.png`, leather tinted brown + overlay), trim patterns (`trims/entity/humanoid*/<pattern>.png`), palette key and material palettes (`trims/color_palettes`, `_darker` variants when trim material = armor material).
- `banner_data.js`: front face (crop x1–21, y1–41) of each `entity/banner/<pattern>.png` as PNG data URLs, plus pattern names/requirements and the idea lists.
- `fonts/mojangles.woff`: built with fontTools from `font/include/default.json` bitmap providers (ascii.png, nonlatin_european.png; 8px cells, ascent 7, 125 units per pixel, advance = glyph width + 1).
- The pack is in `tools/texture-pack/` (gitignored). Unzip it before regenerating.

## Testing
- `.claude/launch.json` has a `site` config (`python -m http.server 8123 --directory site`) for the Claude Code browser pane. Test at the mobile preset (375×812), in light and dark.
- The service worker serves the saved copy, so unregister it and clear caches before reloading after an edit, or you'll see stale files.
- Useful in-page checks: run `goTo` for every `[data-item]` destination on every tab and confirm it lands and `goBack()` returns; measure buttons under 44px and inputs under 16px.
- Check visual changes by rendering and looking, not just by passing tests.

## Known rough edges / ideas
- Decorated pot icon is a plain textured block (no neck).
- Portal link checker ignores height (Y).
- Banner color swatches are about 39px on phones (8 across is the most that fits), just under the 44px target.
- The item card only knows what the app's data covers. It never says where a mob drop or ore is found.
- Potion order planner shares brews across potions; arrows step is a note, not a brew.
- Villager trade lists have no prices (by choice).
- Ideas Josiah may want later: more banner designs, numbers/letters in other styles, further tabs.
