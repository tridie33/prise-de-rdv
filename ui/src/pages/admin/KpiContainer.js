import { Grid, Header, StatsCard } from "tabler-react";
import React from "react";
import { useFetch } from "../../common/hooks/useFetch";

const KpiNumber = (props) => {
  return (
    <Grid.Col sm={4} lg={2}>
      <StatsCard layout={1} movement={0} total={props.total} label={props.label} />
    </Grid.Col>
  );
};

export const KpisComponent = () => {
  const [appointmentsCount, loading] = useFetch("/api/appointment/appointments/count");
  const [parametersCount] = useFetch("/api/widget-parameters/parameters/count");

  return (
    <>
      <Header.H5>Chiffres clés</Header.H5>
      <Grid.Row cards={true}>
        {loading && "Chargement des données..."}
        {appointmentsCount && (
          <KpiNumber
            total={appointmentsCount.total}
            label={appointmentsCount.total > 1 ? "Demandes de RDV" : "Demande de RDV"}
          />
        )}
        {parametersCount && (
          <KpiNumber total={parametersCount.total} label={parametersCount.total > 1 ? "Paramétrages" : "Paramétrage"} />
        )}
      </Grid.Row>
    </>
  );
};
