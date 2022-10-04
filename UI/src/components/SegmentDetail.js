import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  useLocation,
  useMatch,
  useParams,
  useSearchParams,
} from "react-router-dom";

import SegmentDetailMap from "./SegmentDetailMap";
import { ApiGet } from "api/api";
import { deepFreeze } from "utils/helperFuncs";

const MyBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 8,
  borderRadius: 4,
}));

const Segments = (props) => {
  const { id } = useParams();
  const [segment, setSegment] = useState({});

  useEffect(() => {
    const segId = Number(id);

    if (!Number.isNaN(segId)) {
      ApiGet(`/api/segment/${segId}`, setSegment);
    }
  }, [id]);

  return (
    <MyBox>
      <Typography variant="h4">{segment.name}</Typography>
      <Paper sx={{ display: "flex", width: "90vw" }}>
        <Box sx={{ flex: 5 }}>
          <Typography>{segment.name}</Typography>
        </Box>
        <Box style={{ height: "80vh", flex: 5 }}>
          <SegmentDetailMap segment={segment} />
        </Box>
      </Paper>
    </MyBox>
  );
};

Segments.propTypes = {
  prop: PropTypes.string,
};

export default Segments;
