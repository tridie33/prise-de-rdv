import React from "react";
import { FormHeaderComponent } from "./FormHeaderComponent";
import { Divider, InfosLayout, Spacer } from "./styles";
import { FormLayoutComponent } from "./FormLayoutComponent";

export const FormConfirmPage = () => {
  //const { id: requestId } = useParams();
  //const [data, loading] = useFetch(`api/bff/context/formConfirmPage/${requestId}`);
  const data = {
    user: {
      firstname: "Pacey",
      lastname: "Led",
      phone: "12345678",
      email: "pacey@led.com",
    },
    centre: {
      email: "contact@cfa.com",
    },
  };

  return (
    <FormLayoutComponent>
      <FormHeaderComponent title={"C'est noté !"} imagePath={"../../assets/confirm.svg"} imageAlt={"confirm"} />
      <InfosLayout>
        <p>
          Voilà une bonne chose de faite{" "}
          <strong>
            {data.user.firstname} {data.user.lastname}
          </strong>{" "}
          !
        </p>
        <p>
          Vous allez recevoir un email de confirmation à <strong>{data.user.email}.</strong>
        </p>
        <p>
          Nous essaierons de vous joindre dans les prochaines 48h au <strong>{data.user.phone}.</strong>
        </p>
        <Spacer />
        <Spacer />
        <Divider />
        <p>
          Vous souhaitez modifier ou annuler cette demande ? <br />
          Envoyez un email à <u>{data.centre.email}</u>
        </p>
        <Spacer />
      </InfosLayout>
    </FormLayoutComponent>
  );
};
