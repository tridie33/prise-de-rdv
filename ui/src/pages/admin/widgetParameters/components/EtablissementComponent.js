import { createRef } from "react";
import * as PropTypes from "prop-types";
import { Box, Text, Flex, EditablePreview, EditableInput, Editable, Button } from "@chakra-ui/react";
import { Disquette } from "../../../../theme/components/icons";

/**
 * @description Etablissement component.
 * @param {String} siret
 * @param {String} raisonSociale
 * @param {String} emailDecisionnaire
 * @param {Function} emailDecisionnaireSubmit
 * @returns {JSX.Element}
 */
const EtablissementComponent = ({ siret, raisonSociale, emailDecisionnaire, emailDecisionnaireSubmit }) => {
  const emailDecisionnaireFocusRef = createRef();
  const emailDecisionnaireRef = createRef();

  return (
    <Box bg="white" border="1px solid #E0E5ED" borderRadius="4px" mt={10}>
      <Box borderBottom="1px solid #E0E5ED">
        <Text fontSize="16px" p={5}>
          Etablissement
        </Text>
      </Box>
      <Box p={5}>
        <Flex>
          <Text textStyle="sm" fontWeight="600">
            Raison sociale <br />
            <br />
            <Text as="span" fontWeight="400">
              {raisonSociale}
            </Text>
          </Text>
          <Box ml={10}>
            <Text textStyle="sm" fontWeight="600">
              SIRET <br />
              <br />
              <Text as="span">{siret}</Text>
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Text
            textStyle="sm"
            fontWeight="600"
            mt={10}
            mb={5}
            onClick={() => emailDecisionnaireFocusRef.current.focus()}
          >
            Email gestionnaire du CFA
          </Text>
        </Flex>
        <Flex>
          <Box onClick={() => emailDecisionnaireFocusRef.current.focus()}>
            <Editable
              defaultValue={emailDecisionnaire}
              style={{
                border: "solid #dee2e6 1px",
                padding: 5,
                marginRight: 10,
                borderRadius: 4,
                minWidth: 200,
              }}
            >
              <EditablePreview ref={emailDecisionnaireFocusRef} />
              <EditableInput ref={emailDecisionnaireRef} type="email" _focus={{ border: "none" }} />
            </Editable>
          </Box>
          <Box>
            <Button
              RootComponent="a"
              variant="primary"
              onClick={() => emailDecisionnaireSubmit(siret, emailDecisionnaireRef.current.value)}
            >
              <Disquette w="16px" h="16px" />
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

EtablissementComponent.propTypes = {
  siret: PropTypes.string.isRequired,
  raisonSociale: PropTypes.string.isRequired,
  emailDecisionnaire: PropTypes.string.isRequired,
  emailDecisionnaireSubmit: PropTypes.func.isRequired,
};

export default EtablissementComponent;
