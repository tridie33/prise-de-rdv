import { CallTypography, FormHeaderLayout, FormIllustrationLayout } from "../styles";
import React from "react";

export const FormHeaderComponent = (props) => {
  return (
    <FormHeaderLayout>
      <CallTypography as={"h1"}>{props.title}</CallTypography>
      <FormIllustrationLayout>
        <img src={props.imagePath} alt={props.imageAlt} />
      </FormIllustrationLayout>
    </FormHeaderLayout>
  );
};
