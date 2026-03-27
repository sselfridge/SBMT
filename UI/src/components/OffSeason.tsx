import React from "react";
import AppContext from "AppContext";
//@ts-ignore -- svgImport
import { ReactComponent as Logo } from "assets/logoV1.svg";
import { DateTime } from "luxon";

import { Box, Paper, Typography, type Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

const styles = {
  mainBox: (isMobile: boolean) => ({
    width: "95vw",
    maxWidth: 1000,
    padding: isMobile ? 1 : 2,
    borderRadius: 1,
  }),
  mainPaper: (isMobile: boolean) => ({
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

const useCountdown = (kickOffDateStr: string) => {
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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );
  const { days, hours, minutes, seconds } = useCountdown(kickOffDate);

  const pad = (n: number | undefined) =>
    String(Math.floor(Math.abs(n || 0))).padStart(2, "0");

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

        <Box
          sx={{
            textAlign: "center",
            maxWidth: 600,
            fontSize: isMobile ? "1rem" : "1.1rem",
          }}
        >
          <section>
            How does it work? See the <Link to={"/info"}>info</Link> page.
          </section>
          <div>Check the past season leaderboards</div>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Link to="/leaderboard?year=2025sbmt">2025</Link>
            <Link to="/leaderboard?year=2025trail">2025 Trail League</Link>
            <Link to="/leaderboard?year=2024">2024</Link>
            <Link to="/leaderboard?year=2023">2023</Link>
          </Box>
          <div>
            Use the dropdown in the top left to see past seasons anywhere on the
            site.
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default OffSeason;
