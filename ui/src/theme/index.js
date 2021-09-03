import { extendTheme } from "@chakra-ui/react";
import { fonts, colors, fontSizes, space, rootFontSizePx, textStyles } from "./theme-beta";
import { components } from "./components/index";

const styles = {
  global: {
    "html, body": {
      fontSize: `${rootFontSizePx}px`,
      fontFamily: "Inter, Arial",
      background: "#FAFAFA",
      color: "primaryText",
    },
  },
};

const priseDeRdvColors = {
  primaryText: "grey.800",
  primaryBackground: "#FAFAFA",
  secondaryBackground: "#e5edef",
  blue: {
    500: "#007BFF",
  },
};

const overrides = {
  fonts,
  colors: { ...colors, ...priseDeRdvColors },
  styles,
  fontSizes,
  textStyles,
  space,
  components,
};

export default extendTheme(overrides);
