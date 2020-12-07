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
  const [data, loading] = useFetch("api/bff/stats");

  return (
    <>
      <Header.H5>Chiffres clés</Header.H5>
      <Grid.Row cards={true}>
        {loading && "Chargement des données..."}
        {data && <KpiNumber total={data.stats.nbItems} label={data.stats.nbItems > 1 ? "Demandes" : "Demande"} />}
      </Grid.Row>
    </>
  );
};
