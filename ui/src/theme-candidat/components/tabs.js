const Tabs = {
  parts: ["table", "thead", "Td", "tr", "tbody"],
  baseStyle: {
    table: {
      border: "none",
      bg: "secondaryBackground",
      color: "grey.750",
    },
    tr: {
      border: "none",
      bg: "secondaryBackground",
      color: "grey.750",
    },
    tbody: {
      border: "none",
      bg: "secondaryBackground",
      color: "grey.750",
    },
    thead: {
      color: "grey.100",
      h: 1000,
    },
    Td: {
      bg: "#EEF1F8",
      color: "#383838",
      fontWeight: "700",
      fontSize: "zeta",
      position: "relative",
      bottom: "-1px",
    },
  },
  variants: {
    line: {
      tab: {
        fontSize: ["epsilon", "gamma"],
        _selected: { color: "grey.800", borderBottom: "4px solid", borderColor: "grey.750" },
      },
    },
    search: {
      table: {
        borderBottom: "1px solid #e7e7e7",
        bg: "secondaryBackground",
        color: "grey.750",
        width: "198rem",
      },
      thead: {
        color: "grey.800",
        h: "auto",
      },
      Td: {
        bg: "#EEF1F8",
        color: "#383838",
        fontWeight: "700",
        fontSize: "zeta",
        position: "relative",
        bottom: "-1px",
        _hover: {
          bg: "#B6B6FF",
        },
        _selected: {
          bg: "white",
          color: "bluefrance",
          borderTop: "2px solid #000091",
          borderLeft: "1px solid #e7e7e7",
          borderRight: "1px solid #e7e7e7",
        },
      },
    },
  },
};

export { Tabs };
