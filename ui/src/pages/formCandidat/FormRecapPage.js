import { useParams } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";
import { FormLayoutComponent } from "./layout/FormLayoutComponent";
import { useFetch } from "../../common/hooks/useFetch";

export const FormRecapPage = () => {
  const { id: appointmentId } = useParams();
  const [data, loading] = useFetch(`/api/appointment-request/context/recap?appointmentId=${appointmentId}`);

  return (
    <FormLayoutComponent>
      {loading && <span>Chargement des données...</span>}
      {data && (
        <>
          {data.user && (
            <Box mt={10}>
              <Text as="span" color="info" textStyle="h6">
                Voilà une bonne chose de faite {data.user.firstname} {data.user.lastname}!
              </Text>
              <Text fontWeight="700" mt={6}>
                {" "}
                {data.etablissement.etablissement_formateur_entreprise_raison_sociale} essaiera de vous joindre dans les
                prochaines 48h au{" "}
                <Text as="span" color="info">
                  {" "}
                  {data.user.phone}
                </Text>{" "}
                pour répondre à vos questions.
              </Text>
              <Text mt={10}>Vous allez recevoir un email de confirmation de votre demande de rappel </Text>
              <Text>
                à{" "}
                <Text as="span" color="info">
                  {data.user.email}
                </Text>
              </Text>
              <Box borderBottom="1px solid #D0C9C4" mt={10} />
              <Box mt={10}>
                {data.etablissement && (
                  <Text>
                    Vous souhaitez modifier ou annuler cette demande ? <br />
                    Envoyez un email à{" "}
                    <u>
                      <a href={`mailto:${data.etablissement.email}`}>{data.etablissement.email}</a>
                    </u>
                  </Text>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </FormLayoutComponent>
  );
};
