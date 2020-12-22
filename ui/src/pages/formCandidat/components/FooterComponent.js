import { Divider, FooterLayout, MentionsTypography, Spacer } from "../styles";
import React from "react";

export const FooterComponent = () => {
  return (
    <FooterLayout>
      <Spacer />
      <Spacer />
      <Spacer />
      <Divider />
      <MentionsTypography>
        Un outil développé par
        <a href={"http://www.apprentissage.beta.gouv.fr"}>la mission nationale pour l'apprentissage</a> - Conditions
        générales d’utilisation
      </MentionsTypography>
      <Spacer />
    </FooterLayout>
  );
};
