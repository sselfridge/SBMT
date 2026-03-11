import React, { useCallback } from "react";
import PropTypes from "prop-types";
import {
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface LabeledSelectProps {
  value: string;
  setValue: Function;
  label: string;
  list: string[];
  minWidth?: number;
  maxWidth: number;
  helpText?: string;
  onOpen?: (event: React.SyntheticEvent<Element, Event>) => void;
}

const LabeledSelect = (props: LabeledSelectProps) => {
  const {
    value,
    label,
    setValue,
    list,
    minWidth = 60,
    maxWidth,
    helpText = "",
    onOpen = () => {},
  } = props;

  const onChange = useCallback(
    (e: SelectChangeEvent) => {
      setValue(e.target.value);
    },
    [setValue],
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
          maxWidth,
        }}
        onOpen={onOpen}
      >
        {helpText && <Box sx={{ p: 1, maxWidth: "200px" }}>{helpText}</Box>}
        {list.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
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
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  helpText: PropTypes.string,
  onOpen: PropTypes.func,
};

export default LabeledSelect;
