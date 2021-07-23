import React from "react";
import { useParams } from "react-router-dom";
import { FormHeaderComponent } from "./components/FormHeaderComponent";
import { Divider, InfosLayout, Spacer, Text } from "./styles";
import { FormLayoutComponent } from "./components/FormLayoutComponent";
import { useFetch } from "../../common/hooks/useFetch";
import { InfoMessage } from "./HolidayMessage";

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
              <Text>
                <span>Voilà une bonne chose de faite</span>{" "}
                <strong>
                  {data.user.firstname} {data.user.lastname}
                </strong>{" "}
                !
                <br />
                <br />
                Vous allez recevoir un email de confirmation de votre demande de rappel à{" "}
                <strong>{data.user.email}</strong>.
              </Text>
              <Spacer />
              <InfoMessage />
              <Spacer />
              <Divider />
              {data.etablissement && (
                <Text>
                  Vous souhaitez modifier ou annuler cette demande ? <br />
                  Envoyez un email à{" "}
                  <u>
                    <a href={`mailto:${data.etablissement.email}`}>{data.etablissement.email}</a>
                  </u>
                </Text>
              )}
            </InfosLayout>
          )}
        </>
      )}
    </FormLayoutComponent>
  );
};
