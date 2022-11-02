import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
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
import { useParams } from "react-router-dom";
import { ApiGet } from "api/api";
import { formattedTime } from "utils/helperFuncs";
import { MAX_INT } from "utils/constants";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  color: theme.palette.common.black,
  backgroundColor: theme.palette.background.paper,
}));

const Athletes = (props) => {
  const params = useParams();
  const [user, setUser] = useState(undefined);
  const [userSegments, setUserSegments] = useState([]);
  const [meinSegments, setMeinSegments] = useState(null);

  const [hideIncomplete, setHideIncomplete] = useState(false);

  const { user: meinUser } = useContext(AppContext);

  const gravelSegments = userSegments.filter((s) => s.surfaceType === "gravel");
  const roadSegments = userSegments.filter((s) => s.surfaceType === "road");
  const roadCompletedCount = roadSegments.filter(
    (s) => s.efforts.length > 0
  ).length;
  const gravelCompletedCount = gravelSegments.filter(
    (s) => s.efforts.length > 0
  ).length;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  React.useEffect(() => {
    ApiGet(`/api/athletes/${params.id}`, setUser, true, null);
    ApiGet(`/api/athletes/${params.id}/efforts`, setUserSegments);
  }, [params]);

  React.useEffect(() => {
    if (
      // isMobile === false &&
      meinUser?.athleteId &&
      user?.athleteId &&
      meinUser.athleteId !== user.athleteId &&
      !meinSegments
    ) {
      ApiGet(`/api/athletes/${meinUser.athleteId}/efforts`, setMeinSegments);
    }
  }, [isMobile, meinSegments, meinUser, user]);

  const makeSegmentRow = (segment, index) => {
    let meinSegment = null;
    let timeDiff = 0;
    if (meinSegments) {
      meinSegment = meinSegments.find((s) => s.segmentId === segment.segmentId);
      if (meinSegment.bestTime !== MAX_INT && segment.bestTime !== MAX_INT) {
        timeDiff = meinSegment.bestTime - segment.bestTime;
      }
    }
    const negStyle = { color: "red" };
    const posStyle = { color: "green" };
    return (
      <React.Fragment>
        {isMobile && (
          <TableRow>
            <TableCell colSpan={5}>
              <Typography textAlign={"center"}>
                {segment.segmentName}
              </Typography>
            </TableCell>
          </TableRow>
        )}
        <TableRow key={index}>
          {!isMobile && (
            <React.Fragment>
              <TableCell>{segment.segmentName}</TableCell>
            </React.Fragment>
          )}
          <TableCell>{segment.efforts.length}</TableCell>
          <TableCell>
            {segment.bestTime === MAX_INT
              ? "--"
              : formattedTime(segment.bestTime)}
          </TableCell>
          {meinSegment && (
            <React.Fragment>
              <TableCell>
                {meinSegment.bestTime === MAX_INT
                  ? "--"
                  : formattedTime(meinSegment.bestTime)}
              </TableCell>
              <TableCell
                sx={timeDiff > 0 ? negStyle : timeDiff < 0 ? posStyle : {}}
              >
                {timeDiff > 0 ? "-" : timeDiff < 0 ? "+" : ""}
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
          }}
        >
          <Avatar src={user.avatar} sx={{ height: "100px", width: "100px" }} />
          {user.firstname} {user.lastname}{" "}
        </Typography>
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
                <Avatar src={user.avatar} />
              </TableCell>
              {meinSegments && (
                <React.Fragment>
                  <TableCell>
                    <Avatar src={meinUser.avatar} />
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
                  Road Segments {roadCompletedCount} of {roadSegments.length}{" "}
                  completed
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
          </TableBody>
        </Table>
      </MyBox>
    );
  } else if (user === null) {
    return <MyBox>Athlete Not found {params.id}</MyBox>;
  } else {
    return null;
  }
};

Athletes.propTypes = {
  prop: PropTypes.string,
};

export default Athletes;
