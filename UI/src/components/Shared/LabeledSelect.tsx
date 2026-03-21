import React, { useCallback } from "react";
import {
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface LabeledSelectProps {
  value: string | Element;
  setValue: Function;
  label: string;
  list: string[];
  minWidth?: number;
  maxWidth?: number;
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
        value={value as string} //Not pretty but it works
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

export default LabeledSelect;
