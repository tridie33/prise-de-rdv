import { ContactCentreTrainingContainer, ContactCentreTrainingLayout } from "../styles";
import React from "react";

export const ContactCentreComponent = (props) => {
  return (
    <ContactCentreTrainingContainer>
      <ContactCentreTrainingLayout>
        <img src={"../../assets/school.svg"} alt={"school"} />
        <p>
          {props.centre && <span>Etablissement : {props.centre.entreprise_raison_sociale}</span>}
          {!props.centre && <span>Etablissement : N.C</span>}
          <br />
          {props.training && <span>Formation : {props.training.intitule}</span>}
          {!props.training && <span>Formation : N.C</span>}
        </p>
      </ContactCentreTrainingLayout>
      <ContactCentreTrainingLayout>
        <img src={"../../assets/map.svg"} alt={"map"} />
        {props.centre && (
          <p>
            <span>{props.centre.adresse}</span> <br />
            <span>{props.centre.code_postal}</span>
          </p>
        )}
      </ContactCentreTrainingLayout>
    </ContactCentreTrainingContainer>
  );
};
