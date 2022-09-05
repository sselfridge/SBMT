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
} from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import LabeledSelect from "./Shared/LabeledSelect";

import { styled } from "@mui/material/styles";
import {
  ageList,
  categoryList,
  genderList,
  surfaceList,
} from "utils/constants";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

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

      <Button size="small" variant="contained" onClick={handleApplyChanges}>
        <DoubleArrowIcon fontSize="small" /> Apply
      </Button>
    </FormGroup>
  );
};

Filters.propTypes = {
  prop: PropTypes.string,
};

export default Filters;
