import React from "react";
import { ContactCentreTrainingContainer, ContactCentreTrainingLayout } from "../styles";

/**
 * @description Etablissement information.
 * @param {Object} props
 * @param {String} props.entreprise_raison_sociale
 * @param {String} props.intitule
 * @param {String} props.adresse
 * @param {String} props.code_postal
 * @param {String} props.ville
 * @returns {JSX.Element}
 */
export const ContactCentreComponent = (props) => {
  const { adresse, codePostal, entrepriseRaisonSociale, intitule, ville } = props;
  return (
    <ContactCentreTrainingContainer>
      <ContactCentreTrainingLayout>
        <img src={"../../assets/school.svg"} alt={"school"} />
        <p>
          <span>Etablissement : {entrepriseRaisonSociale || "N.C"}</span>
          <br />
          <span>Formation : {intitule || "N.C"}</span>
        </p>
      </ContactCentreTrainingLayout>
      <ContactCentreTrainingLayout>
        <img src={"../../assets/map.svg"} alt={"map"} />
        {adresse && codePostal && (
          <p>
            <span>{adresse}</span> <br />
            <span>
              {codePostal} {ville}
            </span>
          </p>
        )}
      </ContactCentreTrainingLayout>
    </ContactCentreTrainingContainer>
  );
};
