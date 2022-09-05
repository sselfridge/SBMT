import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  Tooltip,
  Button,
  Avatar,
  ListItemIcon,
  Menu,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import stravaSvg from "assets/stravaLogo.svg";
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
  const navTo = (path) => {
    navigate(path);
  };

  const [user, setUser] = React.useState({
    firstName: "SamMock",
    lastName: "WiseMock",
    id: 10645041,
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/10645041/16052758/1/medium.jpg",
  });

  // useEffect(() => {
  //   setUser({});
  // }, []);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          position: "absolute",
          top: "8px",
          right: "8px",
        }}
      >
        {!user.id && (
          <Button
            sx={{
              backgroundColor: "strava.main",
              "&:hover": {
                backgroundColor: "strava.light",
              },
            }}
          >
            Register
          </Button>
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
        {/* <MenuItem>
          <Avatar /> Profile
        </MenuItem> */}
        {user.id && (
          <a href={`https://www.strava.com/athletes/${user.id}`}>
            <MenuItem>
              <Avatar src={stravaSvg} /> My Strava Profile
            </MenuItem>
            <Divider />
          </a>
        )}
        {/* <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem> */}
        {user.id && (
          <MenuItem onClick={() => navTo("/settings")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}
        <MenuItem onClick={() => navTo("/info")}>
          <ListItemIcon>
            <InfoOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Info{" "}
        </MenuItem>
        <MenuItem onClick={() => navTo("/help")}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small" />
          </ListItemIcon>
          Help / Contact
        </MenuItem>
        {user.id && (
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
