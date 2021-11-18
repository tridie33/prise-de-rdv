import { Box, Text, Flex } from "@chakra-ui/react";
import { IconeLogo } from "../../../theme/components/icons";

/**
 * @description Form header component.
 * @returns {JSX.Element}
 */
export const FormHeaderComponent = () => {
  return (
    <Box bg="#F9F8F6">
      <Flex alignItems="center" flexDirection={["column", "column", "row"]}>
        <Box flex="1" ml={["0", "0", "6em"]}>
          <Flex flexDirection={["column", "column", "row"]} mt={[7, 0, 0]}>
            <Text textStyle="h2" color="info">
              Envoyer <br />
              une demande de contact <br />
              <Text textStyle="h2" as="span" color="grey.700">
                au centre de formation
              </Text>
            </Text>
          </Flex>
        </Box>
        <Box mr="2rem" mt={8}>
          <IconeLogo w={["0px", "0px", "300px"]} h={["0px", "0px", "174px"]} />
        </Box>
      </Flex>
    </Box>
  );
};
