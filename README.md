# One in a Million

A playable pixel adventure. Pip is a small human shopkeeper raised by monsters. He looks weak, but a one-in-a-million gift lies dormant in his heart. Rescue Uncle Bones from the old crypt to unlock it.

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

## First chapter

- Explore the family shop courtyard, mossway, and crypt.
- Defeat enchanted armour and a boss to earn three stages of hidden strength.
- Open wooden, iron, and golden chests. Their trash / useful / rare odds are 65/30/5, 35/50/15, and 10/60/30.
- Rare equipment equips automatically. Sell junk and buy healing potions at Silk’s shop.
- Rescue Uncle Bones and bring him home. You can continue exploring afterward or start again.
- The chapter is winnable without rare equipment. Death returns you to the courtyard with your loot and progression intact.

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

This is a complete first playable chapter, rather than the full game. Future chapters can introduce the knight and the rest of Pip’s family.
