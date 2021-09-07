import { Box, Text, Link } from "@chakra-ui/react";

/**
 * @description Footer component.
 * @returns {JSX.Element}
 */
export const FooterComponent = () => (
  <Box bg="#F9F8F6" p={8}>
    <Link borderBottom="1px solid #2A2A2A" href="https://mission-apprentissage.gitbook.io/general/">
      <Text textAlign="center"> Un outil développé par la Mission interministérielle pour l’apprentissage</Text>
    </Link>
  </Box>
);
