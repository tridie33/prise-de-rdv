import { Divider, FooterLayout, MentionsTypography, Spacer } from "../styles";
import React from "react";

/**
 * @description Footer component.
 * @returns {JSX.Element}
 */
export const FooterComponent = () => (
  <FooterLayout>
    <Spacer />
    <Spacer />
    <Spacer />
    <Divider />
    <MentionsTypography>
      Un outil développé par{" "}
      <a href={"https://mission-apprentissage.gitbook.io/general/"}>la mission nationale pour l'apprentissage</a>
    </MentionsTypography>
    <Spacer />
  </FooterLayout>
);
