import styled, { css } from "styled-components";
import { Form as BaseForm, Button as BaseButton } from "tabler-react";
import { color, spacing, typography } from "../../utils/sharedStyles";

export const Textarea = styled(BaseForm.Textarea)`
  min-height: 60px;
`;

export const ReferrerLayout = styled.div`
  text-align: center;
`;

export const Button = styled(BaseButton)`
  margin: 0 ${spacing.padding.medium};
`;

export const IconLayout = styled.div`
  text-align: center;

  > i {
    color: ${(props) => (props.state === "up" ? color.blue : color.black)};
    font-size: ${typography.fontSize.m3};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }

  ${(props) =>
    !props.disabled &&
    css`
      > i:hover {
        color: ${color.blue};
        font-size: ${typography.fontSize.l1};
      }
    `}
`;
