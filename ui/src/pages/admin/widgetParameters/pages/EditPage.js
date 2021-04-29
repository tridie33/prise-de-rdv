import React, { createRef, useEffect, useState } from "react";
import _ from "lodash";
import { useParams } from "react-router";
import { Button, Card, Grid, Page, Table, Icon, Form as TablerForm } from "tabler-react";
import { toast } from "react-toastify";
import * as emailValidator from "email-validator";
import { _get, _post, _put } from "../../../../common/httpClient";
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

        const [catalogueResponse, parametersResponse, referrers] = await Promise.all([
          fetch(
            `/api/catalogue/formations?query={"etablissement_formateur_siret":"${id}", "etablissement_reference_catalogue_published": true, "published": true }&page=1&limit=500`
          ),
          getParameters(id),
          getReferrers(),
        ]);

        const catalogueResult = await catalogueResponse.json();

        let permissions = [];
        for (const formation of catalogueResult.formations) {
          const parameter = parametersResponse.parameters.find(
            (item) => item.id_rco_formation === formation.id_rco_formation
          );

          referrers.forEach((referrer) =>
            permissions.push({
              referrerId: referrer.code,
              siret: formation.etablissement_formateur_siret,
              name: referrer.full_name,
              cfd: formation.cfd,
              codePostal: formation.code_postal,
              id_rco_formation: formation.id_rco_formation,
              checked: !!parameter?.referrers
                .map((parameterReferrer) => parameterReferrer.code)
                .includes(referrer.code),
            })
          );
        }

        setPermissions(_.uniqWith(permissions, _.isEqual));
        setCatalogueResult(catalogueResult);
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
  const getParameters = (id) =>
    _get(`/api/widget-parameters/parameters?query={"etablissement_siret":"${id}"}&limit=1000`);

  /**
   * @description Returns all referrers.
   * @returns {Promise<{code: {number}, name: {string}, full_name: {string}, url: {string}[]}>}
   */
  const getReferrers = async () => {
    const { referrers } = await _get(`/api/constants`);

    return referrers;
  };

  /**
   * @description Returns permissions from criterias.
   * @param {Object[]} permissions
   * @param {String} id_rco_formation
   * @returns {Object}
   */
  const getPermissionsFromCriterias = ({ permissions, id_rco_formation }) => {
    return permissions.filter((item) => item.id_rco_formation === id_rco_formation);
  };

  /**
   * @description Toggles checkboxes.
   * @param {Object} permission
   * @param {Number} permission.referrerId
   * @param {String} permission.id_rco_formation
   * @returns {Promise<void>}
   */
  const togglePermission = ({ referrerId, id_rco_formation }) => {
    setPermissions(
      permissions.map((item) => {
        if (item.referrerId === referrerId && item.id_rco_formation === id_rco_formation) {
          return {
            ...item,
            checked: !item.checked,
          };
        }

        return item;
      })
    );
  };

  /**
   * @description Inserts in database or updates.
   * @param {Object} params
   * @param {Object} params.formation
   * @param {Object} params.parameter
   * @param {String} params.email
   * @returns {Promise<void>}
   */
  const upsertParameter = async ({ formation, parameter, email, formationPermissions }) => {
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
      code_postal: formation.code_postal,
      formation_cfd: formation.cfd,
      email_rdv: emailRdv,
      referrers: formationPermissions.filter((item) => item.checked).map((item) => item.referrerId),
      id_rco_formation: formation.id_rco_formation,
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
                        <Table.ColHeader>Id RCO</Table.ColHeader>
                        <Table.ColHeader>Id PRDV</Table.ColHeader>
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
                            (item) => item.id_rco_formation === formation.id_rco_formation
                          );

                          const formationPermissions = getPermissionsFromCriterias({
                            permissions,
                            id_rco_formation: formation.id_rco_formation,
                          });

                          return (
                            <TableRowHover key={formation._id}>
                              <Table.Col>{formation.id_rco_formation}</Table.Col>
                              <Table.Col>{parameter?._id || ""}</Table.Col>
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
                                {formationPermissions.map((permission) => (
                                  <TablerForm.Checkbox
                                    key={`${formation.cfd}-${permission.referrerId}`}
                                    checked={permission.checked}
                                    label={permission.name}
                                    value={permission.referrerId}
                                    onChange={() => togglePermission(permission)}
                                  />
                                ))}
                              </Table.Col>
                              <Table.Col>
                                <Button
                                  RootComponent="a"
                                  color="primary"
                                  onClick={() =>
                                    upsertParameter({
                                      formation,
                                      parameter,
                                      email: emailRef.current.value,
                                      formationPermissions,
                                    })
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
