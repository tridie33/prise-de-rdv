import React from "react";
import {
  CenterContainer,
  Container,
  FormContainer,
  FormLayout,
  Main,
  Vector1,
  Vector2,
  Vector3,
  ContainerParent,
} from "./styles";
import { FooterComponent } from "./FooterComponent";

export const FormLayoutComponent = (props) => {
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
              <FormLayout>{props.children}</FormLayout>
              <div></div>
            </FormContainer>
            <FooterComponent />
          </CenterContainer>
          <div></div>
        </Container>
      </ContainerParent>
      <div></div>
    </Main>
  );
};
