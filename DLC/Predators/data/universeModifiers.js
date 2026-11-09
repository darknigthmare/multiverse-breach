// Predators — mission modifiers consumed by the Hub.
export const createUniverseModifier = () => ({ id: 'game_preserve', name: { fr: 'Reserve de chasse', en: 'Game Preserve' }, desc: { fr: 'Le terrain est choisi par les chasseurs: boss +15% PV, cache +25%.', en: 'The hunters choose the ground: boss +15% HP, cache +25%.' }, bossHp: 1.15, reward: 1.25, color: '#8fbf55' });
