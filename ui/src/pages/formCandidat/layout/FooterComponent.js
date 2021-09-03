import { Box, Text, Link } from "@chakra-ui/react";

/**
 * @description Footer component.
 * @returns {JSX.Element}
 */
export const FooterComponent = () => (
  <Box bg="#F9F8F6" p={8}>
    <Text textAlign="center">
      {" "}
      Un outil développé par{" "}
      <Link borderBottom="1px solid #2A2A2A" href={"https://mission-apprentissage.gitbook.io/general/"}>
        beta.gouv.fr
      </Link>{" "}
      -{" "}
      <Link href={"https://mission-apprentissage.gitbook.io/general/"} borderBottom="1px solid #2A2A2A">
        Conditions générales d’utilisation
      </Link>
    </Text>
  </Box>
);
