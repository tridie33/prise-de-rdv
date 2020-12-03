import React from "react";
import {
  CenterContainer,
  ContactCFALayout,
  ContactCFANameAddressLayout,
  Container,
  FooterContainer,
  FormBodyLayout,
  FormContainer,
  FormHeaderLayout,
  FormLayout,
  Main,
  CallTypography,
  ContactCFAIconsLayout,
  FormIllustrationLayout,
  Divider,
  Input,
  HelloTypography,
  Spacer,
  Textarea,
  Button,
  ButtonLayout,
  MentionsTypography,
  Vector1,
  Vector2,
  Vector3,
  AsterixTypography,
  ContainerParent,
} from "./styles";
import { useCustomHook } from "./utils/useCustomHook";
import { _post } from "../../common/httpClient";

export const FormCandidat = (props) => {
  const [
    urlParamCentreId,
    urlParamTrainingId,
    urlParamFromWhom,
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
        referrer: urlParamFromWhom,
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

  const handleOnChange = (event) => {
    event.preventDefault();
  };

  return (
    <Main>
      <div></div>
      <ContainerParent>
        <Vector1 src={"../../assets/vector1.svg"} />
        <Vector2 src={"../../assets/vector2.svg"} />
        <Vector3 src={"../../assets/vector1.svg"} />
        <Container>
          <div></div>
          <CenterContainer>
            <FormContainer>
              <div></div>
              <FormLayout>
                <FormHeaderLayout>
                  <CallTypography as={"h1"}>On s'appelle ?</CallTypography>
                  <FormIllustrationLayout>
                    <img src={"../../assets/people.svg"} alt={"people"} />
                  </FormIllustrationLayout>
                  <ContactCFALayout>
                    <ContactCFAIconsLayout>
                      <img src={"../../assets/school.svg"} alt={"school"} />
                      <img src={"../../assets/map.svg"} alt={"map"} />
                    </ContactCFAIconsLayout>
                    <ContactCFANameAddressLayout>
                      <span>
                        Gip Formation tout au long de la vie et insertion professionnelle de l’académie d’Orléans Tours.
                      </span>
                      <span>
                        2 Rue du Carbone <br />
                        45100 Orléans
                      </span>
                    </ContactCFANameAddressLayout>
                  </ContactCFALayout>
                </FormHeaderLayout>
                <FormBodyLayout>
                  <HelloTypography as={"h2"}>Bonjour !</HelloTypography>
                  <p>
                    Vous êtes<AsterixTypography>*</AsterixTypography> :{" "}
                  </p>
                  <Input placeholder={"Votre prénom"} value={""} onChange={(event) => handleOnChange(event)} />
                  <Input placeholder={"Votre nom"} value={""} onChange={(event) => handleOnChange(event)} />
                  <Spacer />

                  <p>
                    Pour tout savoir de notre formation <u>BMA CERAMIQUE</u>, laissez-nous <strong>48h</strong> et{" "}
                    <strong>votre numéro</strong>
                    <AsterixTypography>*</AsterixTypography> :
                  </p>
                  <Input
                    placeholder={"Votre numéro de téléphone"}
                    value={""}
                    onChange={(event) => handleOnChange(event)}
                  />
                  <Spacer />

                  <p>
                    Vous recevrez un <strong>email de confirmation</strong> à cette adresse
                    <AsterixTypography>*</AsterixTypography> :
                  </p>
                  <Input placeholder={"Votre adresse email"} value={""} onChange={(event) => handleOnChange(event)} />
                  <Spacer />

                  <p>
                    Que voulez-vous savoir, plus précisément<AsterixTypography>*</AsterixTypography> ?
                  </p>
                  <Textarea placeholder={"Pré-inscription, horaires, calendrier, etc."} />
                  <Spacer />

                  <ButtonLayout>
                    <Button>Envoyer</Button>
                  </ButtonLayout>
                  <Spacer />
                  <Spacer />
                </FormBodyLayout>
              </FormLayout>
              <div></div>
            </FormContainer>
            <FooterContainer>
              <Divider />
              <MentionsTypography>
                Un outil développé par <a href={"beta.gouv.fr"}>beta.gouv.fr</a> - Conditions générales d’utilisation
              </MentionsTypography>
              <Spacer />
            </FooterContainer>
          </CenterContainer>
          <div></div>
        </Container>
      </ContainerParent>
      <div></div>
    </Main>
  );
};
