import React from "react";
import { useParams } from "react-router-dom";
import { Page, Site } from "tabler-react";

export const SiteParentPage = () => {
  const { hostname } = useParams();
  const siteName = hostname === "lba" ? "La Bonne Alternance" : "Parcoursup";

  return (
    <Site>
      <Site.Header>Bienvenue sur {siteName}</Site.Header>
      <Page>
        <Page.Main>
          <Page.Content>
            <h1>Fiche de formation du CFA ID 0831760M</h1>
            Bonjour je m'appelle Paul KRIS
            <div
              className={"widget-prdv"}
              data-prdv-centre={"0831760M"}
              data-prdv-training={"13531545"}
              data-prdv-sitename={"La Bonne Alternance"}
              data-prdv-candidat-firstname={"Paul"}
              data-prdv-candidat-lastname={"KRIS"}
            />
            <br />
            Bonjour je m'appelle Louna DIR
            <div
              className={"widget-prdv"}
              data-prdv-centre={"0831760M"}
              data-prdv-training={"13531545"}
              data-prdv-candidat-firstname={"Louna"}
              data-prdv-candidat-lastname={"DIR"}
            />
          </Page.Content>
        </Page.Main>
      </Page>
    </Site>
  );
};
