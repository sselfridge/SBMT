import { createTheme } from "@mui/material/styles";

import palette from "./palette";
import components from "./components";

const theme = createTheme({
  components,
  palette,
});

// console.log("theme: ", JSON.stringify(theme.palette));
// console.log("theme: ", theme);
export default theme;
