import {
  AsterixTypography,
  Button,
  ButtonLayout,
  FormBodyLayout,
  HelloTypography,
  Input,
  Spacer,
  Textarea,
} from "./styles";
import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import * as emailValidator from "email-validator";
import * as qs from "query-string";
import FormError from "../../common/components/FormError";
import { ContactCentreComponent } from "./components/ContactCentreComponent";
import { useHistory } from "react-router-dom";
import { FormHeaderComponent } from "./components/FormHeaderComponent";
import { FormLayoutComponent } from "./components/FormLayoutComponent";
import { _post } from "../../common/httpClient";

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

  const { idRcoFormation, referrer } = qs.parse(props.location.search);

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
    } else if (!/^\d{10}$/i.test(value)) {
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
    <FormLayoutComponent>
      <FormHeaderComponent title={"Le CFA vous rappelle !"} imagePath={"../../assets/people.svg"} imageAlt={"people"} />
      {loading && <span>Chargement des données...</span>}
      {error && <span> {error} </span>}
      {data && (
        <FormBodyLayout>
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
                  <ContactCentreComponent
                    entrepriseRaisonSociale={data.etablissement_formateur_entreprise_raison_sociale}
                    intitule={data.intitule_long}
                    adresse={data.lieu_formation_adresse}
                    codePostal={data.code_postal}
                    ville={data.localite}
                  />
                  <HelloTypography as={"h2"}>Bonjour !</HelloTypography>
                  <p>
                    Vous êtes <AsterixTypography>*</AsterixTypography> :{" "}
                  </p>
                  <Field name="firstname">
                    {({ field, meta }) => (
                      <Input placeholder="Votre prénom" {...field} {...feedback(meta, "Prénom invalide")} />
                    )}
                  </Field>
                  <Field name="lastname">
                    {({ field, meta }) => (
                      <Input placeholder="Votre nom" {...field} {...feedback(meta, "Nom invalide")} />
                    )}
                  </Field>
                  <Spacer />

                  {data.training && (
                    <p>
                      Pour tout savoir de notre formation <u>{data.intitule_long}</u>, laissez-nous <strong>48h</strong>{" "}
                      et <strong>votre numéro de téléphone</strong> <AsterixTypography>*</AsterixTypography> :
                    </p>
                  )}

                  <Field name="phone" validate={validatePhone}>
                    {({ field, meta }) => {
                      return (
                        <Input
                          placeholder="Votre numéro de téléphone"
                          {...field}
                          {...feedback(meta, "Numéro de téléphone invalide")}
                        />
                      );
                    }}
                  </Field>
                  <Spacer />

                  <p>
                    Vous recevrez un <strong>email de confirmation</strong> à cette adresse{" "}
                    <AsterixTypography>*</AsterixTypography> :
                  </p>
                  <Field name="email" validate={validateEmail}>
                    {({ field, meta }) => {
                      return (
                        <Input
                          placeholder="Votre adresse email"
                          {...field}
                          {...feedback(meta, "Adresse email invalide")}
                        />
                      );
                    }}
                  </Field>
                  <Spacer />

                  <p>
                    Que voulez-vous savoir, plus précisément <AsterixTypography>*</AsterixTypography> ?
                  </p>
                  <Field name="motivations">
                    {({ field, meta }) => {
                      return (
                        <Textarea
                          placeholder="Pré-inscription, horaires, calendrier, etc."
                          {...field}
                          {...feedback(meta, "Désolée, ce champs est nécessaire")}
                        />
                      );
                    }}
                  </Field>
                  <Spacer />

                  <ButtonLayout>
                    <Button type={"submit"} loading={submitLoading}>
                      Envoyer
                    </Button>
                  </ButtonLayout>

                  {status.error && <FormError>{status.error}</FormError>}
                </Form>
              );
            }}
          </Formik>
        </FormBodyLayout>
      )}
    </FormLayoutComponent>
  );
};
