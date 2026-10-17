// Explicit additions. The two Wraithverge upgrades do not create new roster IDs.
export const SIGNATURE_WAVE5_REFERENCES = Object.freeze({
  're-zombie': 'https://game.capcom.com/residentevil/en/exfile-1-1.html',
  're-cerberus': 'https://game.capcom.com/residentevil/en/exfile-1-13.html',
  're-licker': 'https://game.capcom.com/residentevil/en/exfile-1-6.html',
  're-hunter': 'https://game.capcom.com/residentevil/en/exfile-1-2.html',
  're-nemesis': 'https://blog.playstation.com/2020/05/14/nemesis-invades-resident-evil-resistance-in-new-update-live-now/',
  're-tyrant': 'https://game.capcom.com/manual/resistance/en/ps4/page/3/7'
});
const enemy = (enemyName, legacyName, name, range, source, note) => Object.freeze({
  key: `Resident Evil::${enemyName}`, universe: 'Resident Evil', enemyName, legacyName,
  name, style: 'slash', range, source, wave: 5, delivery: 'melee', note
});
export const SIGNATURE_WAVE5_ROWS = Object.freeze([
  enemy('T-Virus Zombie', null, 'Zombie Bite', 62, 're-zombie',
    'Contact bite only. No infection, grapple, resurrection or instant death is added.'),
  enemy('Zombie Dog (Cerberus)', null, 'Cerberus Bite', 68, 're-cerberus',
    'Existing mixed catalog label preserved. Bite family only; no pack AI, leap or automatic knockdown.'),
  enemy('Ceiling-Clinging Licker', null, 'Licker Tongue Lash', 155, 're-licker',
    'Tongue contact at extended melee range. No visual targeting power, hearing AI, ceiling traversal or auto-kill is granted.'),
  enemy('Hunter Beta', null, 'Hunter Claw Strike', 82, 're-hunter',
    'Hunter claw family only. No decapitation, leap, resistance change or conversion to the Alpha incarnation.'),
  enemy('Nemesis T-Type', 'Tentacle Bind Slam', 'Nemesis Tentacle Sweep', 145, 're-nemesis',
    'Shared tentacle attack family only; no remake parasite conversion, flamethrower or stage transformation added.'),
  enemy('Mr. X T-00 Tyrant', 'Stalker Door Breach', 'Tyrant Hook Punch', 88, 're-tyrant',
    'T-103 punch family only. No Resistance controller, scripted door destruction, grab execution or invulnerability.')
]);
const spirits = Object.freeze({ summonAgent: 'wraithverge-spirit',
  note: 'Four independently steered spirits in RPG and Smash; contacts require collision. One contact per spirit, fixed confirmed targets, bounded lifetime and caster-KO cleanup are Nexus adaptations. No repeated source touch damage, free retargeting, mana economy or copied source artwork.',
  visualStatus: 'procedural spirit heads/tails; original creature artwork not supplied' });
export const SIGNATURE_WAVE5_UPGRADES = Object.freeze({ hexen_parias: spirits, 'Hexen::Traductus': spirits });
