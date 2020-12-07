import { ContactCFAIconsLayout, ContactCFALayout, ContactCFANameAddressLayout } from "../styles";
import React from "react";

export const ContactCentreComponent = (props) => {
  return (
    <ContactCFALayout>
      <ContactCFAIconsLayout>
        <img src={"../../assets/school.svg"} alt={"school"} />
        <img src={"../../assets/map.svg"} alt={"map"} />
      </ContactCFAIconsLayout>
      <ContactCFANameAddressLayout>
        <p>
          {props.centre && <span>Etablissement : {props.centre.entreprise_raison_sociale}</span>}
          {!props.centre && <span>Etablissement : N.C</span>}
          <br />
          {props.training && <span>Formation : {props.training.intitule}</span>}
          {!props.training && <span>Formation : N.C</span>}
        </p>
        {props.centre && (
          <span>
            {props.centre.adresse} <br />
            {props.centre.code_postal}
          </span>
        )}
      </ContactCFANameAddressLayout>
    </ContactCFALayout>
  );
};
