import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Paper } from "@mui/material";
import { ReactComponent as Logo } from "assets/logoV1.svg";

import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Info = (props) => {
  const { prop } = props;
  return (
    <MyBox>
      <Paper>
        <Box
          sx={{
            maxWidth: { xs: "80vw", sm: "20vw" },
            maxHeight: { xs: "80vw", sm: "20vw" },
          }}
        >
          <Logo style={{ width: "100%", height: "100%" }} />
        </Box>
        <Typography variant="h2">Info</Typography>
      </Paper>
    </MyBox>
  );
};

Info.propTypes = {
  prop: PropTypes.string,
};

export default Info;
