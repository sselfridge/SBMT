import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";
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
      <Typography variant="h4">Segment Detail {id}</Typography>

      <div style={{ height: "80vh", width: "85vw" }}>
        <SegmentDetailMap segment={segment} />
      </div>
    </MyBox>
  );
};

Segments.propTypes = {
  prop: PropTypes.string,
};

export default Segments;
