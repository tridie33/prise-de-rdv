import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Site } from "tabler-react";

export const SiteParentPage = () => {
  const { hostname } = useParams();
  const [domPSCfaId, setDomPSCfaId] = useState("");
  const [domPSCfaIdValue, setDomPSCfaIdValue] = useState("");

  useEffect(() => {
    if (hostname === "ps") {
      setDomPSCfaId("domPSCfaId");
      setDomPSCfaIdValue("12345");
    }
    if (hostname === "lba") {
      setDomPSCfaId("domLBACfaId");
      setDomPSCfaIdValue("67890");
    }
  }, [hostname]);

  return (
    <Site>
      <Site.Header>La Bonne Alternance / Parcoursup</Site.Header>
      <Page>
        <Page.Main>
          <Page.Content>
            <h1>Fiche de formation du CFA ID {domPSCfaIdValue}</h1>
            <span id={domPSCfaId} style={{ display: "none" }}>
              {domPSCfaIdValue}
            </span>
            <div id={"prdv-button"} />
          </Page.Content>
        </Page.Main>
      </Page>
    </Site>
  );
};
