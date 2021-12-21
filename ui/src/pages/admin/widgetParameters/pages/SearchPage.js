import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { useHistory } from "react-router";
import { Box, Button, Input, Text, useToast } from "@chakra-ui/react";

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  /**
   * @description Returns search results.
   * @param {Object} values
   * @param {Object} options
   * @param {Boolean} options.disableLoading - Disable setLoading
   * @param {String} values.keyword
   * @returns {Promise<void>}
   */
  const search = async (values, options = { disableLoading: false }) => {
    const { keyword } = values;

    setSearchKeyword(keyword);

    try {
      const keywordEncoded = encodeURIComponent(keyword);
      const catalogueResponse = await fetch(
        `/api/catalogue/formations?query={ "$or": [ { "etablissement_formateur_siret": "${keywordEncoded}" }, { "etablissement_formateur_uai": "${keywordEncoded}"}, { "id_rco_formation": "${keywordEncoded}"} ] }`
      );

      const catalogueResult = await catalogueResponse.json();

      if (!catalogueResult.formations.length) {
        toast({
          title: "Aucun établissement trouvé dans le catalogue.",
          status: "info",
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        history.push(`/admin/widget-parameters/edit/${catalogueResult.formations[0].etablissement_formateur_siret}`);
      }
    } catch (e) {
      toast({
        title: "Une erreur est survenue pendant la recherche.",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box border="1px solid #E0E5ED" bg="white" mx={40} mt={6}>
      {loading && <Button loading color="secondary" block />}
      <Text fontWeight="500" textStyle="h6" p={4} px={6} borderBottom="1px solid #E0E5ED">
        Rechercher un établissement
      </Text>
      <Box mt={5} px={6}>
        <Formik initialValues={{ keyword: searchKeyword }} onSubmit={search}>
          <Form>
            <Box>
              <Field name="keyword">
                {({ field }) => {
                  return <Input placeholder="Siret formateur / UAI / Identifiant RCO formation" {...field} />;
                }}
              </Field>
            </Box>
            <Button variant="primary" mt={3} mb={5} type={"submit"} loading={loading}>
              Rechercher
            </Button>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
};

export default SearchPage;
