import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { MenuItem, Box, FormControl, InputLabel, Select } from "@mui/material";

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
        sx={{
          ":first-letter": {
            textTransform: "capitalize",
          },
          minWidth,
        }}
      >
        {list.map((item, idx) => (
          <MenuItem value={item} key={idx}>
            <Box sx={{ ":first-letter": { textTransform: "uppercase" } }}>
              {item}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

LabeledSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
};

export default LabeledSelect;
