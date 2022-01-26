import { useEffect, useState } from "react";
import { Box, Container, Flex, Text, Button } from "@chakra-ui/react";
import { useParams } from "react-router";
import GovernmentHeader from "../common/components/GovernmentHeader";
import GovernmentFooter from "../common/components/GovernmentFooter";
import { SuccessCircle, InfoCircleFilled } from "../theme/components/icons";
import { _get, _post } from "../common/httpClient";

/**
 * @description Premium form component.
 * @returns {JSX.Element}
 */
const PremiumForm = () => {
  const { id } = useParams();
  const [hasRefused, setHasRefused] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [etablissement, setEtablissement] = useState();

  /**
   * @description Accept terms.
   * @returns {Promise<void>}
   */
  const accept = async () => {
    await _post(`/api/etablissements/${id}/premium/accept`);
    window.scrollTo(0, 0);
    setHasAccepted(true);
  };

  /**
   * @description Refuse invite.
   * @returns {Promise<void>}
   */
  const refuse = async () => {
    await _post(`/api/etablissements/${id}/premium/refuse`);
    window.scrollTo(0, 0);
    setHasRefused(true);
  };

  useEffect(async () => {
    const etablissement = await _get(`/api/etablissements/${id}`);

    if (etablissement.premium_refused_at) {
      setHasRefused(true);
    }

    if (etablissement.premium_activated_at) {
      setHasAccepted(true);
    }

    setEtablissement(etablissement);
  }, [id]);

  if (!etablissement) {
    return null;
  }

  return (
    <Box fontFamily="Marianne">
      <GovernmentHeader />
      <Container
        border="1px solid #000091"
        mt={24}
        maxW="996px"
        pl={20}
        pr={24}
        py={20}
        mb={hasRefused || hasAccepted ? "400px" : "0"}
      >
        {(hasRefused || hasAccepted) && (
          <Flex>
            <Box w="40px">
              <SuccessCircle width={33} fillHexaColor="#000091" />
            </Box>
            <Box w="100%">
              <Text textStyle="h3" fontSize="24px" fontWeight="bold" color="grey.800" ml={2}>
                Votre choix a bien été pris en compte.
              </Text>
            </Box>
          </Flex>
        )}
        {!hasRefused && !hasAccepted && (
          <>
            <Box>
              <Text textStyle="h3" fontSize="24px" fontWeight="bold" color="grey.800">
                Activation du service “RDV Apprentissage” sur Parcoursup
              </Text>
            </Box>
            <Text fontWeight="700" mt={5}>
              Afin de bénéficier de la parution du service RDV Apprentissage, je m'engage auprès de Parcoursup à
            </Text>
            <Text fontWeight="700" mt={5}>
              <Box float="left" pt={1} pr={3}>
                <SuccessCircle width={16} fillHexaColor="#00AC8C" />
              </Box>{" "}
              Contacter tous les candidats qui feront une demande sur cette plateforme
            </Text>
            <Text fontWeight="700">
              <Box float="left" pt={1} pr={3}>
                <SuccessCircle width={16} fillHexaColor="#00AC8C" />
              </Box>{" "}
              En appelant chaque candidat ou en lui envoyant un e-mail
            </Text>
            <Text fontWeight="700">
              <Box float="left" pt={1} pr={3}>
                <SuccessCircle width={16} fillHexaColor="#00AC8C" />
              </Box>{" "}
              Dans un délais de 4 jours ouvrés après réception de la demande par e-mail
            </Text>
            <Text mt={6}>
              Je prends acte du fait que la Mission interministérielle pour l’apprentissage pourra prendre toutes les
              mesures utiles pour mesurer le fait que cet engagement soit tenu (dont enquêtes en ligne ou orale auprès
              des candidats et des CFA).
            </Text>
            <Text mt={6}>
              En cas de non-respect de mon engagement, je bénéficierai d’un avertissement m’invitant à remédier à cette
              défaillance puis d’une éventuelle suspension du service.
            </Text>
            <Button mt={5} mr={6} variant="beta" onClick={accept}>
              J’accepte les conditions
            </Button>
            <Button mt={5} variant="beta" onClick={refuse}>
              Non je suis pas prêt
            </Button>
            <Flex borderColor="pinksoft.400" borderLeftWidth="4px" mt={65} bg="grey.100" py={2}>
              <Text>
                <Box float="left" pt={1} pr={3} pl={3}>
                  <InfoCircleFilled width={6} fillHexaColor="#FF8D7E" />
                </Box>{" "}
                Cette action n’aura aucun impact sur le référencement de vos formations dans Parcoursup
              </Text>
            </Flex>
            <Box mt={14} mb={20}>
              <Text mt="-7px">
                Le service sera activé sur toutes les formations référencés dans Parcoursup de l’organisme suivant :
              </Text>
              <Box bg="#E5E5E5" px={10} py={6} mt={3} lineHeight="38px" w="100%">
                <Text>
                  Raison sociale :{" "}
                  <Text as="span" fontWeight="700">
                    {etablissement.raison_sociale}
                  </Text>
                </Text>
                <Text>
                  SIRET :{" "}
                  <Text as="span" fontWeight="700">
                    {etablissement.siret_formateur}
                  </Text>
                </Text>
                <Text>
                  Adresse :{" "}
                  <Text as="span" fontWeight="700">
                    {etablissement.adresse}
                  </Text>
                </Text>
                <Text>
                  Code postal :{" "}
                  <Text as="span" fontWeight="700">
                    {etablissement.code_postal}
                  </Text>
                </Text>
                <Text>
                  Ville :{" "}
                  <Text as="span" fontWeight="700">
                    {etablissement.localite}
                  </Text>
                </Text>
              </Box>
            </Box>
          </>
        )}
      </Container>
      <GovernmentFooter />
    </Box>
  );
};

export default PremiumForm;
