import React from "react";
import { Page } from "tabler-react";

import "./DashboardPage.css";
import { useFetch } from "../../common/hooks/useFetch";
import { KpisComponent } from "./KpiContainer";
import { RequestsBoardComponent } from "./RequestsBoardComponent";

export default () => {
  const [data, loading] = useFetch("api/appointment/appointments/details?limit=500");
  const appointments = data === null ? [] : data.appointments;

  return (
    <Page>
      <Page.Main>
        <Page.Content title="Tableau de bord">
          {loading && "Chargement des données..."}
          {data && (
            <>
              <KpisComponent />
              <RequestsBoardComponent appointments={appointments} />
            </>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
