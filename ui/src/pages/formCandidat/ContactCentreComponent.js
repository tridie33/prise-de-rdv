import { ContactCFAIconsLayout, ContactCFALayout, ContactCFANameAddressLayout } from "./styles";
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
          {props.centre && <span>Etablissement : {props.centre.name}</span>}
          {!props.centre && <span>Etablissement : N.C</span>}
          <br />
          {props.training && <span>Formation : {props.training.name}</span>}
          {!props.training && <span>Formation : N.C</span>}
        </p>
        <span>
          2 Rue du Carbone <br />
          45100 Orléans
        </span>
      </ContactCFANameAddressLayout>
    </ContactCFALayout>
  );
};
