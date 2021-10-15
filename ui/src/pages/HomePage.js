import { Text, Alert, Box } from "@chakra-ui/react";

/**
 * @description HomePage component.
 * @returns {JSX.Element}
 */
const HomePage = () => {
  return (
    <Box>
      <Alert display="block" colorScheme="#FBF3CF" w="81%" mt={6} mx="auto">
        <Text textStyle="h2" color="#7D6608" fontWeight="600">
          Espace administration
        </Text>
        <Text color="#7D6608" mt={2}>
          Vous devez être authentifié afin de pouvoir poursuivre.
        </Text>
      </Alert>
    </Box>
  );
};

export default HomePage;
