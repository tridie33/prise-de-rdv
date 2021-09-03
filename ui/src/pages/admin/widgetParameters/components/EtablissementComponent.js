import * as PropTypes from "prop-types";
import { Box, Text, Flex } from "@chakra-ui/react";

/**
 * @description Etablissement component.
 * @param {String} siret
 * @param {String} raisonSociale
 * @param {String} uai
 * @returns {JSX.Element}
 */
const EtablissementComponent = ({ siret, raisonSociale, uai }) => {
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
        <Text textStyle="sm" fontWeight="600" mt={10}>
          UAI
        </Text>
        <Text mt={5} mb={5}>
          {uai}
        </Text>
      </Box>
    </Box>
  );
};

EtablissementComponent.propTypes = {
  siret: PropTypes.string,
  raisonSociale: PropTypes.string,
  uai: PropTypes.string,
};

export default EtablissementComponent;
