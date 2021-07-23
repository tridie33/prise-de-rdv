import { Info, InfoIcon } from "./styles";

export const InfoMessage = () => (
  <Info>
    <InfoIcon src="../../assets/info.svg" />
    <strong>Au mois d’août la plupart des centres de de formation sont en congés.</strong> Votre demande de rappel sera
    donc traitée dans les prochaines 48h ouvrées ou à la réouverture du centre de formation début septembre.
    <br />
    <br />
    Merci de votre compréhension !
  </Info>
);
