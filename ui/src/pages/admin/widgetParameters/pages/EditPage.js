import { createRef, useEffect, useState } from "react";
import _ from "lodash";
import { useParams } from "react-router";
import * as emailValidator from "email-validator";
import {
  Tbody,
  Button,
  Tr,
  Thead,
  Td,
  Checkbox,
  Table,
  Flex,
  Box,
  Text,
  useToast,
  Spinner,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import { _get, _post, _put } from "../../../../common/httpClient";
import EtablissementComponent from "../components/EtablissementComponent";
import downloadFile from "../../../../common/utils/downloadFile";
import { Check, Disquette, Download } from "../../../../theme/components/icons";

const EditPage = () => {
  const { id } = useParams();
  const [parametersResult, setParametersResult] = useState();
  const [catalogueResult, setCatalogueResult] = useState();
  const [permissions, setPermissions] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * @description Fetch initial data.
   * @return {Promise<void>}
   */
  const fetchData = async () => {
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
            checked: !!parameter?.referrers.map((parameterReferrer) => parameterReferrer.code).includes(referrer.code),
          })
        );
      }

      setPermissions(_.uniqWith(permissions, _.isEqual));
      setCatalogueResult(catalogueResult);
      setParametersResult(parametersResponse);
    } catch (error) {
      toast({
        title: "Une erreur est survenue durant la récupération des informations.",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Get all parameters.
   */
  useEffect(() => {
    fetchData();
  }, [id, toast]);

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
   * @description Submits "email decisionnaire".
   * @param {string} siret
   * @param {string|null} emailDecisionnaireInput
   * @return {Promise<void>}
   */
  const submitEmailDecisionnaire = async (siret, emailDecisionnaireInput) => {
    if (emailDecisionnaireInput && !emailValidator.validate(emailDecisionnaireInput)) {
      toast({
        title: "Email décisionnaire non valide.",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });

      return;
    }

    await _put("/api/widget-parameters/email-decisionnaire", {
      etablissement_siret: siret,
      email_decisionnaire: emailDecisionnaireInput,
    });

    // Refresh data
    const parametersResponse = await getParameters(id);
    setParametersResult(parametersResponse);
    toast({
      title: "Configuration enregistrée avec succès.",
      status: "success",
      isClosable: true,
      position: "bottom-right",
    });
  };

  /**
   * @description Returns "email gestionnaire" from parameters.
   * @param {Object} parameters
   * @return {null|string}
   */
  const getEmailGestionnaire = (parameters) => {
    const parameterFound = parameters.find((parameter) => parameter.email_decisionnaire);

    return parameterFound ? parameterFound.email_decisionnaire : null;
  };

  /**
   * @description Inserts in database or updates.
   * @param {Object} params
   * @param {Object} params.formation
   * @param {Object} params.parameter
   * @param {String} params.emailRdv
   * @returns {Promise<void>}
   */
  const upsertParameter = async ({ formation, parameter, emailRdv, formationPermissions }) => {
    if (emailRdv && !emailValidator.validate(emailRdv)) {
      toast({
        title: "Email de contact non valide.",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });

      return;
    }

    const body = {
      etablissement_siret: formation.etablissement_formateur_siret,
      etablissement_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
      formation_intitule: formation.intitule_long,
      code_postal: formation.code_postal,
      formation_cfd: formation.cfd,
      email_rdv: emailRdv || null,
      email_decisionnaire: parameter?.email_decisionnaire || null,
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
    toast({
      title: "Configuration enregistrée avec succès.",
      status: "success",
      isClosable: true,
      position: "bottom-right",
    });
  };

  /**
   * @description Downloads CSV file.
   * @param {string} siret
   * @returns {Promise<void>}
   */
  const download = (siret) =>
    downloadFile(
      `/api/widget-parameters/parameters/export?query={"etablissement_siret":"${siret}"}`,
      `parametres-${siret}.csv`
    );
  if (!parametersResult && !catalogueResult) {
    return <Spinner display="block" mx="auto" mt="10rem" />;
  }
  return (
    <Box mx={["1rem", "1rem", "10rem", "10rem"]}>
      {parametersResult && catalogueResult && !loading && (
        <>
          <EtablissementComponent
            raisonSociale={catalogueResult.formations[0].etablissement_formateur_entreprise_raison_sociale}
            siret={catalogueResult.formations[0].etablissement_formateur_siret}
            emailDecisionnaire={getEmailGestionnaire(parametersResult.parameters)}
            emailDecisionnaireSubmit={submitEmailDecisionnaire}
          />
          <Flex bg="white" mt={10} border="1px solid #E0E5ED" borderRadius="4px" borderBottom="none">
            <Text flex="1" fontSize="16px" p={5}>
              Formations
            </Text>
            <Download
              onClick={() => download(catalogueResult.formations[0].etablissement_formateur_siret)}
              color="#9AA0AC"
              cursor="pointer"
              w="16px"
              h="16px"
              mt={6}
              mr={5}
            />
          </Flex>
          <Box border="1px solid #E0E5ED" overflow="auto" cursor="pointer">
            <Table w="150rem" bg="white">
              <Thead color="#ADB2BC">
                <Td textStyle="sm">ID RCO</Td>
                <Td textStyle="sm">INTITULE</Td>
                <Td textStyle="sm">CFD</Td>
                <Td textStyle="sm">CODE POSTAL</Td>
                <Td textStyle="sm">LOCALITE</Td>
                <Td textStyle="sm">EMAIL</Td>
                <Td textStyle="sm">EMAIL CATALOGUE</Td>
                <Td textStyle="sm">
                  SOURCE <br />
                </Td>
                <Td textStyle="sm">ACTIONS</Td>
              </Thead>
              <Tbody>
                {catalogueResult.formations.map((formation) => {
                  const emailRef = createRef();
                  const emailFocusRef = createRef();
                  const emailDecisionnaireRef = createRef();
                  const parameter = parametersResult.parameters.find(
                    (item) => item.id_rco_formation === formation.id_rco_formation
                  );

                  const formationPermissions = getPermissionsFromCriterias({
                    permissions,
                    id_rco_formation: formation.id_rco_formation,
                  });

                  return (
                    <Tr key={formation._id} _hover={{ bg: "#f4f4f4", transition: "0.5s" }} transition="0.5s">
                      <Td>{formation.id_rco_formation}</Td>
                      <Td>{formation.intitule_long}</Td>
                      <Td>{formation.cfd}</Td>
                      <Td>{formation.code_postal}</Td>
                      <Td>{formation.localite}</Td>
                      <Td onClick={() => emailFocusRef.current.focus()}>
                        <Editable
                          defaultValue={parameter?.email_rdv}
                          style={{
                            border: "solid #dee2e6 1px",
                            padding: 5,
                            marginRight: 10,
                            borderRadius: 4,
                            minWidth: 200,
                          }}
                        >
                          <EditablePreview ref={emailFocusRef} />
                          <EditableInput ref={emailRef} type="email" _focus={{ border: "none" }} />
                        </Editable>
                      </Td>
                      <Td>{formation.email || "N/C"}</Td>
                      <Td>
                        {formationPermissions.map((permission) => (
                          <>
                            <Flex mt={1}>
                              <Checkbox
                                key={`${formation.cfd}-${permission.referrerId}`}
                                checked={permission.checked}
                                value={permission.referrerId}
                                icon={<Check w="20px" h="18px" />}
                                defaultIsChecked={permission.checked}
                                onChange={() => togglePermission(permission)}
                              >
                                <Text ml={2}>{permission.name}</Text>
                              </Checkbox>
                            </Flex>
                          </>
                        ))}
                      </Td>
                      <Td>
                        <Button
                          mt={10}
                          RootComponent="a"
                          variant="primary"
                          onClick={() =>
                            upsertParameter({
                              formation,
                              parameter,
                              emailRdv: emailRef.current.value,
                              formationPermissions,
                            })
                          }
                        >
                          <Disquette w="16px" h="16px" />
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EditPage;
