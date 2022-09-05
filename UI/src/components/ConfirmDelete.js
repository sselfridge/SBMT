import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactComponent as StravaLogo } from "assets/stravaLogo.svg";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const ConfirmDelete = (props) => {
  const [deletePressed, setDeletePressed] = useState(false);
  const [deleteEnabledCount, setDeleteEnabledCount] = useState(3);
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState("");
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
    setTimeout(() => {
      setDeleteConfirmMsg("Your data has been removed");
    }, 750);
  };
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
            }}
          >
            <Typography variant="h4">Confirm Delete?</Typography>
            <Typography sx={{ margin: "24px" }}>
              Click button below within 10 seconds of pressing 'Delete' button
              to remove all data from SBMT.
            </Typography>
            <StravaLogo />
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
