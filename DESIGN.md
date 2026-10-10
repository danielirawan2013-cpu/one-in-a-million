---
name: One in a Million
description: A small human hero in a dusk courtyard storybook.
colors:
  night: "#162526"
  deep: "#102022"
  line: "#39504b"
  paper: "#eee3c9"
  ink: "#3e3433"
  muted: "#70624f"
  gold: "#edc477"
  green: "#92b89b"
  coral: "#ce715f"
  parchment-trim: "#bc9962"
  parchment-divider: "#c9b794"
  journal-copy: "#6b5847"
  journal-track: "#d6c7a8"
  journal-progress: "#846237"
  button-green: "#304a40"
  button-green-hover: "#3e5d4c"
  button-paper: "#f7ecd4"
  secondary-ink: "#65513f"
  secondary-border: "#b5a080"
  quiet-ink: "#d1dbc9"
  quiet-hover: "#243635"
typography:
  display:
    fontFamily: "Silkscreen, monospace"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.05
  headline:
    fontFamily: "Georgia, serif"
    fontSize: "20px"
    fontWeight: 700
    letterSpacing: "-.02em"
  scene-title:
    fontFamily: "Silkscreen, monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
  journal-body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
  scene-body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    lineHeight: 1.65
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "11px"
  key:
    fontFamily: "Silkscreen, monospace"
    fontSize: "11px"
rounded:
  key: "2px"
  quiet: "4px"
spacing:
  compact: "4px"
  small: "8px"
  control: "12px"
  inset: "16px"
  section: "22px"
  masthead: "26px"
components:
  button-primary:
    backgroundColor: "{colors.button-green}"
    textColor: "{colors.button-paper}"
    padding: "11px 16px"
  button-primary-hover:
    backgroundColor: "{colors.button-green-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-ink}"
    padding: "11px 16px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.quiet-ink}"
    rounded: "{rounded.quiet}"
    padding: "8px 10px"
  button-quiet-hover:
    backgroundColor: "{colors.quiet-hover}"
    textColor: "{colors.gold}"
  journal:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "22px 21px 18px"
---

# Design System: One in a Million

## Overview

**Creative North Star: "Dusk Courtyard Storybook"**

A dusk courtyard storybook in which the world is drawn in crisp pixels and the supporting interface reads like a small parchment journal. Deep evergreen frames warm candle gold, pale paper, and restrained coral. The small human silhouette remains readable against architecture and foliage as his strength grows.

**Key Characteristics:**
- Code-drawn pixel world with a visibly small human hero.
- Parchment journal with compact, readable status information.
- Warm gold for power and interaction; coral for danger.

## Colors

The primary evergreen frame supports candle gold and soft parchment; Canvas art uses richer local shading rather than recoloring the entire interface.

- **Primary:** night and deep provide the frame; button green makes scene actions tangible; green marks location and calm status.
- **Secondary:** gold identifies strength, coins, interactions, and keyboard focus. Journal progress uses a darker warm brown against paper.
- **Tertiary:** coral belongs to damage and danger. Violet shades in sprites and rare loot distinguish unusual treasures.
- **Neutral:** paper and ink define the journal; trim and divider colors establish binding and sections; muted tones keep supporting copy subordinate.

## Typography

Silkscreen is self-hosted from `dist/assets/Silkscreen-Regular.ttf`. It supplies the wordmark, journal name, scene titles, keys, and short Canvas labels. Georgia supplies journal headlines and italic field notes; the system stack handles continuous copy and controls.

The wordmark's second line grows to (29px). Journal secondary headings use (18px), field-note headings (14px), and the journal name (13px). Scene copy and headings shrink at the tablet and phone breakpoints; phone journal copy is (11px).

**The Pixel Labels Rule.** Reserve the pixel face for short identity, status, and scene text; keep continuous journal reading in the system stack.

## Layout

The centered application is capped at (1440px), with desktop padding (26px 40px 18px). The main grid pairs a flexible viewport with a (286px) journal and a (22px) gap. At (1100px) the journal becomes (250px) and the gap (17px). At (800px) the layout stacks, the journal becomes two equal columns, and touch controls appear beneath the viewport. At (480px), application padding is (16px 11px 13px) and the footer stacks.

The game Canvas is (480 × 304), scaled with pixelated rendering. Its desktop viewport keeps that aspect ratio; phones use (1.4). Status stays inside the viewport and controls remain below it. Journal sections use borders and compact vertical spacing; inventory alone scrolls within a (150px) maximum height.

## Elevation & Depth

Canvas depth comes from pixel shading, ground shadows, and entities sorted by their feet. UI depth uses a dark ambient shadow around the viewport, a warm paper panel above a translucent dark scene veil, and a smaller loot-toast shadow. Exact shadow values live in the sidecar.

Movement belongs to the world: walking, lanterns, insects, directional sword swings, and expanding gold power bursts. Reduced motion removes camera shake and makes camera following immediate; the existing ambient world animations continue.

## Shapes

The world and journal use square forms. The viewport has a framed border (4px desktop; 3px phone). Paper surfaces have warm top and bottom binding borders (4px). Only quiet controls and keyboard keys use small corner radii. Progress bars are straight, thin rectangles; potential uses three separated segments.

## Components

- **Scene actions:** square green primary button, parchment text, stronger green hover, and a visible warm focus outline. Secondary actions are transparent with a warm thin border. Desktop primary minimum height is (44px); mobile scene controls follow the smaller implemented overlay sizes.
- **Header controls:** quiet transparent buttons with small rounded corners; hover adds a dark green surface and gold text. Icon labels disappear at the tablet breakpoint while accessible labels remain.
- **Journal:** paper surface, Georgia section headings, thin warm dividers, compact quest checkboxes, pixel item art, and earned potential segments. Completed quests turn green; rare item names turn violet.
- **Keyboard hints:** compact pixel lettering in dark bordered keys. Instruction overlays reverse them onto warm paper.
- **Viewport overlays:** DOM text sits over the Canvas; story and dialogue panels center in a dark veil, constrain width, and scroll when space is short. Health and coins use translucent dark backplates.
- **Touch controls:** a three-column directional pad with square buttons, plus Dodge, Use, and a larger gold Attack action.

**The Crisp World Rule.** Draw and scale all sprite and inventory artwork without image smoothing; retain real text for readable interface content.

## Do's and Don'ts

### Do:
- **Do** render sprites, inventory art, and the world with pixel smoothing disabled.
- **Do** use real DOM text and visible keyboard focus for overlays and controls.
- **Do** keep the human hero physically small as potential grows.
- **Do** reflow the journal into two columns and reveal touch controls at the implemented mobile breakpoint.

### Don't:
- **Don't** substitute webpage cards for the Canvas world.
- **Don't** use the pixel face for continuous journal body copy.
- **Don't** retain camera shake when reduced motion is requested.

## Combat Motion
A short wind-up leads into an eased forward sword strike, then recovery. The hand, grip and blade remain connected to Pip’s directional sprite; upward swings render behind his body. Enemies show a forward warning before swinging in a locked direction. Contact produces brief knockback and a hit flash. Dodge cancels a swing. Reduced motion removes the blade trail and camera shake while retaining readable attack timing.

## Expanded adventure surfaces
The family-shop interior uses warm wooden floorboards, a woven rug, shelves, and Silk’s counter. Admin tools share parchment dialogue styling with labelled native fields and scrolling. Z toggles Admin; F parries, R uses heart burst. Scrap King’s V special pauses gameplay for copper fragments, a raised sword and cinematic letterboxing, shortened with reduced motion. Eleven named swords retain crisp PNG pixels in hands and inventory.

## Ability Dock and Weapon Effects
A framed ability dock sits directly below the Canvas, with keys, cooldowns, unlock status and the ultimate charge track. It uses four columns on larger screens, three on phones. Inventory and Admin use a viewport-sized veil with a constrained scrolling parchment panel so buttons remain reachable. Admin actions update controls in place. Sword ultimates share timing and camera composition but use distinct names, colors and pixel motifs: suns, crescents, flames, shards, leaves, portals, lightning, fangs, stars, wisps and scrap. No camera shake, orbital movement or lightning animation in reduced motion.

### Region and boss identities
The established crisp Canvas pixel world gives all nineteen creature bosses individually drawn anatomy, silhouettes, shading, and attack poses. Main expedition creatures include an iron behemoth, archive owl, salvage scorpion, furnace salamander, elder stag, silk spider matriarch, tide crab, prism moth, meteor armadillo, astral ray, brass minotaur, and command nautilus. Their richer local palettes express metal, feathers, shells, foliage, and elemental light within the existing evergreen frame and parchment journal.

The Lake Tempest has a broad-winged thunder wyvern body. The six divine creatures carry distinct forms: Rimewyrm coils as an icy serpent with blade-like fins and an ice crown; the oath basilisk has two heads and suspended balance pans; the solar phoenix has layered feathers and a streaming tail; the lunar medusa has a crescent jellyfish bell and ribbon tentacles; the memory cuttlefish has page-like fins and carries an open folio; the sovereign griffin has a lion body, hooked beak, and six wings. Creature strikes use claws, pincers, fangs, impact marks, or elemental effects appropriate to their anatomy. Health bars scale to creature width and sit above each creature's height.

The divine arc retains six distinct landscapes. Region backgrounds use authored terrain and landmarks. Frost warnings use dark red against the pale floor; other divine warnings use pale gold.

### The Broken Oath epilogue
The oath hall extends the existing pixel world with barred cells, a cracked circular seal, and muted stone. Rowan has an authored human silhouette: uncovered brown hair, blue steel armour, coral sash, and a connected sword. Shield lancers read through tall kite shields and upright spears; masked arbalists use dark hoods and wide crossbows. Preserve these silhouette differences at phone scale.

The confession and aftermath use the existing parchment overlay with one paragraph per page, Continue/Previous actions, and a final explicit fight or return action. A compact health strip names Rowan’s current stage above the duel; the journal supplies the corresponding tactic. Authored warnings show her broad sweep or directional rush, lancers’ narrow thrusts, and arbalists’ locked aim lines before damage. Warning geometry must remain visible through the wind-up. Saved progress resumes the current duel stage and defeated remnant soldiers; it does not preserve partial enemy health.

### Divine sword identities
Six guaranteed god rewards use separate crisp PNG silhouettes in the hand and inventory: Rimecrown’s serrated ice blade, Oathbreaker’s narrow gold blade and broad guard, Solstice’s flame-shaped blade, Tidemirror’s curved blue blade, Recollection’s violet blade and asymmetric guard, and Heavensfall’s gold blade with a crown-like guard. Their ability names and effects change with equipment: freezing fields, binding chains, burning eruptions, returning tides, repeated memory echoes, and long crown-severing strikes. Ultimate titles and motifs follow the equipped sword while keeping the established cinematic composition and shortened reduced-motion timing.

### Divine charge and impact effects
God charges and strikes use authored pixel marks: frost shards, oath chain links, solar flames, lunar crescents, open pages, and crowns. Match each motif to its creature and marked damage zone rather than relying on palette alone. Reduced motion fixes charge rotation, removes converging charge sparks and rising strike marks, and disables camera shake; brief impact fades, changing strike spread, and oath-seal bursts remain. Keep the warning and combat timing readable in both motion settings.
