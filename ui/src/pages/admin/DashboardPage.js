import React from "react";
import { Page } from "tabler-react";
import "./DashboardPage.css";
import { useFetch } from "../../common/hooks/useFetch";
import { KpisComponent } from "./KpiContainer";
import { RequestsBoardComponent } from "./RequestsBoardComponent";

export default () => {
  const [data, loading] = useFetch("api/request/requests");
  const requests = data === null ? [] : data.requests;

  return (
    <Page>
      <Page.Main>
        <Page.Content title="Tableau de bord">
          {loading && "Chargement des données..."}
          {data && (
            <>
              <KpisComponent />
              <RequestsBoardComponent requests={requests} />
            </>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
