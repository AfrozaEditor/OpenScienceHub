Dans ce hackathon, le choix **le plus stratégique pour Afroza Editor** c’est :

# ✅ Thème 2 — OpenScience Hub : Répertoire Institutionnel

Pourquoi ? Parce que c’est le thème qui colle le mieux avec votre vision **SSI / Verifiable Credentials / identité académique numérique**.

Le thème demande une plateforme d’archivage, de classification et de consultation des travaux scientifiques universitaires : mémoires, thèses, articles, avec recherche et métadonnées. Le guide prévoit même un bonus IA via l’analyse automatique des PDF pour extraire auteurs, mots-clés, résumé et thématiques. 

## Votre angle stratégique

Au lieu de faire juste un dépôt de mémoires classique, vous proposez :

# **OpenScience SSI Hub**

### Répertoire académique vérifiable pour mémoires, thèses et articles universitaires

L’idée : chaque document scientifique publié dans la plateforme reçoit une **preuve académique vérifiable**.

Par exemple :

Un étudiant dépose son mémoire.
Le département valide.
La faculté signe numériquement.
La plateforme génère un **Verifiable Credential** attestant que :

> “Ce mémoire a été officiellement soumis, validé et archivé par l’Université X, Faculté Y, Département Z, à telle date.”

Donc vous ne faites pas seulement une bibliothèque numérique.
Vous faites une **infrastructure de confiance académique**.

---

# Pourquoi c’est puissant

Dans les universités africaines, il y a plusieurs problèmes :

1. Difficulté à vérifier si un mémoire ou une thèse est authentique.
2. Risque de plagiat ou de duplication.
3. Mauvaise traçabilité des travaux scientifiques.
4. Archives universitaires dispersées ou non numérisées.
5. Absence de preuve numérique officielle liée aux travaux académiques.

Votre solution répond à tout ça avec :

**SSI + IA + archivage académique + vérification publique.**

---

# Fonctionnalités MVP réalistes en 24h

Vous pouvez faire un MVP propre avec :

### 1. Dépôt de document

Upload PDF du mémoire, thèse ou article.

### 2. Extraction IA

L’IA extrait automatiquement :

* titre ;
* auteur ;
* encadreur ;
* résumé ;
* mots-clés ;
* domaine scientifique ;
* année ;
* faculté/département.

C’est directement aligné avec le bonus IA du thème. 

### 3. Workflow de validation

Statuts simples :

* Soumis ;
* En revue ;
* Validé ;
* Rejeté ;
* Archivé officiellement.

### 4. Signature vérifiable

Quand le document est validé, la plateforme génère une attestation vérifiable :

* DID de l’institution ;
* hash du document ;
* métadonnées ;
* date de validation ;
* QR code de vérification.

### 5. Page publique de vérification

Un recruteur, une université ou un jury scanne le QR code et vérifie :

* document authentique ;
* hash conforme ;
* institution émettrice ;
* statut validé ;
* date d’archivage.

---

# Le nom que je propose

## **VeriScholar**

### OpenScience Hub with Verifiable Academic Credentials

Ou en version Afroza-style :

## **CADIS Research**

### Certified Academic Digital Issuance for Scientific Works

Mais pour le hackathon, je conseille un nom simple et compréhensible :

# **VeriScholar Hub**

C’est plus direct pour le jury.

---

# Pitch court

**VeriScholar Hub est une plateforme universitaire qui archive les mémoires, thèses et articles scientifiques, extrait automatiquement leurs métadonnées par IA et délivre une preuve SSI vérifiable pour garantir l’authenticité, la traçabilité et la validation officielle des travaux académiques.**

---

# Pourquoi ce thème est meilleur que les autres pour vous

Le thème 1 est intéressant, mais il est surtout orienté prise de notes et gestion doctorale.
Le thème 3 touche à la validation collaborative, mais le SSI serait un peu forcé.
Le thème 5 peut intégrer l’identité, mais c’est plus corporate wiki.
Le thème 15 est devtool, pas assez aligné avec votre vision SSI.

Le **Thème 2** est le plus naturel parce qu’il touche directement à :

* université ;
* documents académiques ;
* certification ;
* preuve ;
* validation institutionnelle ;
* traçabilité ;
* confiance numérique.

Donc c’est le meilleur terrain pour introduire **SSI sans forcer**.

---

# Positionnement final

Vous ne devez pas dire :
“On veut faire du SSI.”

Vous devez dire :

> “Nous voulons résoudre le problème de confiance dans les productions scientifiques universitaires. Le SSI est notre mécanisme technique pour rendre chaque mémoire, thèse ou article vérifiable, infalsifiable et traçable.”

C’est ça qui va sonner mature devant le jury.

Parle moi du QR code je n'ai pas très bien compris où il sera stocké ni comment on va le scanner bref c'est ambigu

Le QR code n’est pas “le SSI” lui-même. C’est juste **une porte d’entrée de vérification**.

Dans votre projet, il sert à permettre à quelqu’un de vérifier rapidement qu’un mémoire, une thèse ou un article est bien officiel.

# 1. Ce que contient le QR code

Le QR code ne doit pas contenir tout le document, ni toutes les données SSI.

Il contient généralement une **URL de vérification** ou un **identifiant de credential**.

Exemple :

```txt
https://verischolar.afroza.com/verify/VC-2026-UY1-00045
```

Ou bien :

```txt
verischolar://verify?credential_id=VC-2026-UY1-00045
```

Donc quand quelqu’un scanne le QR code, il est redirigé vers une page qui vérifie le document.

---

# 2. Où le QR code est stocké ?

Il y a deux cas.

## Cas simple pour le hackathon

Vous générez le QR code au moment où le document est validé.

Ensuite, vous pouvez le stocker à 3 endroits :

### A. Dans la base de données

Vous stockez le lien ou le chemin de l’image QR code.

Exemple dans PostgreSQL :

```txt
document_id: 45
credential_id: VC-2026-UY1-00045
qr_code_url: /storage/qrcodes/VC-2026-UY1-00045.png
verification_url: https://verischolar.afroza.com/verify/VC-2026-UY1-00045
```

### B. Dans le PDF final

Vous pouvez injecter le QR code sur la première ou dernière page du mémoire validé.

Exemple :

> Document certifié par l’Université de Yaoundé I
> Scannez ce QR code pour vérifier l’authenticité.

### C. Sur la page du document

Quand on ouvre la fiche publique du mémoire, le QR code s’affiche aussi.

Donc le QR code peut être :

* dans la base de données ;
* dans le PDF certifié ;
* sur la page web publique du document.

Mais techniquement, ce qui compte vraiment, c’est **l’URL de vérification**. Le QR code n’est qu’une image générée à partir de cette URL.

---

# 3. Comment on le scanne ?

Très simple.

Une personne prend son téléphone et scanne le QR code avec :

* la caméra du téléphone ;
* Google Lens ;
* une app de scan QR ;
* ou directement depuis l’app VeriScholar/CADIS si vous en créez une plus tard.

Après scan, elle tombe sur une page du genre :

```txt
https://verischolar.afroza.com/verify/VC-2026-UY1-00045
```

La page affiche :

```txt
✅ Document authentique
Titre : Système de gestion académique...
Auteur : Bell Aqil
Institution : Université de Yaoundé I
Département : Informatique
Date de validation : 12 juin 2026
Hash du document : 9A7F...32C
Statut : Validé officiellement
Signature : Vérifiée
```

Si le document a été modifié ou n’existe pas :

```txt
❌ Document non authentique
Ce document ne correspond à aucune certification officielle.
```

---

# 4. Le rôle du hash du document

C’est ici que ça devient sérieux.

Quand le mémoire est validé, vous calculez une empreinte numérique du PDF.

Exemple :

```txt
hash = SHA256(document.pdf)
```

Ça donne un résultat unique :

```txt
9f2a8c7b4e91d3...
```

Ce hash est stocké dans le credential.

Donc si quelqu’un modifie une seule virgule dans le PDF, le hash change.

La vérification permet donc de dire :

> Ce PDF est exactement le même que celui validé par l’université.

---

# 5. Où intervient le SSI exactement ?

Dans une vraie logique SSI, l’université joue le rôle d’**Issuer**.

Elle émet une preuve numérique appelée **Verifiable Credential**.

Exemple simplifié :

```json
{
  "id": "VC-2026-UY1-00045",
  "type": "AcademicWorkCredential",
  "issuer": "did:web:uy1.cm",
  "subject": {
    "title": "Système de gestion académique",
    "author": "Bell Aqil",
    "documentHash": "9f2a8c7b4e91d3...",
    "department": "Informatique",
    "status": "Validated"
  },
  "issuedAt": "2026-06-02",
  "proof": {
    "type": "DigitalSignature",
    "signature": "..."
  }
}
```

Le QR code pointe vers ce credential ou vers la page qui le vérifie.

---

# 6. Schéma simple du fonctionnement

```txt
1. Étudiant upload le mémoire PDF
              ↓
2. IA extrait les métadonnées
              ↓
3. Comité / admin valide le document
              ↓
4. Le système calcule le hash du PDF
              ↓
5. L’université émet un Verifiable Credential
              ↓
6. Le système génère un QR code
              ↓
7. QR code ajouté au PDF + fiche publique
              ↓
8. Quelqu’un scanne le QR code
              ↓
9. Page de vérification affiche : authentique ou non
```

---

# 7. Pour le MVP hackathon, ne compliquez pas trop

Pour le hackathon, vous n’êtes pas obligés de faire une SSI complète avec wallet, DID registry, ledger, etc.

Vous pouvez faire une version crédible :

### Version MVP

* Upload PDF ;
* calcul du hash SHA-256 ;
* génération d’un identifiant de credential ;
* stockage en base ;
* QR code vers une page `/verify/:credentialId` ;
* page de vérification ;
* fausse signature institutionnelle ou signature simulée ;
* badge “Verified by Institution”.

### Version pitch SSI

Vous expliquez que dans la version complète :

* l’université devient **issuer** ;
* l’étudiant ou le chercheur peut devenir **holder** ;
* le recruteur, jury ou autre université devient **verifier** ;
* le document est lié à un **Verifiable Credential** ;
* le QR code permet une vérification instantanée.

---

# 8. Exemple concret pour votre démo

Vous prenez un mémoire PDF fictif.

L’admin clique sur **Valider & Certifier**.

Le système affiche :

```txt
Credential généré : VC-UY1-INF-2026-001
QR code généré avec succès.
Document certifié.
```

Ensuite vous montrez le PDF avec le QR code.

Le jury scanne ou clique sur le QR code.

Il tombe sur une page :

```txt
✅ Certification valide

Ce travail scientifique a été officiellement validé par :
Université de Yaoundé I
Faculté des Sciences
Département Informatique

Hash vérifié : conforme
Signature institutionnelle : valide
Statut : archivé officiellement
```

C’est très clair et très impressionnant pour un MVP.

---

La phrase simple à retenir :

> **Le QR code est stocké comme une image ou un lien dans le système, mais il sert surtout à ouvrir une page de vérification. Cette page vérifie le credential SSI, le hash du document et la signature de l’institution.**


Donc on aura combien de portail ?

Pour un MVP clair, je conseille **3 portails principaux**.

# 1. Portail Étudiant / Chercheur

C’est l’espace de celui qui dépose son travail.

Il peut :

* créer un compte ;
* déposer un mémoire, une thèse ou un article ;
* remplir ou corriger les métadonnées ;
* suivre le statut du document ;
* télécharger le PDF certifié après validation ;
* voir son QR code et son credential.

Statuts possibles :

```txt
Soumis → En vérification → Validé → Certifié → Archivé
```

---

# 2. Portail Institution / Comité académique

C’est l’espace des responsables universitaires.

Il peut être utilisé par :

* chef de département ;
* encadreur ;
* comité scientifique ;
* administration de la faculté ;
* responsable archive/bibliothèque.

Ils peuvent :

* voir les documents soumis ;
* vérifier les métadonnées extraites par IA ;
* accepter ou rejeter un document ;
* demander une correction ;
* valider officiellement ;
* générer le credential SSI ;
* générer le QR code ;
* publier le document dans le répertoire.

C’est le portail le plus important pour montrer la logique **Issuer**.

L’université est l’émetteur officiel de la preuve.

---

# 3. Portail Public de Vérification

C’est l’espace accessible sans compte.

Il sert aux personnes externes :

* recruteur ;
* autre université ;
* jury ;
* entreprise ;
* étudiant ;
* public.

Ils peuvent :

* scanner un QR code ;
* rechercher un document ;
* vérifier son authenticité ;
* voir le statut du credential ;
* confirmer que le PDF n’a pas été modifié ;
* consulter les métadonnées publiques.

Exemple après scan :

```txt
✅ Document authentique
Titre : ...
Auteur : ...
Institution : Université de Yaoundé I
Hash : conforme
Statut : Validé officiellement
Credential : valide
```

---

# Donc en résumé

Vous aurez :

```txt
1. Portail Étudiant / Chercheur
2. Portail Institution / Comité académique
3. Portail Public / Vérification
```

Pour le hackathon, c’est largement suffisant.

# Architecture SSI derrière

```txt
Étudiant / Chercheur = Holder
Université / Institution = Issuer
Public / Recruteur / Jury = Verifier
```

Donc votre projet respecte parfaitement le modèle SSI :

```txt
Issuer → Holder → Verifier
```

La meilleure présentation au jury serait :

> “Notre plateforme est structurée autour de trois espaces : un portail chercheur pour soumettre les travaux, un portail institutionnel pour valider et émettre les preuves vérifiables, et un portail public pour vérifier instantanément l’authenticité via QR code.”


Là, on est très loin et ce n'est pas bon. Ce n'est pas bon parce que les bases ne sont pas encore solides. On lui dit c'est plus du, on revient un peu en arrière. On revient un peu en arrière, parce que quand tu dis université, voilà l'outil et tout et tout, c'est bien vrai, c'est bien vrai. Il faut voir le thème, il faut bien voir le thème. On dit ceci. Donc on pense à ça et répète ainsi une plateforme d'archivage de classification et de consultation des travaux scientifiques universitaires, mémoires, thèses, etc. avec un méthode de recherche indexée à Facet. OK. Là, nous sommes déjà bons. Maintenant, ce qu'il faut faire, c'est quoi? Il faut vérifier comment ou bien quel est le processus de validation d'une thèse, d'un mémoire, d'une thèse, d'une mémoire ou bien d'un article. Donc tu vas faire ça, tu permets, tu recherches quel est le processus de validation d'une mémoire, le processus de validation d'une thèse, le processus de validation des articles, etc. Tu vois ce que je veux dire ou pas? Donc tu recherches à avancer sur le net pour savoir exactement et précisément ce qui se passe, notamment ici au Cameroun. Donc tu peux faire pour moi et on verra ce que ça donne. Après ça, on verra comment implémenter le SSE, on verra également combien de portails on aura avec les minimums de fonctionnalités pour chaque portail.

# Validation des mémoires, thèses et articles au Cameroun pour cadrer votre OpenScience Hub

## Ce que le hackathon vous permet réellement de défendre

Le cadrage le plus solide, au vu du guide du hackathon, est bien **OpenScience Hub** : le thème y est présenté comme une plateforme d’archivage, de classification et de consultation des travaux scientifiques universitaires — mémoires, thèses, articles — avec un **moteur de recherche indexé à facettes**. Le guide ajoute aussi une opportunité IA très cohérente avec ce thème : l’**extraction automatique des métadonnées des PDF** et la suggestion de thématiques associées. Juste à côté, le thème **Peer Review** vise un espace collaboratif où des comités peuvent annoter, commenter et voter sur la validation des soumissions d’articles. Autrement dit, votre meilleur angle stratégique est de **prendre OpenScience Hub comme noyau produit**, puis d’y greffer un **workflow de validation léger** inspiré de Peer Review, au lieu d’essayer de construire d’emblée une revue scientifique complète. fileciteturn0file0

Cette lecture est cohérente avec les sources universitaires camerounaises disponibles publiquement. Celles-ci montrent que, sur le terrain, la validation d’un mémoire ou d’une thèse passe d’abord par des **structures académiques internes** — école doctorale, commissions scientifiques, facultés, directions de la recherche — avant toute diffusion, tandis que pour les articles, la validation est davantage **pilotée par la revue et son processus de peer review**. Cela vous donne une histoire-produit simple à pitcher : **un répertoire institutionnel qui capte les étapes de validation existantes au lieu de les inventer ex nihilo**. citeturn8view2turn26view0turn62view0

## Ce qui ressort des sources camerounaises

Les sources officielles consultables ne montrent pas un **texte national unique et publiquement accessible** qui décrirait un flux identique pour toutes les universités du Cameroun. En revanche, elles convergent sur une même ossature : **admission dans le cycle concerné**, **encadrement**, **instruction scientifique**, **avis ou expertise avant soutenance pour les travaux les plus avancés**, **soutenance ou décision de validation**, **dépôt/archivage**, puis **authentification ou vérification documentaire**. Cette convergence apparaît notamment à l’Université de Dschang, à l’Université de Buea, à l’Université de Yaoundé I et à l’Université de Douala. citeturn8view2turn26view0turn38view0turn61view2turn61view3

À Dschang, l’École doctorale déclare explicitement qu’elle gère les cycles de **Master** et de **Doctorat/Ph.D**, qu’elle **centralise les dossiers d’admission**, prépare les lettres sollicitant **l’expertise des thèses en vue de leur soutenance**, tient un **fichier central des thèses**, gère une **bibliothèque**, et que sa **commission scientifique** émet un avis sur les admissions et les soutenances de Master et de Doctorat. Le site précise aussi que la direction des thèses de doctorat est assurée par des **enseignants de rang magistral**, avec exceptions encadrées en codirection. C’est une source très forte parce qu’elle décrit à la fois les acteurs et les points de contrôle. citeturn8view2turn8view3

À Buea, l’université ne publie pas, dans les pages librement accessibles, un pas-à-pas complet de soutenance, mais elle documente des **instruments formels de gestion de la recherche** — notamment un **UB Thesis Guide**, un **Research Policy and Management Guide**, une stratégie de recherche, et des lignes directrices d’évaluation — tout en indiquant que les unités de supervision incluent des **Faculty and Departmental Scientific Committees** ainsi que des **Ethics committees**. La **Division of Research and Publications** y est présentée comme la structure qui coordonne les activités de recherche. Cela confirme qu’au Cameroun la validation n’est pas un simple upload de PDF : elle s’inscrit dans une gouvernance académique et scientifique déjà structurée. citeturn26view0turn26view1turn26view2

À Yaoundé I, le site institutionnel montre l’existence d’une **École doctorale**, d’un espace **“Thesis Offers & Research Topics”**, d’un **moteur de recherche documentaire**, d’annonces liées à la **sélection en Master 2**, d’un communiqué relatif aux **demandes d’authentification**, et d’actualités catégorisées **“Soutenances”**, par exemple un **second tour de soutenance** organisé à la FMSB en septembre 2025. Même si tous les contenus détaillés ne sont pas entièrement exposés au crawl, cela confirme l’existence de **phases**, de **campagnes**, et d’une **gestion institutionnelle centralisée** de la fin de parcours académique. citeturn38view0turn65view0turn66view0

## Ce qu’il faut retenir pour un mémoire de Master

Pour le **mémoire de Master**, les sources permettent de dégager un schéma de validation plus léger que celui de la thèse, mais déjà structuré. Il commence par l’**admission ou la sélection** dans le cycle de Master concerné, se poursuit par l’**encadrement académique** et le travail de recherche, puis par une **instruction interne** au niveau du département, de la faculté ou de l’école doctorale selon l’organisation de l’établissement. À Dschang, la commission scientifique de l’École doctorale donne un avis sur les soutenances de Master ; à Yaoundé I, l’existence d’annonces de **sélection en Master 2** montre bien que le mémoire s’insère dans un dispositif institutionnel de cycle et non dans une simple logique individuelle. citeturn8view2turn65view0turn66view0

En pratique, pour votre modélisation produit, le mémoire de Master doit donc être pensé comme un objet qui passe au minimum par ces états : **brouillon**, **soumis à l’encadreur**, **déposé pour instruction**, **autorisé à soutenir**, **soutenu**, **corrigé si besoin**, puis **archivé**. Je formule cela comme une **synthèse** des structures visibles dans les sources camerounaises, et non comme un règlement unique valable partout ; c’est justement pourquoi votre plateforme devra permettre des **workflows paramétrables par établissement**. citeturn8view2turn26view0turn38view0

Il faut aussi retenir un point fonctionnel important : le mémoire n’est pas seulement un document, c’est un **dossier**. Pour être crédible, votre MVP ne doit pas stocker seulement le PDF final, mais aussi ses **métadonnées académiques minimales** : auteur, cycle, filière, directeur, laboratoire ou département, année académique, date de soutenance, jury, statut de diffusion, mots-clés, résumé, et historique de version. Le guide du hackathon vous pousse précisément dans cette direction avec la recherche à facettes et l’extraction IA de métadonnées. fileciteturn0file0

## Ce qu’il faut retenir pour une thèse de Doctorat

Pour la **thèse de doctorat**, les contrôles sont plus lourds et plus centralisés. À Dschang, l’École doctorale indique qu’elle **centralise les dossiers d’admission en Doctorat**, prépare les lettres sollicitant **l’expertise des thèses** avant soutenance, tient un **fichier central des thèses**, et que sa commission scientifique émet un **avis sur les soutenances**. Le même site précise que la direction des thèses de doctorat est normalement réservée aux **enseignants de rang magistral**. Cela montre qu’une thèse, avant d’être soutenue, passe déjà par une phase d’**éligibilité scientifique formalisée**. citeturn8view2turn8view3

L’Université de Yaoundé I renforce cette lecture en exposant une **École doctorale**, un espace de **sujets et offres de thèse**, et des actualités liées aux **soutenances**, ce qui suggère un rythme institutionnalisé de suivi doctoral et de mise en soutenance. Là encore, la leçon produit est claire : pour une thèse, votre base de données doit séparer **le projet doctoral**, **les versions du manuscrit**, **les expertises/avis**, **la décision d’autorisation**, **la soutenance**, **les corrections post-soutenance**, puis **le dépôt final**. citeturn38view0turn66view0

Le point décisif pour votre vision SSI est que la **valeur la plus forte** ne se situe pas dans le simple stockage du PDF, mais dans la **preuve du statut académique** du document. Les universités consultées montrent toutes, chacune à leur manière, un besoin institutionnel de **vérification** : Buea propose un portail de **credential verification**, Dschang renvoie vers une plateforme d’**authentification de diplôme**, Douala mentionne un **service d’authentification des diplômes**, et Yaoundé I publie une liste d’adresses habilitées à traiter les demandes d’authentification. J’en déduis que, pour un MVP crédible, la couche SSI doit surtout servir à **signer et vérifier des attestations** — par exemple “thèse soutenue”, “version finale archivée”, “diplôme authentifié” — plutôt qu’à remplacer tout le processus académique lui-même. citeturn24view0turn61view2turn61view3turn65view0

## Ce qu’il faut retenir pour un article scientifique

Pour les **articles scientifiques**, la situation est différente. Les sources camerounaises montrent bien l’existence d’une activité de publication et d’encadrement scientifique — par exemple la **Division of Research and Publications** à Buea, les **commissions scientifiques** à Buea et Dschang, et un **appel à contributions** pour la *Revue internationale des sciences de l’éducation* à Yaoundé I — mais elles ne publient pas, dans les pages librement accessibles, un **workflow national uniforme** de validation des articles au Cameroun. Cela signifie que la validation de l’article est, en pratique, **revue-dépendante** et non université-dépendante. citeturn26view0turn8view2turn65view0

Pour modéliser ce processus avec rigueur, la source la plus utile est donc le cadre éditorial officiel de l’ICMJE. Celui-ci rappelle qu’un manuscrit doit être envoyé avec une **cover letter** ou un formulaire de soumission mentionnant les travaux voisins ou redondants, les **conflits d’intérêts**, l’**authorship**, l’auteur correspondant, et tout signalement pertinent sur la conduite de la recherche. L’ICMJE précise aussi que les éditeurs doivent assurer la **confidentialité** des manuscrits, organiser une **sélection appropriée des reviewers**, publier une description **claire et transparente** du processus de peer review, et que les reviewers doivent répondre rapidement, garder la confidentialité, déclarer leurs conflits et produire des avis **constructifs, honnêtes et polis**. L’éditeur garde la responsabilité finale de la décision, y compris le rejet avant publication si des problèmes d’intégrité émergent. citeturn64view0turn62view0

L’ICMJE ajoute également que la préparation du manuscrit doit être suffisamment structurée pour permettre l’évaluation par les éditeurs et reviewers, en particulier via une organisation claire du texte, l’usage de lignes directrices de reporting, la présentation des méthodes, des résultats, et des métadonnées utiles à l’évaluation. Pour votre produit, cela a une conséquence très forte : **si vous choisissez OpenScience Hub**, le module “articles” ne doit pas essayer de refaire tout l’univers des revues. Il doit plutôt gérer le **statut éditorial** de l’article — soumis, en review, révision demandée, accepté, publié — et éventuellement offrir, en extension, un mini-espace de commentaires/votes inspiré du thème **Peer Review** du hackathon. citeturn63view0turn62view0turn64view0turn0file0

## Ce que cela implique pour votre MVP et le nombre de portails

Mon conseil stratégique, au regard des processus réels et de la contrainte de rapidité du hackathon, est de viser **trois portails cœur**, avec **un quatrième portail seulement en option** si vous décidez d’embrasser pleinement la validation collaborative des articles. Cette recommandation est une **synthèse produit** des workflows observés dans les universités camerounaises, du besoin d’authentification documentaire, et du cadrage OpenScience Hub / Peer Review du guide. citeturn8view2turn26view0turn24view0turn61view2turn61view3turn64view0turn0file0

**Portail déposant** — pour l’étudiant, le doctorant, l’enseignant-chercheur. Il doit permettre la création d’un dossier, l’upload du PDF, la saisie ou l’extraction IA des métadonnées, la sélection du type de travail (mémoire, thèse, article), le suivi du statut, la gestion des versions, et la soumission finale. C’est le point d’entrée unique pour produire un **dossier académique traçable**. citeturn26view0turn63view0turn0file0

**Portail validation académique** — pour encadreurs, rapporteurs, comités scientifiques, école doctorale, faculté, bibliothèque ou administration. Il doit permettre l’affectation des encadreurs ou reviewers, la demande d’expertise, la collecte d’avis, l’autorisation de soutenance, l’enregistrement du jury, la saisie de la décision finale, la demande de corrections, puis la bascule vers l’archive institutionnelle. C’est ici que vous collez le mieux à ce que montrent Dschang, Buea et Yaoundé I. citeturn8view2turn8view3turn26view0turn66view0

**Portail public de consultation et de vérification** — pour lecteurs, étudiants, chercheurs, recruteurs, partenaires et services d’authentification. Il doit offrir la **recherche à facettes**, la consultation des notices et des PDF diffusable, une page de preuve d’authenticité, un QR code ou lien de vérification, et des filtres par établissement, discipline, année, niveau, encadreur, mots-clés et statut. C’est ce portail qui donne immédiatement de la valeur visible au jury du hackathon. citeturn61view2turn61view3turn24view0turn65view0turn0file0

**Portail revue ou peer review** — optionnel, à n’ajouter que si vous avez de la bande passante technique. Il sert aux articles et reprend le thème Peer Review du guide : annotations en marge, commentaires, vote, décision de révision/acceptation/rejet. Si vous manquez de temps, ne le faites pas comme portail séparé : implémentez-le comme un **module interne** du portail validation académique, limité aux articles. C’est beaucoup plus stratégique en 24 heures. fileciteturn0file0

Si vous voulez une réponse très nette à la question **“Combien de portails ?”**, ma recommandation est donc : **trois portails minimum** à annoncer dans la démo, et **un quatrième en roadmap**. C’est le meilleur compromis entre ambition, crédibilité académique et faisabilité hackathon. citeturn8view2turn26view0turn24view0turn61view2turn61view3turn0file0

## Le workflow minimal que vous pouvez défendre devant le jury

Le workflow le plus propre à montrer est le suivant : **création du dossier**, **extraction IA des métadonnées**, **affectation de l’encadreur ou du comité**, **avis/expertise**, **décision de validation**, **dépôt final**, **publication dans le répertoire**, puis **vérification d’authenticité** sur une page publique. Pour les articles, remplacez la soutenance par **screening éditorial**, **peer review**, **révision**, **acceptation/rejet**, puis **archivage du statut ou du texte publié**. Cette chaîne est exactement ce qui relie le mieux le besoin réel des universités, le thème OpenScience Hub, et votre volonté d’introduire SSI sans sur-ingénierie. citeturn8view2turn8view3turn62view0turn64view0turn0file0

Si vous devez réduire encore, gardez seulement ces objets métiers : **Utilisateur**, **Dossier**, **Document**, **Version**, **Avis**, **Décision**, **Événement de soutenance**, **Archive**, **Preuve de vérification**. Avec ça, vous couvrez déjà mémoire, thèse et article avec une seule architecture de données. C’est, à mon sens, la meilleure base pour brancher ensuite votre couche SSI, parce que cette couche vient signer des **faits de validation** produits par le workflow académique. citeturn8view2turn26view0turn24view0turn61view2turn61view3

## Questions ouvertes et limites

Le point principal à garder en tête est qu’il existe des **variations locales** selon l’université, la faculté, le cycle et parfois la discipline. Les pages publiques consultables montrent clairement les **structures**, les **acteurs** et plusieurs **indices de workflow**, mais elles ne publient pas toujours le détail intégral des formulaires, des délais, du nombre de rapporteurs, des barèmes de mention ou des modèles de procès-verbaux. Il faut donc présenter votre produit comme une **plateforme paramétrable par établissement**, et non comme un moteur réglementaire unique pour tout le Cameroun. citeturn8view2turn26view0turn38view0turn65view0turn66view0

La conséquence stratégique est simple : pour le pitch, ne revendiquez pas “nous remplaçons toute la règlementation universitaire”. Dites plutôt : **“nous numérisons le dossier scientifique, les étapes de validation et l’authentification institutionnelle, avec recherche à facettes et métadonnées IA.”** Cette formulation est beaucoup plus juste au regard des sources, et beaucoup plus forte pour un jury hackathon. citeturn8view2turn26view0turn61view2turn61view3turn0file0

Depuis là ?

Oui gar, la recherche est sortie. Le point important : **tu avais raison de dire qu’on allait trop vite vers le SSI**. La bonne base, c’est d’abord de comprendre le vrai workflow académique.

Voici la synthèse exploitable.

# 1. Ce que le thème demande vraiment

Le thème n’est pas “faire une plateforme SSI”.
Le thème est :

> **plateforme d’archivage, de classification et de consultation des travaux scientifiques universitaires : mémoires, thèses, articles, avec moteur de recherche indexé à facettes.**

Donc le cœur du produit doit être :

**un répertoire institutionnel intelligent des travaux académiques.**

Le SSI vient plus tard comme **couche de preuve**, pas comme fonctionnalité principale dès le départ.

---

# 2. Processus réel d’un mémoire

Pour un mémoire de Master, le workflow réaliste est :

```txt
1. Étudiant inscrit / éligible
2. Sujet validé par le département ou l’encadreur
3. Rédaction du mémoire
4. Dépôt du manuscrit
5. Vérification administrative et académique
6. Autorisation de soutenance
7. Soutenance devant jury
8. Délibération
9. Corrections éventuelles
10. Dépôt de la version finale
11. Archivage institutionnel
```

Donc dans notre plateforme, un mémoire ne doit pas être juste un PDF.
Il doit être un **dossier académique** avec statut, auteur, encadreur, département, jury, date de soutenance, version finale, résumé, mots-clés, etc.

---

# 3. Processus réel d’une thèse

Pour une thèse, c’est plus lourd :

```txt
1. Admission en doctorat
2. Validation du sujet de recherche
3. Désignation du directeur de thèse
4. Suivi doctoral
5. Dépôt du manuscrit
6. Expertise / rapporteurs
7. Avis de l’école doctorale ou commission scientifique
8. Autorisation de soutenance
9. Soutenance publique
10. Délibération du jury
11. Corrections éventuelles
12. Dépôt final
13. Archivage central
```

Donc pour une thèse, il faut gérer plus d’acteurs :

* doctorant ;
* directeur de thèse ;
* rapporteurs ;
* école doctorale ;
* commission scientifique ;
* jury ;
* bibliothèque / archive ;
* administration.

---

# 4. Processus réel d’un article scientifique

Pour l’article, ce n’est pas exactement comme mémoire/thèse.
Le processus dépend surtout de la revue :

```txt
1. Soumission de l’article
2. Vérification éditoriale initiale
3. Affectation à des reviewers
4. Peer review
5. Décision : accepté / rejeté / corrections
6. Révision par l’auteur
7. Acceptation finale
8. Publication
9. Archivage dans le répertoire institutionnel
```

Donc dans notre plateforme, pour les articles, on peut faire simple :

**soumis → en review → corrections demandées → accepté → publié / archivé**

Pas besoin de construire une vraie revue complète en 24h.

---

# 5. Conclusion produit : combien de portails ?

Après cette analyse, je corrige ma proposition précédente.

Pour le MVP, il faut **3 portails**, mais pas dans le sens “SSI d’abord”.

## Portail 1 — Déposant

Pour :

* étudiant ;
* doctorant ;
* enseignant-chercheur.

Fonctions minimales :

* déposer mémoire / thèse / article ;
* uploader le PDF ;
* remplir les métadonnées ;
* laisser l’IA extraire titre, auteur, résumé, mots-clés ;
* suivre le statut du dossier ;
* déposer une version corrigée.

---

## Portail 2 — Validation académique

Pour :

* encadreur ;
* chef de département ;
* école doctorale ;
* comité scientifique ;
* reviewer ;
* administration.

Fonctions minimales :

* voir les dossiers soumis ;
* valider ou corriger les métadonnées ;
* donner un avis ;
* autoriser la soutenance ou la publication ;
* enregistrer la décision finale ;
* demander des corrections ;
* envoyer le document vers l’archive.

C’est le portail central.

---

## Portail 3 — Consultation publique / archive

Pour :

* étudiants ;
* chercheurs ;
* universités ;
* recruteurs ;
* public.

Fonctions minimales :

* rechercher des travaux ;
* filtrer par faculté, département, année, auteur, encadreur, mots-clés, type de document ;
* consulter la fiche du document ;
* télécharger le PDF si autorisé ;
* voir le statut : archivé, validé, publié, restreint, etc.

C’est ici qu’on respecte vraiment le thème : **archivage, classification, consultation, recherche à facettes.**

---

# 6. Où placer le SSI alors ?

Le SSI ne doit pas remplacer le workflow.
Il doit venir **après la validation**.

Quand un mémoire, une thèse ou un article est validé et archivé, la plateforme peut générer une preuve :

```txt
Ce document a bien été validé par telle institution,
à telle date,
avec tel auteur,
tel titre,
tel hash PDF,
et tel statut académique.
```

Donc le SSI sert à certifier des événements :

* mémoire soutenu ;
* thèse soutenue ;
* article accepté ;
* version finale archivée ;
* document authentique.

---

# 7. Positionnement final

Le meilleur projet n’est pas :

> “Une plateforme SSI pour les mémoires.”

C’est plutôt :

> **Une plateforme institutionnelle d’archivage et de validation des travaux scientifiques, enrichie par IA pour l’extraction des métadonnées et extensible vers le SSI pour la preuve d’authenticité.**

Là, on est solide.
On respecte le thème, on comprend le terrain académique, et on garde le SSI comme avantage stratégique.


# Validation des mémoires, thèses et articles au Cameroun pour cadrer votre OpenScience Hub

## Ce que le hackathon vous permet réellement de défendre

Le cadrage le plus solide, au vu du guide du hackathon, est bien **OpenScience Hub** : le thème y est présenté comme une plateforme d’archivage, de classification et de consultation des travaux scientifiques universitaires — mémoires, thèses, articles — avec un **moteur de recherche indexé à facettes**. Le guide ajoute aussi une opportunité IA très cohérente avec ce thème : l’**extraction automatique des métadonnées des PDF** et la suggestion de thématiques associées. Juste à côté, le thème **Peer Review** vise un espace collaboratif où des comités peuvent annoter, commenter et voter sur la validation des soumissions d’articles. Autrement dit, votre meilleur angle stratégique est de **prendre OpenScience Hub comme noyau produit**, puis d’y greffer un **workflow de validation léger** inspiré de Peer Review, au lieu d’essayer de construire d’emblée une revue scientifique complète. fileciteturn0file0

Cette lecture est cohérente avec les sources universitaires camerounaises disponibles publiquement. Celles-ci montrent que, sur le terrain, la validation d’un mémoire ou d’une thèse passe d’abord par des **structures académiques internes** — école doctorale, commissions scientifiques, facultés, directions de la recherche — avant toute diffusion, tandis que pour les articles, la validation est davantage **pilotée par la revue et son processus de peer review**. Cela vous donne une histoire-produit simple à pitcher : **un répertoire institutionnel qui capte les étapes de validation existantes au lieu de les inventer ex nihilo**. citeturn8view2turn26view0turn62view0

## Ce qui ressort des sources camerounaises

Les sources officielles consultables ne montrent pas un **texte national unique et publiquement accessible** qui décrirait un flux identique pour toutes les universités du Cameroun. En revanche, elles convergent sur une même ossature : **admission dans le cycle concerné**, **encadrement**, **instruction scientifique**, **avis ou expertise avant soutenance pour les travaux les plus avancés**, **soutenance ou décision de validation**, **dépôt/archivage**, puis **authentification ou vérification documentaire**. Cette convergence apparaît notamment à l’Université de Dschang, à l’Université de Buea, à l’Université de Yaoundé I et à l’Université de Douala. citeturn8view2turn26view0turn38view0turn61view2turn61view3

À Dschang, l’École doctorale déclare explicitement qu’elle gère les cycles de **Master** et de **Doctorat/Ph.D**, qu’elle **centralise les dossiers d’admission**, prépare les lettres sollicitant **l’expertise des thèses en vue de leur soutenance**, tient un **fichier central des thèses**, gère une **bibliothèque**, et que sa **commission scientifique** émet un avis sur les admissions et les soutenances de Master et de Doctorat. Le site précise aussi que la direction des thèses de doctorat est assurée par des **enseignants de rang magistral**, avec exceptions encadrées en codirection. C’est une source très forte parce qu’elle décrit à la fois les acteurs et les points de contrôle. citeturn8view2turn8view3

À Buea, l’université ne publie pas, dans les pages librement accessibles, un pas-à-pas complet de soutenance, mais elle documente des **instruments formels de gestion de la recherche** — notamment un **UB Thesis Guide**, un **Research Policy and Management Guide**, une stratégie de recherche, et des lignes directrices d’évaluation — tout en indiquant que les unités de supervision incluent des **Faculty and Departmental Scientific Committees** ainsi que des **Ethics committees**. La **Division of Research and Publications** y est présentée comme la structure qui coordonne les activités de recherche. Cela confirme qu’au Cameroun la validation n’est pas un simple upload de PDF : elle s’inscrit dans une gouvernance académique et scientifique déjà structurée. citeturn26view0turn26view1turn26view2

À Yaoundé I, le site institutionnel montre l’existence d’une **École doctorale**, d’un espace **“Thesis Offers & Research Topics”**, d’un **moteur de recherche documentaire**, d’annonces liées à la **sélection en Master 2**, d’un communiqué relatif aux **demandes d’authentification**, et d’actualités catégorisées **“Soutenances”**, par exemple un **second tour de soutenance** organisé à la FMSB en septembre 2025. Même si tous les contenus détaillés ne sont pas entièrement exposés au crawl, cela confirme l’existence de **phases**, de **campagnes**, et d’une **gestion institutionnelle centralisée** de la fin de parcours académique. citeturn38view0turn65view0turn66view0

## Ce qu’il faut retenir pour un mémoire de Master

Pour le **mémoire de Master**, les sources permettent de dégager un schéma de validation plus léger que celui de la thèse, mais déjà structuré. Il commence par l’**admission ou la sélection** dans le cycle de Master concerné, se poursuit par l’**encadrement académique** et le travail de recherche, puis par une **instruction interne** au niveau du département, de la faculté ou de l’école doctorale selon l’organisation de l’établissement. À Dschang, la commission scientifique de l’École doctorale donne un avis sur les soutenances de Master ; à Yaoundé I, l’existence d’annonces de **sélection en Master 2** montre bien que le mémoire s’insère dans un dispositif institutionnel de cycle et non dans une simple logique individuelle. citeturn8view2turn65view0turn66view0

En pratique, pour votre modélisation produit, le mémoire de Master doit donc être pensé comme un objet qui passe au minimum par ces états : **brouillon**, **soumis à l’encadreur**, **déposé pour instruction**, **autorisé à soutenir**, **soutenu**, **corrigé si besoin**, puis **archivé**. Je formule cela comme une **synthèse** des structures visibles dans les sources camerounaises, et non comme un règlement unique valable partout ; c’est justement pourquoi votre plateforme devra permettre des **workflows paramétrables par établissement**. citeturn8view2turn26view0turn38view0

Il faut aussi retenir un point fonctionnel important : le mémoire n’est pas seulement un document, c’est un **dossier**. Pour être crédible, votre MVP ne doit pas stocker seulement le PDF final, mais aussi ses **métadonnées académiques minimales** : auteur, cycle, filière, directeur, laboratoire ou département, année académique, date de soutenance, jury, statut de diffusion, mots-clés, résumé, et historique de version. Le guide du hackathon vous pousse précisément dans cette direction avec la recherche à facettes et l’extraction IA de métadonnées. fileciteturn0file0

## Ce qu’il faut retenir pour une thèse de Doctorat

Pour la **thèse de doctorat**, les contrôles sont plus lourds et plus centralisés. À Dschang, l’École doctorale indique qu’elle **centralise les dossiers d’admission en Doctorat**, prépare les lettres sollicitant **l’expertise des thèses** avant soutenance, tient un **fichier central des thèses**, et que sa commission scientifique émet un **avis sur les soutenances**. Le même site précise que la direction des thèses de doctorat est normalement réservée aux **enseignants de rang magistral**. Cela montre qu’une thèse, avant d’être soutenue, passe déjà par une phase d’**éligibilité scientifique formalisée**. citeturn8view2turn8view3

L’Université de Yaoundé I renforce cette lecture en exposant une **École doctorale**, un espace de **sujets et offres de thèse**, et des actualités liées aux **soutenances**, ce qui suggère un rythme institutionnalisé de suivi doctoral et de mise en soutenance. Là encore, la leçon produit est claire : pour une thèse, votre base de données doit séparer **le projet doctoral**, **les versions du manuscrit**, **les expertises/avis**, **la décision d’autorisation**, **la soutenance**, **les corrections post-soutenance**, puis **le dépôt final**. citeturn38view0turn66view0

Le point décisif pour votre vision SSI est que la **valeur la plus forte** ne se situe pas dans le simple stockage du PDF, mais dans la **preuve du statut académique** du document. Les universités consultées montrent toutes, chacune à leur manière, un besoin institutionnel de **vérification** : Buea propose un portail de **credential verification**, Dschang renvoie vers une plateforme d’**authentification de diplôme**, Douala mentionne un **service d’authentification des diplômes**, et Yaoundé I publie une liste d’adresses habilitées à traiter les demandes d’authentification. J’en déduis que, pour un MVP crédible, la couche SSI doit surtout servir à **signer et vérifier des attestations** — par exemple “thèse soutenue”, “version finale archivée”, “diplôme authentifié” — plutôt qu’à remplacer tout le processus académique lui-même. citeturn24view0turn61view2turn61view3turn65view0

## Ce qu’il faut retenir pour un article scientifique

Pour les **articles scientifiques**, la situation est différente. Les sources camerounaises montrent bien l’existence d’une activité de publication et d’encadrement scientifique — par exemple la **Division of Research and Publications** à Buea, les **commissions scientifiques** à Buea et Dschang, et un **appel à contributions** pour la *Revue internationale des sciences de l’éducation* à Yaoundé I — mais elles ne publient pas, dans les pages librement accessibles, un **workflow national uniforme** de validation des articles au Cameroun. Cela signifie que la validation de l’article est, en pratique, **revue-dépendante** et non université-dépendante. citeturn26view0turn8view2turn65view0

Pour modéliser ce processus avec rigueur, la source la plus utile est donc le cadre éditorial officiel de l’ICMJE. Celui-ci rappelle qu’un manuscrit doit être envoyé avec une **cover letter** ou un formulaire de soumission mentionnant les travaux voisins ou redondants, les **conflits d’intérêts**, l’**authorship**, l’auteur correspondant, et tout signalement pertinent sur la conduite de la recherche. L’ICMJE précise aussi que les éditeurs doivent assurer la **confidentialité** des manuscrits, organiser une **sélection appropriée des reviewers**, publier une description **claire et transparente** du processus de peer review, et que les reviewers doivent répondre rapidement, garder la confidentialité, déclarer leurs conflits et produire des avis **constructifs, honnêtes et polis**. L’éditeur garde la responsabilité finale de la décision, y compris le rejet avant publication si des problèmes d’intégrité émergent. citeturn64view0turn62view0

L’ICMJE ajoute également que la préparation du manuscrit doit être suffisamment structurée pour permettre l’évaluation par les éditeurs et reviewers, en particulier via une organisation claire du texte, l’usage de lignes directrices de reporting, la présentation des méthodes, des résultats, et des métadonnées utiles à l’évaluation. Pour votre produit, cela a une conséquence très forte : **si vous choisissez OpenScience Hub**, le module “articles” ne doit pas essayer de refaire tout l’univers des revues. Il doit plutôt gérer le **statut éditorial** de l’article — soumis, en review, révision demandée, accepté, publié — et éventuellement offrir, en extension, un mini-espace de commentaires/votes inspiré du thème **Peer Review** du hackathon. citeturn63view0turn62view0turn64view0turn0file0

## Ce que cela implique pour votre MVP et le nombre de portails

Mon conseil stratégique, au regard des processus réels et de la contrainte de rapidité du hackathon, est de viser **trois portails cœur**, avec **un quatrième portail seulement en option** si vous décidez d’embrasser pleinement la validation collaborative des articles. Cette recommandation est une **synthèse produit** des workflows observés dans les universités camerounaises, du besoin d’authentification documentaire, et du cadrage OpenScience Hub / Peer Review du guide. citeturn8view2turn26view0turn24view0turn61view2turn61view3turn64view0turn0file0

**Portail déposant** — pour l’étudiant, le doctorant, l’enseignant-chercheur. Il doit permettre la création d’un dossier, l’upload du PDF, la saisie ou l’extraction IA des métadonnées, la sélection du type de travail (mémoire, thèse, article), le suivi du statut, la gestion des versions, et la soumission finale. C’est le point d’entrée unique pour produire un **dossier académique traçable**. citeturn26view0turn63view0turn0file0

**Portail validation académique** — pour encadreurs, rapporteurs, comités scientifiques, école doctorale, faculté, bibliothèque ou administration. Il doit permettre l’affectation des encadreurs ou reviewers, la demande d’expertise, la collecte d’avis, l’autorisation de soutenance, l’enregistrement du jury, la saisie de la décision finale, la demande de corrections, puis la bascule vers l’archive institutionnelle. C’est ici que vous collez le mieux à ce que montrent Dschang, Buea et Yaoundé I. citeturn8view2turn8view3turn26view0turn66view0

**Portail public de consultation et de vérification** — pour lecteurs, étudiants, chercheurs, recruteurs, partenaires et services d’authentification. Il doit offrir la **recherche à facettes**, la consultation des notices et des PDF diffusable, une page de preuve d’authenticité, un QR code ou lien de vérification, et des filtres par établissement, discipline, année, niveau, encadreur, mots-clés et statut. C’est ce portail qui donne immédiatement de la valeur visible au jury du hackathon. citeturn61view2turn61view3turn24view0turn65view0turn0file0

**Portail revue ou peer review** — optionnel, à n’ajouter que si vous avez de la bande passante technique. Il sert aux articles et reprend le thème Peer Review du guide : annotations en marge, commentaires, vote, décision de révision/acceptation/rejet. Si vous manquez de temps, ne le faites pas comme portail séparé : implémentez-le comme un **module interne** du portail validation académique, limité aux articles. C’est beaucoup plus stratégique en 24 heures. fileciteturn0file0

Si vous voulez une réponse très nette à la question **“Combien de portails ?”**, ma recommandation est donc : **trois portails minimum** à annoncer dans la démo, et **un quatrième en roadmap**. C’est le meilleur compromis entre ambition, crédibilité académique et faisabilité hackathon. citeturn8view2turn26view0turn24view0turn61view2turn61view3turn0file0

## Le workflow minimal que vous pouvez défendre devant le jury

Le workflow le plus propre à montrer est le suivant : **création du dossier**, **extraction IA des métadonnées**, **affectation de l’encadreur ou du comité**, **avis/expertise**, **décision de validation**, **dépôt final**, **publication dans le répertoire**, puis **vérification d’authenticité** sur une page publique. Pour les articles, remplacez la soutenance par **screening éditorial**, **peer review**, **révision**, **acceptation/rejet**, puis **archivage du statut ou du texte publié**. Cette chaîne est exactement ce qui relie le mieux le besoin réel des universités, le thème OpenScience Hub, et votre volonté d’introduire SSI sans sur-ingénierie. citeturn8view2turn8view3turn62view0turn64view0turn0file0

Si vous devez réduire encore, gardez seulement ces objets métiers : **Utilisateur**, **Dossier**, **Document**, **Version**, **Avis**, **Décision**, **Événement de soutenance**, **Archive**, **Preuve de vérification**. Avec ça, vous couvrez déjà mémoire, thèse et article avec une seule architecture de données. C’est, à mon sens, la meilleure base pour brancher ensuite votre couche SSI, parce que cette couche vient signer des **faits de validation** produits par le workflow académique. citeturn8view2turn26view0turn24view0turn61view2turn61view3

## Questions ouvertes et limites

Le point principal à garder en tête est qu’il existe des **variations locales** selon l’université, la faculté, le cycle et parfois la discipline. Les pages publiques consultables montrent clairement les **structures**, les **acteurs** et plusieurs **indices de workflow**, mais elles ne publient pas toujours le détail intégral des formulaires, des délais, du nombre de rapporteurs, des barèmes de mention ou des modèles de procès-verbaux. Il faut donc présenter votre produit comme une **plateforme paramétrable par établissement**, et non comme un moteur réglementaire unique pour tout le Cameroun. citeturn8view2turn26view0turn38view0turn65view0turn66view0

La conséquence stratégique est simple : pour le pitch, ne revendiquez pas “nous remplaçons toute la règlementation universitaire”. Dites plutôt : **“nous numérisons le dossier scientifique, les étapes de validation et l’authentification institutionnelle, avec recherche à facettes et métadonnées IA.”** Cette formulation est beaucoup plus juste au regard des sources, et beaucoup plus forte pour un jury hackathon. citeturn8view2turn26view0turn61view2turn61view3turn0file0

Oui, là maintenant on est **sur une base solide**.

La bonne correction est celle-ci :

> On ne vend pas d’abord une plateforme SSI.
> On vend d’abord un **OpenScience Hub institutionnel** : archivage, classification, consultation et recherche à facettes des mémoires, thèses et articles.
> Ensuite, on ajoute une couche **validation + preuve d’authenticité**.

Le thème officiel parle précisément d’une plateforme d’archivage, de classification et de consultation des travaux scientifiques universitaires, avec moteur de recherche indexé à facettes, et bonus IA pour l’extraction automatique des métadonnées des PDF. 

# Décision stratégique

Le projet doit être présenté comme :

## **OpenScience Hub**

### Répertoire académique intelligent avec workflow de validation et preuve d’authenticité

Pas :

> “Une plateforme SSI pour les mémoires.”

Mais plutôt :

> “Une plateforme qui numérise le dépôt, la validation, l’archivage et la consultation des travaux scientifiques universitaires, avec extraction IA des métadonnées et vérification d’authenticité.”

C’est beaucoup plus propre.

---

# Workflow produit central

On garde un workflow unique, adaptable à mémoire, thèse et article :

```txt
1. Création du dossier scientifique
2. Upload du document PDF
3. Extraction IA des métadonnées
4. Vérification/correction des métadonnées
5. Affectation à un encadreur, comité ou reviewer
6. Avis / expertise / validation
7. Corrections éventuelles
8. Décision finale
9. Archivage institutionnel
10. Consultation publique
11. Vérification d’authenticité
```

Pour un mémoire ou une thèse, la décision finale est liée à la soutenance.

Pour un article, la décision finale est liée au processus éditorial :

```txt
soumis → en review → corrections demandées → accepté/rejeté → archivé/publié
```

---

# Nombre de portails à retenir

## ✅ 3 portails pour le MVP

### 1. Portail Déposant

Pour :

* étudiant ;
* doctorant ;
* enseignant-chercheur.

Fonctions minimales :

* créer un dossier ;
* choisir le type : mémoire, thèse, article ;
* uploader le PDF ;
* voir les métadonnées extraites par IA ;
* corriger/compléter les informations ;
* soumettre officiellement ;
* suivre le statut ;
* déposer une version corrigée.

---

### 2. Portail Validation Académique

Pour :

* encadreur ;
* chef de département ;
* école doctorale ;
* comité scientifique ;
* reviewer ;
* administration ;
* bibliothèque/archive.

Fonctions minimales :

* voir les dossiers soumis ;
* vérifier les métadonnées ;
* affecter un reviewer/rapporteur/encadreur ;
* donner un avis ;
* demander des corrections ;
* enregistrer la décision ;
* valider pour archivage ;
* générer la preuve d’authenticité.

C’est le portail le plus important côté workflow.

---

### 3. Portail Public / Consultation

Pour :

* étudiants ;
* chercheurs ;
* recruteurs ;
* administrations ;
* universités ;
* grand public.

Fonctions minimales :

* rechercher les travaux ;
* filtrer par facettes ;
* consulter une fiche de travail ;
* voir le résumé, auteur, année, discipline, encadreur ;
* télécharger le PDF si autorisé ;
* vérifier l’authenticité via lien ou QR code.

Les facettes importantes :

```txt
Type : mémoire / thèse / article
Université
Faculté
Département
Filière
Année
Auteur
Encadreur
Mots-clés
Domaine scientifique
Statut : validé / archivé / publié / restreint
```

---

# Le 4e portail ?

Pas pour le MVP.

Le **portail Peer Review** doit rester une option roadmap.

Pour le hackathon, on ne crée pas un portail séparé pour ça. On l’intègre comme **module du portail validation académique**, surtout pour les articles.

Donc réponse nette :

```txt
MVP : 3 portails
Roadmap : 4e portail Peer Review avancé
```

---

# Où placer le SSI exactement ?

Le SSI ne vient pas au début. Il vient **après validation**.

Quand un document est validé et archivé, le système peut générer une preuve :

```txt
Ce document a été validé par telle institution,
à telle date,
avec tel auteur,
tel titre,
tel hash PDF,
et tel statut académique.
```

Dans le MVP, cette preuve peut être simple :

* hash du PDF ;
* identifiant unique ;
* QR code de vérification ;
* page publique de vérification ;
* statut validé/archivé.

Dans la version avancée, cette preuve devient un vrai **Verifiable Credential**.

---

# Objets métiers à garder

Pour ne pas vous disperser, vous devez modéliser seulement ça :

```txt
Utilisateur
Rôle
Institution
Dossier scientifique
Document
Version de document
Métadonnées
Avis
Décision
Archive
Preuve de vérification
```

C’est suffisant pour couvrir mémoire, thèse et article.

---

# Pitch corrigé

> **OpenScience Hub est une plateforme institutionnelle qui permet aux universités d’archiver, classifier, valider et consulter les travaux scientifiques — mémoires, thèses et articles — avec extraction IA des métadonnées, recherche à facettes et vérification d’authenticité des documents validés.**

Là, c’est propre, défendable, réaliste et aligné avec le thème.


Tu as sûrement entendu parler du Rag ça va peut-être aider ici

Oui gar, **le RAG peut clairement aider ici**, mais il faut bien le placer. Il ne doit pas remplacer la recherche à facettes. Il doit venir comme **couche intelligente au-dessus de l’archive**.

Le guide que tu as envoyé définit le RAG comme une technique qui connecte un modèle d’IA générative à une base documentaire interne, pour lui permettre de récupérer les passages pertinents avant de générer une réponse. Il précise aussi que ça améliore la traçabilité de l’information et réduit les hallucinations par rapport à un LLM seul. 

# Où le RAG entre dans OpenScience Hub ?

Votre plateforme aura beaucoup de documents :

```txt
mémoires
thèses
articles
résumés
mots-clés
rapports d’avis
décisions de validation
PV de soutenance
métadonnées institutionnelles
```

Donc le RAG peut servir à créer un **assistant de recherche académique**.

Au lieu que l’utilisateur fasse seulement :

```txt
Filtre : Informatique
Année : 2024
Type : Mémoire
Mot-clé : blockchain
```

Il peut demander naturellement :

```txt
Quels mémoires de l’Université de Yaoundé I parlent de blockchain appliquée à l’identité numérique ?
```

Ou :

```txt
Trouve-moi les thèses récentes sur l’intelligence artificielle en santé au Cameroun.
```

Ou encore :

```txt
Résume les travaux disponibles sur la vérification des diplômes numériques.
```

Le RAG cherche dans les documents archivés, récupère les passages pertinents, puis génère une réponse avec les sources.

---

# La bonne architecture : Faceted Search + RAG

Il ne faut pas choisir entre les deux. Il faut combiner.

## 1. Recherche à facettes

C’est ce que le thème demande explicitement : recherche indexée par filtres/facettes. 

Elle sert à filtrer proprement :

```txt
université
faculté
département
année
type de document
auteur
encadreur
mots-clés
statut
```

## 2. RAG

Il sert à poser des questions en langage naturel sur les documents.

Exemple :

```txt
Question :
Quels sont les principaux thèmes de recherche en cybersécurité entre 2020 et 2025 ?

RAG :
- récupère les mémoires/thèses/articles pertinents ;
- extrait les passages utiles ;
- génère une synthèse ;
- cite les documents utilisés.
```

Donc votre avantage IA devient très fort :

> **Recherche structurée par facettes + assistant RAG pour explorer les connaissances archivées.**

---

# Ce que le RAG peut faire concrètement dans votre MVP

Pour le hackathon, vous pouvez défendre 4 fonctions RAG simples mais puissantes.

## 1. Assistant de recherche documentaire

L’utilisateur pose une question :

```txt
Quels travaux parlent de reconnaissance faciale dans les universités camerounaises ?
```

Le système répond :

```txt
J’ai trouvé 6 travaux pertinents.
Les principaux axes sont :
1. reconnaissance faciale pour le contrôle d’accès ;
2. identification biométrique ;
3. sécurité des examens ;
4. authentification mobile.

Sources :
- Mémoire X, page 12
- Article Y, résumé
- Thèse Z, chapitre 2
```

C’est parfaitement aligné avec OpenScience Hub.

---

## 2. Génération de fiche de lecture

Sur une thèse ou un mémoire, le RAG peut générer :

```txt
Résumé court
Problématique
Méthodologie
Résultats principaux
Limites
Mots-clés suggérés
Travaux proches
```

Ça aide les chercheurs à comprendre vite un document.

---

## 3. Détection de travaux similaires

Quand un étudiant dépose un mémoire, le système peut dire :

```txt
Des travaux proches existent déjà :
- Mémoire A : similarité élevée
- Article B : même thématique
- Thèse C : même méthode
```

Attention : ce n’est pas forcément un détecteur de plagiat complet. C’est plutôt un **détecteur de proximité scientifique**.

C’est très utile pour éviter les doublons et orienter l’encadreur.

---

## 4. Assistant de validation académique

Pour le portail validation, l’encadreur ou le comité peut demander :

```txt
Ce mémoire respecte-t-il les éléments attendus ?
```

Le RAG peut aider à repérer :

```txt
- résumé absent ou faible ;
- méthodologie peu détaillée ;
- bibliographie insuffisante ;
- absence de résultats expérimentaux ;
- mots-clés incohérents avec le contenu.
```

Mais il faut présenter ça comme une **aide à la décision**, pas comme une décision automatique.

---

# Architecture technique simple

Voici le pipeline RAG adapté à votre projet :

```txt
1. Upload PDF
       ↓
2. Extraction texte du PDF
       ↓
3. Nettoyage du texte
       ↓
4. Découpage en chunks
       ↓
5. Ajout des métadonnées
       ↓
6. Vectorisation
       ↓
7. Stockage dans une base vectorielle
       ↓
8. Question utilisateur
       ↓
9. Recherche des passages pertinents
       ↓
10. Réponse générée avec sources
```

Le guide RAG insiste justement sur ces étapes : conversion des documents en texte, nettoyage, segmentation/chunking, enrichissement avec métadonnées, vectorisation et indexation dans une base vectorielle. 

---

# Les métadonnées sont cruciales

Dans votre cas, chaque chunk ne doit pas être stocké seul. Il doit garder ses métadonnées :

```json
{
  "document_id": "DOC-2026-001",
  "title": "Système de vérification des diplômes par SSI",
  "author": "Bell Aqil",
  "type": "mémoire",
  "university": "Université de Yaoundé I",
  "faculty": "Faculté des Sciences",
  "department": "Informatique",
  "year": 2026,
  "keywords": ["SSI", "DID", "Verifiable Credentials"],
  "status": "archivé",
  "page": 12,
  "chunk_text": "..."
}
```

C’est ça qui permet au RAG de répondre intelligemment à des requêtes comme :

```txt
Trouve les mémoires d’informatique entre 2022 et 2026 qui parlent de SSI.
```

Il fera une recherche hybride :

```txt
filtre structuré : type = mémoire, département = informatique, année 2022-2026
+
recherche sémantique : SSI, identité décentralisée, credentials vérifiables
```

---

# La meilleure formulation pour le pitch

Vous pouvez dire :

> **Notre solution combine une recherche à facettes classique avec un assistant RAG. La recherche à facettes permet de filtrer les travaux scientifiques par institution, discipline, année, auteur ou statut. Le RAG permet d’interroger le contenu même des mémoires, thèses et articles en langage naturel, avec des réponses sourcées et traçables.**

C’est très fort parce que le guide du hackathon demande déjà un moteur de recherche indexé à facettes et valorise les intégrations IA concrètes. 

---

# Attention : ce que le RAG ne doit pas faire

Il ne doit pas :

```txt
❌ valider officiellement un mémoire
❌ remplacer un jury
❌ décider si une thèse mérite soutenance
❌ certifier l’authenticité d’un document
❌ remplacer le SSI
```

Il doit :

```txt
✅ chercher dans les documents
✅ résumer
✅ comparer des travaux
✅ suggérer des mots-clés
✅ aider à l’analyse
✅ citer ses sources
✅ assister les comités
```

Le guide RAG insiste aussi sur les limites : le RAG réduit les hallucinations mais ne les supprime pas totalement, donc il faut garder traçabilité, sources et évaluation des réponses. 

---

# Position finale du produit

Votre produit devient beaucoup plus sérieux :

```txt
OpenScience Hub
= Archive institutionnelle
+ Classification académique
+ Recherche à facettes
+ Extraction IA des métadonnées
+ Assistant RAG de recherche scientifique
+ Workflow léger de validation
+ Vérification d’authenticité / SSI en extension
```

Donc oui, le RAG aide énormément. Mais il doit être présenté comme **l’intelligence de consultation et d’exploration du répertoire**, pas comme le cœur de validation académique.


Maintenant que nous avons tous ceci il faut maintenant aller loin dans la conception 

Exact. Maintenant on peut passer à la **conception sérieuse** : produit, modules, workflow, données, IA/RAG, validation, vérification et démo hackathon.

Le projet doit être conçu comme ceci :

# **OpenScience Hub**

## Plateforme institutionnelle d’archivage, classification, validation et exploration intelligente des travaux scientifiques

Le noyau reste conforme au thème officiel : **archivage, classification, consultation des mémoires, thèses et articles, avec moteur de recherche à facettes**. L’IA intervient d’abord pour l’extraction de métadonnées des PDF, puis le RAG vient enrichir la recherche documentaire. 

---

# 1. Vision produit

Le problème à résoudre :

> Les travaux scientifiques universitaires sont souvent dispersés, mal classés, difficiles à rechercher, difficiles à vérifier et peu valorisés.

La solution :

> Une plateforme qui centralise les travaux scientifiques, extrait automatiquement leurs métadonnées, organise leur validation académique, permet une recherche avancée, puis fournit une preuve d’authenticité après archivage.

Donc le produit n’est pas juste une bibliothèque numérique.

C’est une combinaison de :

```txt
Archive institutionnelle
+ workflow académique
+ extraction IA
+ recherche à facettes
+ assistant RAG
+ vérification d’authenticité
+ extension SSI
```

---

# 2. Les 3 portails du MVP

## Portail 1 — Déposant

Pour étudiants, doctorants et enseignants-chercheurs.

Fonctionnalités MVP :

```txt
Créer un dossier scientifique
Choisir le type : mémoire, thèse, article
Uploader le PDF
Déclencher l’extraction IA
Voir les métadonnées extraites
Corriger les métadonnées
Soumettre le dossier
Suivre le statut
Déposer une version corrigée
```

Statuts visibles côté déposant :

```txt
Brouillon
Soumis
En instruction
Correction demandée
Validé
Archivé
Rejeté
```

---

## Portail 2 — Validation académique

Pour encadreurs, reviewers, rapporteurs, comités scientifiques, administration, bibliothèque.

Fonctionnalités MVP :

```txt
Voir les dossiers soumis
Consulter le PDF et les métadonnées
Corriger ou valider les métadonnées
Ajouter un avis
Demander une correction
Enregistrer une décision
Valider pour archivage
Générer la preuve d’authenticité
```

Ce portail simule les vrais processus académiques : avis, expertise, soutenance, acceptation, corrections, dépôt final.

---

## Portail 3 — Consultation publique

Pour étudiants, chercheurs, recruteurs, administrations, partenaires, public.

Fonctionnalités MVP :

```txt
Rechercher un travail scientifique
Filtrer par facettes
Consulter une fiche publique
Lire le résumé
Télécharger le PDF si autorisé
Poser une question à l’assistant RAG
Vérifier l’authenticité via QR code ou lien
```

Facettes importantes :

```txt
Type de document
Université
Faculté
Département
Filière
Domaine scientifique
Année
Auteur
Encadreur
Mots-clés
Statut
Niveau : Master / Doctorat / Article
Accès : public / restreint
```

---

# 3. Workflow métier principal

On doit concevoir un workflow unique mais adaptable.

```txt
1. Création du dossier
2. Upload PDF
3. Extraction IA des métadonnées
4. Validation ou correction des métadonnées
5. Soumission officielle
6. Instruction académique
7. Avis / review / expertise
8. Corrections éventuelles
9. Décision finale
10. Dépôt final
11. Archivage institutionnel
12. Génération d’une preuve d’authenticité
13. Publication dans le répertoire
14. Consultation + recherche + RAG
```

Pour mémoire :

```txt
Soumis → Encadreur → Autorisé → Soutenu → Corrigé → Archivé
```

Pour thèse :

```txt
Soumis → École doctorale → Expertise → Autorisé → Soutenu → Corrigé → Archivé
```

Pour article :

```txt
Soumis → Screening → Peer review → Révision → Accepté/Rejeté → Archivé/Publié
```

---

# 4. Modules fonctionnels

## Module A — Gestion des utilisateurs et rôles

Rôles minimaux :

```txt
Déposant
Validateur
Administrateur institutionnel
Archiviste
Public
```

Rôles avancés :

```txt
Encadreur
Rapporteur
Reviewer
Chef de département
École doctorale
Comité scientifique
Bibliothèque
Super admin
```

Pour le MVP, ne compliquez pas. Vous pouvez coder 4 rôles :

```txt
student
validator
admin
public
```

---

## Module B — Dossier scientifique

Un dossier représente le travail académique complet.

Il contient :

```txt
Titre
Auteur
Type
Résumé
Mots-clés
Institution
Faculté
Département
Filière
Année académique
Encadreur
Statut
PDF principal
Versions
Avis
Décisions
Historique
```

C’est l’objet central de toute l’application.

---

## Module C — Extraction IA des métadonnées

Après upload PDF, l’IA extrait :

```txt
Titre
Auteur
Résumé
Mots-clés
Problématique
Méthodologie
Domaine scientifique
Encadreur si détecté
Année
Langue
Thématiques associées
```

C’est directement aligné avec le bonus IA du guide du hackathon. 

---

## Module D — Recherche à facettes

C’est obligatoire dans le thème.

Recherche classique :

```txt
mot-clé dans titre
auteur
résumé
mots-clés
département
année
```

Recherche filtrée :

```txt
Type = Thèse
Département = Informatique
Année = 2024-2026
Mot-clé = IA
Statut = Archivé
```

---

## Module E — Assistant RAG

Le RAG doit être présenté comme **assistant de recherche scientifique**.

Le guide RAG explique qu’un système RAG récupère d’abord les documents ou extraits pertinents dans une base documentaire, puis utilise un modèle génératif pour produire une réponse informée. 

Fonctions RAG MVP :

```txt
Poser une question sur l’archive
Obtenir une réponse sourcée
Trouver des travaux similaires
Résumer un document
Générer une fiche de lecture
Suggérer des mots-clés
```

Exemples de questions :

```txt
Quels travaux parlent de SSI dans les universités camerounaises ?
Résume les mémoires récents sur la blockchain.
Quels documents abordent l’identité numérique académique ?
Quels sont les travaux proches de ce mémoire ?
```

Le RAG doit toujours afficher les sources utilisées.

---

## Module F — Validation académique

Fonctions :

```txt
Ajouter un avis
Demander correction
Valider les métadonnées
Changer le statut
Enregistrer la décision finale
Envoyer vers archivage
```

Décisions possibles :

```txt
Accepté pour archivage
Correction demandée
Rejeté
Validé après soutenance
Accepté après review
Publié
```

---

## Module G — Preuve d’authenticité

Après validation finale, le système génère :

```txt
Identifiant unique
Hash SHA-256 du PDF
Date d’archivage
Institution validatrice
Statut académique
QR code de vérification
Page publique de vérification
```

Le QR code pointe vers :

```txt
/verify/DOC-2026-0001
```

La page affiche :

```txt
Document authentique
Titre
Auteur
Institution
Date de validation
Hash du fichier
Statut
```

Le SSI arrive ici en extension : plus tard, cette preuve devient un **Verifiable Credential**.

---

# 5. Modèle de données minimal

Voici les tables essentielles.

```txt
users
roles
institutions
departments
research_works
documents
document_versions
metadata_extractions
reviews
decisions
archives
verification_proofs
rag_chunks
```

## Table centrale : research_works

```txt
id
title
abstract
type
author_id
institution_id
department_id
supervisor_name
academic_year
status
visibility
created_at
updated_at
```

## documents

```txt
id
research_work_id
file_url
file_name
mime_type
sha256_hash
page_count
uploaded_by
created_at
```

## document_versions

```txt
id
document_id
version_number
file_url
sha256_hash
change_note
created_at
```

## reviews

```txt
id
research_work_id
reviewer_id
comment
recommendation
created_at
```

## decisions

```txt
id
research_work_id
decision_type
decided_by
comment
created_at
```

## verification_proofs

```txt
id
research_work_id
credential_id
document_hash
verification_url
qr_code_url
issued_by
issued_at
status
```

## rag_chunks

```txt
id
research_work_id
document_id
chunk_text
embedding
page_number
metadata
created_at
```

---

# 6. Architecture technique proposée

Pour aller vite en hackathon :

```txt
Frontend : Next.js / React
Backend : Django REST Framework ou FastAPI
Database : PostgreSQL
Vector DB : pgvector
Storage PDF : local / S3-compatible
IA extraction : API LLM
RAG : embeddings + pgvector + LLM
QR code : librairie backend
Auth : JWT / sessions
```

Architecture logique :

```txt
Client Web
   ↓
API Backend
   ↓
PostgreSQL + pgvector
   ↓
Storage PDF
   ↓
Service IA Extraction
   ↓
Service RAG
   ↓
Service Vérification / QR
```

Le guide RAG insiste justement sur le prétraitement : conversion des documents, nettoyage, chunking, enrichissement en métadonnées, vectorisation et indexation. 

---

# 7. Pipeline IA/RAG détaillé

Quand un PDF est uploadé :

```txt
1. Sauvegarder le PDF
2. Extraire le texte
3. Calculer le hash SHA-256
4. Envoyer le texte à l’IA pour extraire les métadonnées
5. Découper le texte en chunks
6. Ajouter les métadonnées à chaque chunk
7. Générer les embeddings
8. Stocker dans pgvector
9. Rendre le document recherchable
```

Quand un utilisateur pose une question :

```txt
1. Transformer la question en embedding
2. Chercher les chunks les plus proches
3. Appliquer les filtres éventuels
4. Envoyer les chunks au LLM
5. Générer une réponse
6. Afficher la réponse + sources
```

---

# 8. Priorisation hackathon

## MVP obligatoire

```txt
Auth simple
Dashboard déposant
Upload PDF
Extraction IA des métadonnées
Validation/correction des métadonnées
Statut du dossier
Recherche à facettes
Fiche publique du document
RAG simple sur les documents
Génération QR code
Page de vérification
```

## À éviter pendant le hackathon

```txt
Wallet SSI complet
DID registry
Ledger blockchain
Signature cryptographique complexe
Annotations PDF avancées
Gestion complète d’une revue scientifique
Workflow réglementaire trop détaillé
```

## Roadmap après hackathon

```txt
Verifiable Credentials
DID institutionnel
Signature numérique avancée
Portail peer review complet
Annotations PDF collaboratives
Authentification diplôme
Intégration bibliothèque universitaire
Interopérabilité avec MOSIP/IDS plus tard
```

---

# 9. Démo idéale devant le jury

La démo doit suivre une histoire simple.

```txt
1. Un étudiant dépose un mémoire PDF.
2. L’IA extrait automatiquement le titre, résumé, auteur et mots-clés.
3. Le validateur corrige ou confirme les métadonnées.
4. Le validateur accepte le document pour archivage.
5. Le système génère un hash et un QR code.
6. Le document apparaît dans le répertoire public.
7. Le jury recherche “identité numérique” avec les facettes.
8. Le jury pose une question au RAG.
9. Le RAG répond avec les sources.
10. Le jury scanne le QR code et voit que le document est authentique.
```

C’est une démo complète, cohérente et impressionnante.

---

# 10. Formulation finale du concept

> **OpenScience Hub est une plateforme institutionnelle qui transforme les mémoires, thèses et articles en dossiers scientifiques structurés. Elle automatise l’extraction des métadonnées par IA, organise la validation académique, archive les versions finales, permet une recherche à facettes et offre un assistant RAG capable d’interroger les travaux scientifiques en langage naturel avec des réponses sourcées. Après validation, chaque document reçoit une preuve d’authenticité vérifiable par QR code, extensible vers les Verifiable Credentials et le SSI.**

Là, on est sur une conception solide : conforme au thème, faisable en 24h, démontrable, et alignée avec votre vision SSI.

Ne parles pas d'assistant rag mais assistant ia

Oui. Maintenant il faut arrêter de raisonner “idée” et passer en **produit structuré** : qui utilise quoi, quels modules existent, quelles fonctionnalités sont indispensables, et ce qu’on peut réellement démontrer en hackathon.

Le produit doit être pensé comme une **plateforme institutionnelle modulaire**, pas comme une simple app d’upload PDF.

# 1. Nom produit et positionnement

## **OpenScience Hub**

### Positionnement

> Plateforme institutionnelle d’archivage, de classification, de validation et d’exploration intelligente des travaux scientifiques universitaires.

Le cœur doit rester aligné au thème : archivage, classification, consultation des mémoires, thèses et articles, avec recherche à facettes. Le bonus IA peut être défendu par l’extraction automatique des métadonnées PDF et par l’assistant IA de recherche scientifique. 

---

# 2. Les grands espaces produit

On garde **3 espaces principaux**.

```txt
1. Espace Déposant
2. Espace Validation académique
3. Espace Archive publique
```

Et techniquement, un back-office admin transverse.

---

# 3. Espace 1 — Déposant

## Utilisateurs

```txt
Étudiant
Doctorant
Enseignant-chercheur
Auteur d’article
```

## Objectif

Permettre à l’auteur de créer un dossier scientifique, déposer son document et suivre son évolution.

## Modules de cet espace

### A. Tableau de bord déposant

Affiche :

```txt
Nombre de dossiers
Dossiers en brouillon
Dossiers soumis
Dossiers en correction
Dossiers validés
Dossiers archivés
```

### B. Création de dossier scientifique

Champs minimum :

```txt
Type : mémoire / thèse / article
Titre provisoire
Auteur
Institution
Faculté
Département
Filière
Niveau
Année académique
Encadreur / directeur / revue
Langue
Visibilité souhaitée
```

### C. Upload du document

Fonctions :

```txt
Upload PDF
Contrôle du format
Calcul du hash du fichier
Extraction du texte
Création d’une version V1
```

### D. Extraction IA des métadonnées

L’IA propose automatiquement :

```txt
Titre
Auteur
Résumé
Mots-clés
Domaine scientifique
Problématique
Méthodologie
Encadreur si détecté
Année
Thématiques associées
```

Ce module est très important pour le hackathon, car le guide mentionne explicitement l’analyse automatique des PDF pour extraire les métadonnées et suggérer des thématiques. 

### E. Correction et soumission

Le déposant peut :

```txt
corriger les métadonnées extraites ;
compléter les champs manquants ;
soumettre officiellement le dossier ;
déposer une nouvelle version après correction.
```

### F. Suivi du statut

Statuts côté déposant :

```txt
Brouillon
Soumis
En instruction
Correction demandée
Validé
Archivé
Rejeté
```

---

# 4. Espace 2 — Validation académique

## Utilisateurs

```txt
Encadreur
Rapporteur
Reviewer
Chef de département
Comité scientifique
École doctorale
Bibliothèque
Administration
```

## Objectif

Permettre à l’institution de contrôler, commenter, valider et archiver les travaux.

## Modules de cet espace

### A. Inbox des dossiers soumis

Liste des dossiers avec filtres :

```txt
type de document
département
année
statut
auteur
encadreur
date de soumission
```

### B. Consultation du dossier

Le validateur voit :

```txt
PDF
métadonnées
versions
historique
hash du document
auteur
encadreur
avis déjà donnés
```

### C. Validation des métadonnées

Actions :

```txt
confirmer les métadonnées IA ;
modifier les champs incorrects ;
ajouter des mots-clés ;
changer la catégorie scientifique ;
marquer le dossier comme incomplet.
```

### D. Avis académique

Chaque validateur peut donner :

```txt
commentaire
recommandation
niveau de conformité
décision proposée
```

Décisions possibles :

```txt
Accepter
Demander correction
Rejeter
Transmettre à un autre validateur
Valider pour archivage
```

### E. Gestion des corrections

Le validateur peut demander :

```txt
correction du résumé ;
ajout de mots-clés ;
remplacement du PDF ;
complément de bibliographie ;
correction de la page de garde ;
mise en conformité.
```

### F. Décision finale

Selon le type de document :

Pour mémoire :

```txt
Validé après soutenance
Correction demandée
Archivé
```

Pour thèse :

```txt
Expertise favorable
Autorisation de soutenance
Validé après soutenance
Dépôt final accepté
Archivé
```

Pour article :

```txt
En review
Révision demandée
Accepté
Rejeté
Archivé / publié
```

### G. Archivage institutionnel

Quand le dossier est validé :

```txt
le statut passe à Archivé ;
la version finale est verrouillée ;
le hash final est enregistré ;
la fiche publique est générée ;
la preuve d’authenticité est créée ;
le QR code est généré.
```

---

# 5. Espace 3 — Archive publique

## Utilisateurs

```txt
Étudiants
Chercheurs
Recruteurs
Universités
Administrations
Grand public
```

## Objectif

Permettre de consulter, rechercher, filtrer et vérifier les travaux scientifiques.

## Modules de cet espace

### A. Catalogue public

Liste des travaux archivés :

```txt
titre
auteur
type
institution
département
année
résumé
mots-clés
statut
```

### B. Recherche à facettes

Facettes indispensables :

```txt
Type : mémoire / thèse / article
Institution
Faculté
Département
Filière
Domaine scientifique
Année
Auteur
Encadreur
Mots-clés
Langue
Statut
Accès : public / restreint
```

C’est un module central, parce que le thème du hackathon demande explicitement un moteur de recherche indexé à facettes. 

### C. Fiche publique du document

Affiche :

```txt
Titre
Résumé
Auteur
Institution
Département
Encadreur
Année
Mots-clés
Type du document
Statut : archivé / validé / publié
Lien PDF si public
QR code de vérification
```

### D. Assistant IA de recherche scientifique

Nom produit :

> **Assistant IA**

Pas “assistant RAG”.

Fonctions visibles :

```txt
poser une question sur l’archive ;
résumer un document ;
trouver des travaux similaires ;
générer une fiche de lecture ;
expliquer les grandes tendances d’un sujet ;
citer les documents utilisés.
```

Techniquement, il peut s’appuyer sur une architecture RAG : récupération de passages pertinents, puis génération d’une réponse informée. Le guide RAG explique justement qu’un système de ce type connecte un modèle génératif à une base documentaire, récupère les extraits pertinents, puis produit une réponse contextualisée avec meilleure traçabilité. 

### E. Vérification d’authenticité

Accessible via :

```txt
QR code
lien public
identifiant unique
```

La page affiche :

```txt
Document authentique ou non
Titre
Auteur
Institution
Date d’archivage
Hash du document
Statut
Identifiant de preuve
```

---

# 6. Back-office administrateur

Même si on ne le montre pas beaucoup, il faut le prévoir.

## Utilisateurs

```txt
Admin institution
Super admin plateforme
```

## Modules

```txt
Gestion des utilisateurs
Gestion des rôles
Gestion des institutions
Gestion des facultés
Gestion des départements
Gestion des types de documents
Gestion des statuts
Gestion des permissions
Configuration des workflows
Statistiques globales
```

Dans le MVP hackathon, on peut simplifier. Mais dans la conception produit, il doit exister.

---

# 7. Modules transverses du produit

Maintenant, voici la vraie découpe produit.

## Module 1 — Authentification & rôles

Fonctions :

```txt
connexion
inscription
gestion de session
rôles
permissions
profils utilisateurs
```

Rôles MVP :

```txt
deposant
validator
admin
public
```

Rôles avancés :

```txt
student
researcher
supervisor
reviewer
department_head
doctoral_school
archivist
institution_admin
super_admin
```

---

## Module 2 — Dossier scientifique

C’est le cœur du système.

Un dossier scientifique contient :

```txt
type
titre
auteur
institution
département
résumé
mots-clés
document PDF
versions
avis
décisions
statut
preuve
archive
```

Le dossier est plus important que le PDF.
Le PDF est seulement une pièce du dossier.

---

## Module 3 — Documents & versions

Fonctions :

```txt
upload PDF
stockage
versioning
hash SHA-256
historique des versions
verrouillage de la version finale
```

Exemple :

```txt
V1 : première soumission
V2 : corrections après avis
V3 : version finale archivée
```

---

## Module 4 — Extraction IA des métadonnées

Fonctions :

```txt
extraction du texte PDF
détection du titre
détection auteur
résumé automatique
mots-clés suggérés
classification thématique
détection langue
fiche de lecture automatique
```

C’est votre premier gros point IA.

---

## Module 5 — Workflow de validation

Fonctions :

```txt
soumission
assignation à validateur
avis
correction demandée
nouvelle version
décision finale
archivage
historique des actions
```

Workflow générique :

```txt
Brouillon
→ Soumis
→ En instruction
→ Correction demandée
→ Re-soumis
→ Validé
→ Archivé
```

---

## Module 6 — Recherche & facettes

Fonctions :

```txt
recherche plein texte
filtres avancés
tri par pertinence
tri par date
facettes dynamiques
recherche par auteur
recherche par mot-clé
recherche par institution
```

---

## Module 7 — Assistant IA

Fonctions :

```txt
question-réponse sur l’archive
résumé d’un document
fiche de lecture
travaux similaires
suggestion de mots-clés
aide à la validation
réponses sourcées
```

À dire dans le pitch :

> L’assistant IA permet d’interroger les travaux scientifiques en langage naturel et retourne des réponses sourcées à partir des documents archivés.

---

## Module 8 — Preuve & vérification

Fonctions :

```txt
génération identifiant unique
calcul hash final
génération QR code
page de vérification
statut d’authenticité
journal de vérification
```

Version future :

```txt
Verifiable Credential
DID institutionnel
signature numérique
wallet étudiant/chercheur
```

Mais pour le MVP, on reste simple.

---

## Module 9 — Statistiques & pilotage

Fonctions :

```txt
nombre de mémoires archivés
nombre de thèses
nombre d’articles
documents par département
documents par année
sujets les plus fréquents
mots-clés dominants
dossiers en attente
temps moyen de validation
```

Très bon pour l’effet “application d’entreprise”.

---

# 8. Priorisation MVP

## À construire absolument

```txt
Auth simple
Dashboard déposant
Création dossier
Upload PDF
Extraction IA métadonnées
Dashboard validation
Avis / décision
Archivage
Recherche à facettes
Fiche publique
Assistant IA simple
QR code de vérification
Page verify
```

## À simuler si manque de temps

```txt
workflow complet mémoire/thèse/article
multi-rapporteurs
signature cryptographique
SSI complet
gestion avancée des permissions
annotations PDF
statistiques avancées
```

## À mettre en roadmap

```txt
portail peer review avancé
Verifiable Credentials
DID institutionnel
wallet
signature numérique qualifiée
interopérabilité universités
intégration bibliothèques
détection avancée de plagiat
```

---

# 9. Découpage produit final

Voici la version propre à mettre dans votre document de conception :

```txt
OpenScience Hub
│
├── Espace Déposant
│   ├── Tableau de bord
│   ├── Création dossier scientifique
│   ├── Upload PDF
│   ├── Métadonnées IA
│   ├── Soumission
│   └── Suivi statut
│
├── Espace Validation académique
│   ├── Dossiers soumis
│   ├── Consultation document
│   ├── Validation métadonnées
│   ├── Avis académique
│   ├── Correction demandée
│   ├── Décision finale
│   └── Archivage
│
├── Espace Archive publique
│   ├── Catalogue
│   ├── Recherche à facettes
│   ├── Fiche document
│   ├── Assistant IA
│   └── Vérification QR code
│
├── Back-office Admin
│   ├── Utilisateurs
│   ├── Rôles
│   ├── Institutions
│   ├── Départements
│   ├── Workflows
│   └── Statistiques
│
└── Services transverses
    ├── Stockage documents
    ├── Versioning
    ├── Extraction IA
    ├── Indexation
    ├── Recherche
    ├── Preuve d’authenticité
    └── Notifications
```

---

# 10. Phrase produit finale

> **OpenScience Hub transforme les mémoires, thèses et articles en dossiers scientifiques structurés. La plateforme permet le dépôt, l’extraction IA des métadonnées, la validation académique, l’archivage institutionnel, la recherche à facettes, l’exploration par assistant IA et la vérification d’authenticité par QR code.**

Là, on a une vraie base produit.
La prochaine étape logique est de faire le **workflow détaillé écran par écran** pour chaque espace.

Allant il faut d'abord finaliser la conception en faisant les diagrammes. On commence per le diagramme de classe. Tu vas le faire en plantexUML et si tu peux le Compiler directement et me donner le pdf et code .ou alors tu me donne le code plantexUml je pars Compiler en ligne. Donc réfléchis bien avant de le faire. Sans supposer sois précis et expert 

Oui. J’ai finalisé un **premier diagramme de classe complet** pour OpenScience Hub, en PlantUML, avec les modules clés : identité, institution, dossier scientifique, documents/versioning, validation académique, archive, assistant IA, recherche à facettes, preuve et vérification.

Le modèle garde bien le cœur du thème : archivage, classification, consultation, recherche à facettes et extraction IA des métadonnées PDF. 

Fichiers prêts :

* [Code PlantUML `.puml`](sandbox:/mnt/data/OpenScienceHub_class_diagram.puml)
* [PDF du diagramme](sandbox:/mnt/data/OpenScienceHub_class_diagram.pdf)
* [Pack ZIP complet](sandbox:/mnt/data/OpenScienceHub_class_diagram_deliverables.zip)

Petite précision : le PDF est généré comme rendu visuel du même modèle de conception. Le fichier PlantUML reste la source officielle à compiler ou modifier.

Il y a trop d'incohérences sur l'affichage et aussi le rendu n'est pas premieum
Et aussi dinne le md du diagramme parmi les assets téléchargeable que tu va donner 
Le SSI est natif via eidStack-CMU et non en extension 

Tu as raison. J’ai corrigé la conception sur trois points :

1. **Rendu premium** : le diagramme n’est plus sur une seule page saturée. Il est découpé en vues lisibles : vue globale, noyau métier, validation, IA/recherche/SSI, énumérations.
2. **Markdown ajouté** : le `.md` explicatif du diagramme est maintenant inclus dans les assets.
3. **SSI natif** : la preuve n’est plus traitée comme une extension vague. Elle est intégrée nativement via **eidStack-CMU** dans le module de preuve/vérification.

J’ai gardé le cœur du thème : archive, classification, consultation, recherche à facettes et extraction IA des métadonnées PDF. 

Assets corrigés :

* [PDF premium du diagramme](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v3_premium.pdf)
* [Code PlantUML corrigé](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v3_premium.puml)
* [Markdown explicatif](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v3_premium.md)
* [Pack complet ZIP](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v3_premium_deliverables.zip)

Le fichier officiel à modifier reste le `.puml`. Le PDF est la version propre pour lecture, présentation et validation interne.

Le md doit décrire le diagramme en détail textuel et detail avec champs, types, enum...

Et le pdf doit être bien cohérent car plusieurs trucs non liés c'est pas forcément bien cohérent bref c'est toi l'expert si c'est bon ça va
C’est corrigé en **v4**.

J’ai repris le diagramme pour avoir une version plus cohérente et plus propre :

* le **PDF est découpé en vues lisibles** : vue globale, noyau métier, validation, recherche/assistant IA, SSI natif eidStack-CMU, enums ;
* le **SSI est intégré nativement** avec `EidStackCMUConnection`, `DecentralizedIdentifier`, `VerifiableCredential`, `CredentialSubject`, `CredentialSchema`, `CredentialStatusRecord` ;
* le **Markdown décrit le diagramme en détail** : classes, champs, types, relations, règles métier et enums ;
* le `.puml` reste disponible pour compilation/modification PlantUML.

Fichiers :

* [PDF premium corrigé](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v4_premium.pdf)
* [Code PlantUML v4](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v4.puml)
* [Markdown détaillé v4](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v4.md)
* [Pack complet ZIP](sandbox:/mnt/data/OpenScienceHub_ClassDiagram_v4_deliverables.zip)

On passe au diagrammes de cas d'utilisation complet. Pas seulement du mv mais du système complet 

J’ai finalisé le **diagramme de cas d’utilisation complet du système OpenScience Hub**, pas seulement le MVP.

Il couvre : déposant, validation académique, mémoire, thèse, article, archive publique, recherche à facettes, assistant IA, administration, QR code, vérification et SSI natif via **eidStack-CMU**. Le cadrage reste aligné avec le thème officiel : archivage, classification, consultation, recherche à facettes et IA pour métadonnées PDF. 

Fichiers prêts :

* [PDF premium - diagrammes de cas d’utilisation](sandbox:/mnt/data/OpenScienceHub_UseCaseDiagram_v1_complete.pdf)
* [Code PlantUML complet](sandbox:/mnt/data/OpenScienceHub_UseCaseDiagram_v1_complete.puml)
* [Markdown détaillé](sandbox:/mnt/data/OpenScienceHub_UseCaseDiagram_v1_complete.md)
* [Pack complet ZIP](sandbox:/mnt/data/OpenScienceHub_UseCaseDiagram_v1_complete_deliverables.zip)

Diagrama suivant 

On passe au **diagramme de séquence complet**. J’ai couvert tout le système, pas seulement le MVP :

1. dépôt scientifique + extraction IA + indexation ;
2. soumission + validation académique générique ;
3. variante thèse ;
4. variante article ;
5. archivage final + QR code + SSI natif via eidStack-CMU ;
6. consultation publique + recherche à facettes + Assistant IA ;
7. vérification d’authenticité par QR code ;
8. administration institutionnelle + paramétrage des workflows.

Fichiers prêts :

* [PDF premium - diagrammes de séquence](sandbox:/mnt/data/OpenScienceHub_SequenceDiagrams_v1_complete.pdf)
* [Code PlantUML complet](sandbox:/mnt/data/OpenScienceHub_SequenceDiagrams_v1_complete.puml)
* [Markdown détaillé](sandbox:/mnt/data/OpenScienceHub_SequenceDiagrams_v1_complete.md)
* [Pack complet ZIP](sandbox:/mnt/data/OpenScienceHub_SequenceDiagrams_v1_complete_deliverables.zip)


Suivant 
Diagramme suivant finalisé : **diagrammes d’activité complets du système OpenScience Hub**.

J’ai couvert les flux principaux du système complet : dépôt, extraction IA, validation académique mémoire/thèse/article, archivage, SSI natif via eidStack-CMU, recherche à facettes, Assistant IA, vérification QR et administration. Le tout reste aligné avec le thème officiel : archivage, classification, consultation, recherche à facettes et extraction IA des métadonnées PDF. 

Fichiers :

* [PDF premium - diagrammes d’activité](sandbox:/mnt/data/OpenScienceHub_ActivityDiagrams_v1_complete.pdf)
* [Code PlantUML](sandbox:/mnt/data/OpenScienceHub_ActivityDiagrams_v1_complete.puml)
* [Markdown détaillé](sandbox:/mnt/data/OpenScienceHub_ActivityDiagrams_v1_complete.md)
* [Pack complet ZIP](sandbox:/mnt/data/OpenScienceHub_ActivityDiagrams_v1_complete_deliverables.zip)


On passe maintenant au branding 

Oui. On passe au **branding produit**, pas seulement “logo”. Il faut construire une identité claire pour que le jury comprenne immédiatement :

> c’est une plateforme académique sérieuse, intelligente, institutionnelle, vérifiable et moderne.

# 1. Positionnement de marque

Le produit doit être perçu comme :

```txt
Académique
Institutionnel
Fiable
Moderne
Intelligent
Vérifiable
Ouvert à la recherche
```

Donc il faut éviter un branding trop “startup fun” ou trop “blockchain/crypto”.
On doit être plus proche de :

```txt
archive universitaire + moteur de recherche scientifique + preuve numérique
```

---

# 2. Nom du produit

## Option recommandée

# **OpenScience Hub**

C’est clair, directement lié au thème, et compréhensible par un jury.

### Tagline courte

> **Archive. Validate. Discover. Verify.**

Ou en français :

> **Archiver. Valider. Explorer. Vérifier.**

### Version plus institutionnelle

> **La mémoire scientifique universitaire, structurée et vérifiable.**

### Version pitch

> **Le hub intelligent des travaux scientifiques universitaires.**

---

# 3. Sous-marque technique

Comme le SSI est natif via **eidStack-CMU**, il ne faut pas le mettre dans le nom principal. On peut le présenter comme une capacité interne :

```txt
OpenScience Hub
Powered by eidStack-CMU SSI Layer
```

Ou :

```txt
Native SSI verification with eidStack-CMU
```

Mais dans le logo principal, on garde **OpenScience Hub**.

---

# 4. Identité visuelle recommandée

## Palette principale

Je recommande une palette **bleu profond + cyan + blanc**, parce que :

* bleu = confiance, institution, recherche ;
* cyan = technologie, IA, numérique ;
* blanc = clarté, bibliothèque, savoir ;
* une touche violet peut rappeler l’IA, mais sans dominer.

### Palette proposée

```txt
Navy Deep      #0B1026
Academic Blue  #1E3A8A
Science Cyan   #06B6D4
Soft Sky       #E0F2FE
Pure White     #FFFFFF
Slate Text     #334155
Success Green  #10B981
Warning Amber  #F59E0B
Error Red      #EF4444
```

## Usage

```txt
Bleu profond : header, sidebar, fond premium
Cyan : boutons, liens, accents IA
Blanc : cartes, zones de lecture
Vert : document validé / authentique
Orange : correction demandée
Rouge : rejeté / invalide
```

---

# 5. Style graphique

Le symbole doit représenter 4 idées :

```txt
document scientifique
archive institutionnelle
recherche intelligente
preuve vérifiable
```

Donc les pistes logo fortes sont :

## Concept A — Document + réseau

Une feuille stylisée avec des nœuds connectés.

Signification :

```txt
PDF scientifique + IA + connaissance structurée
```

## Concept B — Livre ouvert + check vérifié

Un livre ou document ouvert avec un check discret.

Signification :

```txt
savoir académique validé
```

## Concept C — Hexagone institutionnel + document

Un hexagone ou bouclier léger contenant une page.

Signification :

```txt
confiance, preuve, institution, SSI
```

## Concept D — Loupe + document + étincelle IA

Une loupe sur un document avec un point lumineux.

Signification :

```txt
recherche, exploration, assistant IA
```

Pour votre projet, je recommande :

# **Concept A : Document + réseau + check discret**

C’est le plus équilibré. Il montre le document, l’intelligence et la vérification sans faire trop administratif.

---

# 6. Ton de marque

Le ton doit être :

```txt
professionnel
académique
clair
fiable
ambitieux
```

À éviter :

```txt
trop blockchain
trop IA magique
trop bibliothèque simple
trop administratif lent
```

Exemples de phrases produit :

> **Centralisez, validez et valorisez les travaux scientifiques de votre institution.**

> **Une archive académique intelligente, consultable et vérifiable.**

> **Transformez les mémoires, thèses et articles en connaissances structurées.**

> **De l’upload PDF à la preuve vérifiable.**

---

# 7. Noms des modules dans l’interface

Il faut des noms simples, pas trop techniques.

```txt
Tableau de bord
Dossiers scientifiques
Dépôt de document
Métadonnées IA
Validation académique
Archive publique
Assistant IA
Recherche avancée
Vérification
Administration
```

Éviter :

```txt
RAG
VC Manager
DID Registry
Credential Issuer
Chunk Index
Vector Search
```

Ces termes restent dans le dossier technique, pas dans l’interface.

---

# 8. Statuts avec labels propres

```txt
Brouillon              gris
Soumis                 bleu
En instruction          cyan
Correction demandée     orange
Validé                 vert
Archivé                bleu profond
Rejeté                 rouge
Authentique            vert
Non vérifié            gris
Invalide               rouge
```

Dans l’interface, afficher des badges :

```txt
VALIDÉ
ARCHIVÉ
AUTHENTIQUE
CORRECTION DEMANDÉE
```

---

# 9. Structure de landing page

Pour le hackathon, la page d’accueil doit vendre vite.

## Hero section

Titre :

> **OpenScience Hub**

Sous-titre :

> **La plateforme intelligente d’archivage, de validation et de vérification des travaux scientifiques universitaires.**

Boutons :

```txt
Explorer l’archive
Déposer un travail
Vérifier un document
```

## Section problème

```txt
Les mémoires, thèses et articles sont dispersés, difficiles à rechercher et rarement vérifiables.
```

## Section solution

```txt
OpenScience Hub centralise les travaux, extrait les métadonnées par IA, organise la validation académique et permet une recherche intelligente avec preuve d’authenticité.
```

## Section fonctionnalités

```txt
Archivage institutionnel
Métadonnées IA
Recherche à facettes
Assistant IA
Validation académique
Vérification QR code
SSI natif eidStack-CMU
```

---

# 10. Identité finale recommandée

```txt
Nom : OpenScience Hub
Tagline : Archiver. Valider. Explorer. Vérifier.
Style : institutionnel, premium, technologique
Couleurs : bleu profond, cyan, blanc
Logo : document scientifique + réseau + check
Promesse : transformer les travaux scientifiques en connaissances structurées et vérifiables
```

Phrase de marque finale :

> **OpenScience Hub aide les institutions à archiver, classifier, valider et valoriser les mémoires, thèses et articles grâce à l’IA, la recherche avancée et la vérification native via eidStack-CMU.**

Prochaine étape logique : produire le **brand book complet** avec logo direction, palette, typographies, composants UI, messages, slogans et variantes de nom.

Le hub intelligent des travaux scientifiques universitaires

Main OpenScience Hub ne me plaît pas trop comme nom

Oui, **“Le hub intelligent des travaux scientifiques universitaires”** est une très bonne base de slogan, mais **OpenScience Hub** est un peu générique. Ça sonne comme un thème, pas comme un vrai produit différenciant.

Il faut un nom qui porte 4 idées :

```txt
Science universitaire
Archive / mémoire
IA / exploration intelligente
Preuve / validation / authenticité
```

# Mes meilleures propositions

## 1. **SciVault**

> Le hub intelligent des travaux scientifiques universitaires.

Très bon nom.
“Vault” donne l’idée d’archive sécurisée, de coffre, de conservation fiable.

Positionnement :

> **SciVault centralise, classe, valide et rend vérifiables les mémoires, thèses et articles universitaires.**

Avantage : court, premium, international, facile à retenir.

---

## 2. **VeriScholar**

> Le hub intelligent des travaux scientifiques universitaires.

Très cohérent avec votre vision SSI.
“Veri” = vérification.
“Scholar” = monde académique.

Positionnement :

> **VeriScholar transforme les travaux universitaires en connaissances structurées, consultables et vérifiables.**

Avantage : très fort pour la preuve d’authenticité.

---

## 3. **SciCore**

> Le hub intelligent des travaux scientifiques universitaires.

Nom plus moderne, plus tech.
“Core” donne l’idée de noyau institutionnel de la recherche.

Positionnement :

> **SciCore est le noyau numérique des mémoires, thèses et articles universitaires.**

Avantage : très propre pour une plateforme d’entreprise/institution.

---

## 4. **ThesisHub**

> Le hub intelligent des travaux scientifiques universitaires.

Très clair, mais un peu limité parce que le produit gère aussi les articles et mémoires.

Avantage : immédiatement compréhensible.
Faiblesse : trop centré sur les thèses.

---

## 5. **MemoRise**

> Le hub intelligent des travaux scientifiques universitaires.

Jeu entre “mémoire” et “rise”.
Ça évoque la valorisation des travaux scientifiques.

Avantage : joli, original.
Faiblesse : moins institutionnel.

---

## 6. **AcadVault**

> Le hub intelligent des travaux scientifiques universitaires.

Archive académique sécurisée et vérifiable.

Positionnement :

> **AcadVault conserve, organise et certifie les productions scientifiques universitaires.**

Avantage : plus institutionnel que SciVault.
Faiblesse : un peu plus froid.

---

## 7. **Knowvia**

> Le hub intelligent des travaux scientifiques universitaires.

“Knowledge” + “via” : la voie vers la connaissance.

Avantage : élégant et brandable.
Faiblesse : moins immédiatement académique.

---

## 8. **CertaSci**

> Le hub intelligent des travaux scientifiques universitaires.

“Certified Science”.
Très orienté validation/authenticité.

Avantage : colle bien au SSI.
Faiblesse : sonne un peu moins naturel.

---

# Mon top 3 stratégique

## 🥇 **VeriScholar**

C’est le meilleur si vous voulez mettre en avant :

```txt
validation
preuve
SSI natif
authenticité
travaux académiques
```

Phrase forte :

> **VeriScholar, le hub intelligent des travaux scientifiques universitaires.**

---

## 🥈 **SciVault**

C’est le meilleur si vous voulez mettre en avant :

```txt
archive
sécurité
institution
conservation
recherche scientifique
```

Phrase forte :

> **SciVault, l’archive intelligente et vérifiable des travaux universitaires.**

---

## 🥉 **SciCore**

C’est le meilleur si vous voulez un nom plus produit SaaS/institutionnel :

```txt
plateforme centrale
infrastructure académique
système d’information universitaire
```

Phrase forte :

> **SciCore, le noyau intelligent de la production scientifique universitaire.**

---

# Recommandation finale

Je choisirais :

# **VeriScholar**

Avec comme slogan :

> **Le hub intelligent des travaux scientifiques universitaires.**

Et comme phrase produit :

> **VeriScholar est une plateforme institutionnelle qui archive, classe, valide et rend vérifiables les mémoires, thèses et articles universitaires grâce à l’IA et au SSI natif via eidStack-CMU.**

C’est clair, sérieux, différenciant et très aligné avec votre vision.


On garde l'ancien 
Ok, on garde donc :

# **OpenScience Hub**

Avec le slogan :

> **Le hub intelligent des travaux scientifiques universitaires**

Formulation officielle à stabiliser :

> **OpenScience Hub est une plateforme institutionnelle qui permet d’archiver, classifier, valider, explorer et vérifier les mémoires, thèses et articles universitaires grâce à l’IA, la recherche avancée et le SSI natif via eidStack-CMU.**

Donc pour la suite du branding, on part sur :

```txt
Nom : OpenScience Hub
Slogan : Le hub intelligent des travaux scientifiques universitaires
Promesse : Archiver. Valider. Explorer. Vérifier.
Positionnement : plateforme académique institutionnelle, intelligente et vérifiable
SSI : natif via eidStack-CMU
```

On peut maintenant construire le **brand book complet** : logo direction, palette, typographie, composants UI, ton de communication, textes landing page et identité visuelle.


Ssi via e-IDStack pas de cmu mais reference IDS plutôt e-IDStack de IDS 

Oui, correction importante à stabiliser :

# **SSI natif via e-IDStack de IDS**

On ne doit plus écrire :

> SSI via eidStack-CMU

On écrit désormais :

> **SSI natif via e-IDStack, en référence à IDS**

ou plus proprement :

> **SSI natif basé sur e-IDStack de IDS**

Formulation officielle corrigée :

> **OpenScience Hub est une plateforme institutionnelle qui permet d’archiver, classifier, valider, explorer et vérifier les mémoires, thèses et articles universitaires grâce à l’IA, la recherche avancée et une couche SSI native basée sur e-IDStack de IDS.**

Pour le branding :

```txt
Nom : OpenScience Hub
Slogan : Le hub intelligent des travaux scientifiques universitaires
Promesse : Archiver. Valider. Explorer. Vérifier.
SSI : natif via e-IDStack de IDS
Positionnement : plateforme académique institutionnelle, intelligente et vérifiable
```

Pour les prochains documents et diagrammes, il faut donc remplacer partout :

```txt
eidStack-CMU
e-IDStack-CMU
CMU SSI Layer
```

par :

```txt
e-IDStack
e-IDStack de IDS
IDS e-IDStack
```

Et côté architecture, le module ne doit pas être nommé `EidStackCMUConnection`, mais plutôt :

```txt
EIDStackConnection
IDSIdentityProvider
VerifiableCredentialIssuer
DecentralizedIdentifier
CredentialStatusRegistry
```

C’est cette version qu’on garde pour la suite.


Ne met pas natif

D’accord. On retire **“natif”**.

Formulation stabilisée :

# **OpenScience Hub**

> **Le hub intelligent des travaux scientifiques universitaires**

Description officielle corrigée :

> **OpenScience Hub est une plateforme institutionnelle qui permet d’archiver, classifier, valider, explorer et vérifier les mémoires, thèses et articles universitaires grâce à l’IA, la recherche avancée et une couche SSI basée sur e-IDStack de IDS.**

Donc on garde maintenant :

```txt
Nom : OpenScience Hub
Slogan : Le hub intelligent des travaux scientifiques universitaires
Promesse : Archiver. Valider. Explorer. Vérifier.
SSI : couche SSI basée sur e-IDStack de IDS
```

À ne plus utiliser :

```txt
SSI natif
eidStack-CMU
e-IDStack-CMU
CMU SSI Layer
```

À utiliser partout :

```txt
couche SSI basée sur e-IDStack de IDS
intégration e-IDStack
vérification via e-IDStack de IDS
preuves vérifiables via e-IDStack
```

On passe au logo.


La palette de couleurs est respecté ?

Oui, **la palette de la référence est globalement respectée**.

On retrouve bien :

```txt
Noir profond → texte principal, laurier gauche, base du symbole
Rouge → accent principal, laurier droit, check, ligne, lettre accentuée
Gris clair → circuits, arcs de fond, éléments secondaires
Blanc → fond principal
```

Donc visuellement, on est bien dans le style :

> **académique + institutionnel + tech + premium rouge/noir/gris**

Par contre, il y a deux points à corriger avant de valider le logo :

1. **Le slogan est en anglais** :
   actuellement :
   `THE INTELLIGENT HUB FOR UNIVERSITY SCIENTIFIC WORKS`
   alors que notre slogan officiel est :
   **Le hub intelligent des travaux scientifiques universitaires**

2. **La lisibilité du mot “OpenScience” est stylée mais un peu trop futuriste**. C’est beau, mais il faut s’assurer que le jury lise immédiatement **OpenScience Hub** sans effort.

Ma recommandation : on garde cette direction visuelle, mais on génère une **version corrigée** avec :

```txt
Nom : OpenScience Hub
Slogan : Le hub intelligent des travaux scientifiques universitaires
Palette : rouge / noir / gris / blanc
Symbole : document + livre + validation + circuits + laurier
Style : premium institutionnel
```

Donc oui, **la palette est bonne**, mais le texte et la lisibilité doivent être corrigés.

Ah oui, compris. Tu ne parlais pas du **logo généré**, tu parlais de la **palette officielle du branding OpenScience Hub**.

Donc non : **la palette qu’on avait proposée au départ n’est pas exactement la même que la référence CADIS**.

Avant, on avait proposé :

```txt
Navy Deep      #0B1026
Academic Blue  #1E3A8A
Science Cyan   #06B6D4
Soft Sky       #E0F2FE
White          #FFFFFF
```

Cette palette fait plus **institution moderne / cloud / IA**, mais elle ne respecte pas vraiment la référence que tu viens de donner.

Avec ta référence CADIS, le branding doit plutôt partir sur :

# Palette officielle recommandée

```txt
Primary Black       #050505
Academic Red        #C40012
Deep Red            #8B000B
Tech Gray           #9CA3AF
Light Silver        #E5E7EB
Pure White          #FFFFFF
Dark Text           #111827
Soft Background     #F8F9FA
```

# Interprétation

Le style devient :

```txt
Noir      → sérieux, institution, autorité
Rouge     → certification, énergie, signature visuelle
Gris      → technologie, circuits, neutralité
Blanc     → clarté, archive, espace premium
```

Donc le branding OpenScience Hub doit abandonner le bleu/cyan si on veut vraiment matcher la référence CADIS.

# Direction branding corrigée

```txt
Nom : OpenScience Hub
Slogan : Le hub intelligent des travaux scientifiques universitaires
Promesse : Archiver. Valider. Explorer. Vérifier.
Palette : Noir / Rouge / Gris / Blanc
Style : académique, certifiant, tech, premium
Symbole : document + livre ouvert + check + circuits + laurier
SSI : couche SSI basée sur e-IDStack de IDS
```

# Règle importante

On garde le rouge/noir/gris/blanc pour :

```txt
logo
landing page
dashboard
documents PDF
présentation
diagrammes
badges de statut
```

Donc oui : **pour le branding final, on doit utiliser la palette CADIS-like, pas la palette bleu/cyan proposée avant.**


La **nouvelle palette officielle OpenScience Hub** devient :

# Palette principale

| Usage              |           Couleur |      Code |
| ------------------ | ----------------: | --------: |
| Noir principal     | **Primary Black** | `#050505` |
| Rouge signature    |  **Academic Red** | `#C40012` |
| Rouge profond      |      **Deep Red** | `#8B000B` |
| Gris technologique |     **Tech Gray** | `#9CA3AF` |
| Argent clair       |  **Light Silver** | `#E5E7EB` |
| Blanc pur          |    **Pure White** | `#FFFFFF` |

# Palette fonctionnelle

| Usage                      |             Couleur |      Code |
| -------------------------- | ------------------: | --------: |
| Texte principal            |       **Dark Text** | `#111827` |
| Texte secondaire           |      **Slate Gray** | `#4B5563` |
| Fond clair                 | **Soft Background** | `#F8F9FA` |
| Bordures / séparateurs     |     **Border Gray** | `#D1D5DB` |
| Succès / authentique       |  **Verified Green** | `#10B981` |
| Avertissement / correction |   **Warning Amber** | `#F59E0B` |
| Erreur / rejeté            |       **Error Red** | `#EF4444` |

# Règle d’utilisation

```txt
Noir        → logo, titres, sidebar, textes forts
Rouge       → accents, boutons principaux, ligne signature, éléments de validation
Gris        → circuits, contours, textes secondaires, éléments techniques
Blanc       → fond premium, cartes, espaces de lecture
Vert        → document authentique / validé
Orange      → correction demandée / en attente
Rouge clair → rejeté / invalide
```

# Identité finale

```txt
Nom : OpenScience Hub
Slogan : Le hub intelligent des travaux scientifiques universitaires
Palette : Noir / Rouge / Gris / Blanc
Promesse : Archiver. Valider. Explorer. Vérifier.
SSI : couche SSI basée sur e-IDStack de IDS
Style : académique, institutionnel, technologique, premium
```

Donc on abandonne définitivement la palette bleu/cyan. Le branding officiel part maintenant sur **noir + rouge + gris + blanc**, comme la référence CADIS.


On passe au rendu explicatif de l'interface. 
On commence par une description générale de chaque portail. Puis pour. Chaque portail on va décrire en général chaque page de chaque portail puis on va décrire en détail chaque fonctionnalité de chaque page, chaque interface de chaque portail.  On commence 

On commence par la **conception fonctionnelle des interfaces**. Là, on ne dessine pas encore les maquettes, on décrit précisément **ce que chaque portail contient**, **à quoi il sert**, **qui l’utilise**, et **quelles pages doivent exister**.

Le produit reste :

# **OpenScience Hub**

## Le hub intelligent des travaux scientifiques universitaires

> Plateforme institutionnelle permettant d’archiver, classifier, valider, explorer et vérifier les mémoires, thèses et articles universitaires grâce à l’IA, la recherche avancée et une couche SSI basée sur **e-IDStack de IDS**.

Le cœur reste aligné au thème du hackathon : **archivage, classification, consultation des travaux scientifiques universitaires avec moteur de recherche à facettes**, enrichi par l’IA pour l’extraction automatique des métadonnées PDF. 

---

# 1. Vue générale des portails

Le système complet doit être organisé en **4 grands portails**.

```txt
1. Portail Déposant
2. Portail Validation académique
3. Portail Archive publique
4. Portail Administration
```

Le **Portail Peer Review** n’est pas un portail séparé au départ. Il est intégré comme un **module du portail Validation académique**, surtout pour les articles scientifiques.

---

# 2. Portail Déposant

## Rôle général

Le portail déposant est l’espace utilisé par ceux qui soumettent des travaux scientifiques.

Il concerne :

```txt
Étudiants
Doctorants
Enseignants-chercheurs
Auteurs d’articles
```

Son objectif est simple :

> permettre à un auteur de créer un dossier scientifique, déposer son document PDF, faire extraire les métadonnées par IA, compléter les informations manquantes, soumettre officiellement le dossier et suivre son statut.

## Pages principales du Portail Déposant

```txt
1. Tableau de bord déposant
2. Mes dossiers scientifiques
3. Nouveau dépôt
4. Détail d’un dossier
5. Métadonnées IA
6. Versions du document
7. Corrections demandées
8. Preuve et vérification
9. Profil déposant
```

---

## 2.1 Tableau de bord déposant

### Objectif de la page

Donner au déposant une vue rapide sur tous ses travaux et leur état.

### Contenu général

La page doit afficher :

```txt
Nombre total de dossiers
Dossiers en brouillon
Dossiers soumis
Dossiers en instruction
Dossiers avec correction demandée
Dossiers validés
Dossiers archivés
Dernières actions
Notifications importantes
```

### Fonctionnalités

Le déposant peut :

```txt
voir l’état général de ses travaux ;
reprendre un dépôt en brouillon ;
consulter un dossier soumis ;
voir les corrections demandées ;
accéder rapidement au bouton “Nouveau dépôt” ;
voir les dernières décisions académiques.
```

---

## 2.2 Page “Mes dossiers scientifiques”

### Objectif de la page

Lister tous les dossiers créés par le déposant.

### Colonnes principales

```txt
Titre
Type : mémoire / thèse / article
Institution
Département
Année académique
Statut
Dernière mise à jour
Action
```

### Filtres

```txt
Type de document
Statut
Année académique
Département
Date de création
```

### Actions possibles

```txt
ouvrir le dossier ;
modifier un brouillon ;
soumettre un dossier ;
déposer une nouvelle version ;
voir les corrections ;
télécharger la version validée ;
accéder à la preuve si le document est archivé.
```

---

## 2.3 Page “Nouveau dépôt”

### Objectif de la page

Créer un nouveau dossier scientifique.

### Étapes de l’interface

La page doit fonctionner comme un wizard en plusieurs étapes :

```txt
Étape 1 : Choix du type de travail
Étape 2 : Informations académiques
Étape 3 : Upload du PDF
Étape 4 : Extraction IA
Étape 5 : Vérification des métadonnées
Étape 6 : Soumission
```

### Champs principaux

```txt
Type de document : mémoire / thèse / article
Titre provisoire
Auteur principal
Co-auteurs éventuels
Institution
Faculté
Département
Filière
Niveau académique
Année académique
Encadreur / directeur / revue
Langue
Visibilité souhaitée : public / restreint / privé institutionnel
```

### Fonctionnalités

```txt
créer un brouillon ;
enregistrer progressivement ;
uploader un PDF ;
lancer l’extraction IA ;
corriger les métadonnées ;
soumettre officiellement.
```

---

## 2.4 Page “Détail d’un dossier”

### Objectif de la page

Afficher toutes les informations d’un dossier scientifique.

### Sections de la page

```txt
Résumé du dossier
Statut actuel
Métadonnées académiques
Document principal
Versions
Avis reçus
Décisions
Historique
Preuve de vérification si disponible
```

### Fonctionnalités

```txt
consulter les informations du dossier ;
modifier si le dossier est en brouillon ;
voir les avis académiques ;
lire les demandes de correction ;
déposer une nouvelle version ;
suivre l’évolution du workflow ;
voir la fiche publique si archivé.
```

---

## 2.5 Page “Métadonnées IA”

### Objectif de la page

Afficher les informations extraites automatiquement du PDF.

### Données extraites

```txt
Titre
Auteur
Résumé
Mots-clés
Domaine scientifique
Problématique
Méthodologie
Résultats principaux
Encadreur détecté
Année
Langue
Thématiques associées
```

### Fonctionnalités

```txt
accepter les métadonnées proposées ;
modifier les champs incorrects ;
ajouter des mots-clés ;
relancer l’analyse IA ;
comparer métadonnées IA et métadonnées saisies ;
valider les informations avant soumission.
```

Cette page est très importante pour le hackathon parce qu’elle montre directement l’usage IA attendu dans le thème : analyse PDF, extraction des métadonnées et suggestion de thématiques. 

---

## 2.6 Page “Versions du document”

### Objectif de la page

Gérer les différentes versions du PDF.

### Contenu

```txt
Version
Date de dépôt
Auteur du dépôt
Hash du fichier
Statut de la version
Note de modification
Lien de téléchargement
```

### Exemple de versions

```txt
V1 : première soumission
V2 : version corrigée
V3 : version finale archivée
```

### Fonctionnalités

```txt
voir l’historique des versions ;
déposer une nouvelle version ;
comparer les informations principales ;
identifier la version finale ;
verrouiller la version finale après archivage.
```

---

## 2.7 Page “Corrections demandées”

### Objectif de la page

Permettre au déposant de répondre aux demandes de correction.

### Contenu

```txt
Correction demandée
Auteur de la demande
Date
Priorité
Commentaire académique
Statut de traitement
```

### Fonctionnalités

```txt
lire les remarques ;
répondre à une correction ;
uploader une version corrigée ;
marquer une correction comme traitée ;
renvoyer le dossier en validation.
```

---

## 2.8 Page “Preuve et vérification”

### Objectif de la page

Afficher la preuve générée après validation et archivage.

### Contenu

```txt
Identifiant du document
Identifiant de preuve
Hash SHA-256 du PDF final
Statut d’authenticité
Date d’archivage
Institution validatrice
QR code
Lien public de vérification
Référence e-IDStack de IDS
```

### Fonctionnalités

```txt
copier le lien de vérification ;
télécharger le QR code ;
voir la page publique de vérification ;
télécharger le PDF final certifié ;
voir le statut de la preuve.
```

---

# 3. Portail Validation académique

## Rôle général

Le portail Validation académique est l’espace des acteurs institutionnels qui examinent, corrigent, valident ou rejettent les dossiers scientifiques.

Il concerne :

```txt
Encadreurs
Directeurs de thèse
Rapporteurs
Reviewers
Chefs de département
Comités scientifiques
Écoles doctorales
Bibliothécaires / archivistes
Administrations académiques
```

Son objectif :

> permettre à l’institution de contrôler la qualité du dossier, valider les métadonnées, donner des avis, demander des corrections, enregistrer une décision finale et déclencher l’archivage.

## Pages principales

```txt
1. Tableau de bord validation
2. Dossiers à traiter
3. Détail du dossier à valider
4. Avis académiques
5. Gestion des corrections
6. Décision finale
7. Archivage institutionnel
8. Module articles / peer review
9. Historique des actions
```

---

## 3.1 Tableau de bord validation

### Objectif

Donner une vue globale du travail en attente.

### Indicateurs

```txt
Dossiers soumis
Dossiers en instruction
Corrections en attente
Dossiers prêts pour décision
Dossiers validés
Dossiers rejetés
Dossiers archivés
Temps moyen de traitement
```

### Fonctionnalités

```txt
filtrer par département ;
filtrer par type de document ;
voir les dossiers urgents ;
accéder aux dossiers assignés ;
consulter les statistiques de validation.
```

---

## 3.2 Page “Dossiers à traiter”

### Objectif

Lister les dossiers soumis à l’acteur connecté.

### Colonnes

```txt
Titre
Auteur
Type
Département
Statut
Date de soumission
Validateur assigné
Priorité
Action
```

### Filtres

```txt
Mémoire
Thèse
Article
Département
Statut
Date
Encadreur
Reviewer
```

### Actions

```txt
ouvrir le dossier ;
assigner un validateur ;
donner un avis ;
demander correction ;
envoyer vers décision finale.
```

---

## 3.3 Page “Détail du dossier à valider”

### Objectif

Permettre au validateur d’examiner le dossier complet.

### Sections

```txt
PDF viewer
Métadonnées extraites
Métadonnées corrigées
Informations académiques
Versions du document
Historique
Avis précédents
Actions disponibles
```

### Fonctionnalités

```txt
lire le PDF ;
vérifier les métadonnées ;
corriger les champs ;
voir le hash du document ;
consulter les anciennes versions ;
ajouter un commentaire ;
demander une correction ;
émettre un avis.
```

---

## 3.4 Page “Avis académiques”

### Objectif

Centraliser les avis des encadreurs, rapporteurs ou reviewers.

### Champs d’un avis

```txt
Auteur de l’avis
Rôle de l’auteur
Date
Commentaire
Recommandation
Niveau de conformité
Décision proposée
```

### Recommandations possibles

```txt
Favorable
Favorable avec corrections
Défavorable
À réviser
À transmettre
```

---

## 3.5 Page “Gestion des corrections”

### Objectif

Créer et suivre les corrections demandées au déposant.

### Types de corrections

```txt
Métadonnées incorrectes
Résumé incomplet
Mots-clés faibles
PDF non conforme
Bibliographie insuffisante
Version finale manquante
Correction scientifique
Correction administrative
```

### Fonctionnalités

```txt
créer une demande de correction ;
attribuer une priorité ;
suivre la réponse du déposant ;
valider la correction ;
renvoyer en instruction.
```

---

## 3.6 Page “Décision finale”

### Objectif

Enregistrer la décision institutionnelle.

### Décisions possibles

Pour mémoire :

```txt
Validé après soutenance
Correction demandée
Rejeté
Archivable
```

Pour thèse :

```txt
Expertise favorable
Autorisation de soutenance
Validé après soutenance
Dépôt final accepté
Archivable
```

Pour article :

```txt
Accepté
Révision demandée
Rejeté
Publié
Archivable
```

### Fonctionnalités

```txt
choisir la décision ;
ajouter un commentaire ;
joindre un PV ou document justificatif ;
déclencher l’archivage ;
notifier le déposant.
```

---

# 4. Portail Archive publique

## Rôle général

Le portail Archive publique est l’espace consultable par les étudiants, chercheurs, universités, entreprises, recruteurs et administrations.

Son objectif :

> permettre de rechercher, filtrer, consulter, explorer et vérifier les travaux scientifiques archivés.

## Pages principales

```txt
1. Accueil archive publique
2. Catalogue des travaux
3. Recherche avancée à facettes
4. Fiche publique d’un document
5. Assistant IA
6. Page de vérification QR code
7. Tendances scientifiques
```

---

## 4.1 Accueil archive publique

### Objectif

Présenter la plateforme et orienter l’utilisateur.

### Sections

```txt
Barre de recherche principale
Boutons : Explorer / Vérifier / Assistant IA
Statistiques globales
Travaux récents
Domaines populaires
Institutions participantes
```

---

## 4.2 Catalogue des travaux

### Objectif

Afficher tous les travaux accessibles.

### Carte d’un document

```txt
Titre
Auteur
Type
Institution
Département
Année
Résumé court
Mots-clés
Statut
Bouton consulter
```

---

## 4.3 Recherche avancée à facettes

### Objectif

Permettre une recherche structurée et précise.

### Facettes

```txt
Type de document
Institution
Faculté
Département
Filière
Domaine scientifique
Année
Auteur
Encadreur
Mots-clés
Langue
Statut
Accès
```

### Fonctionnalités

```txt
combiner plusieurs filtres ;
trier par date ;
trier par pertinence ;
réinitialiser les filtres ;
sauvegarder une recherche ;
ouvrir une fiche document.
```

---

## 4.4 Fiche publique d’un document

### Objectif

Présenter un travail scientifique archivé.

### Sections

```txt
Titre
Auteur
Résumé
Mots-clés
Institution
Département
Encadreur
Année
Type de document
Statut
PDF disponible ou restreint
QR code
Preuve d’authenticité
Travaux similaires
```

### Fonctionnalités

```txt
consulter les métadonnées ;
télécharger le PDF si autorisé ;
copier la référence ;
ouvrir la vérification ;
demander une synthèse IA ;
voir les documents similaires.
```

---

## 4.5 Page “Assistant IA”

### Objectif

Permettre à l’utilisateur d’interroger l’archive en langage naturel.

### Exemples de questions

```txt
Quels travaux parlent de l’identité numérique universitaire ?
Résume les thèses récentes sur l’intelligence artificielle en santé.
Quels mémoires abordent la blockchain et les diplômes numériques ?
Quels sont les travaux proches de ce document ?
```

### Fonctionnalités

```txt
poser une question ;
obtenir une réponse sourcée ;
voir les documents utilisés ;
ouvrir les sources ;
résumer un document ;
générer une fiche de lecture ;
suggérer des mots-clés.
```

---

## 4.6 Page de vérification QR code

### Objectif

Permettre à une personne externe de vérifier l’authenticité d’un document.

### Accès

```txt
Scan QR code
Lien direct
Identifiant de preuve
```

### Résultat affiché

```txt
Document authentique / invalide / introuvable
Titre
Auteur
Institution
Hash du document
Date d’archivage
Statut
Référence e-IDStack de IDS
```

---

# 5. Portail Administration

## Rôle général

Le portail Administration permet de configurer et piloter la plateforme.

Il concerne :

```txt
Administrateur institutionnel
Super administrateur
Responsable archive
Responsable SI
```

## Pages principales

```txt
1. Tableau de bord administration
2. Gestion des utilisateurs
3. Gestion des rôles
4. Gestion des institutions
5. Gestion des facultés et départements
6. Configuration des workflows
7. Gestion des types de documents
8. Paramètres IA
9. Paramètres SSI / e-IDStack
10. Statistiques et audit
```

---

## 5.1 Tableau de bord administration

### Indicateurs

```txt
Nombre total de dossiers
Nombre de documents archivés
Nombre d’utilisateurs
Dossiers en attente
Dossiers validés
Dossiers rejetés
Nombre de vérifications QR
Activité IA
Activité SSI
```

---

## 5.2 Gestion des utilisateurs

### Fonctionnalités

```txt
créer un utilisateur ;
modifier un profil ;
désactiver un compte ;
attribuer un rôle ;
lier un utilisateur à une institution ;
lier un utilisateur à un département.
```

---

## 5.3 Gestion des rôles

### Rôles principaux

```txt
Déposant
Validateur
Encadreur
Rapporteur
Reviewer
Archiviste
Administrateur institutionnel
Super administrateur
```

### Fonctionnalités

```txt
créer un rôle ;
modifier les permissions ;
limiter les accès par institution ;
limiter les accès par département.
```

---

## 5.4 Configuration des workflows

### Objectif

Permettre à chaque institution d’adapter le circuit de validation.

### Workflows configurables

```txt
Workflow mémoire
Workflow thèse
Workflow article
Workflow archive
Workflow vérification
```

### Fonctionnalités

```txt
définir les étapes ;
définir les rôles autorisés ;
définir les transitions ;
activer ou désactiver une étape ;
définir les décisions possibles.
```

---

# 6. Structure globale stabilisée

```txt
OpenScience Hub
│
├── Portail Déposant
│   ├── Tableau de bord
│   ├── Mes dossiers
│   ├── Nouveau dépôt
│   ├── Détail dossier
│   ├── Métadonnées IA
│   ├── Versions
│   ├── Corrections
│   └── Preuve
│
├── Portail Validation académique
│   ├── Tableau de bord
│   ├── Dossiers à traiter
│   ├── Détail validation
│   ├── Avis
│   ├── Corrections
│   ├── Décision finale
│   └── Archivage
│
├── Portail Archive publique
│   ├── Accueil
│   ├── Catalogue
│   ├── Recherche à facettes
│   ├── Fiche document
│   ├── Assistant IA
│   └── Vérification QR
│
└── Portail Administration
    ├── Dashboard
    ├── Utilisateurs
    ├── Rôles
    ├── Institutions
    ├── Départements
    ├── Workflows
    ├── IA
    ├── SSI / e-IDStack
    └── Audit
```

C’est la première couche propre. La suite logique est de prendre **portail par portail** et de décrire **chaque page en détail interface par interface**, en commençant par le **Portail Déposant**.


Vas-y 

Parfait. On commence par le **Portail Déposant**, parce que c’est le point d’entrée naturel du système.

# Portail 1 — Portail Déposant

## Description générale

Le **Portail Déposant** est l’espace réservé aux utilisateurs qui soumettent des travaux scientifiques dans la plateforme.

Il concerne principalement :

```txt
Étudiant
Doctorant
Enseignant-chercheur
Auteur d’article
Chercheur associé
```

Son rôle est de permettre au déposant de :

```txt
créer un dossier scientifique ;
déposer un mémoire, une thèse ou un article ;
faire analyser le PDF par l’IA ;
vérifier et compléter les métadonnées ;
soumettre le dossier à validation ;
suivre le traitement académique ;
répondre aux corrections ;
accéder à la preuve de vérification après archivage.
```

Ce portail est essentiel parce qu’il transforme un simple document PDF en **dossier scientifique structuré**. C’est ce dossier qui pourra ensuite être validé, archivé, recherché, exploré par l’assistant IA et vérifié via la couche SSI basée sur **e-IDStack de IDS**.

---

# Structure générale du Portail Déposant

Le Portail Déposant contient les pages suivantes :

```txt
1. Tableau de bord
2. Mes dossiers scientifiques
3. Nouveau dépôt
4. Détail d’un dossier
5. Métadonnées IA
6. Versions du document
7. Corrections demandées
8. Preuve et vérification
9. Notifications
10. Profil déposant
```

---

# 1. Page : Tableau de bord déposant

## Objectif général

Le tableau de bord donne au déposant une vue rapide de tous ses travaux scientifiques et de leur état de traitement.

C’est la première page après connexion.

## Interface générale

La page doit être organisée en quatre zones :

```txt
1. En-tête de bienvenue
2. Cartes statistiques
3. Liste des dossiers récents
4. Bloc notifications / actions urgentes
```

---

## 1.1 En-tête de bienvenue

### Contenu

```txt
Bonjour, [Nom du déposant]
Bienvenue sur votre espace de dépôt scientifique.
Bouton : Nouveau dépôt
Bouton secondaire : Consulter mes dossiers
```

### Rôle

L’en-tête sert à orienter immédiatement l’utilisateur. Le bouton **Nouveau dépôt** doit être très visible, parce que c’est l’action principale du portail.

---

## 1.2 Cartes statistiques

### Cartes à afficher

```txt
Total des dossiers
Brouillons
Soumis
En instruction
Correction demandée
Validés
Archivés
Rejetés
```

### Exemple visuel

```txt
┌──────────────────┐
│ Total dossiers   │
│ 08               │
└──────────────────┘

┌──────────────────┐
│ En instruction   │
│ 03               │
└──────────────────┘
```

### Logique des statuts

```txt
Brouillon : dossier créé mais non soumis
Soumis : dossier envoyé à l’institution
En instruction : dossier en cours de traitement
Correction demandée : action attendue du déposant
Validé : décision favorable
Archivé : document publié dans l’archive
Rejeté : dossier refusé
```

---

## 1.3 Dossiers récents

### Colonnes

```txt
Titre
Type
Statut
Dernière mise à jour
Action
```

### Actions disponibles

```txt
Voir
Modifier
Continuer
Répondre aux corrections
Voir preuve
```

### Règle d’affichage

L’action dépend du statut :

```txt
Brouillon → Modifier / Continuer
Correction demandée → Répondre
Archivé → Voir preuve / Voir fiche publique
Soumis ou En instruction → Voir seulement
```

---

## 1.4 Notifications importantes

### Types de notifications

```txt
Correction demandée
Dossier validé
Dossier archivé
Dossier rejeté
Nouvel avis académique reçu
Preuve disponible
```

### Exemple

```txt
Correction demandée sur : “Système de vérification des diplômes”
Action requise avant le 15 juin 2026.
```

### Fonctionnalités

```txt
ouvrir la notification ;
marquer comme lue ;
accéder directement au dossier concerné.
```

---

# 2. Page : Mes dossiers scientifiques

## Objectif général

Cette page liste tous les dossiers scientifiques du déposant.

Elle doit être plus complète que le tableau de bord.

---

## Interface générale

La page doit contenir :

```txt
1. Barre de recherche
2. Filtres rapides
3. Tableau des dossiers
4. Actions groupées limitées
5. Pagination
```

---

## 2.1 Barre de recherche

### Recherche sur

```txt
Titre
Auteur
Mots-clés
Département
Année académique
Type de document
```

### Placeholder recommandé

```txt
Rechercher un mémoire, une thèse ou un article...
```

---

## 2.2 Filtres

### Filtres obligatoires

```txt
Type de document
Statut
Année académique
Institution
Département
Date de création
```

### Valeurs du filtre “Type”

```txt
Mémoire
Thèse
Article
```

### Valeurs du filtre “Statut”

```txt
Brouillon
Soumis
En instruction
Correction demandée
Validé
Archivé
Rejeté
```

---

## 2.3 Tableau des dossiers

### Colonnes recommandées

```txt
Titre
Type
Institution
Département
Année académique
Statut
Dernière mise à jour
Actions
```

### Actions possibles

```txt
Voir détails
Modifier brouillon
Soumettre
Déposer nouvelle version
Voir corrections
Voir fiche publique
Voir preuve
Télécharger PDF final
```

---

## 2.4 Règles métier importantes

Un dossier **archivé** ne doit plus être modifiable.

```txt
Si statut = Archivé :
- modification bloquée ;
- version finale verrouillée ;
- preuve accessible ;
- fiche publique accessible.
```

Un dossier **en instruction** ne doit pas être modifiable librement.

```txt
Si statut = En instruction :
- lecture seule ;
- modification possible seulement si correction demandée.
```

Un dossier **brouillon** reste totalement modifiable.

---

# 3. Page : Nouveau dépôt

## Objectif général

Cette page permet de créer un nouveau dossier scientifique.

Elle doit être conçue comme un **assistant de dépôt en étapes**, pour éviter que l’utilisateur soit perdu.

---

# Structure du dépôt

```txt
Étape 1 : Choix du type de travail
Étape 2 : Informations académiques
Étape 3 : Upload du PDF
Étape 4 : Analyse IA
Étape 5 : Vérification des métadonnées
Étape 6 : Soumission officielle
```

---

## 3.1 Étape 1 — Choix du type de travail

### Objectif

Identifier le type de document dès le départ, car le workflow dépend du type.

### Choix proposés

```txt
Mémoire
Thèse
Article scientifique
```

### Interface

Chaque choix doit être présenté sous forme de carte.

```txt
Mémoire
Travail académique de fin de cycle, généralement lié à un Master ou équivalent.

Thèse
Travail doctoral nécessitant une instruction plus avancée et une validation renforcée.

Article scientifique
Manuscrit ou publication soumis à un processus éditorial ou scientifique.
```

### Action

```txt
Bouton : Continuer
```

---

## 3.2 Étape 2 — Informations académiques

## Champs communs

```txt
Titre provisoire : string
Auteur principal : string
Co-auteurs : list<string>
Institution : select
Faculté : select
Département : select
Filière : select
Année académique : string
Langue : enum
Visibilité souhaitée : enum
```

## Champs spécifiques au mémoire

```txt
Niveau : Licence / Master / Ingénieur / Autre
Encadreur : string
Option / spécialité : string
Date prévue de soutenance : date optionnelle
```

## Champs spécifiques à la thèse

```txt
Cycle : Doctorat / PhD
Directeur de thèse : string
Codirecteur : string optionnel
École doctorale : select
Laboratoire : string optionnel
Domaine doctoral : string
```

## Champs spécifiques à l’article

```txt
Revue ou conférence : string
Statut éditorial : soumis / accepté / publié / en révision
DOI : string optionnel
Auteurs : list<string>
Corresponding author : string
```

---

## 3.3 Étape 3 — Upload du PDF

## Objectif

Téléverser le fichier principal.

## Interface

```txt
Zone drag-and-drop
Bouton : Choisir un fichier
Message : Format accepté : PDF
Taille maximale : à définir selon configuration
```

## Après upload

Le système affiche :

```txt
Nom du fichier
Taille
Nombre de pages si détectable
Date d’upload
Hash SHA-256
Statut : Fichier reçu
```

## Fonctions automatiques

```txt
contrôle du type MIME ;
vérification extension PDF ;
stockage du fichier ;
calcul du hash ;
création de la version V1 ;
extraction du texte ;
préparation de l’analyse IA.
```

---

## 3.4 Étape 4 — Analyse IA

## Objectif

Lancer l’analyse automatique du document.

Le thème du hackathon valorise justement l’analyse automatique des PDF pour extraire les métadonnées et proposer des thématiques associées. 

## Interface

```txt
Bouton : Lancer l’analyse IA
Progression :
- Extraction du texte
- Détection du titre
- Détection du résumé
- Extraction des mots-clés
- Classification thématique
- Génération de fiche synthétique
```

## Résultats IA

```txt
Titre détecté
Auteur détecté
Résumé détecté ou généré
Mots-clés suggérés
Domaine scientifique
Problématique
Méthodologie
Résultats principaux
Thématiques associées
Langue détectée
```

---

## 3.5 Étape 5 — Vérification des métadonnées

## Objectif

Permettre au déposant de corriger ce que l’IA a extrait.

## Interface

Chaque champ doit afficher :

```txt
Valeur proposée par l’IA
Champ modifiable par l’utilisateur
Indicateur de confiance si disponible
```

## Exemple

```txt
Titre proposé :
“Système de vérification des diplômes par identité décentralisée”

Champ modifiable :
[ Système de vérification des diplômes par SSI ]
```

## Actions

```txt
Accepter toutes les propositions
Modifier manuellement
Ajouter un mot-clé
Supprimer un mot-clé
Relancer l’analyse IA
Enregistrer comme brouillon
Continuer vers soumission
```

---

## 3.6 Étape 6 — Soumission officielle

## Objectif

Finaliser le dépôt et envoyer le dossier au circuit de validation académique.

## Récapitulatif affiché

```txt
Type de document
Titre
Auteur
Institution
Département
Année
Encadreur / directeur / revue
PDF déposé
Hash
Métadonnées principales
Visibilité demandée
```

## Cases à cocher

```txt
Je confirme que les informations fournies sont exactes.
Je confirme que le document soumis correspond à la version à évaluer.
J’accepte que le dossier soit transmis pour validation académique.
```

## Actions

```txt
Soumettre officiellement
Enregistrer comme brouillon
Retour aux étapes précédentes
```

## Après soumission

Le statut devient :

```txt
Soumis
```

Puis le système crée un événement :

```txt
Dossier soumis par [utilisateur] le [date].
```

---

# 4. Page : Détail d’un dossier

## Objectif général

C’est la page centrale côté déposant.

Elle permet de suivre tout le cycle de vie d’un dossier.

---

## Structure de la page

```txt
1. En-tête du dossier
2. Statut et timeline
3. Métadonnées académiques
4. Document principal
5. Versions
6. Avis et décisions
7. Corrections
8. Preuve si disponible
9. Historique
```

---

## 4.1 En-tête du dossier

### Contenu

```txt
Titre
Type de document
Statut actuel
Institution
Département
Année académique
Bouton action principal
```

### Action principale selon statut

```txt
Brouillon → Continuer le dépôt
Correction demandée → Répondre aux corrections
Archivé → Voir fiche publique
Validé → Voir preuve si générée
```

---

## 4.2 Timeline du workflow

### Exemple générique

```txt
Brouillon → Soumis → En instruction → Correction demandée → Re-soumis → Validé → Archivé
```

### Objectif

Montrer clairement où se trouve le dossier.

Chaque étape doit avoir :

```txt
nom de l’étape ;
date si disponible ;
acteur responsable ;
statut : terminé / en cours / à venir.
```

---

## 4.3 Métadonnées académiques

### Champs affichés

```txt
Titre
Résumé
Mots-clés
Auteur
Co-auteurs
Institution
Faculté
Département
Filière
Encadreur / directeur / revue
Année académique
Langue
Domaine scientifique
Visibilité
```

### Fonctionnalités

```txt
voir les métadonnées ;
modifier seulement si brouillon ou correction demandée ;
voir les champs extraits par IA ;
voir les champs validés par l’institution.
```

---

## 4.4 Document principal

### Contenu

```txt
Nom du PDF
Taille
Nombre de pages
Hash SHA-256
Version actuelle
Date de dépôt
Bouton visualiser
Bouton télécharger
```

### Fonctionnalités

```txt
ouvrir le PDF ;
télécharger ;
voir le hash ;
voir la version active ;
déposer une nouvelle version si autorisé.
```

---

## 4.5 Avis et décisions

### Contenu

```txt
Avis reçus
Auteur de l’avis
Rôle
Date
Commentaire
Recommandation
Décision associée
```

### Recommandations possibles

```txt
Favorable
Favorable avec corrections
Défavorable
À réviser
```

---

## 4.6 Historique

### Événements à tracer

```txt
Création du dossier
Upload du PDF
Extraction IA effectuée
Soumission officielle
Assignation à validateur
Avis ajouté
Correction demandée
Nouvelle version déposée
Décision finale
Archivage
Preuve générée
```

---

# 5. Page : Métadonnées IA

## Objectif général

Permettre au déposant de visualiser, corriger et confirmer les métadonnées produites par l’IA.

Cette page peut être accessible pendant le nouveau dépôt, mais aussi depuis le détail du dossier.

---

## Sections

```txt
1. Résumé IA
2. Informations bibliographiques
3. Classification scientifique
4. Analyse du contenu
5. Suggestions
6. Actions
```

---

## 5.1 Résumé IA

### Contenu

```txt
Résumé court généré
Résumé long si disponible
Problématique détectée
Objectif principal
Méthodologie
Résultats principaux
Limites détectées
```

---

## 5.2 Informations bibliographiques

```txt
Titre
Auteur principal
Co-auteurs
Encadreur
Institution
Année
Langue
```

---

## 5.3 Classification scientifique

```txt
Domaine
Sous-domaine
Mots-clés
Thématiques associées
Travaux similaires potentiels
```

---

## 5.4 Actions

```txt
Accepter les métadonnées
Modifier
Relancer l’analyse
Comparer avec la saisie manuelle
Sauvegarder
Continuer vers soumission
```

---

# 6. Page : Versions du document

## Objectif général

Suivre les différentes versions d’un même travail scientifique.

---

## Tableau des versions

### Colonnes

```txt
Version
Nom du fichier
Date
Déposé par
Hash SHA-256
Statut
Note de modification
Actions
```

### Statuts de version

```txt
Active
Remplacée
Finale
Archivée
Rejetée
```

---

## Fonctions

```txt
voir une version ;
télécharger une version ;
déposer une nouvelle version ;
ajouter une note de modification ;
identifier la version finale ;
comparer les hashes ;
verrouiller après archivage.
```

---

# 7. Page : Corrections demandées

## Objectif général

Permettre au déposant de traiter les retours du validateur.

---

## Interface

La page doit afficher les corrections sous forme de cartes.

### Champs d’une correction

```txt
Titre de la correction
Type de correction
Description
Demandée par
Date
Priorité
Statut
Pièce ou section concernée
```

### Types

```txt
Correction administrative
Correction scientifique
Correction de métadonnées
Correction de fichier
Correction de visibilité
Correction de résumé
Correction de mots-clés
```

### Priorités

```txt
Faible
Normale
Élevée
Bloquante
```

---

## Actions du déposant

```txt
répondre à la correction ;
ajouter un commentaire ;
modifier les métadonnées ;
déposer une nouvelle version ;
marquer comme traitée ;
renvoyer le dossier.
```

---

# 8. Page : Preuve et vérification

## Objectif général

Afficher les éléments de preuve disponibles une fois le dossier validé et archivé.

---

## Condition d’accès

La page est pleinement disponible seulement si :

```txt
statut dossier = Archivé
preuve générée = Oui
```

Avant archivage, elle peut afficher :

```txt
Preuve non disponible.
La preuve sera générée après validation et archivage institutionnel.
```

---

## Contenu affiché

```txt
Identifiant du dossier
Identifiant de preuve
Hash SHA-256 du PDF final
Statut de vérification
Date d’émission
Institution émettrice
Référence e-IDStack de IDS
QR code
Lien public de vérification
```

---

## Actions

```txt
copier le lien de vérification ;
télécharger le QR code ;
ouvrir la page publique de vérification ;
télécharger le PDF final ;
voir les détails de la preuve ;
partager la fiche publique.
```

---

# 9. Page : Notifications

## Objectif général

Centraliser les messages importants du système.

---

## Types de notifications

```txt
Dossier soumis
Dossier reçu en instruction
Correction demandée
Avis ajouté
Décision enregistrée
Dossier validé
Dossier archivé
Preuve générée
Document rejeté
```

---

## Fonctionnalités

```txt
voir toutes les notifications ;
filtrer lues / non lues ;
ouvrir le dossier concerné ;
marquer comme lu ;
supprimer une notification locale.
```

---

# 10. Page : Profil déposant

## Objectif général

Permettre au déposant de gérer ses informations personnelles et académiques.

---

## Champs

```txt
Nom complet
Email
Téléphone optionnel
Institution
Faculté
Département
Filière
Niveau académique
Identifiant étudiant / chercheur
ORCID optionnel
Photo optionnelle
Langue préférée
```

---

## Fonctionnalités

```txt
modifier le profil ;
changer le mot de passe ;
configurer les notifications ;
voir l’historique de connexion ;
lier un identifiant académique externe si disponible.
```

---

# Résumé du Portail Déposant

Le Portail Déposant doit être pensé comme un espace simple, guidé et rassurant.

Son objectif n’est pas seulement de permettre un upload de PDF.
Son objectif est de créer un **dossier scientifique complet**, structuré, analysé par IA, prêt pour validation académique, puis vérifiable après archivage.

Structure finale :

```txt
Portail Déposant
│
├── Tableau de bord
├── Mes dossiers scientifiques
├── Nouveau dépôt
│   ├── Type de travail
│   ├── Informations académiques
│   ├── Upload PDF
│   ├── Analyse IA
│   ├── Vérification métadonnées
│   └── Soumission
├── Détail dossier
├── Métadonnées IA
├── Versions document
├── Corrections demandées
├── Preuve et vérification
├── Notifications
└── Profil déposant
```

Prochaine étape : **Portail Validation académique**, qui est le plus sensible parce qu’il porte les workflows mémoire, thèse et article.

Continue 

On continue avec le **Portail Validation académique**, qui est le cœur institutionnel du système.

# Portail 2 — Portail Validation académique

## Description générale

Le **Portail Validation académique** est l’espace réservé aux acteurs chargés d’examiner, contrôler, commenter, valider ou rejeter les dossiers scientifiques déposés.

Il concerne :

```txt
Encadreur
Directeur de thèse
Rapporteur
Reviewer
Chef de département
Responsable de filière
Comité scientifique
École doctorale
Bibliothécaire / Archiviste
Administration académique
```

Son rôle est de transformer un dossier soumis en dossier officiellement :

```txt
instruit ;
corrigé si nécessaire ;
validé ;
archivé ;
vérifiable.
```

Ce portail doit être robuste parce qu’il porte la partie la plus sensible : la validation académique. Il ne doit pas faire semblant de remplacer l’université. Il doit plutôt **outiller les étapes existantes** : avis, correction, décision, archivage et preuve.

---

# Structure générale du Portail Validation académique

Le portail contient les pages suivantes :

```txt
1. Tableau de bord validation
2. Dossiers à traiter
3. Détail du dossier à valider
4. Validation des métadonnées
5. Avis académiques
6. Gestion des corrections
7. Décision finale
8. Archivage institutionnel
9. Module articles / peer review
10. Historique et audit
11. Notifications validation
12. Profil validateur
```

---

# 1. Page : Tableau de bord validation

## Objectif général

Cette page donne au validateur ou responsable institutionnel une vue rapide sur l’état des dossiers à traiter.

C’est la première page après connexion pour les acteurs académiques.

## Interface générale

La page doit être divisée en cinq zones :

```txt
1. En-tête institutionnel
2. Cartes statistiques
3. File prioritaire des dossiers
4. Graphique ou résumé par type de document
5. Notifications et actions urgentes
```

---

## 1.1 En-tête institutionnel

### Contenu

```txt
Bienvenue, [Nom du validateur]
Rôle : [Encadreur / Reviewer / Archiviste / Admin académique]
Institution : [Université]
Département : [Département]
Bouton : Voir dossiers à traiter
Bouton secondaire : Historique des décisions
```

### Rôle

L’en-tête doit rappeler à l’utilisateur dans quel périmètre il agit.

Exemple :

```txt
Université de Yaoundé I
Faculté des Sciences
Département Informatique
```

C’est important parce qu’un validateur ne doit pas forcément voir tous les dossiers de toute l’institution.

---

## 1.2 Cartes statistiques

### Cartes à afficher

```txt
Dossiers reçus
En instruction
Corrections demandées
En attente de décision
Validés
Rejetés
Archivés
Articles en review
```

### Exemple visuel

```txt
┌────────────────────────┐
│ En attente de décision │
│ 12                     │
└────────────────────────┘

┌────────────────────────┐
│ Corrections demandées  │
│ 05                     │
└────────────────────────┘
```

### Logique

Ces cartes ne sont pas seulement informatives. Elles doivent être cliquables.

Exemple :

```txt
Cliquer sur “Corrections demandées” filtre automatiquement les dossiers concernés.
```

---

## 1.3 File prioritaire des dossiers

### Objectif

Afficher les dossiers qui nécessitent une action rapide.

### Critères de priorité

```txt
Dossier soumis depuis longtemps
Correction non traitée
Décision finale attendue
Article en review bloqué
Dossier validé mais non archivé
Dossier avec conflit de métadonnées
```

### Colonnes

```txt
Titre
Type
Auteur
Statut
Date de soumission
Action attendue
Priorité
```

### Actions rapides

```txt
Ouvrir
Donner un avis
Demander correction
Prendre décision
Archiver
```

---

## 1.4 Résumé par type de document

### Objectif

Permettre de distinguer rapidement les flux :

```txt
Mémoires
Thèses
Articles
```

### Indicateurs

```txt
Nombre soumis
Nombre en instruction
Nombre validé
Nombre archivé
Nombre rejeté
```

### Utilité

Les mémoires, thèses et articles n’ont pas le même workflow. Cette séparation évite de traiter tous les documents comme de simples PDF.

---

## 1.5 Notifications et actions urgentes

### Types de notifications

```txt
Nouveau dossier assigné
Nouvelle version déposée
Correction traitée par le déposant
Avis d’un rapporteur reçu
Décision finale requise
Archivage en attente
Erreur de génération de preuve
```

### Actions

```txt
ouvrir la notification ;
accéder au dossier concerné ;
marquer comme lue ;
filtrer les notifications urgentes.
```

---

# 2. Page : Dossiers à traiter

## Objectif général

Cette page liste les dossiers soumis à l’acteur connecté ou à son unité académique.

C’est l’équivalent d’une inbox académique.

---

## Interface générale

La page contient :

```txt
1. Barre de recherche
2. Filtres avancés
3. Tableau des dossiers
4. Actions de traitement
5. Pagination
```

---

## 2.1 Barre de recherche

### Recherche sur

```txt
Titre
Auteur
Mots-clés
Encadreur
Département
Identifiant du dossier
Type de document
```

### Placeholder recommandé

```txt
Rechercher un dossier à valider...
```

---

## 2.2 Filtres

### Filtres principaux

```txt
Type de document
Statut
Département
Filière
Année académique
Validateur assigné
Date de soumission
Priorité
```

### Valeurs du filtre “Type”

```txt
Mémoire
Thèse
Article
```

### Valeurs du filtre “Statut”

```txt
Soumis
En instruction
Correction demandée
Re-soumis
Avis en attente
Décision requise
Validé
Rejeté
Archivable
Archivé
```

---

## 2.3 Tableau des dossiers

### Colonnes recommandées

```txt
Titre
Auteur
Type
Département
Statut
Assigné à
Date de soumission
Dernière activité
Actions
```

### Actions possibles

```txt
Ouvrir
Assigner
Donner avis
Demander correction
Enregistrer décision
Envoyer à l’archive
```

---

## 2.4 Règles métier

Un dossier **soumis** peut être ouvert en instruction.

```txt
Soumis → En instruction
```

Un dossier avec **correction demandée** reste bloqué jusqu’à réponse du déposant.

```txt
Correction demandée → Re-soumis
```

Un dossier **validé** peut être envoyé à l’archivage.

```txt
Validé → Archivable → Archivé
```

Un dossier **archivé** est verrouillé.

```txt
Archivé = lecture seule
```

---

# 3. Page : Détail du dossier à valider

## Objectif général

C’est la page centrale du portail Validation académique.

Elle permet à un validateur de lire le document, contrôler les métadonnées, consulter les versions, donner un avis, demander une correction ou enregistrer une décision.

---

## Structure de la page

```txt
1. En-tête du dossier
2. Panneau de statut
3. Visualiseur PDF
4. Métadonnées académiques
5. Versions du document
6. Analyse IA
7. Avis académiques
8. Corrections
9. Décisions
10. Actions principales
11. Historique
```

---

## 3.1 En-tête du dossier

### Contenu

```txt
Titre du travail
Type : mémoire / thèse / article
Auteur
Institution
Département
Année académique
Statut actuel
Identifiant du dossier
```

### Boutons principaux

Selon le rôle :

```txt
Donner un avis
Demander correction
Valider métadonnées
Enregistrer décision
Envoyer vers archivage
```

---

## 3.2 Panneau de statut

### Objectif

Afficher clairement où se trouve le dossier dans son workflow.

### Exemple mémoire

```txt
Soumis → En instruction → Correction demandée → Re-soumis → Validé → Archivé
```

### Exemple thèse

```txt
Soumis → Expertise → Autorisation soutenance → Soutenu → Dépôt final → Archivé
```

### Exemple article

```txt
Soumis → Screening → Peer review → Révision → Accepté → Archivé
```

Chaque étape doit afficher :

```txt
date ;
acteur ;
statut : terminé / en cours / bloqué / à venir.
```

---

## 3.3 Visualiseur PDF

### Fonctionnalités

```txt
Afficher le PDF
Naviguer par page
Zoomer
Télécharger si autorisé
Voir le numéro de page
Copier une référence de page
```

### Données associées

```txt
Nom du fichier
Version active
Hash SHA-256
Nombre de pages
Date de dépôt
```

### Règle

Le validateur doit toujours savoir quelle version il examine.

Exemple :

```txt
Version examinée : V2 — déposée le 12/06/2026
Hash : 8fa23...
```

---

## 3.4 Métadonnées académiques

### Champs affichés

```txt
Titre
Résumé
Auteur principal
Co-auteurs
Institution
Faculté
Département
Filière
Encadreur / directeur / revue
Année académique
Langue
Domaine scientifique
Mots-clés
Visibilité demandée
```

### Fonctionnalités

```txt
corriger une métadonnée ;
valider une métadonnée ;
marquer une métadonnée comme douteuse ;
ajouter un mot-clé ;
supprimer un mot-clé incorrect ;
comparer avec la proposition IA.
```

### États possibles d’un champ

```txt
Non vérifié
Proposé par IA
Corrigé par déposant
Validé par institution
Rejeté / incohérent
```

---

## 3.5 Versions du document

### Objectif

Comparer l’évolution du document.

### Colonnes

```txt
Version
Date
Déposé par
Hash
Statut
Note
Action
```

### Statuts de version

```txt
Active
Remplacée
En correction
Finale
Archivée
Rejetée
```

### Actions

```txt
ouvrir une version ;
télécharger ;
définir comme version à examiner ;
marquer comme version finale ;
comparer les hashes.
```

---

## 3.6 Analyse IA

### Objectif

Aider le validateur à comprendre rapidement le document.

L’assistant IA ne décide pas. Il assiste.

### Contenu affiché

```txt
Résumé court
Résumé détaillé
Mots-clés suggérés
Domaine détecté
Problématique détectée
Méthodologie détectée
Résultats détectés
Limites détectées
Travaux similaires
Points à vérifier
```

### Fonctions

```txt
relancer l’analyse IA ;
ouvrir les passages sources ;
générer une fiche de lecture ;
chercher des travaux similaires ;
demander une synthèse ;
signaler une réponse IA incorrecte.
```

### Règle importante

Il faut afficher une mention claire :

```txt
L’analyse IA est une aide à la lecture. La décision académique reste humaine.
```

---

# 4. Page : Validation des métadonnées

## Objectif général

Cette page permet de contrôler et confirmer les métadonnées avant archivage.

Elle peut être intégrée dans le détail du dossier, mais c’est mieux de la prévoir comme page dédiée dans la conception complète.

---

## Structure

```txt
1. Métadonnées proposées par IA
2. Métadonnées saisies par le déposant
3. Métadonnées validées par l’institution
4. Champs conflictuels
5. Actions de validation
```

---

## 4.1 Comparaison des métadonnées

### Exemple d’interface

```txt
Champ : Titre

IA :
Système de vérification des diplômes par identité décentralisée

Déposant :
Système de vérification des diplômes par SSI

Institution :
[champ modifiable]
```

### Fonctionnalités

```txt
accepter la valeur IA ;
accepter la valeur déposant ;
saisir une valeur institutionnelle ;
marquer comme vérifié ;
marquer comme à corriger.
```

---

## 4.2 Champs à valider obligatoirement

```txt
Titre
Auteur
Type de document
Institution
Département
Année académique
Résumé
Mots-clés
Domaine scientifique
Visibilité
Version finale
```

---

## 4.3 Statuts de validation des métadonnées

```txt
Non vérifiées
Partiellement vérifiées
Corrections nécessaires
Validées
Verrouillées pour archivage
```

---

## 4.4 Actions

```txt
Valider les métadonnées
Demander correction au déposant
Ajouter une note interne
Verrouiller les métadonnées
Revenir au dossier
```

---

# 5. Page : Avis académiques

## Objectif général

Centraliser les avis des acteurs académiques.

Un avis n’est pas forcément une décision finale. C’est une contribution au processus.

---

## Structure de la page

```txt
1. Liste des avis
2. Formulaire d’ajout d’avis
3. Synthèse des recommandations
4. Historique des avis
```

---

## 5.1 Liste des avis

### Champs d’un avis

```txt
Auteur de l’avis
Rôle
Date
Version examinée
Commentaire
Recommandation
Niveau de conformité
Pièce jointe éventuelle
```

### Rôles possibles

```txt
Encadreur
Directeur de thèse
Rapporteur
Reviewer
Chef de département
Comité scientifique
Archiviste
```

---

## 5.2 Formulaire d’avis

### Champs

```txt
Version examinée : select
Recommandation : enum
Commentaire général : text
Points forts : text optionnel
Points faibles : text optionnel
Corrections recommandées : text optionnel
Pièce jointe : file optionnel
```

### Recommandations possibles

```txt
Favorable
Favorable avec corrections mineures
Favorable avec corrections majeures
Défavorable
À réviser
À transmettre
```

---

## 5.3 Synthèse des recommandations

### Objectif

Afficher une vue consolidée.

Exemple :

```txt
3 avis reçus
2 favorables
1 favorable avec corrections
0 défavorable
```

### Fonction

Aider le responsable à prendre la décision finale.

---

# 6. Page : Gestion des corrections

## Objectif général

Permettre aux validateurs de créer, suivre et clôturer les demandes de correction.

---

## Structure

```txt
1. Liste des corrections
2. Création d’une correction
3. Réponses du déposant
4. Validation des corrections traitées
```

---

## 6.1 Correction

### Champs

```txt
Titre
Type de correction
Description
Priorité
Section concernée
Page concernée optionnelle
Demandée par
Assignée au déposant
Date limite optionnelle
Statut
```

### Types de correction

```txt
Administrative
Scientifique
Métadonnées
Fichier PDF
Résumé
Mots-clés
Bibliographie
Visibilité
Version finale
Conformité institutionnelle
```

### Priorités

```txt
Faible
Normale
Élevée
Bloquante
```

### Statuts

```txt
Ouverte
En traitement
Traitée par déposant
Validée
Rejetée
Annulée
```

---

## 6.2 Création d’une correction

### Fonctionnalités

```txt
sélectionner le type ;
rédiger la demande ;
joindre une remarque ;
associer à une page du PDF ;
définir priorité ;
envoyer au déposant ;
notifier le déposant.
```

---

## 6.3 Réponse du déposant

Le validateur voit :

```txt
commentaire du déposant ;
nouvelle version déposée ;
date de réponse ;
fichiers associés ;
métadonnées modifiées.
```

Actions du validateur :

```txt
accepter la correction ;
rejeter la réponse ;
redemander une correction ;
renvoyer en instruction.
```

---

# 7. Page : Décision finale

## Objectif général

Enregistrer officiellement la décision académique.

Cette page doit être stricte, parce qu’elle modifie le cycle de vie du dossier.

---

## Structure

```txt
1. Résumé du dossier
2. Conditions avant décision
3. Formulaire de décision
4. Pièces justificatives
5. Confirmation finale
```

---

## 7.1 Conditions avant décision

Avant décision finale, le système doit vérifier :

```txt
métadonnées validées ;
version active définie ;
avis requis disponibles ;
corrections bloquantes traitées ;
PDF accessible ;
hash calculé.
```

Si une condition manque, le bouton décision finale doit être désactivé.

---

## 7.2 Décisions pour mémoire

```txt
Validé après soutenance
Correction demandée
Rejeté
Archivable
```

---

## 7.3 Décisions pour thèse

```txt
Expertise favorable
Expertise défavorable
Autorisation de soutenance
Correction post-soutenance demandée
Dépôt final accepté
Rejeté
Archivable
```

---

## 7.4 Décisions pour article

```txt
Accepté
Révision mineure demandée
Révision majeure demandée
Rejeté
Publié
Archivable
```

---

## 7.5 Formulaire de décision

### Champs

```txt
Décision : enum
Commentaire officiel : text
Date de décision : date
Décideur : utilisateur connecté
Pièce justificative : file optionnel
Référence PV : string optionnel
Visibilité finale : public / restreint / privé institutionnel
```

---

## 7.6 Confirmation finale

Avant validation, afficher :

```txt
Cette décision sera enregistrée dans l’historique du dossier.
Elle pourra déclencher l’archivage ou une demande de correction.
Confirmez-vous cette décision ?
```

Actions :

```txt
Confirmer
Annuler
Enregistrer brouillon de décision
```

---

# 8. Page : Archivage institutionnel

## Objectif général

Transformer un dossier validé en document archivé et vérifiable.

C’est ici que la plateforme passe du workflow interne à l’archive publique.

---

## Conditions d’archivage

```txt
Dossier validé
Métadonnées verrouillées
Version finale sélectionnée
Hash final calculé
Visibilité définie
Aucune correction bloquante ouverte
```

---

## Interface

La page affiche :

```txt
Résumé du dossier
Version finale
Hash SHA-256
Métadonnées finales
Visibilité publique
Options de vérification
Bouton : Archiver officiellement
```

---

## Actions d’archivage

```txt
verrouiller la version finale ;
créer l’entrée d’archive ;
générer l’identifiant public ;
générer la preuve de vérification ;
générer le QR code ;
publier la fiche publique ;
notifier le déposant.
```

---

## Résultat attendu

Après archivage :

```txt
Statut dossier = Archivé
Version finale = Verrouillée
Fiche publique = Disponible
Preuve = Générée
QR code = Disponible
```

---

# 9. Page : Module articles / peer review

## Objectif général

Ce module gère le flux spécifique des articles scientifiques.

Il ne doit pas devenir un portail séparé dans la première version. Il est intégré au portail Validation académique.

---

## Workflow article

```txt
Soumis
→ Screening éditorial
→ Affectation reviewers
→ Peer review
→ Révision demandée
→ Re-soumis
→ Accepté / Rejeté
→ Archivé / Publié
```

---

## Fonctionnalités

```txt
assigner des reviewers ;
envoyer un article en review ;
collecter les avis ;
demander une révision ;
recevoir une nouvelle version ;
prendre une décision éditoriale ;
archiver l’article accepté.
```

---

## Formulaire de review

### Champs

```txt
Originalité
Clarté
Méthodologie
Pertinence scientifique
Qualité des références
Commentaires à l’auteur
Commentaires internes
Recommandation
```

### Recommandations

```txt
Accepter
Révision mineure
Révision majeure
Rejeter
```

---

# 10. Page : Historique et audit

## Objectif général

Afficher toutes les actions effectuées sur un dossier.

Cette page est essentielle pour la traçabilité.

---

## Événements tracés

```txt
Dossier créé
PDF déposé
Analyse IA lancée
Métadonnées modifiées
Dossier soumis
Validateur assigné
Avis ajouté
Correction demandée
Correction traitée
Décision enregistrée
Archivage effectué
Preuve générée
QR code généré
```

---

## Champs d’un événement

```txt
Date
Utilisateur
Rôle
Action
Ancien statut
Nouveau statut
Adresse IP optionnelle
Commentaire
```

---

## Fonctions

```txt
filtrer par type d’action ;
filtrer par utilisateur ;
exporter l’historique ;
consulter les détails d’un événement.
```

---

# 11. Page : Notifications validation

## Objectif général

Centraliser les alertes du validateur.

---

## Notifications possibles

```txt
Nouveau dossier soumis
Dossier assigné
Nouvelle version reçue
Correction traitée
Avis reçu
Décision attendue
Archivage en attente
Erreur preuve / QR code
```

---

## Actions

```txt
ouvrir le dossier ;
marquer comme lue ;
filtrer par urgence ;
voir les notifications non lues.
```

---

# 12. Page : Profil validateur

## Objectif général

Gérer les informations de l’acteur académique.

---

## Champs

```txt
Nom complet
Email
Rôle institutionnel
Institution
Faculté
Département
Grade académique optionnel
Domaine d’expertise
Téléphone optionnel
Signature institutionnelle optionnelle
Préférences de notification
```

---

## Fonctionnalités

```txt
modifier certaines informations ;
voir les rôles attribués ;
consulter le périmètre d’accès ;
configurer les notifications ;
changer le mot de passe.
```

---

# Résumé du Portail Validation académique

Le Portail Validation académique est le moteur institutionnel d’OpenScience Hub.

Il permet de passer de :

```txt
PDF soumis
```

à :

```txt
dossier validé, archivé, consultable et vérifiable.
```

Structure finale :

```txt
Portail Validation académique
│
├── Tableau de bord validation
├── Dossiers à traiter
├── Détail du dossier à valider
├── Validation des métadonnées
├── Avis académiques
├── Gestion des corrections
├── Décision finale
├── Archivage institutionnel
├── Module articles / peer review
├── Historique et audit
├── Notifications validation
└── Profil validateur
```

Le point important : ce portail ne doit pas simplement “accepter ou rejeter”. Il doit représenter le vrai processus académique :

```txt
instruction → avis → correction → décision → archivage → preuve
```

On continue ensuite avec le **Portail Archive publique**, qui est le portail le plus visible pour le jury et les utilisateurs externes.

Continue 

On continue avec le **Portail Archive publique**, qui est le portail le plus visible du système. C’est lui que le jury comprendra le plus vite, parce qu’il montre directement la valeur : rechercher, consulter, explorer et vérifier les travaux scientifiques.

# Portail 3 — Portail Archive publique

## Description générale

Le **Portail Archive publique** est l’espace ouvert aux utilisateurs externes et internes qui veulent consulter les travaux scientifiques validés ou archivés.

Il concerne :

```txt
Étudiants
Chercheurs
Enseignants
Administrations universitaires
Recruteurs
Entreprises
Partenaires institutionnels
Grand public
```

Son rôle est de permettre à un utilisateur de :

```txt
rechercher un mémoire, une thèse ou un article ;
filtrer les résultats par facettes ;
consulter une fiche scientifique ;
accéder au PDF si autorisé ;
interroger l’archive avec l’Assistant IA ;
voir les travaux similaires ;
vérifier l’authenticité d’un document par QR code ou lien public.
```

Ce portail est directement aligné avec le thème du hackathon, qui demande une plateforme d’archivage, de classification et de consultation des travaux scientifiques universitaires avec moteur de recherche indexé à facettes. 

---

# Structure générale du Portail Archive publique

Le portail contient les pages suivantes :

```txt
1. Accueil public
2. Catalogue des travaux scientifiques
3. Recherche avancée à facettes
4. Fiche publique d’un document
5. Assistant IA
6. Travaux similaires
7. Page de vérification QR code
8. Tendances scientifiques
9. Institutions participantes
10. Page d’aide / FAQ
```

---

# 1. Page : Accueil public

## Objectif général

La page d’accueil publique doit présenter rapidement la plateforme et orienter l’utilisateur vers les trois actions principales :

```txt
Explorer l’archive
Interroger l’Assistant IA
Vérifier un document
```

C’est une page d’entrée simple, claire et premium.

---

## Interface générale

La page doit contenir :

```txt
1. Hero section
2. Barre de recherche principale
3. Actions rapides
4. Statistiques globales
5. Travaux récents
6. Domaines populaires
7. Institutions participantes
8. Bloc de vérification
```

---

## 1.1 Hero section

### Objectif

Présenter immédiatement le produit.

### Contenu recommandé

```txt
OpenScience Hub

Le hub intelligent des travaux scientifiques universitaires.

Archivez, explorez et vérifiez les mémoires, thèses et articles grâce à l’IA, la recherche avancée et une couche SSI basée sur e-IDStack de IDS.
```

### Boutons principaux

```txt
Explorer l’archive
Vérifier un document
Utiliser l’Assistant IA
```

### Style visuel

Le rendu doit être institutionnel et premium :

```txt
fond blanc ou gris très clair ;
texte noir profond ;
accent rouge académique ;
cartes propres ;
icônes scientifiques sobres ;
effets très légers, pas de surcharge.
```

Palette officielle :

```txt
Primary Black : #050505
Academic Red : #C40012
Deep Red : #8B000B
Tech Gray : #9CA3AF
Light Silver : #E5E7EB
Pure White : #FFFFFF
```

---

## 1.2 Barre de recherche principale

### Objectif

Permettre une recherche directe depuis l’accueil.

### Placeholder recommandé

```txt
Rechercher un mémoire, une thèse, un article, un auteur ou un mot-clé...
```

### Champs recherchés

```txt
titre
auteur
résumé
mots-clés
institution
département
encadreur
domaine scientifique
```

### Actions

```txt
lancer la recherche ;
ouvrir la recherche avancée ;
passer vers l’Assistant IA si la requête est formulée comme une question.
```

### Exemple

Si l’utilisateur tape :

```txt
identité numérique universitaire
```

Le système affiche des résultats classiques.

Si l’utilisateur tape :

```txt
Quels travaux parlent de l’identité numérique universitaire ?
```

Le système peut proposer :

```txt
Voulez-vous interroger l’Assistant IA ?
```

---

## 1.3 Actions rapides

### Cartes d’action

```txt
Explorer les travaux
Vérifier un document
Consulter les thèses
Consulter les mémoires
Consulter les articles
Interroger l’Assistant IA
```

### Rôle

Ces cartes permettent à un utilisateur non expert de comprendre rapidement ce qu’il peut faire sur la plateforme.

---

## 1.4 Statistiques globales

### Indicateurs affichés

```txt
Nombre de travaux archivés
Nombre de mémoires
Nombre de thèses
Nombre d’articles
Nombre d’institutions
Nombre de documents vérifiables
Nombre de vérifications effectuées
```

### Exemple

```txt
2 450 travaux archivés
1 700 mémoires
420 thèses
330 articles
12 institutions
```

### Rôle produit

Ces statistiques renforcent la crédibilité de la plateforme.

---

## 1.5 Travaux récents

### Contenu d’une carte

```txt
Titre
Auteur
Type
Institution
Département
Année
Mots-clés
Statut : archivé / publié / vérifiable
Bouton : Consulter
```

### Règle

Afficher seulement les documents dont la visibilité permet la consultation publique ou institutionnelle.

---

## 1.6 Domaines populaires

### Exemples de domaines

```txt
Informatique
Santé
Droit
Économie
Sciences de l’éducation
Génie civil
Agronomie
Intelligence artificielle
Cybersécurité
Identité numérique
```

### Fonctionnalité

Cliquer sur un domaine ouvre le catalogue filtré sur ce domaine.

---

## 1.7 Bloc de vérification rapide

### Objectif

Permettre à quelqu’un de vérifier un document sans chercher dans tout le catalogue.

### Interface

```txt
Champ : Entrer un identifiant de preuve
Bouton : Vérifier
Lien : Scanner un QR code
```

### Exemple d’identifiant

```txt
OSH-VERIFY-2026-000145
```

---

# 2. Page : Catalogue des travaux scientifiques

## Objectif général

La page catalogue affiche les travaux scientifiques accessibles dans l’archive.

Elle doit être conçue comme une page de bibliothèque numérique moderne.

---

## Interface générale

La page contient :

```txt
1. En-tête du catalogue
2. Barre de recherche
3. Panneau de filtres
4. Liste ou grille des résultats
5. Tri des résultats
6. Pagination
```

---

## 2.1 En-tête du catalogue

### Contenu

```txt
Catalogue scientifique

Explorez les mémoires, thèses et articles archivés par les institutions participantes.
```

### Statistiques contextuelles

```txt
Nombre total de résultats
Nombre de filtres actifs
Date de dernière mise à jour
```

---

## 2.2 Barre de recherche

### Recherche sur

```txt
Titre
Auteur
Résumé
Mots-clés
Domaine
Institution
Département
Encadreur
```

### Fonctionnalités

```txt
autocomplétion ;
suggestions de mots-clés ;
correction légère des fautes ;
historique de recherche local ;
passage vers recherche avancée.
```

---

## 2.3 Liste des résultats

### Format recommandé

Chaque résultat doit être affiché sous forme de carte claire.

### Carte d’un document

```txt
Titre
Type : mémoire / thèse / article
Auteur
Institution
Faculté
Département
Année
Résumé court
Mots-clés
Statut
Badge vérifiable
Actions
```

### Exemple

```txt
Système de vérification des diplômes par SSI

Mémoire — Informatique
Université de Yaoundé I, Faculté des Sciences
Auteur : Bell Aqil
Année : 2026

Mots-clés : SSI, diplômes numériques, e-IDStack, vérification

[Consulter] [Vérifier] [Travaux similaires]
```

---

## 2.4 Badges visuels

### Badges possibles

```txt
ARCHIVÉ
VALIDÉ
PUBLIÉ
VÉRIFIABLE
ACCÈS RESTREINT
PDF DISPONIBLE
```

### Couleurs

```txt
ARCHIVÉ : noir ou gris foncé
VALIDÉ : vert
PUBLIÉ : rouge académique
VÉRIFIABLE : vert
ACCÈS RESTREINT : orange
PDF DISPONIBLE : gris / noir
```

---

## 2.5 Actions sur un résultat

```txt
Consulter la fiche
Télécharger le PDF si autorisé
Vérifier l’authenticité
Voir les travaux similaires
Demander une synthèse IA
Copier la référence
```

---

# 3. Page : Recherche avancée à facettes

## Objectif général

La recherche avancée à facettes est l’une des pages les plus importantes du système, parce qu’elle répond directement à l’exigence du thème.

Elle permet de combiner des filtres structurés pour retrouver précisément des travaux scientifiques.

---

## Interface générale

La page doit être organisée en deux zones :

```txt
Panneau gauche : facettes / filtres
Zone principale : résultats
```

---

## 3.1 Facettes principales

### Type de document

```txt
Mémoire
Thèse
Article
```

### Institution

```txt
Université de Yaoundé I
Université de Douala
Université de Dschang
Université de Buea
Autres institutions
```

### Structure académique

```txt
Faculté
Département
Filière
Laboratoire
École doctorale
```

### Domaine scientifique

```txt
Informatique
Mathématiques
Physique
Biologie
Médecine
Droit
Économie
Sciences sociales
Sciences de l’éducation
```

### Année

```txt
Année exacte
Intervalle d’années
Année académique
```

### Auteur et encadreur

```txt
Auteur
Co-auteur
Encadreur
Directeur de thèse
Reviewer / revue pour article
```

### Métadonnées

```txt
Mots-clés
Langue
Statut
Visibilité
Accès PDF
Vérifiable
```

---

## 3.2 Combinaison des filtres

### Exemples de recherches

```txt
Type = Thèse
Institution = Université de Yaoundé I
Département = Informatique
Année = 2020-2026
Mot-clé = intelligence artificielle
```

```txt
Type = Mémoire
Domaine = Identité numérique
Statut = Archivé
Vérifiable = Oui
```

---

## 3.3 Résultats filtrés

Chaque résultat doit montrer pourquoi il correspond à la recherche.

### Exemple

```txt
Correspondance :
- Mot-clé trouvé : identité numérique
- Domaine : Informatique
- Année : 2026
- Statut : Archivé
```

---

## 3.4 Tri des résultats

Options de tri :

```txt
Pertinence
Date récente
Date ancienne
Titre A-Z
Auteur A-Z
Type de document
Institution
Nombre de consultations
```

---

## 3.5 Sauvegarde de recherche

Pour les utilisateurs connectés, il faut prévoir :

```txt
sauvegarder une recherche ;
recevoir une alerte quand un nouveau document correspond ;
exporter les résultats ;
copier le lien de recherche.
```

Pour le MVP, cette fonctionnalité peut être en roadmap, mais dans le système complet elle est cohérente.

---

# 4. Page : Fiche publique d’un document

## Objectif général

La fiche publique présente un travail scientifique archivé de manière claire, fiable et vérifiable.

C’est l’équivalent de la notice documentaire officielle du travail.

---

## Interface générale

La page contient :

```txt
1. En-tête du document
2. Résumé scientifique
3. Métadonnées académiques
4. Accès au document
5. Preuve de vérification
6. Assistant IA contextuel
7. Travaux similaires
8. Citation / export
```

---

## 4.1 En-tête du document

### Contenu

```txt
Titre
Type de document
Statut
Badge vérifiable
Auteur
Institution
Département
Année
```

### Exemple

```txt
Système de vérification des diplômes par identité décentralisée

Mémoire — Informatique
Université de Yaoundé I
Statut : Archivé et vérifiable
```

---

## 4.2 Résumé scientifique

### Contenu

```txt
Résumé officiel
Résumé court IA optionnel
Mots-clés
Domaine scientifique
Thématiques associées
```

### Règle

Le résumé officiel doit rester prioritaire. Le résumé IA doit être clairement identifié comme généré automatiquement.

Exemple :

```txt
Résumé généré par l’IA à partir du document archivé.
```

---

## 4.3 Métadonnées académiques

### Champs affichés

```txt
Auteur principal
Co-auteurs
Encadreur / directeur / revue
Institution
Faculté
Département
Filière
Niveau
Année académique
Date de soutenance ou publication
Langue
Nombre de pages
Version archivée
```

---

## 4.4 Accès au document

### Cas possibles

```txt
PDF public
PDF restreint
PDF indisponible
Notice uniquement
```

### Actions

```txt
Lire en ligne
Télécharger le PDF
Demander l’accès
Copier le lien
```

### Règle

La disponibilité du PDF dépend de la visibilité définie lors de l’archivage.

---

## 4.5 Bloc preuve de vérification

### Contenu

```txt
Identifiant de preuve
Hash du document
Date d’archivage
Institution validatrice
Statut de vérification
QR code
Référence e-IDStack de IDS
```

### Actions

```txt
Ouvrir la page de vérification
Copier l’identifiant
Télécharger le QR code
```

### Message utilisateur

```txt
Ce document dispose d’une preuve de vérification liée à sa version finale archivée.
```

---

## 4.6 Assistant IA contextuel

### Objectif

Permettre à l’utilisateur d’interagir avec ce document précis.

### Actions proposées

```txt
Résumer ce document
Extraire la problématique
Identifier la méthodologie
Lister les résultats principaux
Proposer une fiche de lecture
Trouver des travaux similaires
```

### Règle

L’Assistant IA doit citer les sections ou pages utilisées lorsque possible.

---

## 4.7 Travaux similaires

### Critères de similarité

```txt
mots-clés similaires ;
même domaine ;
même département ;
même encadreur ;
contenu sémantiquement proche ;
même période académique.
```

### Affichage

```txt
Titre
Auteur
Type
Année
Score de proximité
Motif de similarité
```

Exemple :

```txt
Similarité : 82 %
Motifs : SSI, diplômes numériques, vérification académique
```

---

## 4.8 Citation et export

### Formats de citation

```txt
APA
MLA
BibTeX
Référence simple
```

### Actions

```txt
copier la citation ;
exporter en BibTeX ;
copier le lien public ;
partager la fiche.
```

---

# 5. Page : Assistant IA

## Objectif général

La page Assistant IA permet d’interroger l’ensemble de l’archive scientifique en langage naturel.

C’est une interface de recherche intelligente, mais il faut éviter de la présenter comme une IA qui “invente”. Elle doit être présentée comme une IA qui **explore les documents archivés**.

---

## Interface générale

La page contient :

```txt
1. Zone de question
2. Suggestions de questions
3. Réponse générée
4. Sources utilisées
5. Filtres contextuels
6. Historique des échanges
```

---

## 5.1 Zone de question

### Placeholder recommandé

```txt
Posez une question sur les travaux scientifiques archivés...
```

### Exemples affichés

```txt
Quels travaux parlent de l’identité numérique universitaire ?
Résume les thèses récentes sur l’intelligence artificielle en santé.
Quels mémoires abordent la blockchain dans l’éducation ?
Quels documents sont proches de ce sujet ?
```

---

## 5.2 Filtres contextuels

L’utilisateur peut limiter la réponse à :

```txt
une institution ;
un département ;
un type de document ;
une période ;
un domaine scientifique ;
des documents vérifiables uniquement ;
des documents avec PDF public uniquement.
```

Exemple :

```txt
Répondre uniquement avec les thèses entre 2020 et 2026.
```

---

## 5.3 Réponse IA

### Structure recommandée

```txt
Réponse synthétique
Points clés
Documents cités
Limites de la réponse
```

### Exemple

```txt
Les travaux disponibles montrent trois axes principaux :
1. vérification des diplômes ;
2. identité numérique décentralisée ;
3. archivage académique vérifiable.

Sources utilisées :
- Mémoire A, Université X, 2026
- Article B, Revue Y, 2025
- Thèse C, Université Z, 2024
```

---

## 5.4 Sources utilisées

Chaque source doit afficher :

```txt
Titre
Auteur
Type
Institution
Année
Page ou section si disponible
Lien vers la fiche
```

### Règle importante

Une réponse sans source doit être considérée comme faible.

Message recommandé :

```txt
L’Assistant IA répond uniquement à partir des documents retrouvés dans l’archive. Les sources utilisées sont affichées pour vérification.
```

---

## 5.5 Actions sur la réponse

```txt
ouvrir une source ;
copier la réponse ;
générer une fiche de lecture ;
affiner la question ;
signaler une réponse incorrecte ;
exporter la réponse avec sources.
```

---

# 6. Page : Travaux similaires

## Objectif général

Cette page affiche les documents proches d’un travail ou d’une requête.

Elle peut être ouverte depuis :

```txt
une fiche document ;
l’Assistant IA ;
la recherche avancée ;
le dépôt d’un nouveau document.
```

---

## Interface

```txt
Document ou sujet de référence
Liste des travaux similaires
Filtres de similarité
Explication des similarités
```

---

## Critères de similarité

```txt
proximité des mots-clés ;
proximité du résumé ;
proximité du contenu ;
même domaine ;
même méthodologie ;
même institution ;
même encadreur ;
même période.
```

---

## Carte d’un travail similaire

```txt
Titre
Auteur
Type
Année
Institution
Score de similarité
Motifs de similarité
Bouton consulter
```

### Exemple

```txt
Score : 78 %
Motifs :
- même domaine : identité numérique ;
- mots-clés proches : SSI, credentials, vérification ;
- méthodologie similaire : architecture décentralisée.
```

---

# 7. Page : Vérification QR code

## Objectif général

Cette page permet de vérifier l’authenticité d’un document à partir d’un QR code, d’un lien public ou d’un identifiant de preuve.

C’est la page la plus liée à la couche SSI basée sur **e-IDStack de IDS**.

---

## Modes d’accès

```txt
Scan QR code depuis un document
Lien direct de vérification
Saisie manuelle d’un identifiant
```

---

## Interface générale

La page contient :

```txt
1. Champ d’identifiant de preuve
2. Résultat de vérification
3. Métadonnées du document
4. Détails de preuve
5. Actions de sécurité
```

---

## 7.1 Champ de vérification

### Placeholder

```txt
Entrer un identifiant de preuve ou un lien de vérification...
```

### Actions

```txt
Vérifier
Scanner un QR code
Coller depuis le presse-papiers
```

---

## 7.2 Résultats possibles

### Document authentique

```txt
Document authentique

La version vérifiée correspond à une version finale archivée par l’institution.
```

### Document introuvable

```txt
Document introuvable

Aucune preuve ne correspond à cet identifiant.
```

### Document invalide

```txt
Document invalide

La preuve existe, mais les informations ne correspondent pas à la version archivée.
```

### Preuve révoquée ou expirée

```txt
Preuve non valide

Cette preuve a été révoquée ou n’est plus active.
```

---

## 7.3 Métadonnées affichées

```txt
Titre
Auteur
Type de document
Institution
Département
Année
Date d’archivage
Statut
Identifiant de preuve
Hash SHA-256
Référence e-IDStack de IDS
```

---

## 7.4 Actions

```txt
ouvrir la fiche publique ;
copier le résultat de vérification ;
télécharger l’attestation de vérification ;
signaler une anomalie ;
re-vérifier.
```

---

## 7.5 Règle de sécurité

La page ne doit pas exposer d’informations confidentielles. Elle doit afficher uniquement les métadonnées publiques ou autorisées.

---

# 8. Page : Tendances scientifiques

## Objectif général

Afficher des tendances basées sur les travaux archivés.

Cette page donne une dimension décisionnelle à la plateforme.

---

## Indicateurs

```txt
Thématiques les plus fréquentes
Mots-clés émergents
Documents les plus consultés
Domaines les plus actifs
Institutions les plus représentées
Évolution par année
```

---

## Visualisations possibles

```txt
courbe par année ;
nuage de mots-clés ;
classement des domaines ;
répartition par type de document ;
répartition par institution.
```

---

## Filtres

```txt
institution ;
département ;
année ;
type de document ;
domaine scientifique.
```

---

## Utilité

Cette page est utile pour :

```txt
piloter la recherche institutionnelle ;
identifier les sujets émergents ;
valoriser les productions scientifiques ;
aider les étudiants à trouver des sujets ;
aider les responsables à suivre les tendances.
```

---

# 9. Page : Institutions participantes

## Objectif général

Lister les institutions qui utilisent ou alimentent la plateforme.

---

## Contenu

```txt
Nom de l’institution
Logo
Pays / ville
Nombre de travaux archivés
Nombre de documents vérifiables
Domaines principaux
Lien vers le catalogue de l’institution
```

---

## Fiche institution

Chaque institution peut avoir une fiche publique :

```txt
Présentation
Facultés
Départements
Travaux archivés
Statistiques
Documents récents
Statut de vérification
```

---

# 10. Page : Aide / FAQ publique

## Objectif général

Aider les utilisateurs à comprendre la plateforme.

---

## Questions fréquentes

```txt
Comment rechercher un mémoire ?
Comment vérifier un document ?
Que signifie document vérifiable ?
Pourquoi certains PDF ne sont-ils pas téléchargeables ?
Comment utiliser l’Assistant IA ?
Comment citer un document ?
Comment signaler une erreur ?
```

---

# Résumé du Portail Archive publique

Le Portail Archive publique est la vitrine d’OpenScience Hub.

Il doit donner trois expériences fortes :

```txt
1. Recherche structurée
2. Exploration intelligente
3. Vérification fiable
```

Structure finale :

```txt
Portail Archive publique
│
├── Accueil public
├── Catalogue des travaux scientifiques
├── Recherche avancée à facettes
├── Fiche publique document
├── Assistant IA
├── Travaux similaires
├── Vérification QR code
├── Tendances scientifiques
├── Institutions participantes
└── Aide / FAQ
```

Le point clé : ce portail doit être immédiatement compréhensible. Même quelqu’un qui ne connaît pas le SSI doit comprendre :

> Je peux chercher un travail scientifique, consulter sa fiche, poser des questions à l’IA et vérifier que le document est authentique.

On continue ensuite avec le **Portail Administration**, qui pilote les institutions, les rôles, les workflows, l’IA, la recherche, les preuves et l’audit.


Continue 

On continue avec le **Portail Administration**, qui pilote toute la plateforme : institutions, utilisateurs, rôles, workflows, IA, recherche, vérification, SSI/e-IDStack et audit.

# Portail 4 — Portail Administration

## Description générale

Le **Portail Administration** est l’espace réservé aux responsables techniques et institutionnels qui configurent, supervisent et sécurisent OpenScience Hub.

Il concerne :

```txt
Super administrateur
Administrateur institutionnel
Responsable SI
Responsable archive
Responsable académique
Responsable qualité / audit
```

Son rôle est de permettre à l’institution de :

```txt
gérer les utilisateurs ;
attribuer les rôles ;
configurer les institutions, facultés et départements ;
définir les workflows de validation ;
paramétrer l’IA ;
paramétrer la recherche ;
gérer la couche SSI basée sur e-IDStack de IDS ;
suivre les statistiques ;
auditer les actions sensibles.
```

Ce portail est moins visible pour le public, mais il est essentiel pour que la plateforme soit crédible comme solution institutionnelle complète.

---

# Structure générale du Portail Administration

```txt
1. Tableau de bord administration
2. Gestion des utilisateurs
3. Gestion des rôles et permissions
4. Gestion des institutions
5. Gestion des facultés, départements et filières
6. Configuration des workflows
7. Gestion des types de documents
8. Paramètres IA
9. Paramètres recherche et facettes
10. Paramètres SSI / e-IDStack
11. Gestion des preuves et vérifications
12. Statistiques et pilotage
13. Audit et journal système
14. Paramètres généraux
15. Profil administrateur
```

---

# 1. Page : Tableau de bord administration

## Objectif général

Le tableau de bord administration donne une vue globale sur l’état de la plateforme.

Il doit permettre de voir rapidement :

```txt
l’activité globale ;
les dossiers en cours ;
les documents archivés ;
les utilisateurs actifs ;
les vérifications effectuées ;
les éventuels incidents IA / SSI / preuve.
```

---

## Interface générale

La page doit être organisée en plusieurs blocs :

```txt
1. En-tête institutionnel
2. Cartes statistiques principales
3. Activité récente
4. État des services
5. Graphiques de pilotage
6. Alertes système
```

---

## 1.1 En-tête institutionnel

### Contenu

```txt
Administration OpenScience Hub
Institution : [Nom de l’institution]
Rôle : [Super admin / Admin institutionnel]
Date de dernière synchronisation
Bouton : Ajouter un utilisateur
Bouton secondaire : Configurer workflow
```

### Règle

Un **super administrateur** peut voir toute la plateforme.

Un **administrateur institutionnel** ne voit que son institution.

---

## 1.2 Cartes statistiques principales

### Cartes à afficher

```txt
Nombre total de dossiers
Documents archivés
Documents vérifiables
Utilisateurs actifs
Dossiers en attente
Corrections ouvertes
Vérifications QR effectuées
Requêtes Assistant IA
```

### Exemple

```txt
Documents archivés : 1 284
Documents vérifiables : 970
Dossiers en attente : 42
Vérifications QR : 5 230
```

---

## 1.3 État des services

### Services surveillés

```txt
API principale
Stockage PDF
Base de données
Moteur de recherche
Assistant IA
Service d’extraction PDF
Service QR code
Connexion e-IDStack
Service de vérification
```

### Statuts possibles

```txt
Opérationnel
Dégradé
Indisponible
En maintenance
Erreur de configuration
```

### Rôle

Cette zone donne un aspect très sérieux à la plateforme. On montre que ce n’est pas juste une interface, mais un vrai système supervisé.

---

## 1.4 Activité récente

### Événements affichés

```txt
Nouvel utilisateur créé
Nouveau dossier soumis
Métadonnées validées
Décision finale enregistrée
Document archivé
Preuve générée
QR code vérifié
Paramètre workflow modifié
```

### Colonnes

```txt
Date
Utilisateur
Action
Module concerné
Statut
```

---

# 2. Page : Gestion des utilisateurs

## Objectif général

Permettre aux administrateurs de créer, modifier, suspendre et organiser les comptes utilisateurs.

---

## Interface générale

```txt
1. Barre de recherche utilisateur
2. Filtres
3. Tableau des utilisateurs
4. Formulaire création / modification
5. Gestion du statut du compte
```

---

## 2.1 Recherche et filtres

### Recherche sur

```txt
Nom
Email
Matricule / identifiant académique
Institution
Département
Rôle
```

### Filtres

```txt
Rôle
Institution
Faculté
Département
Statut du compte
Date de création
Dernière connexion
```

---

## 2.2 Tableau des utilisateurs

### Colonnes

```txt
Nom complet
Email
Rôle principal
Institution
Département
Statut
Dernière connexion
Actions
```

### Actions

```txt
Voir profil
Modifier
Attribuer rôle
Désactiver
Réactiver
Réinitialiser mot de passe
Consulter activité
```

---

## 2.3 Création d’un utilisateur

### Champs

```txt
Nom complet : string
Email : string
Téléphone : string optionnel
Institution : select
Faculté : select
Département : select
Rôle : select
Identifiant académique : string optionnel
Mot de passe temporaire : généré automatiquement
```

### Rôles possibles

```txt
Déposant
Encadreur
Rapporteur
Reviewer
Validateur
Archiviste
Administrateur institutionnel
Super administrateur
```

---

## 2.4 Statuts de compte

```txt
Actif
En attente d’activation
Suspendu
Désactivé
Archivé
```

### Règles

```txt
Un compte suspendu ne peut pas se connecter.
Un compte désactivé conserve son historique.
Un compte administrateur ne peut pas se supprimer lui-même.
Un super administrateur peut changer le périmètre institutionnel.
```

---

# 3. Page : Gestion des rôles et permissions

## Objectif général

Définir précisément ce que chaque type d’utilisateur peut faire.

C’est une page critique parce que les workflows académiques exigent des droits bien séparés.

---

## Interface générale

```txt
1. Liste des rôles
2. Détail d’un rôle
3. Permissions par module
4. Périmètre d’accès
5. Historique des changements
```

---

## 3.1 Rôles principaux

```txt
Déposant
Encadreur
Directeur de thèse
Rapporteur
Reviewer
Chef de département
Comité scientifique
Archiviste
Administrateur institutionnel
Super administrateur
Public
```

---

## 3.2 Permissions par module

### Modules concernés

```txt
Dossiers scientifiques
Documents et versions
Métadonnées IA
Validation académique
Avis
Corrections
Décisions
Archivage
Recherche publique
Assistant IA
Preuves et vérification
Administration
Audit
```

### Types de permissions

```txt
Voir
Créer
Modifier
Supprimer
Valider
Archiver
Exporter
Configurer
```

---

## 3.3 Exemple de matrice de permissions

```txt
Déposant :
- créer dossier ;
- modifier brouillon ;
- répondre corrections ;
- voir ses preuves.

Validateur :
- voir dossiers assignés ;
- donner avis ;
- demander correction ;
- proposer décision.

Archiviste :
- vérifier version finale ;
- archiver document ;
- générer preuve ;
- publier fiche.

Admin institutionnel :
- gérer utilisateurs institution ;
- configurer workflows ;
- consulter statistiques ;
- auditer actions.
```

---

## 3.4 Périmètre d’accès

Chaque permission peut être limitée par :

```txt
Institution
Faculté
Département
Filière
Type de document
Workflow
```

Exemple :

```txt
Un chef de département Informatique peut voir les dossiers de son département, mais pas ceux de la Faculté de Médecine.
```

---

# 4. Page : Gestion des institutions

## Objectif général

Gérer les universités ou organismes partenaires qui alimentent ou utilisent la plateforme.

---

## Interface générale

```txt
1. Liste des institutions
2. Fiche institution
3. Configuration institutionnelle
4. Statistiques institutionnelles
5. Statut de vérification / e-IDStack
```

---

## 4.1 Champs d’une institution

```txt
Nom officiel
Sigle
Pays
Ville
Adresse
Email institutionnel
Téléphone
Site web
Logo
Type : université / école / institut / centre de recherche
Statut : actif / en attente / suspendu
```

---

## 4.2 Actions

```txt
ajouter une institution ;
modifier les informations ;
activer / suspendre ;
associer des administrateurs ;
configurer la visibilité publique ;
lier à la couche SSI / e-IDStack ;
voir les statistiques.
```

---

## 4.3 Statistiques institutionnelles

```txt
Nombre de dossiers créés
Nombre de documents archivés
Nombre de mémoires
Nombre de thèses
Nombre d’articles
Nombre de documents vérifiables
Nombre de vérifications QR
```

---

# 5. Page : Gestion des facultés, départements et filières

## Objectif général

Modéliser la structure académique de chaque institution.

---

## Hiérarchie

```txt
Institution
└── Faculté / École
    └── Département
        └── Filière / Programme
```

---

## Champs faculté / école

```txt
Nom
Sigle
Institution parent
Doyen / responsable optionnel
Email
Statut
```

---

## Champs département

```txt
Nom
Sigle
Faculté parent
Chef de département optionnel
Email
Domaines scientifiques associés
Statut
```

---

## Champs filière

```txt
Nom
Niveau
Département parent
Cycle : Licence / Master / Doctorat / Autre
Statut
```

---

## Actions

```txt
créer une faculté ;
créer un département ;
créer une filière ;
modifier une structure ;
désactiver une structure ;
associer des utilisateurs ;
consulter les dossiers liés.
```

---

# 6. Page : Configuration des workflows

## Objectif général

Permettre à chaque institution de définir ses circuits de validation.

Cette page est très importante parce que les processus peuvent varier selon les universités, les cycles et les disciplines.

---

## Workflows configurables

```txt
Workflow mémoire
Workflow thèse
Workflow article
Workflow archivage
Workflow preuve / vérification
```

---

## 6.1 Structure d’un workflow

Un workflow contient :

```txt
Nom du workflow
Type de document concerné
Institution concernée
Étapes
Transitions
Rôles autorisés
Conditions
Actions automatiques
Statut actif / inactif
```

---

## 6.2 Exemple workflow mémoire

```txt
Brouillon
→ Soumis
→ En instruction
→ Correction demandée
→ Re-soumis
→ Validé après soutenance
→ Archivable
→ Archivé
```

---

## 6.3 Exemple workflow thèse

```txt
Brouillon
→ Soumis
→ Expertise
→ Autorisation de soutenance
→ Correction post-soutenance
→ Dépôt final accepté
→ Archivable
→ Archivé
```

---

## 6.4 Exemple workflow article

```txt
Brouillon
→ Soumis
→ Screening éditorial
→ Peer review
→ Révision demandée
→ Re-soumis
→ Accepté
→ Publié / Archivable
→ Archivé
```

---

## 6.5 Configuration d’une étape

### Champs

```txt
Nom de l’étape
Description
Rôle responsable
Délai recommandé
Étape obligatoire : oui / non
Autorise correction : oui / non
Autorise décision : oui / non
Déclenche notification : oui / non
```

---

## 6.6 Configuration d’une transition

### Champs

```txt
Étape source
Étape cible
Action déclencheuse
Rôle autorisé
Condition obligatoire
Notification associée
```

### Exemple

```txt
Source : En instruction
Cible : Correction demandée
Action : Demander correction
Rôle autorisé : Validateur
Condition : commentaire obligatoire
```

---

# 7. Page : Gestion des types de documents

## Objectif général

Configurer les types de travaux scientifiques acceptés par la plateforme.

---

## Types de base

```txt
Mémoire
Thèse
Article
```

---

## Champs configurables

```txt
Nom du type
Description
Workflow associé
Métadonnées obligatoires
Visibilité par défaut
Niveau de validation requis
Archivage automatique ou manuel
Preuve générée après archivage : oui / non
```

---

## Métadonnées obligatoires par type

### Mémoire

```txt
Titre
Auteur
Institution
Département
Filière
Encadreur
Année académique
Résumé
Mots-clés
PDF
```

### Thèse

```txt
Titre
Doctorant
Directeur de thèse
École doctorale
Laboratoire optionnel
Domaine
Année
Résumé
Mots-clés
PDF
```

### Article

```txt
Titre
Auteurs
Revue / conférence
Statut éditorial
Résumé
Mots-clés
DOI optionnel
PDF
```

---

# 8. Page : Paramètres IA

## Objectif général

Configurer les services d’intelligence artificielle utilisés par la plateforme.

L’IA sert principalement à :

```txt
extraire les métadonnées ;
résumer les documents ;
suggérer des mots-clés ;
classifier les thématiques ;
alimenter l’Assistant IA ;
trouver des travaux similaires.
```

Le guide du hackathon valorise l’intégration IA concrète, notamment l’analyse automatique des PDF pour extraire les métadonnées et suggérer des thématiques associées. 

---

## 8.1 Paramètres extraction IA

### Options

```txt
Activer / désactiver extraction IA
Modèle utilisé
Langues supportées
Taille maximale du document analysé
Champs à extraire
Seuil de confiance minimal
Relance automatique si échec
```

---

## 8.2 Champs extraits

```txt
Titre
Auteur
Résumé
Mots-clés
Domaine scientifique
Problématique
Méthodologie
Résultats principaux
Langue
Thématiques associées
```

---

## 8.3 Paramètres Assistant IA

### Options

```txt
Activer / désactiver Assistant IA
Documents autorisés comme sources
Nombre maximal de sources utilisées
Obligation d’afficher les sources
Réponse uniquement à partir des sources : oui / non
Historique des conversations : oui / non
```

---

## 8.4 Paramètres travaux similaires

```txt
Poids des mots-clés
Poids du résumé
Poids du contenu complet
Poids du domaine
Poids de l’institution
Seuil minimal de similarité
```

---

## 8.5 Sécurité IA

### Paramètres

```txt
Filtrage des données privées
Exclusion des documents restreints
Masquage des informations sensibles
Journalisation des requêtes
Signalement des réponses incorrectes
```

---

# 9. Page : Paramètres recherche et facettes

## Objectif général

Configurer le moteur de recherche public et institutionnel.

---

## 9.1 Champs indexés

```txt
Titre
Résumé
Mots-clés
Auteur
Institution
Département
Filière
Encadreur
Domaine scientifique
Texte extrait du PDF
```

---

## 9.2 Facettes activables

```txt
Type de document
Institution
Faculté
Département
Filière
Année
Auteur
Encadreur
Domaine
Mots-clés
Langue
Statut
Visibilité
Vérifiable
```

---

## 9.3 Paramètres de tri

```txt
Pertinence
Date récente
Date ancienne
Titre
Auteur
Institution
Nombre de consultations
Nombre de vérifications
```

---

## 9.4 Paramètres de visibilité

```txt
Afficher documents publics
Afficher documents restreints uniquement aux utilisateurs autorisés
Exclure documents privés
Afficher seulement documents archivés
Afficher badge vérifiable
```

---

# 10. Page : Paramètres SSI / e-IDStack

## Objectif général

Configurer l’intégration de la couche SSI basée sur **e-IDStack de IDS**.

Cette page ne doit pas être visible pour tous les administrateurs. Elle est réservée aux profils techniques ou institutionnels autorisés.

---

## 10.1 Configuration générale

### Champs

```txt
Activer couche SSI : oui / non
Provider : e-IDStack de IDS
Environnement : test / production
URL du service
Identifiant institutionnel
Clé/API token de connexion
Statut de connexion
Dernière synchronisation
```

---

## 10.2 Paramètres d’émission de preuve

### Options

```txt
Générer preuve après archivage : oui / non
Type de preuve
Schéma de credential
Institution émettrice
DID institutionnel si disponible
Statut de révocation activé : oui / non
```

---

## 10.3 Données incluses dans la preuve

```txt
Identifiant du document
Titre
Auteur
Type de document
Institution
Département
Année
Hash SHA-256 du PDF final
Date d’archivage
Statut du document
URL de vérification
```

---

## 10.4 Actions

```txt
tester la connexion ;
synchroniser les schémas ;
émettre une preuve test ;
vérifier une preuve test ;
consulter les erreurs ;
désactiver temporairement l’intégration.
```

---

## 10.5 États possibles

```txt
Connecté
Non configuré
Erreur d’authentification
Service indisponible
Environnement test
Environnement production
```

---

# 11. Page : Gestion des preuves et vérifications

## Objectif général

Suivre les preuves émises et les vérifications effectuées.

---

## 11.1 Liste des preuves

### Colonnes

```txt
Identifiant de preuve
Document lié
Institution
Date d’émission
Statut
Hash du document
Méthode
Actions
```

### Statuts

```txt
Active
Révoquée
Expirée
Erreur d’émission
En attente
```

---

## 11.2 Actions sur une preuve

```txt
voir détail ;
ouvrir page de vérification ;
copier identifiant ;
révoquer preuve ;
réémettre preuve ;
consulter logs e-IDStack ;
télécharger QR code.
```

---

## 11.3 Journal des vérifications

### Colonnes

```txt
Date
Identifiant de preuve
Résultat
Source : QR / lien / saisie manuelle
Adresse IP optionnelle
Pays optionnel
Document concerné
```

### Résultats

```txt
Authentique
Introuvable
Invalide
Révoquée
Erreur technique
```

---

# 12. Page : Statistiques et pilotage

## Objectif général

Donner aux responsables une vue décisionnelle sur la production scientifique.

---

## Indicateurs généraux

```txt
Documents par institution
Documents par département
Documents par type
Documents par année
Documents par domaine scientifique
Documents vérifiables
Temps moyen de validation
Taux de correction demandée
Nombre de consultations
Nombre de recherches
Nombre de requêtes Assistant IA
```

---

## Graphiques utiles

```txt
courbe d’évolution des dépôts ;
répartition par type de document ;
répartition par domaine ;
top mots-clés ;
top institutions ;
temps moyen de traitement ;
nombre de vérifications par mois.
```

---

## Filtres

```txt
Institution
Faculté
Département
Type de document
Année
Domaine scientifique
Statut
```

---

## Exports

```txt
Exporter CSV
Exporter PDF
Exporter rapport institutionnel
```

---

# 13. Page : Audit et journal système

## Objectif général

Garantir la traçabilité des actions sensibles.

Cette page est indispensable pour une solution institutionnelle crédible.

---

## Actions auditées

```txt
Connexion utilisateur
Création utilisateur
Modification de rôle
Modification de workflow
Upload PDF
Modification de métadonnées
Validation de dossier
Décision finale
Archivage
Émission de preuve
Révocation de preuve
Vérification QR
Modification des paramètres IA
Modification des paramètres e-IDStack
```

---

## Champs d’un événement d’audit

```txt
Date
Utilisateur
Rôle
Institution
Action
Module concerné
Ancienne valeur
Nouvelle valeur
Adresse IP optionnelle
Statut de l’action
Commentaire
```

---

## Filtres

```txt
Utilisateur
Module
Action
Date
Institution
Niveau de criticité
Résultat
```

---

## Niveaux de criticité

```txt
Information
Important
Sensible
Critique
```

---

# 14. Page : Paramètres généraux

## Objectif général

Configurer les préférences globales de la plateforme.

---

## Paramètres disponibles

```txt
Nom de la plateforme
Logo
Palette visuelle
Langue par défaut
Fuseau horaire
Taille maximale des fichiers
Formats acceptés
Politique de visibilité par défaut
Durée de conservation des logs
Email de support
Mentions légales
```

---

## Paramètres de notification

```txt
Activer notifications email
Activer notifications internes
Notifier à la soumission
Notifier à la correction
Notifier à la décision
Notifier à l’archivage
Notifier à la génération de preuve
```

---

# 15. Page : Profil administrateur

## Objectif général

Permettre à l’administrateur de gérer son propre profil.

---

## Champs

```txt
Nom complet
Email
Rôle
Institution
Département si applicable
Téléphone
Photo
Langue préférée
Préférences de notification
```

---

## Actions

```txt
modifier profil ;
changer mot de passe ;
activer double authentification si disponible ;
voir sessions actives ;
consulter historique de connexion.
```

---

# Résumé du Portail Administration

Le Portail Administration est le centre de contrôle d’OpenScience Hub.

Il permet de gérer :

```txt
les utilisateurs ;
les rôles ;
les institutions ;
les structures académiques ;
les workflows ;
les types de documents ;
l’IA ;
la recherche ;
la couche SSI basée sur e-IDStack de IDS ;
les preuves ;
les statistiques ;
l’audit.
```

Structure finale :

```txt
Portail Administration
│
├── Tableau de bord administration
├── Gestion des utilisateurs
├── Gestion des rôles et permissions
├── Gestion des institutions
├── Gestion facultés / départements / filières
├── Configuration des workflows
├── Gestion des types de documents
├── Paramètres IA
├── Paramètres recherche et facettes
├── Paramètres SSI / e-IDStack
├── Gestion preuves et vérifications
├── Statistiques et pilotage
├── Audit et journal système
├── Paramètres généraux
└── Profil administrateur
```

# Vue globale finale des portails

```txt
OpenScience Hub
│
├── Portail Déposant
│   └── créer, déposer, corriger, suivre, récupérer preuve
│
├── Portail Validation académique
│   └── instruire, commenter, corriger, décider, archiver
│
├── Portail Archive publique
│   └── rechercher, consulter, explorer avec IA, vérifier
│
└── Portail Administration
    └── configurer, superviser, sécuriser, auditer
```

À ce stade, la description fonctionnelle globale des portails est complète.

La prochaine étape logique est de transformer ça en **document de spécification UI/UX écran par écran**, avec pour chaque écran :

```txt
objectif ;
utilisateur cible ;
composants UI ;
données affichées ;
actions disponibles ;
règles métier ;
états vides ;
états d’erreur ;
états de chargement ;
permissions.
```

Continue 

On continue maintenant avec le **niveau supérieur de détail UI/UX écran par écran**.

On va prendre chaque portail et documenter chaque page sous cette structure :

```txt
Objectif
Utilisateur cible
Layout général
Composants UI
Données affichées
Actions disponibles
Règles métier
États vides
États de chargement
États d’erreur
Permissions
```

On commence avec le **Portail Déposant**.

---

# Spécification UI/UX détaillée — Portail Déposant

## 1. Écran : Tableau de bord déposant

### Objectif

Permettre au déposant de voir immédiatement l’état de ses dossiers scientifiques et les actions urgentes à effectuer.

### Utilisateur cible

```txt
Étudiant
Doctorant
Enseignant-chercheur
Auteur d’article
```

### Layout général

```txt
Header supérieur
Sidebar navigation
Zone de bienvenue
Cartes statistiques
Liste des dossiers récents
Bloc notifications urgentes
Bloc raccourcis
```

### Navigation latérale

```txt
Tableau de bord
Mes dossiers
Nouveau dépôt
Corrections
Notifications
Profil
```

---

## 1.1 Composants UI

### Header

Contient :

```txt
Logo OpenScience Hub
Nom du portail : Espace déposant
Champ recherche rapide
Icône notifications
Menu utilisateur
```

### Bloc de bienvenue

Texte :

```txt
Bonjour, [Nom]
Bienvenue dans votre espace de dépôt scientifique.
```

Boutons :

```txt
Nouveau dépôt
Voir mes dossiers
```

### Cartes statistiques

Cartes :

```txt
Total dossiers
Brouillons
Soumis
En instruction
Correction demandée
Validés
Archivés
Rejetés
```

Chaque carte contient :

```txt
libellé
nombre
icône
couleur de statut
lien vers la liste filtrée
```

### Tableau dossiers récents

Colonnes :

```txt
Titre
Type
Statut
Dernière activité
Action
```

### Bloc notifications urgentes

Affiche uniquement :

```txt
correction demandée
décision finale reçue
preuve disponible
dossier rejeté
```

---

## 1.2 Données affichées

```txt
user.fullName
user.role
stats.totalWorks
stats.draftCount
stats.submittedCount
stats.inReviewCount
stats.correctionRequestedCount
stats.validatedCount
stats.archivedCount
stats.rejectedCount
recentWorks[]
urgentNotifications[]
```

---

## 1.3 Actions disponibles

```txt
Créer un nouveau dépôt
Ouvrir un dossier
Continuer un brouillon
Répondre à une correction
Voir une preuve
Voir une fiche publique
Ouvrir une notification
Marquer notification comme lue
```

---

## 1.4 Règles métier

```txt
Un dossier brouillon peut être modifié.
Un dossier soumis est en lecture seule.
Un dossier en instruction est en lecture seule.
Un dossier avec correction demandée peut recevoir une nouvelle version.
Un dossier archivé ne peut plus être modifié.
Un dossier rejeté reste consultable mais non modifiable.
```

### Action principale selon statut

```txt
Brouillon → Continuer
Soumis → Voir
En instruction → Voir
Correction demandée → Répondre
Validé → Voir détail
Archivé → Voir preuve
Rejeté → Voir décision
```

---

## 1.5 États vides

### Aucun dossier

Message :

```txt
Vous n’avez encore créé aucun dossier scientifique.
Commencez par déposer un mémoire, une thèse ou un article.
```

Bouton :

```txt
Nouveau dépôt
```

### Aucune notification

Message :

```txt
Aucune notification importante pour le moment.
```

---

## 1.6 États de chargement

```txt
Skeleton cards pour les statistiques
Skeleton rows pour les dossiers récents
Spinner léger dans le bloc notifications
```

---

## 1.7 États d’erreur

### Erreur chargement statistiques

```txt
Impossible de charger vos statistiques.
Réessayez dans quelques instants.
```

Actions :

```txt
Réessayer
Actualiser la page
```

### Erreur chargement dossiers

```txt
Impossible de charger vos dossiers récents.
```

---

## 1.8 Permissions

```txt
Déposant : accès complet à ses propres données.
Validateur : pas d’accès à ce portail sauf si double rôle.
Admin : peut visualiser en mode support si autorisé.
Public : aucun accès.
```

---

# 2. Écran : Mes dossiers scientifiques

## Objectif

Lister tous les dossiers scientifiques créés par le déposant avec recherche, filtres et actions contextuelles.

## Utilisateur cible

```txt
Déposant connecté
```

## Layout général

```txt
Header de page
Barre de recherche
Filtres horizontaux
Tableau des dossiers
Pagination
Menu d’actions par ligne
```

---

## 2.1 Composants UI

### Header de page

Titre :

```txt
Mes dossiers scientifiques
```

Sous-titre :

```txt
Consultez, modifiez et suivez l’évolution de vos travaux déposés.
```

Bouton principal :

```txt
Nouveau dépôt
```

---

### Barre de recherche

Placeholder :

```txt
Rechercher par titre, mot-clé, département ou année...
```

Recherche sur :

```txt
title
keywords
department
academicYear
documentType
```

---

### Filtres

Filtres visibles :

```txt
Type de document
Statut
Année académique
Institution
Département
Date de création
```

### Type de document

```txt
Tous
Mémoire
Thèse
Article
```

### Statut

```txt
Tous
Brouillon
Soumis
En instruction
Correction demandée
Validé
Archivé
Rejeté
```

---

## 2.2 Tableau des dossiers

Colonnes :

```txt
Titre
Type
Institution
Département
Année
Statut
Dernière mise à jour
Actions
```

### Badge statut

```txt
Brouillon → gris
Soumis → noir
En instruction → gris foncé
Correction demandée → orange
Validé → vert
Archivé → rouge académique / noir
Rejeté → rouge erreur
```

---

## 2.3 Actions disponibles

Actions générales :

```txt
Créer un dossier
Rechercher
Filtrer
Réinitialiser les filtres
Changer page
```

Actions par dossier :

```txt
Voir détail
Modifier brouillon
Continuer dépôt
Soumettre
Répondre correction
Déposer nouvelle version
Voir fiche publique
Voir preuve
Télécharger PDF final
```

---

## 2.4 Règles métier

```txt
Modifier brouillon visible seulement si status = BROUILLON.
Soumettre visible seulement si dossier complet.
Répondre correction visible seulement si status = CORRECTION_DEMANDEE.
Voir preuve visible seulement si preuve générée.
Voir fiche publique visible seulement si dossier archivé et visibilité compatible.
Télécharger PDF final visible seulement si version finale disponible.
```

### Dossier complet avant soumission

Un dossier est complet si :

```txt
type défini ;
titre renseigné ;
institution renseignée ;
département renseigné ;
PDF présent ;
métadonnées minimales validées par déposant.
```

---

## 2.5 États vides

### Aucun dossier

```txt
Aucun dossier scientifique trouvé.
Vous pouvez créer votre premier dépôt.
```

### Aucun résultat après filtre

```txt
Aucun dossier ne correspond aux filtres sélectionnés.
```

Actions :

```txt
Réinitialiser les filtres
Créer un nouveau dépôt
```

---

## 2.6 États de chargement

```txt
Skeleton table
Spinner sur recherche
Désactivation temporaire des filtres pendant chargement
```

---

## 2.7 États d’erreur

```txt
Impossible de charger la liste des dossiers.
```

Actions :

```txt
Réessayer
Retour au tableau de bord
```

---

## 2.8 Permissions

```txt
Le déposant ne voit que ses propres dossiers.
Un admin support peut voir les dossiers si permission explicite.
Aucun utilisateur public ne peut accéder à cette page.
```

---

# 3. Écran : Nouveau dépôt

## Objectif

Guider le déposant dans la création d’un nouveau dossier scientifique.

## Utilisateur cible

```txt
Déposant connecté
```

## Layout général

Interface en wizard :

```txt
Stepper horizontal
Zone de formulaire centrale
Bloc d’aide latéral
Boutons précédent / suivant
Sauvegarde automatique
```

---

## 3.1 Étapes du wizard

```txt
1. Type de travail
2. Informations académiques
3. Upload PDF
4. Analyse IA
5. Vérification métadonnées
6. Soumission
```

Chaque étape possède :

```txt
titre ;
description ;
statut : à venir / en cours / terminé ;
validation locale.
```

---

# 3.2 Étape 1 : Type de travail

## Objectif

Déterminer le workflow à utiliser.

## Composants UI

Trois cartes sélectionnables :

```txt
Mémoire
Thèse
Article scientifique
```

### Carte Mémoire

Texte :

```txt
Travail académique de fin de cycle, généralement associé à une formation de Licence, Master ou équivalent.
```

### Carte Thèse

Texte :

```txt
Travail doctoral nécessitant un suivi scientifique, une expertise et une validation renforcée.
```

### Carte Article

Texte :

```txt
Manuscrit ou publication scientifique soumis à un processus éditorial ou de revue.
```

## Données

```txt
documentType: enum
```

Valeurs :

```txt
MEMOIRE
THESE
ARTICLE
```

## Actions

```txt
Sélectionner un type
Continuer
Annuler
```

## Règles métier

```txt
Un seul type peut être sélectionné.
Le type détermine les champs spécifiques de l’étape suivante.
Le type peut être modifié tant que le dossier n’est pas soumis.
```

## Erreur

```txt
Veuillez sélectionner un type de travail avant de continuer.
```

---

# 3.3 Étape 2 : Informations académiques

## Objectif

Collecter les informations institutionnelles et scientifiques de base.

---

## Champs communs

```txt
title: string, required
mainAuthor: string, required
coAuthors: string[], optional
institutionId: uuid, required
facultyId: uuid, optional
departmentId: uuid, required
programId: uuid, optional
academicYear: string, required
language: enum, required
visibilityRequested: enum, required
```

### Enums

```txt
language:
- FR
- EN
- OTHER

visibilityRequested:
- PUBLIC
- RESTRICTED
- PRIVATE_INSTITUTIONAL
```

---

## Champs spécifiques mémoire

```txt
level: enum, required
supervisorName: string, required
specialization: string, optional
plannedDefenseDate: date, optional
```

Enum `level` :

```txt
LICENCE
MASTER
INGENIEUR
OTHER
```

---

## Champs spécifiques thèse

```txt
doctoralCycle: enum, required
thesisDirectorName: string, required
coDirectorName: string, optional
doctoralSchoolId: uuid, optional
laboratoryName: string, optional
doctoralDomain: string, required
```

Enum `doctoralCycle` :

```txt
DOCTORAT
PHD
OTHER
```

---

## Champs spécifiques article

```txt
journalOrConference: string, optional
editorialStatus: enum, required
doi: string, optional
authors: string[], required
correspondingAuthor: string, optional
```

Enum `editorialStatus` :

```txt
DRAFT
SUBMITTED
UNDER_REVIEW
ACCEPTED
PUBLISHED
```

---

## Composants UI

```txt
Champs texte
Menus déroulants institutionnels
Sélecteur de langue
Sélecteur visibilité
Bloc conditionnel selon type
Bouton sauvegarder brouillon
Bouton continuer
```

---

## Règles métier

```txt
Institution obligatoire.
Département obligatoire pour mémoire et thèse.
Titre obligatoire.
Auteur principal obligatoire.
Encadreur obligatoire pour mémoire.
Directeur de thèse obligatoire pour thèse.
Auteurs obligatoires pour article.
Les champs institutionnels doivent respecter la hiérarchie : institution → faculté → département → filière.
```

---

## États d’erreur

```txt
Champ obligatoire manquant.
Institution non disponible.
Département incompatible avec la faculté sélectionnée.
Format DOI invalide.
Année académique invalide.
```

---

# 3.4 Étape 3 : Upload PDF

## Objectif

Téléverser le document principal.

## Composants UI

```txt
Zone drag-and-drop
Bouton Choisir un fichier
Liste fichier sélectionné
Progress bar upload
Carte informations fichier
Bouton remplacer fichier
```

---

## Données affichées après upload

```txt
fileName: string
fileSize: number
mimeType: string
pageCount: number optional
sha256Hash: string
uploadedAt: datetime
versionNumber: integer
```

---

## Règles métier

```txt
Seuls les PDF sont acceptés.
Un dossier peut avoir un seul PDF principal actif à cette étape.
Chaque upload crée une version.
Le hash SHA-256 est calculé automatiquement.
Le fichier doit être stocké avant l’analyse IA.
```

---

## États de chargement

```txt
Upload en cours
Calcul du hash
Extraction du nombre de pages
Préparation analyse IA
```

---

## États d’erreur

```txt
Format non supporté.
Fichier trop volumineux.
Upload interrompu.
Impossible de calculer le hash.
PDF illisible ou corrompu.
```

Actions :

```txt
Réessayer
Remplacer le fichier
Enregistrer comme brouillon
```

---

# 3.5 Étape 4 : Analyse IA

## Objectif

Analyser le PDF pour extraire automatiquement les métadonnées.

Cette étape correspond directement au bonus IA attendu par le thème : extraction automatique des métadonnées PDF et suggestion de thématiques associées. 

---

## Composants UI

```txt
Bouton Lancer analyse IA
Progression par sous-tâches
Carte résultat IA
Bouton relancer
Bouton continuer
```

---

## Sous-tâches affichées

```txt
Extraction du texte
Détection du titre
Détection des auteurs
Extraction du résumé
Suggestion de mots-clés
Classification thématique
Détection de la méthodologie
Détection des résultats
```

---

## Données produites

```txt
detectedTitle: string
detectedAuthors: string[]
detectedAbstract: text
suggestedKeywords: string[]
detectedDomain: string
detectedProblemStatement: text
detectedMethodology: text
detectedResults: text
detectedLanguage: enum
suggestedThemes: string[]
confidenceScore: decimal
```

---

## Règles métier

```txt
L’analyse IA ne remplace pas la validation humaine.
Les résultats IA doivent être confirmés par le déposant.
Les résultats IA peuvent être relancés si le document est remplacé.
Les champs IA doivent être historisés.
```

---

## États vides

Si l’utilisateur ne lance pas l’analyse :

```txt
L’analyse IA n’a pas encore été lancée.
Vous pouvez continuer sans analyse, mais les métadonnées devront être remplies manuellement.
```

---

## États d’erreur

```txt
Impossible d’extraire le texte du PDF.
Analyse IA indisponible.
Document trop long pour l’analyse automatique.
Réponse IA incomplète.
```

Actions :

```txt
Relancer
Continuer manuellement
Remplacer PDF
```

---

# 3.6 Étape 5 : Vérification des métadonnées

## Objectif

Permettre au déposant de valider ou corriger les métadonnées avant soumission.

---

## Layout

```txt
Colonne gauche : champs du dossier
Colonne droite : propositions IA
Indicateurs de confiance
Boutons d’acceptation champ par champ
```

---

## Champs vérifiables

```txt
title
authors
abstract
keywords
scientificDomain
problemStatement
methodology
mainResults
language
themes
```

---

## Composants UI

```txt
Champ texte éditable
Zone résumé
Tags mots-clés
Bouton Accepter valeur IA
Bouton Modifier
Bouton Ajouter mot-clé
Bouton Supprimer mot-clé
Badge confiance IA
```

---

## Actions

```txt
Accepter toutes les propositions IA
Accepter une proposition
Modifier manuellement
Ajouter mot-clé
Supprimer mot-clé
Relancer analyse
Sauvegarder brouillon
Continuer vers soumission
```

---

## Règles métier

```txt
Le titre final doit être renseigné.
Le résumé doit être renseigné.
Au moins trois mots-clés sont recommandés.
Le domaine scientifique doit être renseigné.
Les métadonnées validées par le déposant deviennent les métadonnées soumises.
```

---

## États d’erreur

```txt
Titre manquant.
Résumé manquant.
Aucun mot-clé.
Domaine scientifique manquant.
```

---

# 3.7 Étape 6 : Soumission officielle

## Objectif

Envoyer officiellement le dossier au circuit de validation académique.

---

## Composants UI

```txt
Récapitulatif du dossier
Récapitulatif du PDF
Récapitulatif métadonnées
Cases de confirmation
Bouton Soumettre officiellement
Bouton Enregistrer brouillon
```

---

## Récapitulatif

```txt
Type de document
Titre
Auteur
Institution
Département
Année académique
Encadreur / directeur / revue
Visibilité demandée
Nom du PDF
Hash SHA-256
Mots-clés
Résumé court
```

---

## Cases à cocher

```txt
Je confirme que les informations fournies sont exactes.
Je confirme que le fichier PDF correspond à la version à évaluer.
J’accepte la transmission du dossier au circuit de validation académique.
```

---

## Règles métier

```txt
Le bouton Soumettre est désactivé tant que les confirmations ne sont pas cochées.
Après soumission, le dossier passe en statut SOUMIS.
Après soumission, le dossier devient lecture seule pour le déposant.
Un événement d’historique est créé.
Une notification est envoyée au portail validation.
```

---

## État succès

```txt
Votre dossier a été soumis avec succès.
Il sera examiné par les acteurs académiques compétents.
```

Actions :

```txt
Voir le dossier
Retour au tableau de bord
Déposer un autre travail
```

---

## États d’erreur

```txt
Dossier incomplet.
Fichier PDF manquant.
Métadonnées obligatoires manquantes.
Impossible de soumettre le dossier.
```

---

# 4. Écran : Détail d’un dossier

## Objectif

Afficher toutes les informations, statuts, versions, avis, corrections et preuves d’un dossier.

## Layout général

```txt
Header dossier
Timeline statut
Onglets
Panneau actions
```

---

## 4.1 Onglets

```txt
Vue d’ensemble
Métadonnées
Document
Versions
Avis & décisions
Corrections
Preuve
Historique
```

---

## 4.2 Header dossier

Données :

```txt
title
documentType
status
institution
department
academicYear
createdAt
lastUpdatedAt
```

Actions contextuelles :

```txt
Continuer dépôt
Répondre correction
Voir fiche publique
Voir preuve
Télécharger PDF final
```

---

## 4.3 Timeline

Étapes génériques :

```txt
Brouillon
Soumis
En instruction
Correction demandée
Re-soumis
Validé
Archivé
```

Chaque étape affiche :

```txt
label
date
actor
state
```

États :

```txt
DONE
CURRENT
BLOCKED
PENDING
```

---

## 4.4 Onglet Vue d’ensemble

Affiche :

```txt
résumé du dossier ;
statut ;
prochaine action ;
dernière activité ;
métadonnées clés ;
document actif ;
notifications liées.
```

---

## 4.5 Onglet Métadonnées

Affiche :

```txt
titre
auteurs
résumé
mots-clés
institution
département
filière
encadreur/directeur/revue
domaine scientifique
langue
visibilité
```

Règle :

```txt
Modification autorisée seulement si BROUILLON ou CORRECTION_DEMANDEE.
```

---

## 4.6 Onglet Document

Affiche :

```txt
visualiseur PDF
nom fichier
taille
nombre de pages
hash SHA-256
version active
date dépôt
```

Actions :

```txt
visualiser
télécharger
remplacer si autorisé
```

---

## 4.7 Onglet Versions

Colonnes :

```txt
Version
Date
Hash
Statut
Note
Action
```

Actions :

```txt
voir
télécharger
déposer nouvelle version
```

Règle :

```txt
Nouvelle version autorisée seulement si correction demandée ou brouillon.
```

---

## 4.8 Onglet Avis & décisions

Affiche :

```txt
avis reçus
recommandations
commentaires académiques
décisions finales
pièces jointes éventuelles
```

Actions :

```txt
consulter avis
télécharger pièce justificative si autorisé
```

---

## 4.9 Onglet Corrections

Affiche :

```txt
liste des corrections
statut de chaque correction
priorité
commentaire du validateur
réponse du déposant
```

Actions :

```txt
répondre
ajouter commentaire
déposer nouvelle version
marquer comme traité
```

---

## 4.10 Onglet Preuve

Disponible si dossier archivé.

Affiche :

```txt
identifiant preuve
hash final
date émission
institution
statut preuve
QR code
lien vérification
référence e-IDStack de IDS
```

Actions :

```txt
copier lien
télécharger QR code
ouvrir page vérification
télécharger PDF final
```

---

## 4.11 Onglet Historique

Colonnes :

```txt
Date
Action
Acteur
Ancien statut
Nouveau statut
Commentaire
```

Événements :

```txt
création
upload
analyse IA
soumission
correction
version déposée
avis reçu
décision
archivage
preuve générée
```

---

# 5. Écran : Corrections demandées

## Objectif

Permettre au déposant de traiter les corrections demandées par les validateurs.

## Layout

```txt
Header
Résumé dossier
Liste corrections
Formulaire réponse
Upload nouvelle version
```

---

## 5.1 Carte correction

Champs :

```txt
title
type
description
priority
requestedBy
requestedAt
dueDate
status
relatedPage
relatedSection
```

### Types

```txt
ADMINISTRATIVE
SCIENTIFIC
METADATA
PDF_FILE
ABSTRACT
KEYWORDS
BIBLIOGRAPHY
VISIBILITY
FINAL_VERSION
```

### Priorités

```txt
LOW
NORMAL
HIGH
BLOCKING
```

### Statuts

```txt
OPEN
IN_PROGRESS
ANSWERED
VALIDATED
REJECTED
CANCELLED
```

---

## 5.2 Actions

```txt
Lire correction
Répondre
Ajouter commentaire
Modifier métadonnées
Uploader nouvelle version
Soumettre correction traitée
```

---

## 5.3 Règles métier

```txt
Une correction bloquante doit être traitée avant re-soumission.
Une nouvelle version peut être obligatoire selon le type de correction.
Le dossier repasse en RE_SOUMIS après réponse complète.
Chaque réponse crée un événement d’historique.
```

---

## 5.4 États vides

```txt
Aucune correction demandée pour ce dossier.
```

---

# 6. Écran : Preuve et vérification

## Objectif

Afficher la preuve associée au document final archivé.

## Condition d’accès

```txt
dossier.status = ARCHIVE
verificationProof.exists = true
```

---

## Layout

```txt
Header preuve
Carte statut
QR code
Détails preuve
Détails document
Actions
```

---

## Données affichées

```txt
proofId
credentialId
documentHash
verificationUrl
qrCodeUrl
issuedAt
issuedBy
proofStatus
eIDStackReference
```

---

## Statuts preuve

```txt
ACTIVE
REVOKED
EXPIRED
PENDING
ERROR
```

---

## Actions

```txt
Copier lien
Télécharger QR code
Ouvrir page vérification
Télécharger PDF final
Copier identifiant preuve
```

---

## États d’erreur

```txt
Preuve non disponible.
Erreur de génération de preuve.
Preuve révoquée.
Impossible de charger le QR code.
```

---

# 7. Écran : Notifications

## Objectif

Centraliser les notifications du déposant.

## Layout

```txt
Filtres
Liste notifications
Détail notification
Actions
```

---

## Types

```txt
DOSSIER_SOUMIS
DOSSIER_EN_INSTRUCTION
CORRECTION_DEMANDEE
AVIS_AJOUTE
DECISION_ENREGISTREE
DOSSIER_VALIDE
DOSSIER_ARCHIVE
PREUVE_GENEREE
DOSSIER_REJETE
```

---

## Actions

```txt
ouvrir dossier
marquer comme lu
marquer tout comme lu
supprimer localement
filtrer non lues
```

---

# 8. Écran : Profil déposant

## Objectif

Gérer les informations personnelles et académiques du déposant.

## Champs

```txt
fullName: string
email: string
phone: string optional
institutionId: uuid
facultyId: uuid optional
departmentId: uuid optional
programId: uuid optional
academicLevel: string optional
academicIdentifier: string optional
orcid: string optional
preferredLanguage: enum
photoUrl: string optional
```

---

## Actions

```txt
Modifier profil
Changer mot de passe
Configurer notifications
Voir sessions actives
Déconnecter autres sessions
```

---

# Résumé opérationnel — Portail Déposant

Le Portail Déposant doit donner une expérience fluide :

```txt
Créer → Uploader → Analyser par IA → Corriger → Soumettre → Suivre → Répondre → Vérifier
```

Les écrans prioritaires pour la conception UI sont :

```txt
1. Nouveau dépôt
2. Détail dossier
3. Corrections demandées
4. Preuve et vérification
5. Tableau de bord
```

On continue ensuite avec le **niveau UI/UX détaillé du Portail Validation académique**, qui exige des règles plus strictes : rôles, décision finale, archivage, preuve, audit.

Continue

On continue avec le **niveau UI/UX détaillé du Portail Administration**.

# Spécification UI/UX détaillée — Portail Administration

## Objectif global du portail

Le **Portail Administration** est le centre de contrôle d’OpenScience Hub.

Il permet de gérer :

```txt
utilisateurs ;
rôles ;
permissions ;
institutions ;
facultés ;
départements ;
filières ;
workflows ;
types de documents ;
paramètres IA ;
recherche à facettes ;
couche SSI basée sur e-IDStack de IDS ;
preuves ;
vérifications ;
statistiques ;
audit système.
```

Ce portail est utilisé par les acteurs qui configurent et sécurisent la plateforme.

---

# 1. Écran : Tableau de bord administration

## Objectif

Donner une vue globale de l’état de la plateforme, de l’activité institutionnelle et des services critiques.

## Utilisateurs cibles

```txt
Super administrateur
Administrateur institutionnel
Responsable SI
Responsable archive
Responsable qualité / audit
```

## Layout général

```txt
Header supérieur
Sidebar administration
Cartes statistiques
État des services
Activité récente
Graphiques de pilotage
Alertes système
```

---

## 1.1 Header supérieur

### Composants UI

```txt
Logo OpenScience Hub
Nom du portail : Administration
Institution active
Recherche globale
Icône notifications système
Menu administrateur
```

### Exemple

```txt
Administration — Université de Yaoundé I
```

## Règle importante

Le périmètre doit toujours être visible.

```txt
Super admin → plateforme entière
Admin institutionnel → institution uniquement
Responsable département → département uniquement si configuré
```

---

## 1.2 Sidebar administration

Menus principaux :

```txt
Tableau de bord
Utilisateurs
Rôles & permissions
Institutions
Structures académiques
Workflows
Types de documents
Paramètres IA
Recherche & facettes
SSI / e-IDStack
Preuves & vérifications
Statistiques
Audit système
Paramètres généraux
Profil
```

La sidebar doit être filtrée selon les permissions. Un responsable archive ne doit pas forcément voir les paramètres e-IDStack.

---

## 1.3 Cartes statistiques

### Cartes à afficher

```txt
Total dossiers
Documents archivés
Documents vérifiables
Utilisateurs actifs
Dossiers en attente
Corrections ouvertes
Vérifications QR
Requêtes Assistant IA
```

### Données

```txt
totalResearchWorks: number
archivedWorks: number
verifiableDocuments: number
activeUsers: number
pendingWorks: number
openCorrections: number
verificationChecks: number
aiQueries: number
```

### Règles UI

```txt
Les cartes doivent être cliquables.
Chaque carte redirige vers une liste filtrée.
Les nombres doivent être actualisés régulièrement.
```

---

## 1.4 État des services

### Services suivis

```txt
API principale
Base de données
Stockage PDF
Extraction PDF
Service IA
Assistant IA
Moteur de recherche
Service QR code
Service e-IDStack
Service vérification
Service email / notifications
```

### Statuts

```txt
OPERATIONAL
DEGRADED
DOWN
MAINTENANCE
MISCONFIGURED
```

### Libellés UI

```txt
Opérationnel
Dégradé
Indisponible
Maintenance
Erreur de configuration
```

### Actions

```txt
Voir détail
Relancer test
Voir logs
Notifier responsable technique
```

---

## 1.5 Activité récente

### Événements affichés

```txt
Nouvel utilisateur créé
Rôle attribué
Dossier soumis
Métadonnées validées
Décision finale enregistrée
Document archivé
Preuve générée
QR code vérifié
Workflow modifié
Paramètre IA modifié
```

### Colonnes

```txt
Date
Utilisateur
Action
Module
Statut
```

---

## 1.6 Alertes système

### Types d’alerte

```txt
Échec extraction IA
Échec génération preuve
Erreur e-IDStack
Fichier PDF inaccessible
Workflow incomplet
Utilisateur suspendu avec tâches actives
Stockage presque plein
```

### Niveaux

```txt
INFO
WARNING
CRITICAL
```

### Actions

```txt
Ouvrir alerte
Marquer comme traitée
Assigner à un admin
Voir logs
```

---

## 1.7 États vides

```txt
Aucune activité récente.
Aucune alerte système.
Aucun incident détecté.
```

---

## 1.8 États d’erreur

```txt
Impossible de charger les statistiques d’administration.
Impossible de vérifier l’état des services.
```

Actions :

```txt
Réessayer
Actualiser
Consulter les logs
```

---

# 2. Écran : Gestion des utilisateurs

## Objectif

Créer, modifier, désactiver et organiser les comptes utilisateurs.

## Layout général

```txt
Header de page
Barre de recherche
Filtres
Tableau utilisateurs
Panneau détail utilisateur
Formulaire création / modification
```

---

## 2.1 Header de page

Titre :

```txt
Gestion des utilisateurs
```

Sous-titre :

```txt
Créez, modifiez et administrez les comptes associés à votre institution.
```

Bouton principal :

```txt
Ajouter un utilisateur
```

Boutons secondaires :

```txt
Importer CSV
Exporter
```

---

## 2.2 Recherche et filtres

### Recherche sur

```txt
fullName
email
academicIdentifier
role
institution
department
```

### Filtres

```txt
Rôle
Institution
Faculté
Département
Statut du compte
Dernière connexion
Date de création
```

### Statuts compte

```txt
ACTIVE
PENDING_ACTIVATION
SUSPENDED
DISABLED
ARCHIVED
```

---

## 2.3 Tableau utilisateurs

Colonnes :

```txt
Nom complet
Email
Rôle principal
Institution
Département
Statut
Dernière connexion
Actions
```

Actions par ligne :

```txt
Voir profil
Modifier
Attribuer rôle
Suspendre
Désactiver
Réactiver
Réinitialiser mot de passe
Voir activité
```

---

## 2.4 Formulaire création utilisateur

### Champs

```txt
fullName: string, required
email: string, required
phone: string, optional
institutionId: uuid, required
facultyId: uuid, optional
departmentId: uuid, optional
programId: uuid, optional
primaryRoleId: uuid, required
academicIdentifier: string, optional
sendInvitationEmail: boolean
```

### Actions

```txt
Créer utilisateur
Créer et envoyer invitation
Annuler
```

---

## 2.5 Attribution des rôles

### Champs

```txt
userId: uuid
roleId: uuid
scopeType: enum
scopeId: uuid optional
validFrom: date optional
validUntil: date optional
```

### Enum `scopeType`

```txt
GLOBAL
INSTITUTION
FACULTY
DEPARTMENT
PROGRAM
WORKFLOW
```

### Règle métier

Un utilisateur peut avoir plusieurs rôles, mais chaque rôle doit avoir un périmètre clair.

Exemple :

```txt
Reviewer → uniquement articles assignés
Chef de département → département Informatique
Admin institutionnel → Université de Yaoundé I
```

---

## 2.6 Règles métier

```txt
Un email doit être unique.
Un compte suspendu ne peut pas se connecter.
Un compte désactivé conserve son historique.
Un administrateur ne peut pas retirer son propre dernier rôle admin.
Un super administrateur peut gérer tous les comptes.
Un admin institutionnel ne peut gérer que les utilisateurs de son institution.
```

---

## 2.7 États vides

```txt
Aucun utilisateur trouvé.
Aucun utilisateur ne correspond aux filtres sélectionnés.
```

Actions :

```txt
Ajouter un utilisateur
Réinitialiser les filtres
```

---

## 2.8 États d’erreur

```txt
Email déjà utilisé.
Rôle incompatible avec le périmètre.
Impossible de désactiver cet utilisateur.
Impossible d’envoyer l’invitation.
```

---

# 3. Écran : Gestion des rôles et permissions

## Objectif

Définir les rôles du système et les droits associés.

## Layout général

```txt
Liste des rôles
Détail rôle
Matrice des permissions
Périmètre d’accès
Historique des modifications
```

---

## 3.1 Liste des rôles

Rôles principaux :

```txt
Déposant
Encadreur
Directeur de thèse
Rapporteur
Reviewer
Chef de département
Comité scientifique
Archiviste
Administrateur institutionnel
Super administrateur
Public
```

### Données rôle

```txt
roleId: uuid
name: string
description: text
isSystemRole: boolean
createdAt: datetime
updatedAt: datetime
```

---

## 3.2 Matrice des permissions

### Modules

```txt
Dossiers scientifiques
Documents et versions
Métadonnées IA
Validation académique
Avis
Corrections
Décisions
Archivage
Recherche publique
Assistant IA
Preuves et vérification
Administration
Audit
```

### Actions

```txt
VIEW
CREATE
UPDATE
DELETE
VALIDATE
DECIDE
ARCHIVE
EXPORT
CONFIGURE
AUDIT
```

### Exemple

```txt
Archiviste :
- VIEW dossier archivable
- ARCHIVE document
- VIEW preuve
- CREATE preuve si autorisé
- VIEW audit archivage
```

---

## 3.3 Périmètre d’accès

Un rôle peut être limité par :

```txt
institution
faculté
département
filière
type de document
workflow
dossier assigné
```

### Règle

Les permissions globales doivent être rares. Par défaut, chaque rôle est limité à son périmètre institutionnel.

---

## 3.4 Actions

```txt
Créer rôle
Modifier rôle
Dupliquer rôle
Activer / désactiver rôle
Modifier permissions
Consulter historique
```

---

## 3.5 Règles métier

```txt
Les rôles système ne peuvent pas être supprimés.
Une permission critique doit être confirmée.
Les changements de permissions doivent être audités.
Un rôle sans périmètre ne doit pas accéder aux données sensibles.
```

---

# 4. Écran : Gestion des institutions

## Objectif

Administrer les institutions partenaires ou clientes de la plateforme.

## Layout général

```txt
Liste institutions
Recherche
Filtres
Fiche institution
Configuration institutionnelle
Statistiques institution
```

---

## 4.1 Champs institution

```txt
institutionId: uuid
officialName: string
shortName: string
country: string
city: string
address: string optional
officialEmail: string
phone: string optional
website: string optional
logoUrl: string optional
institutionType: enum
status: enum
```

### Enum `institutionType`

```txt
UNIVERSITY
SCHOOL
INSTITUTE
RESEARCH_CENTER
OTHER
```

### Enum `status`

```txt
ACTIVE
PENDING
SUSPENDED
DISABLED
```

---

## 4.2 Actions

```txt
Ajouter institution
Modifier institution
Suspendre institution
Réactiver institution
Associer administrateurs
Configurer visibilité publique
Configurer e-IDStack
Voir catalogue institution
Voir statistiques
```

---

## 4.3 Règles métier

```txt
Une institution suspendue ne peut plus archiver de nouveaux documents.
Les documents déjà publics restent consultables sauf désactivation explicite.
Une institution doit avoir au moins un administrateur institutionnel actif.
Le logo institutionnel doit être validé avant publication publique.
```

---

# 5. Écran : Structures académiques

## Objectif

Configurer la hiérarchie académique interne d’une institution.

## Hiérarchie

```txt
Institution
└── Faculté / École
    └── Département
        └── Filière / Programme
```

## Layout général

```txt
Arbre institutionnel
Panneau détail
Formulaire création
Actions structure
```

---

## 5.1 Faculté / École

Champs :

```txt
facultyId: uuid
institutionId: uuid
name: string
shortName: string optional
deanName: string optional
email: string optional
status: enum
```

---

## 5.2 Département

Champs :

```txt
departmentId: uuid
facultyId: uuid
name: string
shortName: string optional
headName: string optional
email: string optional
scientificDomains: string[]
status: enum
```

---

## 5.3 Filière / Programme

Champs :

```txt
programId: uuid
departmentId: uuid
name: string
level: enum
cycle: enum
status: enum
```

### Enum `level`

```txt
LICENCE
MASTER
DOCTORATE
ENGINEERING
OTHER
```

### Enum `cycle`

```txt
UNDERGRADUATE
GRADUATE
POSTGRADUATE
OTHER
```

---

## 5.4 Actions

```txt
Créer faculté
Créer département
Créer filière
Modifier structure
Désactiver structure
Associer responsables
Voir dossiers liés
```

---

## 5.5 Règles métier

```txt
Une filière dépend d’un département.
Un département dépend d’une faculté.
Une faculté dépend d’une institution.
Une structure désactivée ne peut plus recevoir de nouveaux dossiers.
Les anciens dossiers conservent leurs métadonnées historiques.
```

---

# 6. Écran : Configuration des workflows

## Objectif

Configurer les circuits de validation propres aux mémoires, thèses et articles.

## Layout général

```txt
Liste des workflows
Builder visuel de workflow
Panneau étapes
Panneau transitions
Panneau conditions
Simulation workflow
```

---

## 6.1 Données workflow

```txt
workflowId: uuid
name: string
documentType: enum
institutionId: uuid
description: text
isActive: boolean
version: integer
createdAt: datetime
updatedAt: datetime
```

### Enum `documentType`

```txt
MEMOIRE
THESE
ARTICLE
```

---

## 6.2 Étape workflow

Champs :

```txt
stepId: uuid
workflowId: uuid
name: string
description: text
responsibleRoleId: uuid
order: integer
isRequired: boolean
allowsCorrection: boolean
allowsDecision: boolean
triggersNotification: boolean
recommendedDelayDays: integer optional
```

---

## 6.3 Transition workflow

Champs :

```txt
transitionId: uuid
workflowId: uuid
sourceStepId: uuid
targetStepId: uuid
actionLabel: string
authorizedRoleIds: uuid[]
conditionExpression: string optional
notificationTemplateId: uuid optional
```

---

## 6.4 Actions

```txt
Créer workflow
Dupliquer workflow
Ajouter étape
Modifier étape
Ajouter transition
Supprimer transition
Activer workflow
Désactiver workflow
Tester workflow
Publier nouvelle version
```

---

## 6.5 Règles métier

```txt
Un workflow actif ne doit pas être modifié directement sans créer une nouvelle version.
Un dossier déjà soumis conserve la version de workflow utilisée au moment de sa soumission.
Un workflow doit avoir une étape initiale et une étape finale.
Les transitions critiques doivent être auditées.
```

---

# 7. Écran : Gestion des types de documents

## Objectif

Définir les types de travaux scientifiques acceptés.

## Types principaux

```txt
Mémoire
Thèse
Article
```

## Champs

```txt
documentTypeId: uuid
name: string
code: string
description: text
defaultWorkflowId: uuid
requiredMetadata: string[]
defaultVisibility: enum
requiresAcademicValidation: boolean
requiresArchiving: boolean
generatesProofAfterArchiving: boolean
isActive: boolean
```

### Enum `defaultVisibility`

```txt
PUBLIC
RESTRICTED
PRIVATE_INSTITUTIONAL
```

---

## Actions

```txt
Créer type
Modifier type
Activer / désactiver
Définir métadonnées obligatoires
Associer workflow
Configurer visibilité
```

---

## Règles métier

```txt
Les trois types principaux doivent exister par défaut.
Un type désactivé ne peut plus être choisi dans un nouveau dépôt.
Un type utilisé par des dossiers existants ne doit pas être supprimé.
```

---

# 8. Écran : Paramètres IA

## Objectif

Configurer les services IA utilisés pour extraction, résumé, classification et Assistant IA.

## Layout général

```txt
Paramètres extraction IA
Paramètres Assistant IA
Paramètres similarité
Sécurité IA
Journal IA
Tests IA
```

---

## 8.1 Extraction IA

Champs :

```txt
aiExtractionEnabled: boolean
modelProvider: string
modelName: string
supportedLanguages: string[]
maxDocumentPages: integer
confidenceThreshold: decimal
autoRetryOnFailure: boolean
fieldsToExtract: string[]
```

Champs extraits :

```txt
title
authors
abstract
keywords
scientificDomain
problemStatement
methodology
mainResults
language
themes
```

---

## 8.2 Assistant IA

Champs :

```txt
aiAssistantEnabled: boolean
allowedSourceVisibility: enum[]
maxSourcesPerAnswer: integer
requireSources: boolean
answerOnlyFromSources: boolean
storeConversationHistory: boolean
```

Règle recommandée :

```txt
requireSources = true
answerOnlyFromSources = true
```

---

## 8.3 Similarité

Champs :

```txt
keywordWeight: decimal
abstractWeight: decimal
contentWeight: decimal
domainWeight: decimal
institutionWeight: decimal
minimumSimilarityScore: decimal
```

---

## 8.4 Sécurité IA

Paramètres :

```txt
excludePrivateDocuments: boolean
maskSensitiveData: boolean
logAIQueries: boolean
allowUserFeedback: boolean
moderatePrompts: boolean
```

---

## 8.5 Actions

```txt
Tester extraction sur PDF
Tester Assistant IA
Modifier modèle
Sauvegarder paramètres
Restaurer paramètres par défaut
Voir logs IA
```

---

## Règles métier

```txt
L’Assistant IA ne doit pas utiliser des documents privés dans le portail public.
Les réponses doivent afficher les sources.
Les erreurs IA doivent être journalisées.
Une modification critique des paramètres IA doit être auditée.
```

---

# 9. Écran : Paramètres recherche et facettes

## Objectif

Configurer les champs indexés, les filtres et le comportement de recherche.

## Layout général

```txt
Champs indexés
Facettes activées
Tri
Visibilité des résultats
Réindexation
```

---

## 9.1 Champs indexés

```txt
title
abstract
keywords
authors
institution
faculty
department
program
supervisor
scientificDomain
extractedPdfText
```

---

## 9.2 Facettes activables

```txt
documentType
institution
faculty
department
program
academicYear
author
supervisor
scientificDomain
keywords
language
status
visibility
isVerifiable
hasPdf
```

---

## 9.3 Paramètres de tri

```txt
RELEVANCE
NEWEST
OLDEST
TITLE_ASC
AUTHOR_ASC
INSTITUTION_ASC
MOST_VIEWED
MOST_VERIFIED
```

---

## 9.4 Actions

```txt
Activer facette
Désactiver facette
Modifier ordre d’affichage
Lancer réindexation
Tester recherche
Voir logs indexation
```

---

## Règles métier

```txt
Les facettes publiques ne doivent pas révéler l’existence de documents privés.
La réindexation doit être lancée après modification majeure.
Les résultats doivent respecter les permissions.
```

---

# 10. Écran : Paramètres SSI / e-IDStack

## Objectif

Configurer l’intégration de la couche SSI basée sur **e-IDStack de IDS**.

## Accès

Réservé à :

```txt
Super administrateur
Responsable SI autorisé
Administrateur institutionnel autorisé
```

---

## 10.1 Configuration générale

Champs :

```txt
ssiEnabled: boolean
providerName: string = "e-IDStack de IDS"
environment: enum
serviceUrl: string
institutionIdentifier: string
apiCredentialReference: string
connectionStatus: enum
lastSyncAt: datetime
```

### Enum `environment`

```txt
TEST
STAGING
PRODUCTION
```

### Enum `connectionStatus`

```txt
CONNECTED
NOT_CONFIGURED
AUTH_ERROR
SERVICE_UNAVAILABLE
MISCONFIGURED
```

---

## 10.2 Émission de preuve

Champs :

```txt
generateProofAfterArchiving: boolean
credentialSchemaId: string
issuerDid: string optional
enableRevocation: boolean
defaultCredentialStatus: enum
```

### Enum `defaultCredentialStatus`

```txt
ACTIVE
PENDING
SUSPENDED
REVOKED
```

---

## 10.3 Données incluses dans la preuve

```txt
documentId
workTitle
author
documentType
institution
department
academicYear
finalPdfHash
archivedAt
verificationUrl
proofStatus
```

---

## 10.4 Actions

```txt
Tester connexion
Synchroniser schémas
Émettre preuve test
Vérifier preuve test
Voir erreurs
Désactiver intégration
Sauvegarder configuration
```

---

## Règles métier

```txt
La preuve ne peut être générée que pour une version finale archivée.
Le hash du PDF final doit être inclus.
La configuration e-IDStack doit être testée avant passage en production.
Les clés/API tokens ne doivent jamais être affichés en clair.
Toute modification de configuration SSI doit être auditée.
```

---

# 11. Écran : Gestion des preuves et vérifications

## Objectif

Suivre les preuves émises et les vérifications réalisées.

## Layout général

```txt
Liste des preuves
Filtres
Détail preuve
Journal vérifications
Actions preuve
```

---

## 11.1 Liste des preuves

Colonnes :

```txt
Identifiant preuve
Document
Institution
Date d’émission
Statut
Hash
Méthode
Actions
```

### Statuts

```txt
ACTIVE
REVOKED
EXPIRED
PENDING
ERROR
```

---

## 11.2 Détail preuve

Champs :

```txt
proofId
credentialId
documentId
documentHash
verificationUrl
qrCodeUrl
issuedBy
issuedAt
status
eIDStackReference
revokedAt optional
revocationReason optional
```

---

## 11.3 Actions

```txt
Voir détail
Ouvrir vérification
Copier identifiant
Télécharger QR code
Révoquer preuve
Réémettre preuve
Voir logs e-IDStack
```

---

## 11.4 Journal des vérifications

Colonnes :

```txt
Date
Identifiant preuve
Résultat
Source
Document
Adresse IP optionnelle
Pays optionnel
```

### Sources

```txt
QR_CODE
DIRECT_LINK
MANUAL_INPUT
API
```

### Résultats

```txt
AUTHENTIC
NOT_FOUND
INVALID
REVOKED
TECHNICAL_ERROR
```

---

## Règles métier

```txt
Une preuve révoquée doit apparaître comme non active.
La réémission crée une nouvelle entrée de preuve.
Les vérifications publiques ne doivent pas exposer des données privées.
Les révocations doivent être justifiées et auditées.
```

---

# 12. Écran : Statistiques et pilotage

## Objectif

Fournir une vision analytique de la production scientifique et de l’usage de la plateforme.

## Layout général

```txt
Filtres globaux
Cartes KPI
Graphiques
Tableaux analytiques
Exports
```

---

## 12.1 Filtres globaux

```txt
Institution
Faculté
Département
Type de document
Année
Domaine scientifique
Statut
Visibilité
```

---

## 12.2 KPIs

```txt
totalWorks
archivedWorks
validatedWorks
rejectedWorks
averageValidationTime
correctionRate
verificationCount
aiQueryCount
publicViews
pdfDownloads
```

---

## 12.3 Graphiques

```txt
Évolution des dépôts par mois
Répartition par type de document
Répartition par domaine
Top mots-clés
Top institutions
Temps moyen de validation
Vérifications QR par période
Utilisation Assistant IA
```

---

## 12.4 Exports

```txt
CSV
PDF
Rapport institutionnel
Rapport audit
```

---

## Règles métier

```txt
Un admin institutionnel ne voit que les statistiques de son institution.
Les données publiques doivent être agrégées.
Les exports sensibles doivent être réservés aux rôles autorisés.
```

---

# 13. Écran : Audit et journal système

## Objectif

Tracer les actions sensibles réalisées dans la plateforme.

## Layout général

```txt
Recherche
Filtres
Tableau audit
Détail événement
Export audit
```

---

## 13.1 Actions auditées

```txt
LOGIN
USER_CREATED
ROLE_CHANGED
WORKFLOW_CHANGED
PDF_UPLOADED
METADATA_UPDATED
REVIEW_ADDED
CORRECTION_CREATED
DECISION_RECORDED
DOCUMENT_ARCHIVED
PROOF_ISSUED
PROOF_REVOKED
QR_VERIFIED
AI_SETTINGS_CHANGED
SSI_SETTINGS_CHANGED
```

---

## 13.2 Champs événement

```txt
eventId
createdAt
actorId
actorRole
institutionId
actionType
module
oldValue
newValue
ipAddress
severity
status
comment
```

### Severity

```txt
INFO
IMPORTANT
SENSITIVE
CRITICAL
```

---

## 13.3 Filtres

```txt
Utilisateur
Module
Action
Date
Institution
Criticité
Résultat
```

---

## 13.4 Actions

```txt
Voir détail
Exporter audit
Copier identifiant événement
Filtrer par utilisateur
Filtrer par dossier
```

---

## Règles métier

```txt
Les logs d’audit sont en lecture seule.
Les événements critiques ne peuvent pas être supprimés.
L’export audit est réservé aux admins autorisés.
Les changements de rôles, workflows, preuves et SSI sont toujours critiques ou sensibles.
```

---

# 14. Écran : Paramètres généraux

## Objectif

Configurer les paramètres globaux de la plateforme.

## Sections

```txt
Identité plateforme
Branding
Fichiers
Notifications
Sécurité
Mentions légales
Maintenance
```

---

## 14.1 Identité plateforme

Champs :

```txt
platformName
slogan
supportEmail
defaultLanguage
timezone
```

Valeurs OpenScience Hub :

```txt
platformName = OpenScience Hub
slogan = Le hub intelligent des travaux scientifiques universitaires
```

---

## 14.2 Branding

Champs :

```txt
logoUrl
primaryColor
accentColor
backgroundColor
textColor
```

Palette officielle :

```txt
Primary Black: #050505
Academic Red: #C40012
Deep Red: #8B000B
Tech Gray: #9CA3AF
Light Silver: #E5E7EB
Pure White: #FFFFFF
```

---

## 14.3 Fichiers

Champs :

```txt
maxFileSizeMb
allowedFormats
pdfRequired
storageProvider
retentionPolicy
```

Règles :

```txt
PDF obligatoire pour dépôt principal.
Formats additionnels possibles uniquement en pièces jointes.
```

---

## 14.4 Notifications

Paramètres :

```txt
emailNotificationsEnabled
internalNotificationsEnabled
notifyOnSubmission
notifyOnCorrection
notifyOnDecision
notifyOnArchiving
notifyOnProofGeneration
```

---

## 14.5 Sécurité

Paramètres :

```txt
passwordPolicy
sessionDuration
twoFactorEnabled
loginAttemptLimit
auditRetentionDays
```

---

# 15. Écran : Profil administrateur

## Objectif

Permettre à l’administrateur de gérer son profil et ses préférences.

## Champs

```txt
fullName
email
phone
role
institution
department
photoUrl
preferredLanguage
notificationPreferences
```

## Actions

```txt
Modifier profil
Changer mot de passe
Activer double authentification
Voir sessions actives
Déconnecter autres sessions
Voir historique connexion
```

---

# Résumé opérationnel — Portail Administration

Le flux principal du Portail Administration est :

```txt
Configurer → Superviser → Sécuriser → Auditer → Piloter
```

Les écrans prioritaires sont :

```txt
1. Tableau de bord administration
2. Utilisateurs
3. Rôles & permissions
4. Institutions / structures
5. Workflows
6. Paramètres IA
7. Paramètres SSI / e-IDStack
8. Preuves & vérifications
9. Audit système
```

La règle centrale :

> Rien de critique ne doit être modifié sans traçabilité : rôles, workflows, archivage, preuves, paramètres IA et paramètres e-IDStack doivent toujours être audités.

# Synthèse finale des interfaces

OpenScience Hub repose donc sur 4 portails :

```txt
Portail Déposant
Créer, déposer, analyser, corriger, suivre, vérifier.

Portail Validation académique
Examiner, commenter, corriger, décider, archiver.

Portail Archive publique
Rechercher, filtrer, consulter, explorer avec IA, vérifier.

Portail Administration
Configurer, superviser, sécuriser, auditer, piloter.
```

La prochaine étape logique est de produire un **document complet de spécification UI/UX** ou de passer aux **wireframes textuels écran par écran** avec une structure type :

```txt
[Header]
[Sidebar]
[Main content]
[Cards]
[Tables]
[Buttons]
[States]
[Permissions]
```

C’est fait. J’ai préparé deux fichiers Markdown séparés, avec un contenu beaucoup plus lourd et exploitable :

1. **Spécification UI/UX complète** : portails, style, palette, composants, règles, permissions, états vides/chargement/erreur, détails fonctionnels.
2. **Wireframes textuels écran par écran** : structure de chaque écran, composants, disposition, couleurs, actions, états et règles UI.

Fichiers téléchargeables :

* [Spécification UI/UX complète — MD](sandbox:/mnt/data/OpenScienceHub_UIUX_Specification_complete.md)
* [Wireframes textuels complets — MD](sandbox:/mnt/data/OpenScienceHub_Textual_Wireframes_complete.md)
* [Pack ZIP complet](sandbox:/mnt/data/OpenScienceHub_UIUX_and_Wireframes_MD.zip)


