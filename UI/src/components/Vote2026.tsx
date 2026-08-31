import React, { useState, useCallback, useContext } from "react";
import _ from "lodash";
import {
  Paper,
  Grid,
  Box,
  Typography,
  Avatar,
  Select,
  FormControlLabel,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { type SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import AppContext from "AppContext";

import { useNavigate, useLocation } from "react-router-dom";

import { StravaClub } from "@/types/StravaClub";
import { userRefresh } from "services/strava";
import StravaButton from "./Shared/StravaButton";
import type { AppState } from "@/AppReducer";
import { vote2026 } from "services/sbmt";

const MyPaper = styled(Paper)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  width: "90vw",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
}));

const toggleStr = (str: string, bigStr: string, include: boolean) => {
  let newStr = bigStr;
  if (include) {
    newStr = newStr.includes(str) ? newStr : newStr + " " + str;
  } else {
    newStr = newStr.replace(str, "");
  }
  return newStr.trim();
};

const Vote2026 = () => {
  const { user } = useContext(AppContext) as AppState;
  const navigate = useNavigate();
  const [voteTime, setVoteTime] = useState("");
  const [buttonText, setButtonText] = useState<string | React.ReactNode>(
    "Submit Vote",
  );
  const [error, setError] = useState(false);
  const handleSelect = (e: SelectChangeEvent) => {
    setVoteTime(e.target.value);
  };

  const handleVote = async () => {
    if (!user?.athleteId) {
      return;
    }
    if (!voteTime) return;
    try {
      setButtonText(<CircularProgress size={30} />);
      await vote2026(user.athleteId, voteTime);
      setButtonText("Vote Received!");
      await new Promise((r) => setTimeout(r, 1200));

      navigate("/recent");
    } catch (error) {
      setError(true);
    } finally {
    }
  };

  return (
    <MyPaper>
      {error && <Box>Error Submitting Vote, try again?</Box>}
      {user?.athleteId ? (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexDirection: "column",
              maxWidth: "800px",
            }}
          >
            <Avatar src={user?.avatar} sx={{ width: 75, height: 75 }} />
            <span>
              {user.firstname}
              {user.lastname}
            </span>
            <Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span>Having an end of the season happy hour</span>
                <Link to="https://maps.app.goo.gl/nj5CNrJKS9u6yahP8">
                  Sama Llama San Roque
                </Link>
                3435 State St, Santa Barbara, CA 93105
                <span>Saturday September 12.</span>
              </Box>
            </Box>
            What time would you be able to make? Check all that apply
            <Box sx={{ width: "100%", color: "black" }}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_e, newVal) => {
                        setVoteTime((prev) => toggleStr("noon", prev, newVal));
                      }}
                    />
                  }
                  label="Noon"
                />{" "}
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_e, newVal) => {
                        setVoteTime((prev) => toggleStr("3pm", prev, newVal));
                      }}
                    />
                  }
                  label="3:00pm"
                />{" "}
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_e, newVal) => {
                        setVoteTime((prev) => toggleStr("6pm", prev, newVal));
                      }}
                    />
                  }
                  label="6:00pm"
                />{" "}
                <Button disabled={!voteTime} onClick={handleVote}>
                  {buttonText}
                </Button>
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        <div>
          Please login to vote: <StravaButton />
        </div>
      )}
    </MyPaper>
  );
};

export default Vote2026;
