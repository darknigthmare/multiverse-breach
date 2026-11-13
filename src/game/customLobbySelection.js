// A select can retain its previous value while its options change. The action
// must use exactly the candidate currently visible in this page of the lobby.
export function resolveCustomThreatCandidate(visibleEntries, candidateId) {
  return visibleEntries.find(entry => entry.id === candidateId) || visibleEntries[0] || null;
}
