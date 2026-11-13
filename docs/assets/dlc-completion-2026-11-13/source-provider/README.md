# Fournisseur temporaire de médias par lots

`scripts/dlcBatchAssetSource.mjs` fournit les octets exacts d’un asset depuis une révision Git figée. Il ne restaure aucun fichier du checkout et ne modifie ni index, ni configuration Git, ni cache LFS canonique. Les sorties et caches réseau sont limités à un nouveau `mkdtemp` privé sous le dossier temporaire demandé.

## API

```js
import { createDlcBatchAssetSource, inspectDlcBatchAssetSources } from './scripts/dlcBatchAssetSource.mjs';

const metadata = await inspectDlcBatchAssetSources({
  repoRoot, revision, sourcePaths
});
// metadata.revision est le SHA du commit résolu. Chaque entrée expose status,
// gitBlobOid, gitBlobBytes, payloadBytes, expectedSha256 et contentKind.

const source = await createDlcBatchAssetSource({
  repoRoot, revision, parentTmpDir: '/tmp',
  maxTempBytes: 512 * 1024 * 1024,
  maxAssetBytes: 256 * 1024 * 1024,
  allowLfsFetch: true,
  verifiedHistoricalLfsMap
});
try {
  const info = await source.readAssetMetadata(sourcePath);
  const receipt = await source.materialize(sourcePath, {
    expectedBytes: info.payloadBytes,
    ...(info.expectedSha256 ? { expectedSha256: info.expectedSha256 } : {})
  });
  await source.verify(receipt);
  // Consommer/décoder le fichier receipt.path et conserver le reçu du lot.
  await source.cleanup([receipt]);
} finally {
  await source.close();
}
```

`maxBytes` et `maxTempBytes` sont deux noms pour la même limite ; s’ils sont fournis ensemble, leurs valeurs doivent être égales. Les opérations d’un provider sont sérialisées pour conserver un budget déterministe. Plusieurs providers privés peuvent être pilotés en parallèle par l’orchestrateur, sous son plafond global.

Les métadonnées groupées lisent l’arbre du commit, les tailles des blobs et les petits objets de pointeurs en batch. Aucun payload natif n’est matérialisé pour planifier les lots. Les chemins absents du commit, les symlinks Git et les pointeurs malformés sont signalés indisponibles ; ils ne deviennent pas des fichiers générés de remplacement.

## Sources et vérifications

L’ordre est : blob Git natif, payload du cache LFS canonique, blob historique vérifié correspondant au SHA du pointeur, puis LFS distant si `allowLfsFetch` vaut explicitement `true`. Le cache canonique est seulement lu ; un payload utilisé est streamé vers le fichier privé du lot sans dupliquer le cache entier.

Le fallback historique accepte une Map ou un objet `SHA256 → {sha256, gitBlobOid, bytes, verified: true}`, ou un document `{entries: [...]}`. L’index actuel est `../historical-lfs/verified-historical-lfs-map.json`. Même marqué vérifié, chaque candidat est recontrôlé pendant le streaming : taille du pointeur, SHA-256 brut et OID Git du blob historique. Aucun match n’est supposé à partir du nom ou de la taille seule.

Pour le réseau, la commande réelle est un `spawn` sans shell, avec `git -c lfs.storage=<cache privé> -c lfs.skipdownloaderrors=false lfs smudge -- <chemin>`. Le pointeur exact du commit est fourni sur stdin, la sortie est streamée vers le fichier privé et stderr n’est jamais conservé dans les reçus. Les lectures Git imposent `GIT_NO_LAZY_FETCH=1` et `GIT_OPTIONAL_LOCKS=0`.

Un blob natif est vérifié contre son OID Git, incluant l’en-tête de blob, et reçoit aussi un SHA-256 brut. Un payload LFS doit correspondre au SHA-256 et à la longueur déclarés dans le pointeur. Une sortie de smudge qui contient encore un pointeur, une taille différente, un hash différent ou un sous-processus en échec n’obtient aucun reçu accepté.

## Limites et nettoyage

Une source native, historique ou issue du cache canonique réserve une copie de payload. Un fetch LFS réserve deux copies, cache privé puis sortie, plus 256 Kio opérationnels. La taille des fichiers privés est surveillée pendant le smudge et contrôlée avant émission du reçu. Sur Linux, `prlimit` borne aussi la taille de chaque fichier créé par le sous-processus LFS. Le délai par processus est de 60 secondes par défaut (`processTimeoutMs`) ; le groupe LFS est terminé si le délai ou le budget est dépassé.

`maxTempBytes` est un budget de fichiers contrôlé par le provider, pas un quota de volume du système de fichiers. Les allocations de répertoires et les blocs du système de fichiers ajoutent un petit coût ; l’orchestrateur doit garder une réserve globale et borner le nombre de providers simultanés. Aucune possibilité de reflink ni de hardlink entre `/workspace` et `/tmp` n’est présumée.

Avant `cleanup` et `close`, le provider vérifie le marqueur de propriété, l’inode du dossier et l’inventaire de ses fichiers avec leurs empreintes. Un fichier étranger, une sortie modifiée ou un marqueur remplacé bloque le nettoyage avant suppression. Les reçus d’un autre provider sont refusés. Le cache réseau d’un asset est supprimé avec son fichier après consommation ; aucun asset Git ou PG persistant n’est supprimé.

Les erreurs sont typées (`DlcBatchAssetSourceError`) avec `code`, `status` et des détails numériques sûrs. Les classes LFS distinguent accès/authentification, quota, réseau, endpoint/objet absent et sortie corrompue. Les stderr, URLs signées, en-têtes et valeurs d’authentification ne figurent pas dans les reçus.

## Validation

Les **14 tests ciblés v2** passent : métadonnées immuables, sources natives, cache canonique, fallback historique exact, budgets, smudge isolé, retour de pointeur, corruption, erreur d’authentification expurgée, timeout, fichier étranger et nettoyage protégé. Ils couvrent aussi les renommages transitoires du cache LFS et le refus des disparitions hors cache, symlinks et erreurs de permission. Les preuves v1 `unit-tests.*` restent conservées ; la passe v2 est dans `unit-tests-v2.*`. L’injection du sous-processus LFS est un seam de fixture ; aucun faux média n’a servi aux essais réels.

`real-local-stream-smoke.json` atteste trois vrais médias du snapshot `3fb49277809f28d11d4886c847558fca6ee91f21` : blob natif, cache canonique et blob historique. Ils ont été streamés, revérifiés et nettoyés sans réseau. `real-lfs-probe.json` atteste un vrai payload distant de 1 557 977 octets, SHA-256 `fb17a025d1c53540d8863dbba644b01dc6a448a93ab6072a249851b125a337a7`, obtenu en 0,961 seconde dans un cache privé supprimé ensuite. Les 202 objets et 520 398 836 octets du cache canonique sont restés inchangés.

Ces reçus prouvent des octets et leur origine. Ils ne constituent ni une approbation visuelle 1:1, ni une validation de toutes les animations, ni une déclaration de fin du corpus complet.

## Incident du contrôle actif et correctif v2

Le premier run parallèle s’est arrêté au lot `00030` avec `OWNER_GUARD_FAILED`, après 1 238 assets validés dans 31 lots terminés et 45 fetchs réels vérifiés. Le cache canonique était inchangé et aucun dossier temporaire n’est resté. Les reçus v1 et ce résultat incomplet sont préservés ; ils ne sont pas convertis en réussite.

Sur le provider v1 `79645ac90b77ef99001df2410a2af9b8a890e7bba0ff74e637c9735d5dad3aa9`, la fixture de diagnostic a reproduit un rename réel `cache/incomplete/transfer.tmp → cache/objects/payload` entre `readdir` et `lstat`. Le fichier garde le même inode et ses 4 096 octets, sans symlink ou fichier étranger ; `lstat` sur l’ancien nom renvoie normalement `ENOENT`. Le monitor actif convertissait ce cas en erreur de propriété. `owned-cache-rename-reproduction.json` conserve la preuve antérieure au correctif ; son script cible ce comportement v1.

La version v2 `782d6d58fb65ab421fd18bc3ab97e09f13cdaa2c7d0cdd25dff754913be6948c` tolère uniquement `ENOENT` sous le `cacheRoot` du transfert actif pendant sa mesure de taille. Le tick en cours est arrêté et attendu avant les vérifications finales. La mesure finale, les inventaires de propriété et les nettoyages utilisent toujours leur lecture stricte. Une disparition hors cache, un symlink ou `EACCES` reste une erreur. Aucune suppression de fichier inconnu ni relâchement général de propriété n’a été introduit.

La regression positive déplace réellement le fichier entre les deux appels et vérifie ensuite SHA-256, longueur, reçu et nettoyage. Une seconde regression retire le répertoire de staging avant `readdir`. Les cas négatifs maintiennent le refus des disparitions hors cache et des erreurs non transitoires. Aucune relance de médias de production n’a été effectuée par ce correctif ; le nouvel orchestrateur doit utiliser son nouveau checkpoint et son nouveau plan.
