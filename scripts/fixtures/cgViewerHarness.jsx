// Real gallery and revision resolution; synthetic, explicitly labelled artwork.
import React from 'react';
import { createRoot } from 'react-dom/client';
import CgGallery from '../../src/components/cg/CgGallery.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import '../../src/index.css';

const parameters = new URLSearchParams(location.search);
const lang = parameters.get('lang') === 'en' ? 'en' : 'fr';
const artwork = (color, label) => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1200"><rect width="1000" height="1200" fill="${color}"/><rect x="12" y="12" width="976" height="1176" fill="none" stroke="white" stroke-width="12"/><circle cx="500" cy="500" r="220" fill="#f4dc9e"/><text x="500" y="900" text-anchor="middle" fill="white" font-size="54">QA ${label}</text></svg>`);
const original = artwork('#173a55', 'ORIGINAL');
const revised = artwork('#164c3b', 'REVISION');
const variant = artwork('#5b354b', 'VARIANT');
const make = (id, type, imagePath, title, characterId = 'qa-owned') => ({
  id, type, imagePath, thumbnailPath: imagePath, title,
  family: 'Canon', universeKey: 'qa-viewer', universeName: 'QA / synthetic artwork',
  characterKey: characterId, characterId, characterName: 'QA', rarity: 'stable',
  publishedAt: '2026-11-01', unlock: { type: 'heroOwned', heroId: characterId },
  rightsClass: 'project-original', contentRating: 'general', canonStatus: 'fixture',
  continuityId: 'qa', ageStatus: 'adult', consentStatus: 'not-applicable',
  credits: 'Synthetic browser fixture', promptId: 'qa-viewer',
  promptSummary: { fr: 'Image synthétique de contrôle de la visionneuse.', en: 'Synthetic image for viewer verification.' },
  sourceRefs: ['scripts/fixtures/cgViewerHarness.jsx']
});
const entries = [
  make('qa-base', 'characterSolo', original, 'QA Base'),
  make('qa-variant', 'introPose', variant, 'QA Variant'),
  make('qa-locked', 'characterSolo', original, 'QA Locked', 'qa-unowned')
];
if (parameters.has('restored')) entries.push(make('qa-absent-dlc', 'introPose', variant, 'QA Restored'));
const revisions = { 'qa-base': [{ revisionId: 'qa-revision', publishedAt: '2026-11-07', imagePath: revised, thumbnailPath: revised }] };
window.__cgViewerQA = { original, revised, variant };
createRoot(document.getElementById('root')).render(<main style={{ height: '100dvh', minHeight: 0 }}>
  <GameDisplayPreferencesSync />
  <CgGallery lang={lang} entries={entries} revisionRegistry={revisions} unlockedHeroes={['qa-owned']} />
</main>);
