import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import * as emailValidator from "email-validator";
import * as qs from "query-string";
import { useHistory } from "react-router-dom";
import { Text, Input, Button, Box, Checkbox } from "@chakra-ui/react";
import { ContactCfaComponent } from "./layout/ContactCfaComponent";
import { FormLayoutComponent } from "./layout/FormLayoutComponent";
import { _post } from "../../common/httpClient";
import { Check } from "../../theme/components/icons";

/**
 * @description Form appointment page.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const FormCreatePage = (props) => {
  const history = useHistory();
  const [data, setData] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const { idRcoFormation, referrer } = qs.parse(props.location.search);

  const handleChange = () => {
    setChecked(!checked);
  };
  /**
   * @description Initialize.
   */
  useEffect(() => {
    async function fetchContext() {
      try {
        setLoading(true);

        const response = await _post(`/api/appointment-request/context/create`, { idRcoFormation, referrer });

        if (response?.error) {
          throw new Error(response?.error);
        }

        setData(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContext();
  }, [idRcoFormation, referrer]);

  /**
   * @description Validate email.
   * @param {String} value
   * @returns {string|undefined}
   */
  function validateEmail(value) {
    let error;

    if (!value) {
      error = "Adresse email requise";
    } else if (!emailValidator.validate(value)) {
      error = "Adresse email invalide";
    }

    return error;
  }

  /**
   * @description Validate phone number.
   * @param {String} value
   * @returns {string|undefined}
   */
  function validatePhone(value) {
    let error;
    if (!value) {
      error = "Numéro de téléphone requis";
    } else if (!/^0[1-98][0-9]{8}$/i.test(value)) {
      error = "Numéro de téléphone invalide";
    }

    return error;
  }

  /**
   * @description Sends appointment requesT.
   * @param {Object} values
   * @param {Function} setStatus
   * @returns {Promise<void>}
   */
  const sendNewRequest = async (values, { setStatus }) => {
    try {
      setSubmitLoading(true);
      const { appointment } = await _post("/api/appointment-request/validate", {
        ...values,
        idRcoFormation,
        referrer,
      });

      history.push(`/form/confirm/${appointment._id}`);
      setTimeout(() => window.scroll({ top: 0, behavior: "smooth" }), 500);
    } catch (e) {
      console.error(e);
      setStatus({ error: e.prettyMessage });
    } finally {
      setSubmitLoading(false);
    }
  };

  const feedback = (meta, message) => {
    return meta.touched && meta.error
      ? {
          feedback: message,
          invalid: true,
        }
      : {};
  };

  return (
    <FormLayoutComponent bg="white">
      {loading && <span>Chargement des données...</span>}
      {error && <span> {error} </span>}
      {data && (
        <Box>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              phone: "",
              email: "",
              motivations: "",
            }}
            validationSchema={Yup.object().shape({
              firstname: Yup.string().required("Requis"),
              lastname: Yup.string().required("Requis"),
              phone: Yup.number().required("Requis"),
              email: Yup.string().required("Requis"),
              motivations: Yup.string(),
            })}
            onSubmit={sendNewRequest}
          >
            {({ status = {} }) => {
              return (
                <Form>
                  <ContactCfaComponent
                    entrepriseRaisonSociale={data.etablissement_formateur_entreprise_raison_sociale}
                    intitule={data.intitule_long}
                    adresse={data.lieu_formation_adresse}
                    codePostal={data.code_postal}
                    ville={data.localite}
                  />
                  <Text textStyle="h6" color="info">
                    Bonjour,
                  </Text>
                  <Text mt={6}>
                    Vous êtes
                    <Text color="redmarianne" as="span">
                      *
                    </Text>{" "}
                    :
                  </Text>
                  <Field name="firstname">
                    {({ field, meta }) => (
                      <Input placeholder="votre prénom" {...field} {...feedback(meta, "Prénom invalide")} />
                    )}
                  </Field>
                  <Field name="lastname">
                    {({ field, meta }) => (
                      <Input mt={2} placeholder="votre nom" {...field} {...feedback(meta, "Nom invalide")} />
                    )}
                  </Field>
                  {data.intitule_long && (
                    <Text mt={5}>
                      Pour tout savoir de la formation{" "}
                      <b>
                        <u>{data.intitule_long.toUpperCase()}</u>
                      </b>
                      , laissez votre numéro au centre de formation{" "}
                      <Text color="redmarianne" as="span">
                        *
                      </Text>{" "}
                      :
                    </Text>
                  )}
                  <Field name="phone" validate={validatePhone}>
                    {({ field, meta }) => {
                      return (
                        <Input
                          mt={2}
                          type="tel"
                          placeholder="votre numéro"
                          {...field}
                          {...feedback(meta, "Numéro de téléphone invalide")}
                        />
                      );
                    }}
                  </Field>
                  <Text mt={6}>
                    Vous recevrez un email de confirmation à cette adresse
                    <Text color="redmarianne" as="span">
                      *
                    </Text>
                  </Text>
                  <Field name="email" validate={validateEmail}>
                    {({ field, meta }) => {
                      return (
                        <Input
                          placeholder="votre adresse email"
                          type="email"
                          {...field}
                          {...feedback(meta, "Adresse email invalide")}
                        />
                      );
                    }}
                  </Field>
                  <Text mt={5}>Quel sujet voulez-vous aborder ?</Text>
                  <Field name="motivations">
                    {({ field, meta }) => {
                      return (
                        <Input
                          placeholder="période d’inscription, horaires, etc."
                          {...field}
                          {...feedback(meta, "Désolée, ce champs est nécessaire")}
                        />
                      );
                    }}
                  </Field>
                  <Box
                    as="div"
                    variant="highlight"
                    borderLeft="4px solid"
                    borderColor="info"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    bg="#F0F0F0"
                    alignItems="flex-start"
                    p={5}
                    mb={5}
                    mt={12}
                  >
                    <Checkbox value={checked} onChange={handleChange} as="span" icon={<Check w="20px" h="18px" />}>
                      <Text color="grey.750" fontWeight="700" textStyle="sm">
                        Je serai attentif aux appels que je vais recevoir dans les prochains jours.
                        <Text as="span" color="redmarianne">
                          *
                        </Text>
                      </Text>
                    </Checkbox>
                  </Box>
                  <Button
                    variant="unstyled"
                    disabled={checked === false}
                    type={"submit"}
                    loading={submitLoading}
                    bg={checked === false ? "grey.300" : "grey.750"}
                    borderRadius="10px"
                    color="#FFFFFF"
                    w="14.5rem"
                    fontWeight="700"
                    display="block"
                    mx={["auto", "0", "0", "0"]}
                    mt={2}
                    _hover=""
                    textAlign="center"
                  >
                    Envoyer ma demande
                  </Button>
                  {status.error && <Text color="#cd201f">{status.error}</Text>}
                </Form>
              );
            }}
          </Formik>
        </Box>
      )}
    </FormLayoutComponent>
  );
};
