import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useParams } from "react-router-dom";

import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";

import SegmentDetailMap from "./SegmentDetailMap";
import { ApiGet } from "api/api";
import { deepFreeze, metersToMiles, metersToFeet } from "utils/helperFuncs";
// import AppContext from "AppContext";
// import { MAX_INT } from "utils/constants";
import { formattedTime } from "utils/helperFuncs";

const MyBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 8,
  borderRadius: 4,
}));

const Segments = () => {
  let { segmentId } = useParams();
  segmentId = Number(segmentId);
  segmentId = Number.isNaN(segmentId) ? null : segmentId;
  const [segment, setSegment] = useState({});
  // const [userEfforts, setUserEfforts] = useState(null);
  const [segmentLeaderboard, setSegmentLeaderboard] = useState(null);

  // const { user } = useContext(AppContext);

  useEffect(() => {
    if (segmentId) {
      ApiGet(`/api/segments/${segmentId}`, setSegment);
    }
  }, [segmentId]);
  // useEffect(() => {
  //   if (user && !userEfforts) {
  //     ApiGet(`/api/athletes/${user.athleteId}/efforts`, setUserEfforts);
  //   }
  // }, [user, userEfforts]);

  useEffect(() => {
    if (!segmentLeaderboard && segmentId) {
      ApiGet(`/api/segments/${segmentId}/leaderboard`, setSegmentLeaderboard);
    }
  }, [segmentId, segmentLeaderboard]);

  // const segmentEfforts = !userEfforts
  //   ? []
  //   : userEfforts.filter(
  //       (e) => e.segmentId === Number(segmentId) && e.bestTime !== MAX_INT
  //     );

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
      <Typography
        variant="h4"
        sx={{
          fontSize: "min(50px,4vw)",
          borderBottomColor: "secondary.main",
          borderBottomWidth: 4,
          borderBottomStyle: "solid",
          mb: 1,
        }}
      >
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
            {details.map((d, i) => (
              <React.Fragment key={i}>
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
              {e.segmentName} - {formattedTime(e.bestTime)}
            </div>
          ))} */}
          {!!segmentLeaderboard?.length && (
            <React.Fragment>
              <Typography sx={{ mt: 3 }} variant="h5">
                Segment Leaderboard
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Athlete</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segmentLeaderboard.map((e, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          <Link
                            style={{ display: "flex", alignItems: "center" }}
                            to={`/athletes/${e.athleteId}`}
                          >
                            <Avatar src={e.avatar} sx={{ mr: 1 }} />
                            {e.firstname} {e.lastname}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`http://www.strava.com/activities/${e.activityId}`}
                          >
                            {formattedTime(e.elapsedTime)}
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs={12} md={6} sx={{ height: "80vh" }}>
          <SegmentDetailMap segment={segment} />
        </Grid>
      </Grid>
    </MyBox>
  );
};

Segments.propTypes = {};

export default Segments;
