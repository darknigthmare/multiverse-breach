import { drawNativeSuperVisualsWave11, getNativeSuperVisualStateWave11, supportsNativeSuperWave11, supportsTrackedProjectileVisualWave11 } from './nativeSuperVisualsWave11.js';
import { drawFf8SuperVisuals, getFf8SuperVisualState, sampleNativeSuperMotion } from './ff8SuperVisuals.js';
import { drawPartySuperVisuals, getPartySuperVisualState, samplePartySuperMotion } from './partySuperVisuals.js';
import { drawNativeSuperVisualsWave4, getNativeSuperVisualStateWave4 } from './nativeSuperVisualsWave4.js';
import { drawNativeSuperVisualsWave5, getNativeSuperVisualStateWave5, sampleNativeSuperMotionWave5, supportsTrackedProjectileVisualWave5 } from './nativeSuperVisualsWave5.js';
import { drawNativeSuperVisualsWave6, getNativeSuperVisualStateWave6, sampleNativeSuperMotionWave6, supportsNativeSuperWave6, supportsTrackedProjectileVisualWave6 } from './nativeSuperVisualsWave6.js';
import { drawNativeSuperVisualsWave7, getNativeSuperVisualStateWave7, sampleNativeSuperMotionWave7, supportsNativeSuperWave7, supportsTrackedProjectileVisualWave7, preloadNativeSuperAssetsWave7 } from './nativeSuperVisualsWave7.js';
import { drawNativeSuperVisualsWave8, getNativeSuperVisualStateWave8, sampleNativeSuperMotionWave8, supportsNativeSuperWave8, supportsTrackedProjectileVisualWave8 } from './nativeSuperVisualsWave8.js';
import { drawNativeSuperVisualsWave9, getNativeSuperVisualStateWave9, supportsNativeSuperWave9, supportsTrackedProjectileVisualWave9 } from './nativeSuperVisualsWave9.js';

import { drawNativeSuperVisualsWave10, getNativeSuperVisualStateWave10, supportsNativeSuperWave10, supportsTrackedProjectileVisualWave10 } from './nativeSuperVisualsWave10.js';

export const getCharacterSuperVisualState = options => getFf8SuperVisualState(options) || getPartySuperVisualState(options) || getNativeSuperVisualStateWave4(options) || getNativeSuperVisualStateWave5(options) || getNativeSuperVisualStateWave6(options) || getNativeSuperVisualStateWave7(options) || getNativeSuperVisualStateWave8(options) || getNativeSuperVisualStateWave9(options) || getNativeSuperVisualStateWave10(options) || getNativeSuperVisualStateWave11(options);
export const supportsTrackedCharacterSuperVisual = profile => supportsTrackedProjectileVisualWave5(profile) || supportsTrackedProjectileVisualWave6(profile) || supportsTrackedProjectileVisualWave7(profile) || supportsTrackedProjectileVisualWave8(profile) || supportsTrackedProjectileVisualWave9(profile) || supportsTrackedProjectileVisualWave10(profile) || supportsTrackedProjectileVisualWave11(profile);
export const supportsConfirmedCharacterSuperContact = profile => supportsNativeSuperWave6(profile) || supportsNativeSuperWave7(profile) || supportsNativeSuperWave8(profile) || supportsNativeSuperWave9(profile) || supportsNativeSuperWave10(profile) || supportsNativeSuperWave11(profile);
export const preloadCharacterSuperAssets = actors => preloadNativeSuperAssetsWave7(actors);
export const drawCharacterSuperVisuals = (ctx, state) => state?.family === 'party' ? drawPartySuperVisuals(ctx, state)
  : state?.family === 'native-wave4' ? drawNativeSuperVisualsWave4(ctx, state)
    : state?.family === 'native-wave5' ? drawNativeSuperVisualsWave5(ctx, state)
      : state?.family === 'native-wave6' ? drawNativeSuperVisualsWave6(ctx, state)
        : state?.family === 'native-wave7' ? drawNativeSuperVisualsWave7(ctx, state)
          : state?.family === 'native-wave8' ? drawNativeSuperVisualsWave8(ctx, state)
            : state?.family === 'native-wave9' ? drawNativeSuperVisualsWave9(ctx, state)
              : state?.family === 'native-wave10' ? drawNativeSuperVisualsWave10(ctx, state)
                : state?.family === 'native-wave11' ? drawNativeSuperVisualsWave11(ctx, state) : drawFf8SuperVisuals(ctx, state);
export const sampleCharacterSuperMotion = options => {
  const ff8 = sampleNativeSuperMotion(options);
  if (ff8.x || ff8.y) return ff8;
  const party = samplePartySuperMotion(options);
  if (party.x || party.y) return party;
  const wave5 = sampleNativeSuperMotionWave5(options);
  if (wave5.x || wave5.y) return wave5;
  const wave6 = sampleNativeSuperMotionWave6(options);
  if (wave6.x || wave6.y) return wave6;
  const wave7 = sampleNativeSuperMotionWave7(options);
  if (wave7.x || wave7.y) return wave7;
  const wave8 = sampleNativeSuperMotionWave8(options);
  return wave8.x || wave8.y ? wave8 : party;
};
