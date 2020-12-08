import React from "react";
import { Button, Form as TablerForm, Page } from "tabler-react";
import { _post } from "../common/httpClient";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import FormError from "../common/components/FormError";
import { useCustomHook } from "./utils/useCustomHook";

export const FormCandidatOld = (props) => {
  const [
    urlParamCentreId,
    urlParamTrainingId,
    urlParamFromReferrer,
    centreDataFromApiCatalog,
    trainingDataFromApiCatalog,
  ] = useCustomHook(props);

  function validateEmail(value) {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  const sendNewRequest = async (values, { setStatus }) => {
    try {
      values = {
        ...values,
        centreId: urlParamCentreId,
        trainingId: urlParamTrainingId,
        referrer: urlParamFromReferrer,
        role: "candidat",
      };
      let { newRequest } = await _post("/api/demande", values);
      console.log(`new add request success ${newRequest}`);
    } catch (e) {
      console.error(e);
      setStatus({ error: e.prettyMessage });
    }
  };

  let feedback = (meta, message) => {
    return meta.touched && meta.error
      ? {
          feedback: message,
          invalid: true,
        }
      : {};
  };

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          <div>
            <h1>Prendre rendez-vous</h1>
            {centreDataFromApiCatalog && trainingDataFromApiCatalog && (
              <h4>
                Etablissement : {centreDataFromApiCatalog.entreprise_raison_sociale} <br />
                Formation : {trainingDataFromApiCatalog.intitule}
              </h4>
            )}
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
                motivations: Yup.string().required("Requis"),
              })}
              onSubmit={sendNewRequest}
            >
              {({ status = {} }) => {
                return (
                  <Form>
                    <TablerForm.Group label="Prénom">
                      <Field name="firstname">
                        {({ field, meta }) => {
                          return (
                            <TablerForm.Input placeholder="John" {...field} {...feedback(meta, "Prénom invalide")} />
                          );
                        }}
                      </Field>
                    </TablerForm.Group>
                    <TablerForm.Group label="Nom">
                      <Field name="lastname">
                        {({ field, meta }) => {
                          return <TablerForm.Input placeholder="Doe" {...field} {...feedback(meta, "Nom invalide")} />;
                        }}
                      </Field>
                    </TablerForm.Group>
                    <TablerForm.Group label="Téléphone">
                      <Field name="phone">
                        {({ field, meta }) => {
                          return (
                            <TablerForm.Input
                              placeholder="0612345678"
                              {...field}
                              {...feedback(meta, "Téléphone invalide")}
                            />
                          );
                        }}
                      </Field>
                    </TablerForm.Group>
                    <TablerForm.Group label="Email">
                      <Field name="email" validate={validateEmail}>
                        {({ field, meta }) => {
                          return (
                            <TablerForm.Input
                              placeholder="john@doe.com"
                              {...field}
                              {...feedback(meta, "Email invalide")}
                            />
                          );
                        }}
                      </Field>
                    </TablerForm.Group>
                    <TablerForm.Group label="Motivations">
                      <Field name="motivations">
                        {({ field, meta }) => {
                          return (
                            <TablerForm.Textarea
                              placeholder=""
                              {...field}
                              {...feedback(meta, "Veuillez remplir ce champs")}
                            />
                          );
                        }}
                      </Field>
                    </TablerForm.Group>
                    <Button color="primary" type={"submit"}>
                      Valider
                    </Button>

                    {status.error && <FormError>{status.error}</FormError>}
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
