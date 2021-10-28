const commonFieldStyle = {
  color: "#E7E7E7",
  borderColor: "#E7E7E7",
  height: "48px",
};

const Input = {
  parts: ["field"],
  variants: {
    edition: {
      field: {
        ...commonFieldStyle,
        fontWeight: 700,
      },
    },
    outline: {
      field: {
        ...commonFieldStyle,
        color: "black",
      },
    },
  },
};

export { Input };
