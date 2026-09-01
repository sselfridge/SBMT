import React from "react";
import { Box, Chip, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

interface ChipSelectProps {
  list: string[];
  value: string;
  setValue: (value: string) => void;
}

const ChipSelect: React.FC<ChipSelectProps> = ({ list, setValue, value }) => {
  return (
    <MyBox>
      <FormHelperText>Surface</FormHelperText>
      <div>
        {list.map((label) => {
          const selected = value === label;

          return (
            <Chip
              key={label}
              label={label}
              color={selected ? "secondary" : "default"}
              clickable
              onClick={() => setValue(label)}
            />
          );
        })}
      </div>
    </MyBox>
  );
};

export default ChipSelect;
