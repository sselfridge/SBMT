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
  CircularProgress,
  Paper,
} from "@mui/material";
import AppContext from "AppContext";

import { styled, Theme } from "@mui/material/styles";
import { Link, useParams } from "react-router-dom";
import { formattedTime } from "utils/helperFuncs";
import { MAX_INT, SURFACE } from "utils/constants";
import type { User } from "@/types/StravaUserDTO";
import type { UserSegment } from "@/types/UserSegment";
// @ts-ignore
import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";
import SelectCompUser from "./SelectCompUser";
import { AppState } from "@/AppReducer";
import { getAthlete, getAthleteEfforts } from "@/services/sbmt";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  color: theme.palette.common.black,
  backgroundColor: theme.palette.background.paper,
}));

enum ViewSegments {
  ALL,
  Completed,
  Incomplete,
}

interface TimeDisplayProps {
  time: number;
}

const TimeDisplay = (props: TimeDisplayProps) => {
  const { time } = props;

  const isBehind = time > 0;
  const isAhead = time < 0;

  const value = Math.abs(time);

  return (
    <Box
      sx={{
        display: "inline-flex",
        color: isAhead ? "green" : isBehind ? "red" : "",
      }}
    >
      {isAhead ? "-" : isBehind ? "+" : ""}
      {time ? formattedTime(value) : "--"}
    </Box>
  );
};

const calcDiff = (segments: UserSegment[], compSegments: UserSegment[]) => {
  let total = 0;

  segments.forEach((s) => {
    const compSeg = compSegments.find((cs) => cs.segmentId === s.segmentId);
    if (!compSeg) return;

    if (s.bestTime !== MAX_INT && compSeg.bestTime !== MAX_INT) {
      total = total + (compSeg.bestTime - s.bestTime);
    }
  });
  return total;
};

const AthleteDetail = () => {
  const { athleteId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [compSegments, setCompSegments] = useState<UserSegment[]>([]);

  const [viewState, setViewState] = useState(ViewSegments.ALL);

  const [loading, setLoading] = useState(true);

  const {
    user: loggedInUser,
    isPreSeason,
    year,
  }: AppState = useContext(AppContext);

  const gravelSegments = userSegments.filter(
    (s) => s.surfaceType === SURFACE.gravel,
  );
  const roadSegments = userSegments.filter(
    (s) => s.surfaceType === SURFACE.road,
  );
  const trailSegments = userSegments.filter(
    (s) => s.surfaceType === SURFACE.trail,
  );
  const roadCompletedCount = roadSegments.filter(
    (s) => s.efforts.length > 0,
  ).length;
  const gravelCompletedCount = gravelSegments.filter(
    (s) => s.efforts.length > 0,
  ).length;
  const trailCompletedCount = trailSegments.filter(
    (s) => s.efforts.length > 0,
  ).length;

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  React.useEffect(() => {
    const fetchDetails = async () => {
      if (athleteId) {
        try {
          setLoading(true);
          const [newUser, newEfforts] = await Promise.all([
            getAthlete(athleteId),
            getAthleteEfforts(athleteId, year),
          ]);

          setUser(newUser);
          setUserSegments(newEfforts);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [athleteId, year]);

  const makeSegmentRow = (segment: UserSegment) => {
    let timeDiff = 0;
    let compSegment = null;
    let compActLink = null;
    if (compSegments.length) {
      compSegment = compSegments.find((s) => s.segmentId === segment.segmentId);
      if (compSegment) {
        if (compSegment.bestTime !== MAX_INT && segment.bestTime !== MAX_INT) {
          timeDiff = compSegment.bestTime - segment.bestTime;
        }
        compActLink = `${compSegment.bestActId}/segments/${compSegment.bestEffortId}`;
      }
    }

    return (
      <React.Fragment key={segment.segmentId}>
        {isMobile && (
          <TableRow>
            <TableCell colSpan={5}>
              <Typography textAlign={"center"}>
                <Link to={`/segments/${segment.segmentId}`}>
                  {segment.segmentName}
                </Link>
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
              <TableCell>
                <TimeDisplay time={timeDiff} />
              </TableCell>
            </React.Fragment>
          )}
        </TableRow>
      </React.Fragment>
    );
  };
  const toggleIncomplete = () =>
    setViewState((v) => {
      let next = v + 1;
      next = next % 3;
      return next;
    });

  const filterCompleted = (segment: UserSegment) => {
    if (viewState === ViewSegments.ALL) return true;

    if (viewState === ViewSegments.Completed) {
      return segment.bestTime !== MAX_INT;
    }
    if (viewState === ViewSegments.Incomplete) {
      return segment.bestTime === MAX_INT;
    }
  };

  const roadDiff = React.useMemo(() => {
    return calcDiff(roadSegments, compSegments);
  }, [roadSegments, compSegments]);
  const gravelDiff = React.useMemo(() => {
    return calcDiff(gravelSegments, compSegments);
  }, [gravelSegments, compSegments]);
  const trailDiff = React.useMemo(() => {
    return calcDiff(trailSegments, compSegments);
  }, [trailSegments, compSegments]);

  const totalDiff = roadDiff + gravelDiff + trailDiff;

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
        {!isPreSeason || loggedInUser?.athleteId === 1075670 ? (
          <React.Fragment>
            <Typography variant="h4">Segment Efforts</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button onClick={toggleIncomplete}>Toggle View</Button>
              <Box sx={{ fontSize: "14px" }}>
                Showing{" "}
                {viewState === ViewSegments.ALL
                  ? "All"
                  : viewState === ViewSegments.Completed
                    ? "Completed"
                    : viewState === ViewSegments.Incomplete
                      ? "Incomplete"
                      : ""}
              </Box>
            </Box>
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
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <TimeDisplay time={totalDiff} />
                            Diff +/-
                          </Box>
                        </TableCell>
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
                      <TimeDisplay time={roadDiff} />
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
                      <TimeDisplay time={gravelDiff} />
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
                      <TimeDisplay time={trailDiff} />
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
  } else if (loading) {
    return <CircularProgress />;
  } else if (user === null && !loading) {
    return <MyBox>Athlete Not found {athleteId}</MyBox>;
  } else {
    return null;
  }
};

export default AthleteDetail;
