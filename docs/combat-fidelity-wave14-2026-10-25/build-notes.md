# Journal de clôture du lot 14

La première exécution normale de `npm run build`, commencée le 25 octobre 2026 à 09:17:24.189 UTC, a été interrompue volontairement à 09:27:43.573 UTC pour corriger le compteur du guide Tactics : 121 tests dans la suite courante, au lieu de 117 lors du contrôle initial. Le reçu réel conserve le signal SIGTERM et le code 127 ; cette tentative ne constitue pas un build réussi. La première suite Node avait terminé avec 732 tests réussis, aucun échec.

Aucun fichier du gel de production n’a changé. La correction porte sur la documentation, qui est une entrée explicite de l’audit. Le rapport courant est recalculé après cette correction. La nouvelle exécution repart de la commande complète, sans sauter ni réutiliser une étape de cette tentative. Le runner conserve les anciens journaux et le reçu dans ses fichiers `build-before-*.log` et `build-receipt-before-*.log`.
