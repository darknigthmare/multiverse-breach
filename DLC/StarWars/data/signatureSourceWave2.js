// Star Wars — definitions consumed by src/game/signatureSourceWave2.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave2Rows({ hero, saberNote }) {
  return (hero("Star Wars", "ahsoka_padawan", "Skyguy Battlefield Lesson", "Padawan Lightsaber Combination", "slash", 88, "sw-ahsoka", {"hits":2,"color":"#7ed957","note":saberNote}));
}

export function createSignatureWave2Rows2({ hero, saberNote }) {
  return (hero("Star Wars", "ahsoka_adult", "Fulcrum Twin-Saber Sweep", "White Sabers Combination", "slash", 88, "sw-ahsoka", {"hits":2,"color":"#f4f8ff","note":saberNote}));
}

export function createSignatureWave2Rows3({ hero, saberNote }) {
  return (hero("Star Wars", "ahsoka", "Siege of Mandalore Break", "Mandalore Twin Sabers", "slash", 88, "sw-ahsoka", {"hits":2,"color":"#4ea8ff","note":saberNote}));
}

export function createSignatureWave2Rows4({ hero, saberNote }) {
  return (hero("Star Wars", "aayla_secura", "Commander Bly Formation", "Aayla Lightsaber Combination", "slash", 88, "sw-aayla", {"hits":2,"color":"#6cc7ff","note":saberNote}));
}

export function createSignatureWave2Rows5({ hero, saberNote }) {
  return (hero("Star Wars", "obi_wan", "Obi-Wan Kenobi Origin Burst", "Obi-Wan Lightsaber Riposte", "slash", 88, "sw-obiwan", {"hits":2,"color":"#72caff","note":saberNote}));
}

export function createSignatureWave2Rows6({ hero, saberNote }) {
  return (hero("Star Wars", "obiwan", "Kenobi Final Lesson", "Kenobi Lightsaber Riposte", "slash", 88, "sw-obiwan", {"hits":2,"color":"#72caff","note":saberNote}));
}

export function createSignatureWave2Rows7({ hero, saberNote }) {
  return (hero("Star Wars", "yoda", "Yoda Origin Burst", "Yoda Lightsaber Combination", "slash", 88, "sw-yoda", {"hits":3,"color":"#7ddc68","note":saberNote}));
}

export function createSignatureWave2Rows8({ hero, saberNote }) {
  return (hero("Star Wars", "darth_maul", "Shadow Collective Dominion", "Maul Double-Bladed Saber", "slash", 88, "sw-maul", {"hits":2,"color":"#ff4141","note":saberNote}));
}

export function createSignatureWave2Rows9({ hero }) {
  return (hero("Star Wars", "leia_organa", "Leia Organa Origin Burst", "Leia Blaster Volley", "barrage", 310, "sw-leia", {"hits":3,"color":"#ff655c","note":"Personal blaster fire, not a Death Star strike or an army summoned by Leia. Three-contact timing is a game adaptation."}));
}

export function createSignatureWave2Rows10({ hero }) {
  return (hero("Star Wars", "leia", "Resistance Beacon", "Leia Blaster Volley", "barrage", 310, "sw-leia", {"hits":3,"color":"#ff655c","note":"Personal blaster fire, not a Death Star strike or an army summoned by Leia. Three-contact timing is a game adaptation."}));
}

export function createSignatureWave2Rows11({ enemy }) {
  return (enemy("Star Wars", "Stormtrooper Patrol", null, "E-11 Blaster Volley", "barrage", 310, "sw-stormtrooper", {"hits":3,"color":"#ff655c"}));
}

export function createSignatureWave2Rows12({ enemy }) {
  return (enemy("Star Wars", "Stormtrooper Squad", null, "E-11 Blaster Volley", "barrage", 310, "sw-stormtrooper", {"hits":3,"color":"#ff655c"}));
}

export function createSignatureWave2Rows13({ enemy }) {
  return (enemy("Star Wars", "Stormtrooper Fireteam", null, "E-11 Blaster Volley", "barrage", 310, "sw-stormtrooper", {"hits":3,"color":"#ff655c"}));
}

export function createSignatureWave2Rows14({ enemy }) {
  return (enemy("Star Wars", "Droideka Shield Droid", null, "Droideka Twin Blasters", "barrage", 330, "sw-droideka", {"hits":4,"color":"#ff655c","note":"Twin-blaster fire only. Existing defense is untouched; no free rolling transformation or permanent shield is granted."}));
}

export function createSignatureWave2Rows15({ enemy }) {
  return (enemy("Star Wars", "Droideka Shield Unit", null, "Droideka Twin Blasters", "barrage", 330, "sw-droideka", {"hits":4,"color":"#ff655c","note":"Twin-blaster fire only. Existing defense is untouched; no free rolling transformation or permanent shield is granted."}));
}

export function createSignatureWave2Rows16({ enemy }) {
  return (enemy("Star Wars", "Tusken Sand Raider", null, "Gaffi Stick Strike", "slash", 78, "sw-tusken"));
}

export function createSignatureWave2Rows17({ enemy }) {
  return (enemy("Star Wars", "Inquisitor Hunter", null, "Inquisitor Saber Sweep", "slash", 92, "sw-inquisitor", {"hits":2,"color":"#ff4141","note":"Inquisitor combat family, not an identity grant for the Grand Inquisitor; descriptive saber action only."}));
}

export function createSignatureWave2Rows18({ enemy }) {
  return (enemy("Star Wars", "Darth Maul Assassin", "Double Saber Spin Sweep", "Double-Bladed Saber Combination", "slash", 95, "sw-maul", {"hits":2,"color":"#ff4141"}));
}

export function createSignatureWave2Rows19({ enemy }) {
  return (enemy("Star Wars", "Darth Maul Phantom", "Duel of the Fates Rush", "Double-Bladed Saber Combination", "slash", 95, "sw-maul", {"hits":2,"color":"#ff4141"}));
}

export function createSignatureWave2Rows20({ enemy }) {
  return (enemy("Star Wars", "Count Dooku Sith Lord", "Force Lightning Shock", "Dooku Force Lightning", "lightning", 300, "sw-dooku", {"hits":3,"color":"#9fbeff"}));
}

export function createSignatureWave2Rows21({ enemy }) {
  return (enemy("Star Wars", "Emperor Palpatine", "Unlimited Power", "Sidious Force Lightning", "lightning", 330, "sw-palpatine", {"hits":4,"color":"#bda9ff"}));
}

export function createSignatureWave2Rows22({ enemy }) {
  return (enemy("Star Wars", "Darth Vader Sith Lord", "Dark Side Corridor Advance", "Vader Corridor Saber Assault", "slash", 95, "sw-vader", {"hits":3,"color":"#ff4141"}));
}
