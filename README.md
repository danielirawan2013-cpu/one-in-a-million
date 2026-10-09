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
| Inventory / change weapon | E |
| Interact | G |
| Dodge | Shift |
| Parry | F |
| Heart burst | R, after the first unlock |
| Admin panel | Z |
| Sword ultimate | V, with a full ultimate meter |
| Charge ultimate | Hold U while standing still |
| Sweep / Guard / Rush | J / K / L |
| Mending Light / Cyclone / Starcall | C / X / B |
| Hammer lightning | T |
| Heal | H |
| Pause | Escape |

Touch movement and action buttons appear on small screens. Sound is optional. Progress saves in local browser storage; it does not sync between devices.

## Eight playable chapters

1. Rescue Uncle Bones from the old crypt and bring him home.
2. Rowan, Pip’s knight friend and regular shop customer, takes a royal dragon bounty to pay for her own family’s medicine. Reach the family archive and find Pip’s portrait.
3. Before Rowan attacks Grandma, Pip stops her sword with his hidden strength and reveals that the monsters raised him. The two fight together against the royal official who invented the bounty to steal Grandma’s treasure.

4. Follow the collector’s stolen treasure into the workyard and foundry.
5. Help Silk repair the forest wards and find the people left behind.
6. Help Rowan rescue travellers and restore the coastal beacon.
7. Discover the origin of Pip’s gift in the star vault.
8. Save the dungeon heart and return home together.

Silk runs the family shop, Uncle Bones has bad knees, and Grandma’s treasure includes birthday presents. Pip remains a small human in his oversized apron throughout.

- Seventeen regions including a walkable family shop, with enemies, bosses and wooden, iron and golden chests. Trash / useful / rare odds: 65/30/5, 35/50/15 and 10/60/30.
- Eleven named sword skins are obtainable: any sword drops at 0.15% from wood, 0.45% from iron, and 0.9% from gold. Scrap King is admin exclusive. Equip owned swords in the inventory. Sell junk, buy potions, and open 50-coin mystery chests inside Silk’s shop.
- Sword attacks have a brief wind-up, a forward strike, and recovery. Damage lands once in front; dodging cancels a swing. Enemies telegraph their attacks and lock their direction.
- Parry a forward strike just before impact to stagger enemies and strengthen your next swing. Sword sparks, dodge trails, parry flashes and power effects support reduced motion.
- Admin password: **3275**. Equip Scrap King (999 damage), heal, add coins, unlock potential, give any item, and unlock **King’s Verdict**. King’s Verdict is Scrap King’s exclusive ultimate. Fill the meter in Admin or hold U. Each normal sword has its own themed ultimate cutscene, unlocked with the first potential stage; all ultimates spend a full meter and have a 12-second cooldown. These are local single-player cheats; the password is visible in public source and does not protect accounts or a server.
- Six additional abilities unlock in pairs at potential levels 1, 2, and 3. The ability bar below the game shows keys, unlocks and cooldowns.
- After rescuing Uncle Bones, swing toward the lake from its right bank to summon the Lake Tempest. Dodge its telegraphed lightning; defeating it guarantees Thunderwake hammer. T summons lightning while the hammer is equipped. A full satchel leaves the reward in a chest.
- Use the Full screen header button to expand the game where the browser supports fullscreen.
- Replay the extended expedition to hunt rare swords while keeping your loot.
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

Version 0.3 preserves the planned family-and-knight story, expands it to eight chapters, and adds sword skins, the shop interior, parry, effects, and local admin tools.

## The secret divine story (v0.4.0)

After rescuing Uncle Bones, swing a sword towards the lake in Bramble Hollow to summon the Lightning God. Defeating it guarantees Thunderwake and opens a portal on a new stone path into the lake. Walk to the portal and press **G**. If you already defeated the boss, the portal appears when you continue your save.

Three additional chapters contain six realms and six god fights: Rimewyrm (frost), Oras (oaths), Aurel (sun), Nym (moon), Mnemos (memory), and Veyr (the crown). Clear each god and sentinel, then read the recovered memory beside the northern stair to continue. Their attacks mark danger before impact and have safe areas.

Pip discovers he is a banished demigod while keeping his small human appearance and adopted monster family. This optional arc preserves the original eight-chapter story. The southern portal returns to the family shop; returning or falling retains your divine checkpoint, weapons, loot, and expedition progress.

Bosses now have distinct silhouettes: an ice dragon, oath judge, solar deity, moon spirit, floating memory keeper, winged sovereign, and ten distinct expedition constructs. Regions have separate authored landscapes, including frozen sky, lava channels, tide pools, floating library shelves, salvage rails and celestial stairs.
