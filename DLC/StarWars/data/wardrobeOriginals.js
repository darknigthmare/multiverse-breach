// Star Wars — definitions consumed by src/game/wardrobeOriginals.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesigns({ p }) {
  return (p('Star Wars','luke','Veilleur de Convergence','Convergence watcher','Sur-tunique gris perle et ceinture tissée, conserver main gantée et tenue de base ciblée ; aucune lame de couleur nouvelle accordée par le costume.','Pearl-grey over-tunic and woven belt, retain the gloved hand and target base outfit; no new blade color granted by a costume.'));
}

export function createSignatureDesigns2({ p }) {
  return (p('Star Wars','han_solo','Courrier des Failles','Rift courier','Veste de vol originale usée, patch portuaire Nexus et coutures sable ; conserver holster et silhouette de Han sans costume Jedi.','Worn original flight jacket, Nexus port patch and sand seams; retain Han’s holster and silhouette, no Jedi costume.'));
}

export function createSignatureDesigns3({ p }) {
  return (p('Star Wars','leia_organa','Diplomate du Nexus','Nexus diplomat','Sur-veste de commandement ivoire, col net et broche Nexus ; coiffure, âge et identité inchangés, tenue pratique et non sexualisée.','Ivory command over-jacket, clean collar and Nexus brooch; unchanged hair, age and identity, practical nonsexual clothing.'));
}
