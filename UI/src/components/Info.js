import React from "react";
import PropTypes from "prop-types";
import { Box, Link as MuiLink, Paper, Typography } from "@mui/material";
import { ReactComponent as Logo } from "assets/logoV1.svg";

import { styled } from "@mui/material/styles";
import Updates from "./Updates";
const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const ArticleBox = styled(Box)(({ theme }) => ({ margin: "0 15%" }));

const TitleTypography = styled(Typography)(({ theme }) => ({
  borderBottom: `3px solid`,
  borderColor: theme.palette.secondary.main,
}));
const SubTitleTypo = styled(Typography)(({ theme }) => ({
  borderBottom: `3px solid`,
  borderColor: theme.palette.secondary.main,
  margin: "0 20%",
}));

const Info = (props) => {
  return (
    <MyBox>
      <Paper
        sx={{
          width: "80vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "80vw", sm: "20vw" },
            maxHeight: { xs: "80vw", sm: "20vw" },
          }}
        >
          <Logo style={{ width: "100%", height: "100%" }} />
        </Box>
        <ArticleBox>
          <TitleTypography variant="h2">
            What is <span className="sbmt">SBMT</span> ?
          </TitleTypography>
          Inspired by the
          <MuiLink
            sx={{ color: "black", margin: "0px 5px" }}
            href="http://www.smmtchallenge.com"
          >
            SMMT
          </MuiLink>
          the Santa Barbara Mountain Challenge{" "}
          <span className="sbmt">SBMT</span> is the same idea here in Santa
          Barbara. <br />
          We'll have a list of 10-15 local cycling climbs and a leaderboard
          running. Starts Memorial Day weekend and runs til just before labor
          day weekend
          <br />
          <br />
          Ranking is done 1st by number of segments completed, then total
          cumulative time. <br />
          <br />
          We'll have plenty of sub categories so you can compete against people
          you're competitive with.
          <br />
          <br />I discovered the SMMT during COVID and really enjoyed it, plus
          it got me to some areas of the Santa Monicas I probably wouldn't have
          done otherwise. Hoping to bring something similar to SB!
          <br />
          <br />
          <br />
        </ArticleBox>
        <Updates
          ArticleBox={ArticleBox}
          TitleTypography={TitleTypography}
          SubTitleTypo={SubTitleTypo}
        />
      </Paper>
    </MyBox>
  );
};

Info.propTypes = {
  prop: PropTypes.string,
};

export default Info;
