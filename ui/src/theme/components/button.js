const commonButtonStyle = {
  borderRadius: 0,
  textTransform: "none",
  fontWeight: 400,
};

const Button = {
  variants: {
    unstyled: {
      ...commonButtonStyle,
      _hover: { bg: "#363636" },
    },
    primary: {
      ...commonButtonStyle,
      bg: "#306CBE",
      color: "white",
      _hover: { bg: "#3057BE" },
      _disabled: { bg: "#467fcf", color: "white" },
      _focus: { bg: "#3057BE" },
      borderRadius: "4px",
      fontWeight: "600",
      fontSize: "12px",
    },
    beta: {
      ...commonButtonStyle,
      padding: "8px 24px",
      bg: "#000091",
      color: "white",
    },
  },
};

export { Button };
