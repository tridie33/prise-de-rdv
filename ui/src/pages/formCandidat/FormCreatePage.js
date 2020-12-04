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
import React from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import FormError from "../../common/components/FormError";
import { ContactCentreComponent } from "./ContactCentreComponent";
import { useHistory } from "react-router-dom";
import { FormHeaderComponent } from "./FormHeaderComponent";
import { FormLayoutComponent } from "./FormLayoutComponent";
import { _post } from "../../common/httpClient";
const queryString = require("query-string");

export const FormCreatePage = (props) => {
  let history = useHistory();
  const { centreId: urlCentreId, trainingId: urlTrainingId, fromWhom: urlFromWhom } = queryString.parse(
    props.location.search
  );
  //const [data, loading] = useFetch(`api/bff/context/formCreatePage/centre?${urlCentreId}&training?${urlTrainingId}`);
  const data = {
    centre: {
      name: "CEPROC",
      address: "2 Rue du Carbone",
      postalCode: "45100 Orléans",
    },
    training: {
      name: "CAP Cuisine",
    },
  };

  function validateEmail(value) {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Adresse email invalide";
    }
    return error;
  }

  const sendNewRequest = async (values, { setStatus }) => {
    try {
      values = {
        ...values,
        centreId: urlCentreId,
        trainingId: urlTrainingId,
        referrer: urlFromWhom,
        role: "candidat",
      };
      let newRequest = await _post("/api/demande", values);
      history.push(`/form/confirm/${newRequest._id}`);
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
    <FormLayoutComponent>
      <FormHeaderComponent title={"On s'appelle ?"} imagePath={"../../assets/people.svg"} imageAlt={"people"} />
      <FormBodyLayout>
        <Formik
          initialValues={{
            firstname: "Pacey",
            lastname: "Led",
            phone: "12345678",
            email: "pacey@led.com",
            motivations: "Take it easy",
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
                <ContactCentreComponent
                  urlCentreId={props.urlCentreId}
                  urlTrainingId={props.urlTrainingId}
                  centre={data.centre}
                  training={data.training}
                />
                <HelloTypography as={"h2"}>Bonjour !</HelloTypography>
                <p>
                  Vous êtes <AsterixTypography>*</AsterixTypography> :{" "}
                </p>
                <Field name="firstname">
                  {({ field, meta }) => {
                    return <Input placeholder="Votre prénom" {...field} {...feedback(meta, "Prénom invalide")} />;
                  }}
                </Field>
                <Field name="lastname">
                  {({ field, meta }) => {
                    return <Input placeholder="Votre nom" {...field} {...feedback(meta, "Nom invalide")} />;
                  }}
                </Field>
                <Spacer />

                <p>
                  Pour tout savoir de notre formation <u>{data.training.name}</u>, laissez-nous <strong>48h</strong> et{" "}
                  <strong>votre numéro de téléphone</strong> <AsterixTypography>*</AsterixTypography> :
                </p>

                <Field name="phone">
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
                  <Button type={"submit"}>Envoyer</Button>
                </ButtonLayout>

                {status.error && <FormError>{status.error}</FormError>}
              </Form>
            );
          }}
        </Formik>
      </FormBodyLayout>
    </FormLayoutComponent>
  );
};
