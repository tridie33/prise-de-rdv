import React from "react";
import { Page, Site } from "tabler-react";

export const SiteParentPage = () => {
  const cfaID = "12345";

  return (
    <Site>
      <Site.Header>La Bonne Alternance / Parcoursup</Site.Header>
      <Page>
        <Page.Main>
          <Page.Content>
            <h1>Fiche de formation du CFA ID {cfaID}</h1>
            <span id={"cfaId"} style={{ display: "none" }}>
              {cfaID}
            </span>
            <div id={"prdv-button"} />
          </Page.Content>
        </Page.Main>
      </Page>
    </Site>
  );
};
