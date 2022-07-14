import { createTheme } from "@mui/material/styles";

import palette from "./palette";

const theme = createTheme({
  palette,
});

console.info("theme: ", JSON.stringify(theme.palette));
export default theme;
