import React, { useState, useCallback, useContext } from "react";
import _ from "lodash";
import {
  Paper,
  Link,
  Grid,
  Box,
  FormGroup,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppContext from "AppContext";

import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";

import LabeledSelect from "./Shared/LabeledSelect";

import {
  // ageList,
  categoryList,
  // genderList,
  // surfaceList,
} from "utils/constants";
import { ApiGet } from "api/api";

const MyPaper = styled(Paper)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  width: "80vw",
}));

const categorySelect = categoryList.filter((c) => c !== "ALL");

const Register = (props) => {
  const { user, dispatch } = useContext(AppContext);

  // const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [localUser, setLocalUser] = useState({});

  const fetchProfile = useCallback((athleteId) => {
    ApiGet(`/api/strava/userRefresh/${athleteId}`, setLocalUser);
  }, []);

  React.useEffect(() => {
    if (
      localUser &&
      user &&
      _.isEmpty(localUser) === false &&
      _.isEmpty(user) === false &&
      _.isEqual(localUser, user) === false
    ) {
      dispatch({ type: "setUser", user: localUser });
    }
  }, [dispatch, localUser, user]);

  return (
    <MyPaper>
      <Typography variant="h3">Register For things</Typography>

      <FormGroup sx={{}}>
        <Typography variant="h5">Non-Strava Info we need from you</Typography>
        <LabeledSelect
          label={"Category"}
          value={category}
          setValue={setCategory}
          list={categorySelect}
        />
      </FormGroup>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5">Info we pulled from Strava</Typography>
          <Box sx={{ width: 100, height: 100 }}>
            <StravaLogo
            // style={{ height: 40 }}
            />
          </Box>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={4}>
          Age
        </Grid>
        <Grid item xs={4}>
          38
        </Grid>
        <Grid item xs={2} />
        {/* line break */}
        <Grid item xs={2} />
        <Grid item xs={4}>
          Weight
        </Grid>
        <Grid item xs={4}>
          185
        </Grid>
        <Grid item xs={2} />
        {/* line break */}
        <Grid item xs={2} />
        <Grid item xs={4}>
          Sex
        </Grid>
        <Grid item xs={4}>
          M
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={12}>
          <Link
            component={Button}
            sx={{
              color: "strava.contrastText",
              backgroundColor: "strava.main",
              "&:hover": {
                backgroundColor: "strava.light",
              },
              width: "100%",
            }}
            variant="body2"
            target={"_blank"}
            href="https://www.strava.com/settings/profile"
            underline="none"
          >
            Edit your Strava Profile{" "}
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => {
              fetchProfile(user.athleteId);
            }}
            sx={{ width: "100%" }}
          >
            Re-Fetch Strava Data
          </Button>
        </Grid>
      </Grid>
    </MyPaper>
  );
};

export default Register;
