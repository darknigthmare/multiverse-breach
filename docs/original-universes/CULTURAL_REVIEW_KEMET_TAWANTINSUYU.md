# Revue culturelle Kemet et Tawantinsuyu

Date : 2026-07-28.

## Statut et limites

Cette passe est une revue documentaire réalisée par OpenAI à partir du lore
actuel du projet et de sources institutionnelles publiques. Elle ne constitue
ni une consultation ni une approbation par un égyptologue ou un spécialiste
humain des cultures andines. Cette limite reste inscrite dans le plan et dans
les tests avec `humanSpecialistConsultation: false`.

Le fichier source vérifiable est
`docs/original-universes/cultural-remediation-v3.json`. Il associe chaque
correction à une raison, aux sources consultées et à un garde-fou de prompt.

## Remédiation visuelle

27 images OpenAI Image v2 ont été ciblées sans changer le texte canonique du
manifeste ni les chemins runtime :

- Kemet : 15 images — booster, Salle des Deux Vérités, Temple de l'Éclipse,
  Nefra, Khepri-Sen, Taset, shabti, ba, chacal de tombe, Prêtre d'Isfet,
  Ammit, plume de Maât, khopesh, scarabée du cœur et gardien chacal.
- Tawantinsuyu : 12 images — décor, Qorikancha, Killa Mayu, ombre d'Ukhu
  Pacha, chaski corrompu, puma de pierre, jeune Amaru, masque renversé,
  Écho de la montagne, Amaru boss, Pachakuti et alignement des quatre suyus.

Les points bloquants corrigés sont notamment :

- les mortels Khepri-Sen et Taset restent entièrement humains ;
- le ba possède un corps d'oiseau et une tête humaine ;
- le shabti reste une petite figurine funéraire momiforme ;
- Ammit est un quadrupède combinant crocodile, lion et hippopotame ;
- la plume de Maât est une plume d'autruche ;
- le Qorikancha utilise maçonnerie ajustée, ouvertures trapézoïdales et cour
  de type kancha ;
- Amaru est un serpent andin allongé et sans membres, pas un dragon ;
- Pachakuti est un bouleversement du monde et du temps, pas une divinité
  humanoïde ;
- les quatre suyus convergent vers Cusco sous forme de routes, textiles ou
  khipus, sans disque-calendrier mésoaméricain.

## Sources principales

Kemet :

- Metropolitan Museum of Art : ba, shabti, scarabée du cœur, Salle des Deux
  Vérités et titulature royale ;
- British Museum : attributs des divinités égyptiennes et anatomie d'Ammit ;
- UCL Digital Egypt : organisation rectiligne des temples.

Tawantinsuyu :

- UNESCO : Qhapaq Ñan et adaptation du réseau routier andin ;
- Smithsonian NMAI : Cusco, quatre régions, Qorikancha, kancha, chaskis et
  administration routière ;
- Metropolitan Museum of Art : Amaru, khipus et abstraction textile ;
- INAH : distinction avec la Piedra del Sol mexica.

Les URL exactes sont conservées dans
`cultural-remediation-v3.json`.

## Traçabilité technique

- Plan déterministe : 500 jobs et 500 prompts distincts.
- Prompts modifiés : exactement 27 ; prompts inchangés : 473.
- Destinations modifiées : 0.
- Plan SHA-256 :
  `38e5b69fb230ccf6b59e94199bde1520fbc603d30d98dbf9ba4050468025137b`.
- Chaque PNG remplacé conserve un sidecar de provenance lié au prompt exact,
  au plan et au hash réel de l'image.
- Le test automatisé verrouille le nombre d'assets, les sources, les hashes et
  les garde-fous culturels les plus sensibles.
