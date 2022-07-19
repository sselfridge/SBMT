import { createTheme } from "@mui/material/styles";

import palette from "./palette";
import components from "./components";

const theme = createTheme({
  components,
  palette,
});

// console.info("theme: ", JSON.stringify(theme.palette));
// console.info("theme: ", theme);
export default theme;
