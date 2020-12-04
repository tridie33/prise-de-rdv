import { createGlobalStyle, css } from "styled-components";
import { typography, color } from "./sharedStyles";

export const bodyStyles = css`
  /*** RESET CSS ***/
  /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
  */

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  input,
  menu,
  nav,
  output,
  ruby,
  section,
  select,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: ${typography.fontSize.s2};
    font-family: sans-serif;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  main,
  section {
    display: block;
  }

  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-size: ${typography.fontSize.s2};
    color: ${color.darkGrey};
    font-family: sans-serif;
    font-weight: ${typography.fontWeight.regular};
    background-color: ${color.ultraGrey};
  }

  h1,
  h2,
  h3 {
    font-weight: ${typography.fontWeight.regular};
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    all: unset;
    cursor: pointer;
  }

  *:disabled {
    cursor: not-allowed;
    background-color: ${color.lightGrey};
    color: ${color.black};
  }
`;

export const GlobalStyle = createGlobalStyle`
   ${bodyStyles};
`;
