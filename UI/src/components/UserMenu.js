import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Avatar,
  ListItemIcon,
  Menu,
  Divider,
  MenuItem,
  Typography,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";

//Icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import stravaSvg from "assets/stravaLogoOrange.svg";

import { ApiDelete, ApiGet } from "api/api";

const UserMenuBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  position: "absolute",
  top: "8px",
  right: "8px",
}));

const UserMenu = (props) => {
  const { dispatch, user: contextUser } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let navigate = useNavigate();
  const navTo = (path) => {
    navigate(path);
  };

  const [user, setUser] = useState(null);

  const onSetUser = React.useCallback(
    (user) => dispatch({ type: "setUser", user }),
    [dispatch]
  );

  useEffect(() => {
    setUser(contextUser);
  }, [contextUser]);

  const fetchOnce = useRef(true);
  useEffect(() => {
    if (fetchOnce.current) {
      fetchOnce.current = null;
      ApiGet("/api/athletes/current", onSetUser, true, {});
    }
  }, [onSetUser]);

  const onLogout = () => {
    ApiDelete("/api/logout", onSetUser, {});
  };

  if (user === null) {
    return null;
  }

  let redirect_uri;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    redirect_uri = "https://localhost:5001";
  } else {
    redirect_uri = "https://www.sbmtchallenge.com";
  }
  return (
    <React.Fragment>
      <UserMenuBox>
        {!user?.athleteId && (
          <Link
            href={`https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=${redirect_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=read_all,activity:read_all,profile:read_all`}
            sx={{
              backgroundColor: "strava.main",
              padding: "10px 20px",
              borderRadius: 2,
              textDecoration: "none",

              "&:hover": {
                backgroundColor: "strava.light",
              },
            }}
          >
            <Typography
              sx={{
                color: "strava.contrastText",
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
              variant="h6"
            >
              Register / Login
            </Typography>
          </Link>
        )}
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Typography
            sx={{
              color: "primary.contrastText",
              mr: "15px",
              maxWidth: "160px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.firstname} {user?.lastname}
          </Typography>

          <Avatar src={user?.avatar} />
        </IconButton>
      </UserMenuBox>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user?.athleteId && (
          <a href={`https://www.strava.com/athletes/${user?.athleteId}`}>
            <MenuItem>
              <Avatar src={stravaSvg} /> My Strava Profile
            </MenuItem>
            <Divider />
          </a>
        )}

        {user?.athleteId && (
          <MenuItem onClick={() => navTo("settings")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}
        <MenuItem onClick={() => navTo("info")}>
          <ListItemIcon>
            <InfoOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Info{" "}
        </MenuItem>
        <MenuItem onClick={() => navTo("help")}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small" />
          </ListItemIcon>
          Help / Contact
        </MenuItem>
        {user?.athleteId && (
          <MenuItem onClick={onLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
};

UserMenu.propTypes = {
  prop: PropTypes.string,
};

export default UserMenu;
