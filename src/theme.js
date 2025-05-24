import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const colors = {
  brand: {
    primary: "#1D1616",
    secondary: "#8E1616",
    light: "#FFFFFF",

    bg: "#000",
    bgCard: "#8E1616",
    textPrimary: "#FFFFFF",
    textSecondary: "#D84040",
    buttonBg: "#CF0F47",
    buttonText: "#FFFFFF",
    bgHover: "#EEEEEE",
  },
};

const styles = {
  global: (props) => ({
    body: {
      bg: colors.brand.bg,
      color: colors.brand.textPrimary,
    },
  }),
};
const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold",
      borderRadius: "xl",
    },
    variants: {
      solid: {
        bg: colors.brand.buttonBg,
        color: colors.brand.buttonText,
        _hover: {
          bg: colors.brand.bgCard,
        //   color: colors.brand.secondary,
        },
      },
    },
  },
};

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors,
  styles,
  components,
});

export default theme;
