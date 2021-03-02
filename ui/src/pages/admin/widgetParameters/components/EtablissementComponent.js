import React from "react";
import { Grid, ContactCard } from "tabler-react";
import * as PropTypes from "prop-types";

/**
 * @description Etablissement component.
 * @param {String} siret
 * @param {String} raisonSociale
 * @param {String} uai
 * @returns {JSX.Element}
 */
const EtablissementComponent = ({ siret, raisonSociale, uai }) => {
  return (
    <Grid.Row>
      <Grid.Col>
        <ContactCard
          cardTitle="Etablissement"
          rounded
          details={[
            {
              title: "Raison sociale",
              content: <p className="mb-5">{raisonSociale}</p>,
            },
            { title: "SIRET", content: <p className="mb-5">{siret}</p> },
            { title: "UAI", content: <p className="mb-5">{uai}</p> },
          ]}
        />
      </Grid.Col>
    </Grid.Row>
  );
};

EtablissementComponent.propTypes = {
  siret: PropTypes.string,
  raisonSociale: PropTypes.string,
  uai: PropTypes.string,
};

export default EtablissementComponent;
