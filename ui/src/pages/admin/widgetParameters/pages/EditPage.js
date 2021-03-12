import React, { createRef, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Card, Grid, Page, Table, Icon, Form as TablerForm } from "tabler-react";
import { toast } from "react-toastify";
import * as emailValidator from "email-validator";
import { _get, _post, _put } from "../../../../common/httpClient";
import { REFERER } from "../../../../common/constants";
import EtablissementComponent from "../components/EtablissementComponent";
import { TableRowHover } from "../../styles";

export default () => {
  const { id } = useParams();
  const [parametersResult, setParametersResult] = useState();
  const [catalogueResult, setCatalogueResult] = useState();
  const [permissions, setPermissions] = useState();
  const [loading, setLoading] = useState(false);

  /**
   * @description Get all parameters.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [catalogueResponse, parametersResponse] = await Promise.all([
          fetch(`/api/catalogue/formations?query={"etablissement_formateur_siret":"${id}"}&page=1&limit=500`),
          getParameters(id),
        ]);

        const catalogueResult = await catalogueResponse.json();

        // Create permission hashmap
        const permissions = {};
        for (const formation of catalogueResult.formations) {
          const parameter = parametersResponse.parameters.find((item) => item.formation_cfd === formation.cfd);

          permissions[formation.cfd] = Object.entries(REFERER).map(([id, name]) => {
            const referrerId = parseInt(id, 10);

            return {
              referrerId,
              name,
              cfd: formation.cfd,
              checked: parameter?.referrers.includes(referrerId) || false,
            };
          });
        }

        const formationsUniq = catalogueResult.formations.filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.etablissement_formateur_siret === v.etablissement_formateur_siret && t.cfd === v.cfd
            ) === i
        );

        setPermissions(permissions);
        setCatalogueResult({
          ...catalogueResult,
          formations: formationsUniq,
        });
        setParametersResult(parametersResponse);
      } catch (error) {
        toast.error("Une erreur est survenue durant la récupération des informations.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  /**
   * @description Returns all parameters from given sirent.
   * @param {String} id
   * @returns {Promise<*>}
   */
  const getParameters = (id) => _get(`/api/widget-parameters/parameters?query={"etablissement_siret":"${id}"}`);

  /**
   * @description Toggles checkboxes.
   * @param {Object} permission
   * @param {Number} permission.referrerId
   * @param {String} permission.name
   * @param {String} permission.cfd
   * @param {Boolean} permission.checked
   * @returns {Promise<void>}
   */
  const togglePermission = async (permission) => {
    const permissionsClone = { ...permissions };
    permissionsClone[permission.cfd] = permissionsClone[permission.cfd].map((item) => {
      if (item.referrerId === permission.referrerId) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    });

    setPermissions(permissionsClone);
  };

  /**
   * @description Inserts in database or updates.
   * @param {Object} params
   * @param {Object} params.formation
   * @param {Object} params.parameter
   * @param {String} params.email
   * @returns {Promise<void>}
   */
  const upsertParameter = async ({ formation, parameter, email }) => {
    const emailRdv = email || parameter?.email_rdv;

    if (!emailRdv) {
      toast.info("Vous devez renseigner un email.");
      return;
    }

    if (!emailValidator.validate(emailRdv)) {
      toast.error("Email non valide.");
      return;
    }

    const body = {
      etablissement_siret: formation.etablissement_formateur_siret,
      etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
      formation_intitule: formation.intitule_long,
      formation_cfd: formation.cfd,
      email_rdv: emailRdv,
      referrers: permissions[formation.cfd].filter((item) => item.checked).map((item) => item.referrerId),
    };

    // Upsert document
    if (parameter?._id) {
      await _put(`/api/widget-parameters/${parameter._id}`, body);
    } else {
      await _post(`/api/widget-parameters`, body);
    }

    // Refresh data
    const parametersResponse = await getParameters(id);
    setParametersResult(parametersResponse);

    toast.success("Configuration enregistrée avec succès.");
  };

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          {parametersResult && catalogueResult && !loading && (
            <>
              <EtablissementComponent
                raisonSociale={catalogueResult.formations[0].etablissement_formateur_entreprise_raison_sociale}
                siret={catalogueResult.formations[0].etablissement_formateur_siret}
                uai={catalogueResult.formations[0].etablissement_formateur_uai}
              />
              <Grid.Row>
                <Grid.Col>
                  <Card title="Formations">
                    <Table responsive className="card-table table-vcenter text-nowrap">
                      <Table.Header>
                        <Table.ColHeader>Intitulé</Table.ColHeader>
                        <Table.ColHeader>CFD</Table.ColHeader>
                        <Table.ColHeader>Code postal</Table.ColHeader>
                        <Table.ColHeader>Localité</Table.ColHeader>
                        <Table.ColHeader>Email</Table.ColHeader>
                        <Table.ColHeader>
                          Source <br />
                        </Table.ColHeader>
                        <Table.ColHeader>Actions</Table.ColHeader>
                      </Table.Header>
                      <Table.Body>
                        {catalogueResult.formations.map((formation) => {
                          const emailRef = createRef();
                          const parameter = parametersResult.parameters.find(
                            (item) => item.formation_cfd === formation.cfd
                          );

                          return (
                            <TableRowHover key={formation._id}>
                              <Table.Col>{formation.intitule_long}</Table.Col>
                              <Table.Col>{formation.cfd}</Table.Col>
                              <Table.Col>{formation.code_postal}</Table.Col>
                              <Table.Col>{formation.localite}</Table.Col>
                              <Table.ColHeader>
                                <input
                                  ref={emailRef}
                                  type="email"
                                  placeholder={parameter?.email_rdv || "..."}
                                  style={{ border: "solid #dee2e6 1px", padding: 5, marginRight: 10 }}
                                  className="text-lowercase"
                                />
                              </Table.ColHeader>
                              <Table.Col>
                                {permissions[formation.cfd].map((permission) => {
                                  return (
                                    <TablerForm.Checkbox
                                      key={`${formation.cfd}-${permission.referrerId}`}
                                      checked={permission.checked}
                                      label={permission.name}
                                      value={permission.referrerId}
                                      onChange={() => togglePermission(permission)}
                                    />
                                  );
                                })}
                              </Table.Col>
                              <Table.Col>
                                <Button
                                  RootComponent="a"
                                  color="primary"
                                  onClick={() =>
                                    upsertParameter({ formation, parameter, email: emailRef.current.value })
                                  }
                                >
                                  <Icon name="save" className="text-white" />
                                </Button>
                              </Table.Col>
                            </TableRowHover>
                          );
                        })}
                      </Table.Body>
                    </Table>
                  </Card>
                </Grid.Col>
              </Grid.Row>
            </>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
