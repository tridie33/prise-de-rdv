import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Site } from "tabler-react";

export const SiteParentPage = () => {
  const { hostname } = useParams();
  const [domCfaId, setDomCfaId] = useState("");
  const [domCfaIdValue, setDomCfaIdValue] = useState("");

  useEffect(() => {
    if (hostname === "ps") {
      setDomCfaId("domPSCfaId");
      setDomCfaIdValue("12345");
    }
    if (hostname === "lba") {
      setDomCfaId("domLBACfaId");
      setDomCfaIdValue("67890");
    }
  }, [hostname]);

  return (
    <Site>
      <Site.Header>La Bonne Alternance / Parcoursup</Site.Header>
      <Page>
        <Page.Main>
          <Page.Content>
            <h1>Fiche de formation du CFA ID {domCfaIdValue}</h1>
            <span id={domCfaId} style={{ display: "none" }}>
              {domCfaIdValue}
            </span>
            <div id={"prdv-button"} />
          </Page.Content>
        </Page.Main>
      </Page>
    </Site>
  );
};
