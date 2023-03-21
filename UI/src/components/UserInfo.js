import React, { useState, useCallback, useContext } from "react";
import _ from "lodash";
import {
  Paper,
  Link,
  Grid,
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppContext from "AppContext";

import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";

import LabeledSelect from "./Shared/LabeledSelect";

import { categoryList } from "utils/constants";
import { ApiGet, ApiPost } from "api/api";

const MyPaper = styled(Paper)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  width: "80vw",
}));

const categorySelect = categoryList.filter((c) => c !== "ALL");

const UserInfo = () => {
  const { user, dispatch } = useContext(AppContext);
  const [age, setAge] = useState("");
  const [ageHelperText, setAgeHelperText] = useState("");
  const [category, setCategory] = useState("");
  const [localUser, setLocalUser] = useState({});

  const fetchProfile = useCallback((athleteId) => {
    ApiGet(`/api/strava/userRefresh/${athleteId}`, setLocalUser);
  }, []);

  const updateProfile = useCallback(() => {
    const updatedUser = _.cloneDeep(user);
    updatedUser.category = category;
    updatedUser.age = age;
    updatedUser.stravaClubs = [];

    ApiPost(`/api/athletes/current`, updatedUser, () => {});
  }, [age, category, user]);

  React.useEffect(() => {
    setLocalUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  React.useEffect(() => {
    if (localUser?.age !== undefined) {
      setAge(localUser.age);
    }
    if (localUser?.category !== undefined) {
      setCategory(localUser.category);
    }
  }, [localUser]);

  const profileFields = [
    {
      label: "Age",
      content: (
        <Box sx={{ width: "100px" }}>
          <TextField
            value={age}
            error={!!ageHelperText}
            helperText={ageHelperText}
            onChange={(e) => {
              setAgeHelperText("");
              setAge(e.target.value);
            }}
            onBlur={(e) => {
              const newVal = e.target.value;
              const numVal = Number(newVal);
              if (newVal === "") {
                setAge("");
              } else if (Number.isNaN(numVal)) {
                setAge("");
              } else {
                if (numVal < 13) {
                  setAgeHelperText("Age must be higher than 13");
                } else if (numVal > 100) {
                  setAgeHelperText("Age must be less than 100");
                } else {
                  setAge(numVal);
                }
              }
            }}
            InputProps={{
              inputProps: {
                type: "number",
                min: 13,
                max: 100,
              },
            }}
          />
        </Box>
      ),
    },
    {
      label: "Category",
      content: (
        <Box sx={{ width: "220px" }}>
          <LabeledSelect
            label={"Category"}
            value={category}
            setValue={setCategory}
            list={categorySelect}
            minWidth={180}
          />
        </Box>
      ),
    },
  ];

  const stravaFields = [
    { label: "Weight", content: user?.weight, fromStrava: true },
    { label: "Sex", content: user?.sex, fromStrava: true },
    {
      label: "Distance/wk",
      content: `${user?.recentDistance.toFixed(0)} mi`,
      fromStrava: true,
    },
    {
      label: "Elevation/wk",
      content: `${user?.recentElevation.toFixed(0)} ft`,
      fromStrava: true,
    },
    { label: "Clubs", content: "", fromStrava: true },
  ];

  const mapFields = (field) => {
    return (
      <React.Fragment>
        <Grid item xs={1} sm={3} />
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
          {!!field.fromStrava && (
            <Box sx={{ width: 40, height: 40 }}>
              <StravaLogo />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={3}
          sm={1}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">{field.label}:</Typography>
        </Grid>
        <Grid item xs={1} />
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" align="left">
            {field.content}
          </Typography>
        </Grid>
        <Grid item xs={1} />
      </React.Fragment>
    );
  };

  return (
    <MyPaper>
      <Typography variant="h3">User Profile</Typography>
      <Box
        sx={{
          ":first-letter": {
            textTransform: "capitalize",
          },
        }}
      >
        this is a test
      </Box>
      <Grid container spacing={1}>
        {profileFields.map(mapFields)}
        <Grid item xs={1} sm={3} />
        <Grid item xs={10} sm={6}>
          <Button
            onClick={updateProfile}
            sx={{ width: "100%" }}
            disabled={!!ageHelperText}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={1} sm={3} />

        {/* line break */}
        <Grid item xs={1} />
        <Grid item xs={10} sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar src={localUser?.avatar} sx={{ width: 75, height: 75 }} />
        </Grid>
        <Grid item xs={1} />
        {stravaFields.map(mapFields)}

        <Grid item xs={1} sm={2} />
        <Grid item xs={10} sm={8}>
          <Grid container sx={{ justifyContent: "center" }}>
            {localUser?.stravaClubs?.map((club) => {
              return (
                <Grid item key={club.id}>
                  <Box
                    sx={{
                      display: "flex",
                      border: "3px solid black",
                      borderColor: "strava.main",
                      borderRadius: 10,
                      padding: "5px",
                      margin: "5px",
                      alignItems: "center",
                    }}
                  >
                    <Avatar src={club.profileMedium} />
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 12,
                      }}
                      variant="body1"
                    >
                      {club.name}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2} />

        <Grid item xs={1} sm={3} />
        <Grid item xs={10} sm={6}>
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
        <Grid item xs={1} sm={3} />

        <Grid item xs={1} sm={3} />
        <Grid item xs={10} sm={6}>
          <Button
            onClick={() => {
              fetchProfile(user.athleteId);
            }}
            sx={{ width: "100%" }}
          >
            Re-Fetch Strava Data
          </Button>
        </Grid>
        <Grid item xs={1} sm={3} />
      </Grid>
    </MyPaper>
  );
};

export default UserInfo;
