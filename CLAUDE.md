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
- Ship each update as a commit; Netlify deploys from the repo.

## Architecture
No framework, no bundler. `site/index.html` loads classic scripts in this order, sharing globals:
1. `data.js`: crafting recipes (`RECIPES`, `TAGS`, helpers `sh()` shaped / `sl()` shapeless).
2. `textures.js`: generated icons. `TXK` = base64 PNGs keyed by hash, `TXN` = item name → key.
3. `app.js`: Crafting tab (search, recipe panel, `select()`, `renderPanel()`, `icon()`, `img()`, `esc()`).
4. `ench_data.js`: enchantments (`ENCH`, `EBY`, conflicts, presets), `anvil_core.js`: exact anvil optimizer (`anvilSolve`, also used by `planner_worker.js` in a Web Worker), `ench.js`: Enchanting tab.
5. `tabs_data.js`: data for Brewing, Trades, Smelting, Smithing, Food, XP, Portals (+ durability, XP sources, librarian odds).
6. `trims_data.js`: armor/trim textures and palettes for the trim preview.
7. `tabs_brew_trade.js`: shared tab state `TS` (saved to localStorage `mc-tabs`), helpers, Brewing and Trades. `tabs_more.js`: Smelting, Smithing (incl. 3D trim preview), Food, XP, Portals. `banner_data.js` + `tabs_banner.js`: Banners. `tabs_shell.js` (last): tab switching, swipe navigation, all event handlers, crafting extras (back history, phone recipe sheet, crafting tree, crafting calculator, smelting links).
- Several features wrap earlier globals (e.g. `renderPanel = function(){...}` in `tabs_shell.js`), so script order matters.
- `style.css` is a single file (base styles, then enchanting, then tab styles). The pixel font is `--disp` (Mojangles, falling back to Pixelify Sans).
- `sw.js` is an offline cache. **Bump `CACHE` (currently `guide-v11`) on every release** and list any new files in it.
- localStorage keys: `mc-tabs` (most tabs), `mc-ench` (enchanting planner), `mc-steps` (anvil checklist).
- Tabs: craft, ench, brew, trade, smelt, smith, banner, food, xp, portal. The bottom bar scrolls sideways and the page swipes between tabs; elements like `.ichips`, `.esubs`, `.pmode`, `#stage3d`, `.sheet` are excluded from page swipes.

## Key features and how they work
- **Anvil planner** (`anvil_core.js`): exact search over every combine order using a multiset DP (identical books grouped), Java rules: final level × book multiplier, prior work penalty 2^n − 1, step > 39 = Too Expensive, +1 per conflicting enchantment on the target. Verified against the wiki: 7-enchant god boots = 66 levels; Soul Speed III + Mending = 2 one way, 12 the other. Exact up to ~14 books (budget 1.8M); beyond that it pre-merges identical low books and labels steps "Prep". Also: low-level book stacks with shortfall messages, "Build from lower books", one-big-book comparison, step checklist, full armor set mode.
- **Librarian hunt**: odds only. Rerolls are random, there is no predictable cycle. 2/3 chance of a book at novice × 1/40 enchantments × 1/max level (Mending 1 in 60). Josiah cures villagers, so prices were left out on purpose.
- **3D trim preview** (`tabs_more.js`): software renderer on a canvas with a depth buffer (not CSS 3D, which flickered). Box UV layout like the game; armor inflate 1 (0.5 for leggings). Per-part priority (`PART_PRI`) breaks exact-depth ties so overlapping armor never flickers.
- **Banners**: up to 6 layers (loom limit), live preview from pattern textures, loom steps and shopping list, edit a layer's color or pattern in place. Ideas: Popular (community-inspired), Letters and numbers (role-based recipes `L`/`B` so colors can be swapped), 47 Flags, Write a word. Letters, flags and popular designs were built by hand and checked by rendering. DigMinecraft asks AI tools not to use its content, so its recipes were not copied.
- **Icons**: blocks are real 3D inventory renders made from the pack's block models at 32×32; flat items use the item texture at 16×16. Show icons at 32px (or whole multiples) to stay crisp.

## Generated files and how to rebuild them
The one-off build scripts from the chat were not kept, so these files are the source of truth now. Only regenerate if needed (new items, new game version):
- `textures.js`: for each item name used anywhere, resolve `assets/minecraft/items/<id>.json` → model → texture. Block models with `elements` are rendered isometrically (GUI rotation 30/225/0, scale 0.625, face shading top 1.0, N/S 0.8, E/W 0.6) into 32×32 PNGs; entity-based items (chests, shield, banners, heads, decorated pot) are rendered from their entity textures; flat items use the 16×16 texture (first frame of animated ones). Leather armor and vines are tinted; potions are `potion_overlay` tinted per potion color under `potion.png`. Encode as base64, dedupe into `TXK`/`TXN`.
- `trims_data.js`: armor layer textures (`entity/equipment/humanoid*/<material>.png`, leather tinted brown + overlay), trim patterns (`trims/entity/humanoid*/<pattern>.png`), palette key and material palettes (`trims/color_palettes`, `_darker` variants when trim material = armor material).
- `banner_data.js`: front face (crop x1–21, y1–41) of each `entity/banner/<pattern>.png` as PNG data URLs, plus pattern names/requirements and the idea lists.
- `fonts/mojangles.woff`: built with fontTools from `font/include/default.json` bitmap providers (ascii.png, nonlatin_european.png; 8px cells, ascent 7, 125 units per pixel, advance = glyph width + 1).
- The pack is in `tools/texture-pack/` (gitignored). Unzip it before regenerating.

## Testing
The chat tested by loading `site/index.html` in jsdom with stubbed canvas/matchMedia and clicking through features, plus Python renders to visually check icons, banners and the 3D model. Those test scripts were lost; recreate a jsdom smoke test (`npm i -D jsdom`) if you need regression checks. Check visual changes by rendering and looking, not just by passing tests.

## Known rough edges / ideas
- Decorated pot icon is a plain textured block (no neck).
- Portal link checker ignores height (Y).
- Potion order planner shares brews across potions; arrows step is a note, not a brew.
- Villager trade lists have no prices (by choice).
- Ideas Josiah may want later: more banner designs, numbers/letters in other styles, further tabs.
