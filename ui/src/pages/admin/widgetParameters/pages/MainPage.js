import React, { useEffect, useState } from "react";
import { Button, Card, Grid, Page, Table, Icon, Tag } from "tabler-react";
import { toast } from "react-toastify";
import { _get } from "../../../../common/httpClient";
import { REFERER } from "../constants";

export default () => {
  const [parametersResult, setParametersResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * @description Get all parameters.
   */
  useEffect(() => {
    async function fetchParameters() {
      try {
        setLoading(true);
        const response = await _get("/api/widget-parameters/parameters");

        setParametersResult(response);
      } catch (e) {
        toast.error("Une erreur est survenue durant la récupération des informations.");
      } finally {
        setLoading(false);
      }
    }

    fetchParameters();
  }, []);

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          {loading && <Button loading color="secondary" block />}
          {parametersResult && !loading && (
            <Grid.Row>
              <Grid.Col>
                <Card title="Paramètres">
                  <Table responsive className="card-table table-vcenter text-nowrap">
                    <Table.Header>
                      <Table.ColHeader>Siret</Table.ColHeader>
                      <Table.ColHeader>Raison sociale</Table.ColHeader>
                      <Table.ColHeader>Intitule</Table.ColHeader>
                      <Table.ColHeader>CFD</Table.ColHeader>
                      <Table.ColHeader>Email</Table.ColHeader>
                      <Table.ColHeader>Widget actif</Table.ColHeader>
                      <Table.ColHeader>Action</Table.ColHeader>
                    </Table.Header>
                    <Table.Body>
                      {parametersResult.parameters.map((parameter) => (
                        <Table.Row key={parameter._id}>
                          <Table.Col>{parameter.etablissement_siret}</Table.Col>
                          <Table.Col>{parameter.etablissement_raison_sociale}</Table.Col>
                          <Table.Col>{parameter.formation_intitule}</Table.Col>
                          <Table.Col>{parameter.formation_cfd}</Table.Col>
                          <Table.Col>{parameter.email_rdv.toLowerCase()}</Table.Col>
                          <Table.Col>
                            <Tag.List>
                              {parameter.referrers.sort().map((refererId) => (
                                <Tag key={refererId}>{REFERER[refererId]}</Tag>
                              ))}
                            </Tag.List>
                          </Table.Col>
                          <Table.Col>
                            <Button
                              color="primary"
                              RootComponent="a"
                              href={`/admin/widget-parameters/edit/${parameter.etablissement_siret}`}
                            >
                              <Icon name="edit" />
                            </Button>
                          </Table.Col>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Card>
              </Grid.Col>
            </Grid.Row>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
