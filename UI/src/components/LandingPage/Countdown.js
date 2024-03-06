import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { differenceInSeconds } from "date-fns";

const MyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  fontSize: "30px",
}));

const Countdown = (props) => {
  const { targetDate } = props;

  const intervalRef = React.useRef();
  const [countdown, setCountdown] = useState({
    dayDisplay: "",
    lower: "...soon",
  });
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const difference = differenceInSeconds(targetDate, new Date());

      // Convert seconds into days, hours, minutes, and seconds
      const days = Math.floor(difference / (60 * 60 * 24));
      const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = difference % 60;

      // Return the countdown in the format: days:hours:minutes:seconds
      const dayDisplay = days > 0 ? `${days} days\n` : "";
      const lower = `${hours}:${minutes.toFixed(0).padStart(2, "0")}:${seconds
        .toFixed(0)
        .padStart(2, "0")}`;

      setCountdown({ dayDisplay, lower });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [targetDate]);

  return (
    <MyBox>
      <Box>{countdown.dayDisplay}</Box>
      <Box>{countdown.lower}</Box>
    </MyBox>
  );
};

Countdown.defaultProps = {
  targetDate: new Date("May 24, 2024"),
};

Countdown.propTypes = {
  targetDate: PropTypes.object,
};

export default Countdown;
