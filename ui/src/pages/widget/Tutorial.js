import { useEffect } from "react";
import { Box, Button, Center, Code, Container, Text } from "@chakra-ui/react";
import GovernmentHeader from "../../common/components/GovernmentHeader";
import GovernmentFooter from "../../common/components/GovernmentFooter";

/**
 * @description WidgetTutorial page.
 * @returns {JSX.Element}
 */
const WidgetTutorial = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://rdv-cfa.apprentissage.beta.gouv.fr/assets/widget.min.js";
    script.onload = () => window.initPrdvWidget();
    document.head.appendChild(script);
  }, []);

  return (
    <Box fontFamily="Marianne">
      <GovernmentHeader />
      <Container border="1px solid #000091" mt={24} maxW="996px" pl={20} pr={24} py={20} mb={0}>
        <>
          <Box pl={2}>
            <Text textStyle="h1" fontWeight="bold" color="grey.800">
              Exemple d'intégration du Widget RDV Apprentissage"
            </Text>
            <Text mt={9}>
              Pour intégrer le widget "RDV Apprentissage" sur votre site internet, il vous suffit de suivre les étapes
              suivantes:
            </Text>
          </Box>
          <Box pl={2} mt={8}>
            <Text textStyle="h4" fontWeight="bold" color="grey.800">
              Etape 1 :
            </Text>
            <Text mt={3}>
              Insérez le script ci-dessous dans la balise <Code>{"<Head>"}</Code>
            </Text>
            <Code p={2} mt={4}>
              {'<script src="https://rdv-cfa.apprentissage.beta.gouv.fr/assets/widget.min.js"></script>'}
            </Code>
          </Box>
          <Box pl={2} mt={8}>
            <Text textStyle="h4" fontWeight="bold" color="grey.800">
              Etape 2 :
            </Text>
            <Text mt={3}>
              Insérez la balise ci-dessous avec l'attribut <Code>id-rco-formation</Code> correspondant à la formation à
              afficher et insérez l'attribut <Code>referrer</Code> correspondant à votre plateforme de diffusion.
            </Text>
            <Code p={2} mt={4}>
              {
                '<div class="widget-prdv" data-id-rco-formation="15_554095|15_1117617|106339" data-referrer="lba"></div>'
              }
            </Code>
          </Box>

          <Box pl={2} mt={8}>
            <Text textStyle="h4" fontWeight="bold" color="grey.800">
              Etape 3 :
            </Text>
            <Text mt={3}>Déclenchez l'apparition des widgets</Text>
            <Code p={2} mt={4}>
              window.initPrdvWidget()
            </Code>
          </Box>
          <Box pl={2} mt={12}>
            <Center>
              <Text textStyle="h4" fontWeight="bold" color="grey.800">
                Exemple d'affichage d'un widget 🎉
              </Text>
            </Center>
          </Box>
          <Box textAlign={"center"} mt={12} mb={14}>
            <Button variant="beta" onClick={() => document.querySelector("div.widget-prdv > a").click()}>
              <div className="widget-prdv" data-id-rco-formation="15_554095|15_1117617|106339" data-referrer="lba" />
            </Button>
          </Box>
        </>
      </Container>
      <GovernmentFooter />
    </Box>
  );
};

export default WidgetTutorial;
