import React from "react";
import PropTypes from "prop-types";
import AppContext from "AppContext";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const PostSeason = (props) => {
  const { year } = React.useContext(AppContext);

  const { prop } = props;
  return (
    <MyBox sx={{ width: "95vw", maxWidth: 1000 }}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          boxShadow: "none",
          overflow: "auto",
        }}
      >
        <Typography variant="h4">Thats a wrap for the {year} season</Typography>
      </Paper>
    </MyBox>
  );
};

PostSeason.propTypes = {
  prop: PropTypes.object,
};

export default PostSeason;
