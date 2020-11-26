import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Site } from "tabler-react";

export const SiteParentPage = () => {
  const { hostname } = useParams();
  const [domCentreId, setDomCentreId] = useState("");
  const [domCentreIdValue, setDomCentreIdValue] = useState("");
  const [domTrainingId, setDomTrainingId] = useState("");
  const [domTraininIdValue, setDomTrainingIdValue] = useState("");

  useEffect(() => {
    if (hostname === "ps") {
      setDomCentreId("domPSCentreId");
      setDomCentreIdValue("0831760M");
      setDomTrainingId("domPSTrainingId");
      setDomTrainingIdValue("13531545");
    }
    if (hostname === "lba") {
      setDomCentreId("domLBACentreId");
      setDomCentreIdValue("0831760M");
      setDomTrainingId("domLBATrainingId");
      setDomTrainingIdValue("13531545");
    }
  }, [hostname]);

  return (
    <Site>
      <Site.Header>La Bonne Alternance / Parcoursup</Site.Header>
      <Page>
        <Page.Main>
          <Page.Content>
            <h1>Fiche de formation du CFA ID {domCentreIdValue}</h1>
            <span id={domCentreId} style={{ display: "none" }}>
              {domCentreIdValue}
            </span>
            <span id={domTrainingId} style={{ display: "none" }}>
              {domTraininIdValue}
            </span>
            <div id={"prdv-button"} />
          </Page.Content>
        </Page.Main>
      </Page>
    </Site>
  );
};
