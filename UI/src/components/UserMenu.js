import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  Tooltip,
  Avatar,
  ListItemIcon,
  Menu,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Api from "api/api";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const UserMenu = (props) => {
  const { prop } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let navigate = useNavigate();

  const goToSettings = () => {
    navigate("/settings");
  };

  const [user, setUser] = React.useState({
    firstName: "SamMock",
    lastName: "WiseMock",
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/10645041/16052758/1/medium.jpg",
  });
  const fetchOnce = useRef(true);
  useEffect(() => {
    if (fetchOnce.current) {
      fetchOnce.current = null;
      Api.get("/api/strava/athlete/id")
        .then((response) => {
          if (response.status === 200) setUser(response.data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const onLogout = () => {
    Api.delete("/api/strava/logout")
      .then((res) => {
        console.info(res);
        setUser(null);
      })
      .catch((err) => console.error(err));
  };

  //   if (!user) {
  //     return (
  //       <button>
  //         <a href="https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=https://localhost:5001/api/strava/callback&response_type=code&approval_prompt=auto&scope=read_all,activity:read_all">
  //           Strava Login
  //         </a>
  //       </button>
  //     );
  //   }

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Typography sx={{ color: "primary.contrastText", mr: "15px" }}>
            {user.firstName} {user.lastName}
          </Typography>

          <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} />
        </IconButton>
      </Box>
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
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={goToSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

UserMenu.propTypes = {
  prop: PropTypes.string,
};

export default UserMenu;
