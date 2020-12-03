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
  const [data, loading] = useFetch("api/stats");

  return (
    <>
      <Header.H5>Chiffres clés</Header.H5>
      <Grid.Row cards={true}>
        {loading && "Chargement des données..."}
        {data && <KpiNumber total={data.stats.nbItems} label={data.stats.nbItems > 1 ? "Demandes" : "Demande"} />}
        <KpiNumber total={42} label={"Candidats uniques"} />
        <KpiNumber total={30} label={"Prises de contact"} />
        <KpiNumber total={30} label={"Ouvertures Candidat"} />
        <KpiNumber total={37} label={"Ouvertures CFA"} />
      </Grid.Row>
    </>
  );
};
