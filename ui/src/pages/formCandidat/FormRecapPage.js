import React from "react";
import { useParams } from "react-router-dom";
import { FormHeaderComponent } from "./components/FormHeaderComponent";
import { Divider, InfosLayout, Spacer } from "./styles";
import { FormLayoutComponent } from "./components/FormLayoutComponent";
import { useFetch } from "../../common/hooks/useFetch";

export const FormRecapPage = () => {
  const { id: appointmentId } = useParams();
  const [data, loading] = useFetch(`/api/appointment-request/context/recap?appointmentId=${appointmentId}`);

  return (
    <FormLayoutComponent>
      <FormHeaderComponent title={"C'est noté !"} imagePath={"../../assets/confirm.svg"} imageAlt={"confirm"} />
      {loading && <span>Chargement des données...</span>}
      {data && (
        <>
          {data.user && (
            <InfosLayout>
              <p>
                <span>Voilà une bonne chose de faite</span>{" "}
                <strong>
                  {data.user.firstname} {data.user.lastname}
                </strong>{" "}
                !
              </p>
              <p>
                Vous allez recevoir un email de confirmation à <strong>{data.user.email}.</strong>
              </p>
              <p>
                Le CFA essaiera de vous joindre dans les prochaines 48h au <strong>{data.user.phone}.</strong>
              </p>
              <Spacer />
              <Spacer />
              <Divider />
              {data.etablissement && (
                <p>
                  Vous souhaitez modifier ou annuler cette demande ? <br />
                  Envoyez un email à{" "}
                  <u>
                    <a href={`mailto:${data.etablissement.email}`}>{data.etablissement.email}</a>
                  </u>
                </p>
              )}
              <p align="center">
                <i>Vous pouvez fermer cette fenêtre pour revenir sur {data.appointment.referrer.full_name}.</i>
              </p>
            </InfosLayout>
          )}
        </>
      )}
    </FormLayoutComponent>
  );
};
