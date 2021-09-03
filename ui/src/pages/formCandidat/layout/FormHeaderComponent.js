import { Box, Text, Flex } from "@chakra-ui/react";
import { MessageLogo, IconeLogo } from "../../../theme/components/icons";

export const FormHeaderComponent = () => {
  return (
    <Box bg="#F9F8F6">
      <Flex alignItems="center" flexDirection={["column", "column", "row"]}>
        <Box flex="1" ml={["0", "0", "10rem"]}>
          <Flex flexDirection={["column", "column", "row"]} mt={[7, 0, 0]}>
            <MessageLogo w="48px" h="48px" mx="auto" />
            <Text textStyle="h2" color="grey.700" textAlign={["center", "center", "unset"]} ml={3}>
              Le centre de formation <br />
              <Text textStyle="h2" as="span" color="info">
                vous rappelle !
              </Text>
            </Text>
          </Flex>
        </Box>
        <Box mr="5rem" mt={8}>
          <IconeLogo w={["0px", "0px", "240px"]} h={["0px", "0px", "196.4px"]} />
        </Box>
      </Flex>
    </Box>
  );
};
