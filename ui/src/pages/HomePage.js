import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Page } from "tabler-react";
import { _get, _post } from "../common/httpClient";
const queryString = require("query-string");

export const HomePage = (props) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const urlParamCentreId = queryString.parse(props.location.search).centreId;
  const urlParamTrainingId = queryString.parse(props.location.search).trainingId;
  const [centreDataFromApiCatalog, setCentreDataFromApiCatalog] = useState(null);
  const [trainingDataFromApiCatalog, setTrainingDataFromApiCatalog] = useState(null);

  const fetchCentre = useCallback(() => {
    const getCentre = async () => {
      const response = await _get(`/api/centre?centreId=${urlParamCentreId}`);
      setCentreDataFromApiCatalog(response);
    };
    return getCentre();
  }, [urlParamCentreId]);

  const fetchTraining = useCallback(() => {
    const getTraining = async () => {
      const response = await _get(`/api/training?trainingId=${urlParamTrainingId}`);
      setTrainingDataFromApiCatalog(response);
    };
    return getTraining();
  }, [urlParamTrainingId]);

  useEffect(() => {
    fetchCentre();
    fetchTraining();
  }, [fetchCentre, fetchTraining]);

  const handleEventForm = (event, field) => {
    event.preventDefault();
    switch (field) {
      case "firstname":
        setFirstname(event.target.value);
        break;
      case "lastname":
        setLastname(event.target.value);
        break;
      case "phone":
        setPhone(event.target.value);
        break;
      default:
        break;
    }
  };

  const sendNewUser = async (values) => {
    try {
      let { newUser } = await _post("/api/users", values);
      console.log(`new add user success ${newUser}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submit");
    const values = {
      firstname,
      lastname,
      phone,
    };
    sendNewUser(values);
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
            <Form>
              <Form.Input
                icon="user"
                label="Prénom"
                placeholder="John"
                onChange={(event) => handleEventForm(event, "firstname")}
              />
              <Form.Input
                icon="user"
                label="Nom"
                placeholder="Doe"
                onChange={(event) => handleEventForm(event, "lastname")}
              />
              <Form.Input
                icon="phone"
                label="Téléphone"
                placeholder="0612345678"
                onChange={(event) => handleEventForm(event, "phone")}
              />
              <Button type="button" onClick={handleSubmit}>
                Valider
              </Button>
            </Form>
          </div>
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
