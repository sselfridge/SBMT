import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Avatar,
  ListItemIcon,
  Menu,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

//Icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Logout from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import AppContext from "AppContext";
import { ApiDelete } from "api/api";
import StravaButton from "./Shared/StravaButton";

const UserMenuBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  position: "absolute",
  top: "8px",
  right: "8px",
}));

const UserMenu = () => {
  const { dispatch, user: contextUser } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let navigate = useNavigate();
  let { pathname } = useLocation();
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
    if (
      contextUser?.scope &&
      contextUser.scope.includes("activity:read") === false &&
      pathname !== "/settings"
    ) {
      navigate("/settings");
    }
  }, [contextUser, navigate, pathname]);

  const onLogout = () => {
    ApiDelete("/api/logout", onSetUser, {});
  };

  if (user === null) {
    return null;
  }

  return (
    <React.Fragment>
      <UserMenuBox>
        {!user?.athleteId && <StravaButton />}
        <IconButton
          onClick={handleClick}
          size="small"
          // sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Typography
            sx={{
              color: "primary.contrastText",
              mr: user?.athleteId ? "15px" : undefined,
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
          <MenuItem onClick={() => navTo(`athletes/${user?.athleteId}`)}>
            <ListItemIcon>
              <AnalyticsIcon fontSize="small" />
            </ListItemIcon>{" "}
            My Efforts
            <Divider />
          </MenuItem>
        )}
        {user?.athleteId === 1075670 && (
          <MenuItem onClick={() => navTo("admin")}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Admin
          </MenuItem>
        )}
        {user?.athleteId && (
          <MenuItem onClick={() => navTo("settings")}>
            <ListItemIcon>
              <AccountBoxIcon fontSize="small" />
            </ListItemIcon>
            My Profile
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

export default UserMenu;
