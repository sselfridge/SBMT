import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  MenuItem,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  Button,
  Paper,
  useMediaQuery,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import FilterListIcon from "@mui/icons-material/FilterList";
import LabeledSelect from "./Shared/LabeledSelect";

import {
  ageList,
  categoryList,
  genderList,
  surfaceList,
} from "utils/constants";

import ChipSelect from "./Shared/ChipSelect";

const Filters = ({ onApplyFilters }) => {
  const [surface, setSurface] = useState(surfaceList[0]);
  const [gender, setGender] = useState(genderList[0]);
  const [age, setAge] = useState(ageList[0]);
  const [category, setCategory] = useState(categoryList[0]);

  useEffect(() => {
    onApplyFilters({ surface, gender, age, category });
  }, [surface, gender, age, category, onApplyFilters]);

  return (
    <FormGroup
      sx={{
        "& .MuiFormControl-root": {
          paddingRight: "24px",
        },
        justifyContent: "space-around",
      }}
      className="MuiFormGroup-options"
      row
    >
      <LabeledSelect
        label={"Surface"}
        value={surface}
        setValue={setSurface}
        list={surfaceList}
      />
      {/* <ChipSelect
        label={"Surface"}
        list={surfaceList}
        setValue={setSurface}
        value={surface}
      /> */}
      <LabeledSelect
        label={"Gender"}
        value={gender}
        setValue={setGender}
        list={genderList}
      />
      {/* //TODO Register page isn't ready to take input yet */}
      {/* <LabeledSelect
        label={"Category"}
        value={category}
        setValue={setCategory}
        list={categoryList}
      />
      <LabeledSelect
        label={"Age Group"}
        value={age}
        setValue={setAge}
        list={ageList}
      /> */}

      {/* <Button size="small" variant="contained" onClick={handleApplyChanges}>
        <DoubleArrowIcon fontSize="small" /> Apply
      </Button> */}
    </FormGroup>
  );
};

Filters.propTypes = {
  prop: PropTypes.string,
};

const FiltersWithMobile = (props) => {
  const hidden = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return hidden ? (
    <Box>
      <Accordion>
        <AccordionSummary>
          <Button sx={{ width: "100%" }}>
            Show Filters <FilterListIcon />
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          <Filters {...props} />
        </AccordionDetails>
      </Accordion>
    </Box>
  ) : (
    <Filters {...props} />
  );
};

export default FiltersWithMobile;
