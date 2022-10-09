import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Paper, Grid, Box, FormGroup, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { ReactComponent as StravaLogo } from "assets/stravaLogoTransparent.svg";

import LabeledSelect from "./Shared/LabeledSelect";

import {
  ageList,
  categoryList,
  genderList,
  surfaceList,
} from "utils/constants";

const MyPaper = styled(Paper)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  width: "80vw",
}));

const categorySelect = categoryList.filter((c) => c !== "ALL");

const Register = (props) => {
  const { prop } = props;

  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");

  return (
    <MyPaper>
      <Typography variant="h3">Register For things</Typography>

      <FormGroup sx={{}}>
        <Typography>Info we need from you</Typography>
        <LabeledSelect
          label={"Category"}
          value={category}
          setValue={setCategory}
          list={categorySelect}
        />
      </FormGroup>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>Info we pulled from Strava</Typography>
          <StravaLogo style={{ height: 20 }} />
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
        <Grid item xs={12}>
          <Button sx={{ width: "100%" }}>Re-Fetch Strava Data</Button>
        </Grid>
      </Grid>
    </MyPaper>
  );
};

Register.propTypes = {
  prop: PropTypes.string,
};

export default Register;
