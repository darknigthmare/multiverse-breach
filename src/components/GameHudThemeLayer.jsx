import React from 'react';
import {
  GAME_HUD_THEME_MODES,
  OPENAI_COSMETIC_VISUALS
} from '../game/cosmeticVisualAssets';

const GAME_HUD_THEME_MODE_SET = new Set(GAME_HUD_THEME_MODES);

export default function GameHudThemeLayer({ theme, mode }) {
  if (!theme || !GAME_HUD_THEME_MODE_SET.has(mode)) return null;

  const frame = theme.frame || OPENAI_COSMETIC_VISUALS.hudTheme.image;
  const accent = theme.color || '#39c5bb';

  return (
    <span
      className="game-hud-theme-layer"
      data-game-hud-theme={theme.id}
      data-game-hud-mode={mode}
      style={{ '--game-hud-accent': accent }}
      aria-hidden="true"
    >
      {theme.image && (
        <span
          className="game-hud-theme-backdrop"
          style={{ backgroundImage: `url(${theme.image})` }}
        />
      )}
      <img
        className="game-hud-theme-frame"
        src={frame}
        alt=""
        draggable="false"
      />
    </span>
  );
}
