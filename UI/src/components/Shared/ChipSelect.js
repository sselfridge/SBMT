import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Chip, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const ChipSelect = (props) => {
  const { list, setValue, value } = props;

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

ChipSelect.propTypes = {
  list: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default ChipSelect;
