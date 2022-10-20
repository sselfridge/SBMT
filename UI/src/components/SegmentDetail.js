import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  useLocation,
  useMatch,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { ReactComponent as StravaLogo } from "assets/stravaLogoOrange.svg";

import SegmentDetailMap from "./SegmentDetailMap";
import { ApiGet } from "api/api";
import { deepFreeze } from "utils/helperFuncs";

const MyBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 8,
  borderRadius: 4,
}));

const CACHE = {
  id: 658277,
  resourceState: 3,
  name: "Gibraltar Climb",
  activityType: "Ride",
  distance: 9887.37,
  averageGrade: 8,
  maximumGrade: 25.3,
  elevationHigh: 1058.7,
  elevationLow: 268.4,
  startLatlng: [34.45181, -119.68905],
  endLatlng: [34.49128, -119.68999],
  climbCategory: 4,
  totalElevationGain: 804.057,
  effortCount: 68969,
  athleteCount: 11156,
  polyline:
    "yzgqErwoyU_IIsA`@IAmBo@o@?gBVy@Gs@Yo@g@EI]yAIGkBm@EKKeAQOM@m@Vu@EWVe@|@c@Vm@NeBGKBSFa@h@SLG?yBGw@}@GEWFy@h@c@@}A_@KG]m@qAi@EEGs@DI~@eATo@AIo@cAUs@?]\\_@fBk@DG@Ma@{@AWHYMo@c@o@Ea@Lo@FKbAk@BEDk@Og@iDeFe@[iA_@UUEKEw@DeBE]wAqBGW?QHM|@]zC?HGZk@F}APa@d@m@FE~C{@NONg@?ISs@IIkAGeBy@i@M_Ao@Yq@SSY@}A~@I@i@QY_@MGgBFk@[KQEMMoBs@cAaAq@Q_@AYHy@v@qB@g@MMI@a@T[?a@O{@cAIa@OwEIOUQm@GMLm@|BkAlCY?[k@}@u@CI?KBMl@k@XcA?]WmAN}AO_BEImAuAAK?aEMg@UEOV@zED\\dAvANh@G`AYvBQZqANGBYRY\\CHc@pCgAnBiA|AWj@@VNTjCl@\\Tl@l@l@TDFDTPtCI~AWXmA`@yBRo@f@gAMI@]\\i@hAEBOAy@c@MA_@PKZDdA]hAC~@X`@lAHF`@k@tAUNi@OEEiAaC{@cDEEOQKCgAEeATGFo@fBQhB}AdBu@|AGLW`Bk@r@s@XY?GACCe@wAm@w@EKOmAa@eASqA[aAKIUKQBa@HGDWXw@~AQHQ?Ue@KGSCE?QHa@f@g@Xe@Gm@_@_@AKFwAlBgAXEJ?dBQVkAX}CWI@cBpAwDPsCGuBe@sDsAeAOeANq@h@IVIn@Px@jDvB`@?v@W\\FbBtBl@Rj@Fv@p@b@z@p@p@Rd@FtAa@z@i@f@C?eA_@sB?e@OIGm@mAo@a@EAoBFiA?e@Ha@ZGTEd@F`A?XQN_A?GAy@g@u@GeBVcAj@eCVKFOZOx@MPmB@KBMJ]bAcAnBgAd@oBzAgAFSPQh@_@jCQhBQl@k@|@uB|Ac@G@C",
  kom: "27:12",
  qom: "35:05",
  surfaceType: "road",
};

const Segments = (props) => {
  const { id } = useParams();
  const [segment, setSegment] = useState({});

  useEffect(() => {
    const segId = Number(id);
    // setSegment(CACHE);
    if (!Number.isNaN(segId)) {
      ApiGet(`/api/segment/${segId}`, setSegment);
    }
  }, [id]);

  const details = [
    {
      label: "Distance",
      value: segment.distance,
    },

    {
      label: "Elevation Gain",
      value: segment.totalElevationGain,
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
          View on Strava <StravaLogo style={{ height: 40 }} />
        </a>
      ),
    },
    { label: "Has been ridden:", value: `${segment.effortCount} times` },
    { label: "by ", value: `${segment.athleteCount} people` },
    {
      label: "Thats roughly ",
      value: `${(segment.effortCount / segment.athleteCount).toFixed(
        2
      )} times each`,
    },
  ];

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
                <Box sx={{}}>
                  <Typography textAlign={"right"}>{d.label}</Typography>
                </Box>
                <Box>
                  <Typography textAlign="left">{d.value}</Typography>
                </Box>
              </React.Fragment>
            ))}
          </Box>
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

Segments.propTypes = {
  prop: PropTypes.string,
};

export default Segments;
