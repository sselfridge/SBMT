import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import AppContext from "AppContext";
import { useNavigate } from "react-router-dom";

import { Box, Paper, Typography, Button } from "@mui/material";

import { ReactComponent as StravaLogo } from "assets/stravaLogoOrange.svg";

import { ApiDelete } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const ConfirmDelete = (props) => {
  const { user, dispatch } = React.useContext(AppContext);

  const navigate = useNavigate();

  const [deletePressed, setDeletePressed] = useState(false);
  const [deleteEnabledCount, setDeleteEnabledCount] = useState(3);
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState("");
  const [deleteComplete, setDeleteComplete] = useState(false);
  const deleteRef = useRef(null);
  const countRef = useRef(null);
  useEffect(() => {
    clearTimeout(deleteRef.current);
    deleteRef.current = setTimeout(() => {
      setDeletePressed(false);
    }, 10000);

    clearInterval(countRef.current);
    if (deletePressed) {
      setDeleteEnabledCount(3);
      countRef.current = setInterval(() => {
        if (deletePressed) {
          setDeleteEnabledCount((v) => v - 1);
        }
      }, 1000);
    }
  }, [deletePressed]);

  const handleDelete = () => {
    setDeletePressed(false);
    ApiDelete(`/api/athletes/${user.athleteId}`, setDeleteComplete, true);
    // setTimeout(() => {
    //   setDeleteConfirmMsg("Your data has been removed");
    // }, 750);
  };

  useEffect(() => {
    if (deleteComplete) {
      dispatch({ type: "setUser", user: {} });

      setDeleteConfirmMsg(
        <div>
          <div>Your data has been removed</div>
          <div>You will be redirected to the home page.</div>
        </div>
      );
      setTimeout(() => {
        navigate("/beta");
      }, 5000);
    }
  }, [deleteComplete, dispatch, navigate]);

  return (
    <MyBox>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "24px",
        }}
      >
        <Typography variant="h4" textAlign={"center"}>
          Delete my Data
        </Typography>
        <Button
          sx={{ minWidth: 350 }}
          variant="contained"
          color={deletePressed ? "info" : "error"}
          onClick={() => {
            setDeleteEnabledCount(3);
            setDeletePressed((v) => !v);
          }}
          // disabled={deletePressed}
        >
          {deletePressed ? "Cancel " : ""}Delete
        </Button>
        {deletePressed && (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "50vw",
            }}
          >
            <Typography variant="h4">Confirm Delete?</Typography>
            <Typography sx={{ margin: "24px" }}>
              Click Big Red Button to remove all data from SBMT.
            </Typography>
            <StravaLogo style={{ width: 40 }} />
            <Typography>Does not remove your data from strava</Typography>
            <Button
              variant="contained"
              color="error"
              disabled={deleteEnabledCount > 0}
              onClick={handleDelete}
            >
              {deleteEnabledCount > 0 ? (
                <Typography>
                  Button will enable in {deleteEnabledCount}
                </Typography>
              ) : (
                <Typography>BIG RED BUTTON</Typography>
              )}
            </Button>
          </Paper>
        )}
      </Paper>
      {deleteConfirmMsg && (
        <Typography variant={"h3"} color="error">
          {deleteConfirmMsg}
        </Typography>
      )}
    </MyBox>
  );
};

ConfirmDelete.propTypes = {
  prop: PropTypes.string,
};

export default ConfirmDelete;
