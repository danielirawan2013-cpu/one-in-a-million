# One in a Million

A playable pixel adventure. Pip is a small human shopkeeper raised by monsters. He looks weak, but a one-in-a-million gift lies dormant in his heart. Protect his adopted monster family and discover what that strength is for.

[Play the game](https://danielirawan2013-cpu.github.io/one-in-a-million/) · [Source on GitHub](https://github.com/danielirawan2013-cpu/one-in-a-million)

## Play locally

No installation or build is needed. Serve the `dist/` directory over HTTP:

```sh
python3 -m http.server 5173 --directory dist
```

Open http://localhost:5173. Opening `index.html` directly with `file://` will not load JavaScript modules.

## Controls

| Action | Key |
| --- | --- |
| Move | WASD or arrows |
| Attack | Space (hold for repeated swings) |
| Interact | E |
| Dodge | Shift |
| Heart burst | Q, after the first unlock |
| Heal | H |
| Pause | Escape |

Touch movement and action buttons appear on small screens. Sound is optional. Progress saves in local browser storage; it does not sync between devices.

## Three playable chapters

1. Rescue Uncle Bones from the old crypt and bring him home.
2. Rowan, Pip’s knight friend and regular shop customer, takes a royal dragon bounty to pay for her own family’s medicine. Reach the family archive and find Pip’s portrait.
3. Before Rowan attacks Grandma, Pip stops her sword with his hidden strength and reveals that the monsters raised him. The two fight together against the royal official who invented the bounty to steal Grandma’s treasure.

Silk runs the family shop, Uncle Bones has bad knees, and Grandma’s treasure includes birthday presents. Pip remains a small human in his oversized apron throughout.

- Six regions with enemies, bosses and wooden, iron and golden chests. Trash / useful / rare odds: 65/30/5, 35/50/15 and 10/60/30.
- Rare equipment equips automatically. Sell junk and buy healing potions at Silk’s shop.
- Sword attacks have a brief wind-up, a forward strike, and recovery. Damage lands once in front; dodging cancels a swing. Enemies telegraph their attacks and lock their direction.
- All chapters are winnable without rare equipment. Death keeps loot and progression.
- Original chapter-one saves continue into chapter two with equipment and unlocked strength intact. Choose **Continue adventure** after refreshing.

## Development

The game uses Canvas 2D and plain JavaScript modules. No third-party runtime dependencies.

- `dist/engine.mjs`: gameplay state, combat, interaction, progression and checkpoints.
- `dist/world.mjs`: map and enemy definitions.
- `dist/art.mjs`: original pixel sprites, tiles and rendering.
- `dist/game.mjs`: browser controls, interface, sound and saves.
- `dist/core.mjs`: loot tables and shared helpers.

Run meaningful gameplay tests with Node 20 or later:

```sh
node --test tests.mjs
```

## GitHub Pages

The included workflow tests the game and deploys `dist/`. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Pushes to `main` then publish the game. GitHub Free requires a public repository for Pages; private source can also be played locally.

## Credits

Pixel art, map layouts, story, and sounds are authored for this project. Silkscreen by Jason Kottke is bundled under the SIL Open Font License; see `dist/assets/OFL.txt`.

Version 0.2 includes the planned family-and-knight story across three playable chapters.
