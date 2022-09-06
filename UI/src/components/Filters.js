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

const Filters = (props) => {
  const { onApply, surface, gender, category, age } = props;
  const [_surface, setSurface] = useState(surfaceList[0]);
  const [_gender, setGender] = useState(genderList[0]);
  const [_age, setAge] = useState(ageList[0]);
  const [_category, setCategory] = useState(categoryList[0]);

  const handleApplyChanges = React.useCallback(() => {
    onApply({});
  }, [onApply]);

  useEffect(() => {
    console.info("Update ", _surface, _gender, _age, _category);
  }, [_surface, _gender, _age, _category]);

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
        value={_surface}
        setValue={setSurface}
        list={surfaceList}
      />
      <LabeledSelect
        label={"Gender"}
        value={_gender}
        setValue={setGender}
        list={genderList}
      />
      <LabeledSelect
        label={"Category"}
        value={_category}
        setValue={setCategory}
        list={categoryList}
      />
      <LabeledSelect
        label={"Age Group"}
        value={_age}
        setValue={setAge}
        list={ageList}
      />

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
  console.info("hidden: ", hidden);
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
