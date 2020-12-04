import { Divider, FooterLayout, MentionsTypography, Spacer } from "./styles";
import React from "react";

export const FooterComponent = () => {
  return (
    <FooterLayout>
      <Spacer />
      <Spacer />
      <Spacer />
      <Divider />
      <MentionsTypography>
        Un outil développé par <a href={"beta.gouv.fr"}>beta.gouv.fr</a> - Conditions générales d’utilisation
      </MentionsTypography>
      <Spacer />
    </FooterLayout>
  );
};
