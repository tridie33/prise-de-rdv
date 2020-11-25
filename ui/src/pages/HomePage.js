import React, { useEffect, useState } from "react";
import { Button, Form, Page } from "tabler-react";
import { _post } from "../common/httpClient";
const queryString = require("query-string");

export const HomePage = (props) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const urlParamCfaId = queryString.parse(props.location.search).paramCfaId;
  //const [centreDataFromApiCatalog, setCentreDataFromApiCatalog] = useState("");
  //const siteParent = document.host;

  useEffect(() => {
    // TODO fetch API Catalogue for getEtablissement(id) pour remplir centreRefererIsTheSame;
    /* TODO Ensuite check if centreRefererIsTheSame.enseigne === siteParent.name
        si different que faire ? si pareil alors utiliser centreRefererIsTheSame dans le JSX
     */
  }, []);

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
            {urlParamCfaId && <h1>Prendre rendez-vous avec CFA #{urlParamCfaId}</h1>}
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
