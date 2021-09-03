import { Text, Alert, Box } from "@chakra-ui/react";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <Box>
      <Alert display="block" colorScheme="#FBF3CF" w="81%" mt={6} mx="auto">
        <Text textStyle="h2" color="#7D6608" fontWeight="600">
          Apprentissage - Prise de rendez-vous CFA
        </Text>
        <Text color="#7D6608" mt={2}>
          Page d'accueil utilisateur.
        </Text>
      </Alert>
    </Box>
  );
};
