#Specifications techniques sur les modèles de données

Jeune :
- "nom" -> lastname
- "prénom" -> firstname
- "téléphone" (mobile) -> phone
- "email" -> email

Demande :
- "REFERER_Depuis_quel_site" -> referer
- jeune ->
- date de création -> createdAt
- motivations -> motivations
- Date de réponse CFA -> responseCentreAt
- jeune_contacter_par_cfa: false | true -> statusCandidatIsContactedByCentre
- Etat de la demande: text -> statusRequest
- bonne_reception_mail_cfa: false | true (suite au succès / erreur suite à l’envoie de mails) -> statusMailIsReceivedByCentre
- bonne_reception_mail_jeune: false | true (suite au succès / erreur suite à l’envoie de mails) -> statusMailIsReceivedByCandidat
- ouverture_mail_jeune -> statusMailIsOpenedByCandidat

Questions non urgentes: les trois points suivants sont sensiblement les mêmes non ?
- Etat de la demande (ouvert / close) (le jeune et le CFA ont bien échangé) -> informations redondants avec Date de réponse CFA non ?
- jeune_contacter_par_cfa: false | true --> même question 
- Etat de … (cas 1 / cas 2 cf spécifications fonctionnelles V0)
- Comment calcule t-on le numéro de la demande ? Par incrémentation pour l'instant ?
- Ce qui est stocké dans REFERER est-ce l'url du site parent ou simplement le nom du site parent ?

Plus tard :
- Date de rdv (plus tard)
- Mode de prise de rdv  (plus tard) (formulaire de recontacte / agenda …)


Normaliser --> une référence du parent chez l'enfant; Bonne chose quand le parent est amené à être mise à jour
Denormaliser --> toute la structure du parent chez l'enfant; Bonne chose quand c'est pour que du READ par la suite autrement dit
quand pas de mise à jour chez le parent.
