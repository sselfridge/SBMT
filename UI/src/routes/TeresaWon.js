import { Box } from "@mui/material";

export default function TeresaWon(props) {
  return (
    <Box
      sx={{
        padding: "1rem 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "75vh",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <h2>Holy Shit Teresa Wins</h2>
        <Box sx={{ fontSize: "2em" }}>
          <a href="https://www.strava.com/activities/11616177986">
            I mean have you seen this?
          </a>
          <a href="https://www.strava.com/activities/11616177986">
            All in ONE RIDE!!
          </a>
        </Box>
        <h4>*ya we're done here...</h4>
      </Box>
      <Box>
        * ok not actually done, will resume business as usual soon, but holy
        crap that is impressive. <br />
        Don't worry I'm still recording any rides you do.
      </Box>
    </Box>
  );
}
