import React, { useState } from "react";
import { Button, Card, Grid, Page, Form as TablerForm } from "tabler-react";
import { Field, Form, Formik } from "formik";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

export default () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
      const catalogueResponse = await fetch(
        `https://catalogue-recette.apprentissage.beta.gouv.fr/api/v1/entity/formations2021?query={ "$or": [ { "etablissement_formateur_siret": "${keyword}" }, { "etablissement_formateur_uai": "${keyword}"} ] }`
      );

      const catalogueResult = await catalogueResponse.json();

      if (!catalogueResult.formations.length) {
        toast.info("Aucun établissement trouvé dans le catalogue.");
      } else {
        history.push(`/admin/widget-parameters/edit/${catalogueResult.formations[0].etablissement_formateur_siret}`);
      }
    } catch (e) {
      toast.error("Une erreur est survenue pendant la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          {loading && <Button loading color="secondary" block />}
          <Grid.Row>
            <Grid.Col>
              <Card>
                <Card.Header>
                  <Card.Title>Rechercher un établissement</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Formik initialValues={{ keyword: searchKeyword }} onSubmit={search}>
                    <Form>
                      <TablerForm.Group label="Siret ou UAI">
                        <Field name="keyword">
                          {({ field, meta }) => {
                            return <TablerForm.Input placeholder="..." {...field} />;
                          }}
                        </Field>
                      </TablerForm.Group>
                      <Button color="primary" className="text-left" type={"submit"} loading={loading}>
                        Rechercher
                      </Button>
                    </Form>
                  </Formik>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
