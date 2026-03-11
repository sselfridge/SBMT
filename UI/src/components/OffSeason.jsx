import React from "react";
import AppContext from "AppContext";
import { ReactComponent as Logo } from "assets/logoV1.svg";
import { DateTime } from "luxon";

import { Box, Paper, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

const styles = {
  mainBox: (isMobile) => ({
    width: "95vw",
    maxWidth: 1000,
    padding: isMobile ? 1 : 2,
    borderRadius: 1,
  }),
  mainPaper: (isMobile) => ({
    height: "100%",
    width: "100%",
    boxShadow: "none",
    overflow: "auto",
    padding: isMobile ? 2 : 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: isMobile ? 2 : 3,
  }),
};

const useCountdown = (kickOffDateStr) => {
  const kickOffDate = DateTime.fromISO(kickOffDateStr);
  const [timeLeft, setTimeLeft] = React.useState(() => {
    const diff = kickOffDate.diffNow(["days", "hours", "minutes", "seconds"]);
    return diff.toObject();
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const diff = kickOffDate.diffNow(["days", "hours", "minutes", "seconds"]);
      setTimeLeft(diff.toObject());
    }, 1000);
    return () => clearInterval(timer);
  }, [kickOffDate]);

  return timeLeft;
};

const OffSeason = () => {
  const { kickOffDate } = React.useContext(AppContext);
  console.log("kickOffDate: ", kickOffDate);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { days, hours, minutes, seconds } = useCountdown(kickOffDate);

  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");

  return (
    <Box sx={styles.mainBox(isMobile)}>
      <Paper sx={styles.mainPaper(isMobile)}>
        <Box
          sx={{
            maxWidth: { xs: "80vw", sm: "20vw" },
            maxHeight: { xs: "80vw", sm: "20vw" },
          }}
        >
          <Logo style={{ width: "100%", height: "100%" }} />
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: isMobile ? 2 : 4,
            py: isMobile ? 1 : 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Next season starts in
          </Typography>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ fontVariantNumeric: "tabular-nums", letterSpacing: 2 }}
          >
            {pad(days)}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            maxWidth: 600,
            fontSize: isMobile ? "1rem" : "1.1rem",
          }}
        >
          <div>
            Check the <Link to={"/leaderboard"}>leaderboards</Link> to see who
            won.
          </div>
          <div>Use the dropdown in the top left to see past seasons.</div> How
          does it work? See the <Link to={"/info"}>info</Link> page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default OffSeason;
