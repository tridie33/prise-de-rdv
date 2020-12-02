import React from "react";
import { Page, Grid, StatsCard, Header, Table } from "tabler-react";
import "./DashboardPage.css";
import { useFetch } from "../../common/hooks/useFetch";
import RequestsList from "./RequestsList";

export default () => {
  const [data, loading] = useFetch("api/stats");

  return (
    <Page>
      <Page.Main>
        <Page.Content title="Tableau de bord">
          {loading && "Chargement des données..."}
          {data && (
            <>
              <Header.H5>Accueil admin</Header.H5>
              <Grid.Row cards={true}>
                <Grid.Col sm={4} lg={2}>
                  <StatsCard layout={1} movement={0} total={data.stats.nbItems} label="Demande candidat" />
                </Grid.Col>
              </Grid.Row>
              <RequestsList />
            </>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
