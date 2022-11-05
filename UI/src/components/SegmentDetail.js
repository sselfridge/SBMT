import React, { useState, useEffect, useContext } from "react";
// import PropTypes from "prop-types";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";

import SegmentDetailMap from "./SegmentDetailMap";
import { ApiGet } from "api/api";
import { deepFreeze, metersToMiles, metersToFeet } from "utils/helperFuncs";
import AppContext from "AppContext";
import { MAX_INT } from "utils/constants";
import { formattedTime } from "utils/helperFuncs";

const MyBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 8,
  borderRadius: 4,
}));

const Segments = () => {
  const { id } = useParams();
  const segmentId = Number(id);
  const [segment, setSegment] = useState({});
  const [userEfforts, setUserEfforts] = useState(null);

  const { user } = useContext(AppContext);
  console.info("user: ", user);

  useEffect(() => {
    if (!Number.isNaN(segmentId)) {
      ApiGet(`/api/segments/${segmentId}`, setSegment);
    }
  }, [segmentId]);
  useEffect(() => {
    if (user && !userEfforts) {
      ApiGet(`/api/athletes/${user.athleteId}/efforts`, setUserEfforts);
    }
  }, [user, userEfforts]);

  console.info("userEfforts: ", userEfforts);
  const segmentEfforts = !userEfforts
    ? []
    : userEfforts.filter(
        (e) => e.segmentId === Number(segmentId) && e.bestTime !== MAX_INT
      );

  const details = deepFreeze([
    {
      label: "Distance",
      value: `${metersToMiles(segment.distance)} miles`,
    },
    {
      label: "Elevation Gain",
      value: `${metersToFeet(segment.totalElevationGain)} ft`,
    },
    { label: "Has been ridden:", value: `${segment.effortCount} times` },
    { label: "by ", value: `${segment.athleteCount} people` },
    {
      label: "Thats roughly ",
      value: `${(segment.effortCount / segment.athleteCount).toFixed(
        2
      )} times each`,
    },
    {
      label: "",
      value: (
        <a
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
          href={`https://www.strava.com/segments/${segment.id}`}
        >
          <StravaLogo style={{ height: 40 }} />
          View on Strava
        </a>
      ),
    },
  ]);

  return (
    <MyBox>
      <Typography variant="h4" sx={{ fontSize: "min(50px,4vw)" }}>
        {segment.name}
      </Typography>
      <Grid container spacing={1} sx={{ width: "90vw" }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "grid",
              gridGap: "10px",
              gridTemplateColumns: "150px 150px",
              justifyContent: "center",
            }}
          >
            {details.map((d) => (
              <React.Fragment>
                <Box>
                  <Typography textAlign={"right"}>{d.label}</Typography>
                </Box>
                <Box>
                  <Typography textAlign="left">{d.value}</Typography>
                </Box>
              </React.Fragment>
            ))}
          </Box>
          {/* <Typography>Your efforts:</Typography>
          {segmentEfforts.map((e) => (
            <div>
              {console.info(e.bestTime)}
              {e.segmentName} - {formattedTime(e.bestTime)}
            </div>
          ))} */}
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: "80vh" }}>
          <SegmentDetailMap segment={segment} />

          {/* //TODO sort out behavior when mapGrid can't be reached?? */}
          {/* <Box
                      sx={{
                        background:
                          "repeating-linear-gradient(  45deg,  #606dbc,  #606dbc 10px,  #465298 10px,  #465298 20px)",
                        height: "100%",
                        width: "100%",
                      }}
                    />{" "} */}
        </Grid>
      </Grid>
    </MyBox>
  );
};

Segments.propTypes = {};

export default Segments;
