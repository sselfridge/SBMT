import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

const LabeledSelect = (props) => {
  const { value, label, setValue, list, minWidth = 60 } = props;

  const onChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  return (
    <FormControl variant="standard">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        sx={{ textTransform: "capitalize", minWidth }}
      >
        {list.map((item, idx) => (
          <MenuItem value={item} key={idx} sx={{ textTransform: "capitalize" }}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

LabeledSelect.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
};

export default LabeledSelect;
