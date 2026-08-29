const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Calcule une entree de tag relative au rival plutot qu'au bord historique du
// camp. Le resultat reste deterministe et peut etre verifie sans lancer Canvas.
export const resolveFighterTagEntry = ({
  activeX,
  opponentX,
  side = 'player',
  width = 960,
  spacing = 56,
  entrySpeed = 150
}) => {
  const fallbackDirection = side === 'player' ? 1 : -1;
  const opponentDirection = Number.isFinite(opponentX)
    ? (Math.sign(opponentX - activeX) || fallbackDirection)
    : fallbackDirection;
  const x = clamp(activeX - opponentDirection * spacing, 78, width - 78);
  const facing = Number.isFinite(opponentX)
    ? (Math.sign(opponentX - x) || opponentDirection)
    : opponentDirection;
  return {
    x,
    vx: opponentDirection * entrySpeed,
    facing
  };
};
