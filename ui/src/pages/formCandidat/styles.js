import styled from "styled-components";
import { background, color, spacing, typography } from "../../utils/sharedStyles";
import { Form as TablerForm } from "tabler-react";

export const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;

  background-color: ${color.ultraGrey};

  @media (max-width: 1250px) {
    grid-template-columns: 1fr 5fr 1fr;
  }

  @media (max-width: 950px) {
    grid-template-columns: 0fr 2fr 0fr;
  }
`;

export const ContainerParent = styled.div`
  position: relative;
`;

export const Vector1 = styled.img`
  position: absolute;
  left: -224px;
  top: 285px;
  z-index: 9;

  @media (max-width: 1250px) {
    display: none;
  }

  @media (max-width: 950px) {
    display: none;
  }
`;

export const Vector2 = styled.img`
  position: absolute;
  right: -160px;
  top: 100px;
  z-index: 9;

  @media (max-width: 1250px) {
    display: none;
  }

  @media (max-width: 950px) {
    display: none;
  }
`;

export const Vector3 = styled.img`
  position: absolute;
  right: -224px;
  top: 460px;
  z-index: 9;

  //transform: rotate(-42deg);
  transform: rotate(180deg);

  @media (max-width: 1250px) {
    display: none;
  }

  @media (max-width: 950px) {
    display: none;
  }
`;

export const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 14fr 1fr;

  z-index: 10;

  background-color: ${background.white};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`;

export const CenterContainer = styled.div``;

export const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
`;

export const FormLayout = styled.div``;

export const FormHeaderLayout = styled.div`
  padding: ${spacing.padding.xlarge} 0 0;
`;

export const FormBodyLayout = styled.div``;

export const CallTypography = styled.span`
  color: ${color.blue};
  font-size: ${typography.fontSize.m3};
  font-weight: ${typography.fontWeight.bold};
  line-height: ${typography.fontSize.l2};
`;

export const ContactCentreTrainingContainer = styled.div`
  display: grid;
  grid-template-rows: 0fr 0fr;
  grid-gap: ${spacing.padding.small};
  margin-bottom: ${spacing.padding.large};
  padding: ${spacing.padding.small} ${spacing.padding.xsmall};

  background-color: ${background.blueLight};
  box-sizing: border-box;
  border: 1px solid ${color.blue};
  border-radius: 4px;
`;

export const ContactCentreTrainingLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 9fr;
  grid-gap: ${spacing.padding.xxsmall};

  img {
    margin: 0 auto;
  }

  > p,
  span {
    margin: auto 0;
    color: ${color.black};
    font-weight: ${typography.fontWeight.xxbold};
    font-size: ${typography.fontSize.s1};
    line-height: ${typography.fontSize.s3};
  }
`;

export const Divider = styled.div`
  border-bottom: 1px solid ${color.darkGrey};
`;

export const FormIllustrationLayout = styled.div`
  padding: 0 ${spacing.padding.small};
  text-align: center;

  img {
    min-width: 250px;
    width: 40%;
    height: auto;
  }
`;

export const Input = styled(TablerForm.Input)`
  width: 100%;
  margin: ${spacing.padding.xsmall} 0;
  padding: ${spacing.padding.xxsmall};

  border: 1.25px solid ${color.blue};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: ${typography.fontSize.s2};
  font-weight: ${typography.fontWeight.regular};
  line-height: ${typography.fontSize.m3};
  text-align: center;

  :-webkit-input-placeholder {
    color: ${color.darkGrey};
  }

  :-moz-placeholder {
    /* Firefox 18- */
    color: ${color.darkGrey};
  }

  ::-moz-placeholder {
    /* Firefox 19+ */
    color: ${color.darkGrey};
  }

  :-ms-input-placeholder {
    color: ${color.darkGrey};
  }

  ::placeholder {
    color: ${color.darkGrey};
  }
`;

export const Textarea = styled(TablerForm.Textarea).attrs(() => ({
  rows: "4",
  cols: "50",
}))`
  width: 100%;
  margin: ${spacing.padding.xsmall} 0;
  padding: ${spacing.padding.xsmall};

  border: 1.25px solid ${color.blue};
  border-radius: 4px;
  font-size: ${typography.fontSize.s2};
  font-weight: ${typography.fontWeight.regular};
  line-height: ${typography.fontSize.m3};

  :-webkit-input-placeholder {
    color: ${color.darkGrey};
  }

  :-moz-placeholder {
    /* Firefox 18- */
    color: ${color.darkGrey};
  }

  ::-moz-placeholder {
    /* Firefox 19+ */
    color: ${color.darkGrey};
  }

  :-ms-input-placeholder {
    color: ${color.darkGrey};
  }

  ::placeholder {
    color: ${color.darkGrey};
  }
`;

export const HelloTypography = styled.span`
  padding-bottom: ${spacing.padding.xxsmall};

  font-size: ${typography.fontSize.s4};
  font-weight: ${typography.fontWeight.xxbold};
  line-height: ${typography.fontSize.l1};
`;

export const Spacer = styled.div`
  padding-bottom: ${spacing.padding.xmedium};
`;

export const Button = styled.button`
  padding: ${spacing.padding.small} ${spacing.padding.xxlarge};

  background-color: ${color.blue};
  border-radius: 4px;
  color: ${color.white};
  font-size: ${typography.fontSize.s2};
  font-weight: ${typography.fontWeight.xxbold};
  line-height: ${typography.fontSize.m1};
`;

export const ButtonLayout = styled.div`
  text-align: center;
`;

export const FooterLayout = styled.div``;

export const MentionsTypography = styled.p`
  padding: ${spacing.padding.xxmedium} ${spacing.padding.xmedium};

  color: ${color.darkGrey};
  font-size: ${typography.fontSize.s2};
  font-weight: ${typography.fontWeight.lowWeight};
  line-height: ${typography.fontSize.m3};
  text-align: center;

  a {
    color: ${color.darkGrey};
    text-decoration: underline;
  }
`;

export const AsterixTypography = styled.span`
  color: red;
`;

export const InfosLayout = styled.div`
  p {
    padding: ${spacing.padding.xxmedium} 0;

    strong {
      color: ${color.blue};
      font-size: ${typography.fontSize.s2};
      line-height: ${typography.fontSize.m3};
    }
  }
`;
