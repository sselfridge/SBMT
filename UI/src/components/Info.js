import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Paper } from "@mui/material";
import { ReactComponent as Logo } from "assets/logoV1.svg";

import { styled } from "@mui/material/styles";
import { ApiGet } from "api/api";
const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Info = (props) => {
  const [segments, setSegments] = React.useState([]);

  console.info("segments: ", segments);

  React.useEffect(() => {
    ApiGet("/api/admin/segments", setSegments);
  }, []);

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
