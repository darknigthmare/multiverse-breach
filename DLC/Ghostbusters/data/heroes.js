// Ghostbusters — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'venkman_gb', name: 'Peter Venkman', cat: 'hacker', color: '#7f8c8d' },
    { id: 'stantz_gb', name: 'Ray Stantz', cat: 'tactical', color: '#f4d03f' },
    { id: 'spengler_gb', name: 'Egon Spengler', cat: 'hacker', color: '#85c1e9' },
    { id: 'zeddemore_gb', name: 'Winston Zeddemore', cat: 'marine', color: '#34495e' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'janine_gb', name: 'Janine Melnitz', cat: 'hacker', color: '#e67e22', simpleName: 'Phone Desk Dispatch', secondaryName: 'Containment Unit Call', defenseName: 'Reception Glass Cover', specialName: 'Firehouse Coordination' },
    { id: 'dana_barrett_gb', name: 'Dana Barrett', cat: 'horror', color: '#c0392b', simpleName: 'Zuul Warning', secondaryName: 'Gatekeeper Possession Pulse', defenseName: 'Apartment Door Brace', specialName: 'Rooftop Temple Seal' },
    { id: 'louis_tully_gb', name: 'Louis Tully', cat: 'tactical', color: '#a67c52', simpleName: 'Accountant Panic Swing', secondaryName: 'Keymaster Charge', defenseName: 'Party Guest Evasion', specialName: 'Tax Season Gozer Audit' }
  ]);
}
