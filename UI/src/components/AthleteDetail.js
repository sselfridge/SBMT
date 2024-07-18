import React, { useState, useContext } from "react";
import {
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import AppContext from "AppContext";

import { styled } from "@mui/material/styles";
import { Link, useParams } from "react-router-dom";
import { ApiGet } from "api/api";
import { formattedTime } from "utils/helperFuncs";
import { MAX_INT } from "utils/constants";

import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";
import SelectCompUser from "./SelectCompUser";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  color: theme.palette.common.black,
  backgroundColor: theme.palette.background.paper,
}));

const AthleteDetail = () => {
  const params = useParams();
  const [user, setUser] = useState(undefined);
  const [userSegments, setUserSegments] = useState([]);
  const [compSegments, setCompSegments] = useState(null);

  const [hideIncomplete, setHideIncomplete] = useState(false);

  const { user: loggedInUser, isPreLaunch } = useContext(AppContext);

  const gravelSegments = userSegments.filter((s) => s.surfaceType === "gravel");
  const roadSegments = userSegments.filter((s) => s.surfaceType === "road");
  const trailSegments = userSegments.filter((s) => s.surfaceType === "trail");
  const roadCompletedCount = roadSegments.filter(
    (s) => s.efforts.length > 0
  ).length;
  const gravelCompletedCount = gravelSegments.filter(
    (s) => s.efforts.length > 0
  ).length;
  const trailCompletedCount = trailSegments.filter(
    (s) => s.efforts.length > 0
  ).length;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  React.useEffect(() => {
    ApiGet(`/api/athletes/${params.athleteId}`, setUser, null);
    ApiGet(`/api/athletes/${params.athleteId}/efforts`, setUserSegments);
  }, [params]);

  const makeSegmentRow = (segment, index) => {
    let timeDiff = 0;
    let compSegment = null;
    let compActLink = null;
    if (compSegments) {
      compSegment = compSegments.find((s) => s.segmentId === segment.segmentId);
      if (compSegment.bestTime !== MAX_INT && segment.bestTime !== MAX_INT) {
        timeDiff = compSegment.bestTime - segment.bestTime;
      }
      compActLink = `${compSegment.bestActId}/segments/${compSegment.bestEffortId}`;
    }

    const isBehind = timeDiff > 0;
    const isAhead = timeDiff < 0;

    const negStyle = { color: "red" };
    const posStyle = { color: "green" };

    timeDiff = Math.abs(timeDiff);

    return (
      <React.Fragment key={segment.segmentId}>
        {isMobile && (
          <TableRow>
            <TableCell colSpan={5}>
              <Typography textAlign={"center"}>
                <Link to={segment.segmentId}>{segment.segmentName}</Link>
              </Typography>
            </TableCell>
          </TableRow>
        )}
        <TableRow>
          {!isMobile && (
            <React.Fragment>
              <TableCell>
                {" "}
                <Link to={`/segments/${segment.segmentId}`}>
                  {segment.segmentName}
                </Link>
              </TableCell>
            </React.Fragment>
          )}
          <TableCell>{segment.efforts.length}</TableCell>
          <TableCell>
            {segment.bestTime === MAX_INT ? (
              "--"
            ) : (
              <a
                href={`https://www.strava.com/activities/${segment.bestActId}/segments/${segment.bestEffortId}`}
              >
                {formattedTime(segment.bestTime)}
              </a>
            )}
          </TableCell>
          {compSegment && (
            <React.Fragment>
              <TableCell>
                {compSegment.bestTime === MAX_INT ? (
                  "--"
                ) : (
                  <a href={`https://www.strava.com/activities/${compActLink}`}>
                    {formattedTime(compSegment.bestTime)}
                  </a>
                )}
              </TableCell>
              <TableCell sx={isBehind ? negStyle : isAhead ? posStyle : {}}>
                {isAhead ? "-" : isBehind ? "+" : ""}
                {timeDiff ? formattedTime(timeDiff) : "--"}
              </TableCell>
            </React.Fragment>
          )}
        </TableRow>
      </React.Fragment>
    );
  };

  const filterCompleted = (segment) => {
    if (hideIncomplete) {
      return segment.bestTime !== MAX_INT;
    } else return true;
  };

  if (user) {
    return (
      <MyBox>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottomColor: "secondary.main",
            borderBottomWidth: 4,
            borderBottomStyle: "solid",
            mb: 1,
          }}
        >
          <Avatar src={user.avatar} sx={{ height: "100px", width: "100px" }} />
          {user.firstname} {user.lastname}{" "}
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "right", fontSize: "0.8em" }}
        >
          <a
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
            href={`https://www.strava.com/athletes/${user.athleteId}`}
          >
            <StravaLogo style={{ height: 40 }} />
            View on Strava
          </a>
        </Box>
        {!isPreLaunch || loggedInUser.athleteId === 1075670 ? (
          <React.Fragment>
            <Typography variant="h4">Segment Efforts</Typography>
            <Button onClick={() => setHideIncomplete((v) => !v)}>
              {hideIncomplete ? "Show" : "Hide"} uncompleted segments
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  {!isMobile && <TableCell>Segment Name</TableCell>}
                  <TableCell>Runs</TableCell>
                  <TableCell>
                    <Avatar src={user.avatar} alt={user.firstname} />
                  </TableCell>
                  {!!loggedInUser &&
                    user.athleteId !== loggedInUser.athleteId && (
                      <React.Fragment>
                        <TableCell>
                          <SelectCompUser setCompSegments={setCompSegments} />
                        </TableCell>
                        <TableCell>Diff +/-</TableCell>
                      </React.Fragment>
                    )}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ paddingLeft: "50px" }} colSpan={5}>
                    <Typography textAlign={"center"}>
                      Road Segments {roadCompletedCount} of{" "}
                      {roadSegments.length} completed
                    </Typography>
                  </TableCell>
                </TableRow>
                {roadSegments.filter(filterCompleted).map(makeSegmentRow)}
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell sx={{ paddingLeft: "50px" }} colSpan={5}>
                    <Typography textAlign={"center"}>
                      Gravel Segments {gravelCompletedCount} of{" "}
                      {gravelSegments.length} completed
                    </Typography>
                  </TableCell>
                </TableRow>
                {gravelSegments.filter(filterCompleted).map(makeSegmentRow)}
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell sx={{ paddingLeft: "50px" }} colSpan={5}>
                    <Typography textAlign={"center"}>
                      Trail Run Segments {trailCompletedCount} of{" "}
                      {trailSegments.length} completed
                    </Typography>
                  </TableCell>
                </TableRow>
                {trailSegments.filter(filterCompleted).map(makeSegmentRow)}
              </TableBody>
            </Table>
          </React.Fragment>
        ) : (
          <Box>TBD</Box>
        )}
      </MyBox>
    );
  } else if (user === null) {
    return <MyBox>Athlete Not found {params.athleteId}</MyBox>;
  } else {
    return null;
  }
};

export default AthleteDetail;
