import React from 'react';
import { OPENAI_COSMETIC_VISUALS } from '../game/cosmeticVisualAssets';

export default function GameHudThemeLayer({ theme, mode }) {
  if (!theme) return null;

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
