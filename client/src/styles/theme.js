import colors from "./colors";

const theme = {
  colors,
  borderRadius: "16px",
  shadow: "0 6px 16px rgba(0,0,0,0.1)",
  spacing: (factor) => `${factor * 8}px`,
  font: {
    family: "'Inter', sans-serif",
    size: {
      small: "0.9rem",
      medium: "1.1rem",
      large: "2rem",
    },
  },
};

export default theme;