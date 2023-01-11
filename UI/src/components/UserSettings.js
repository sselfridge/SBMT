import React from "react";
import PropTypes from "prop-types";
import {
  // Avatar,
  Box,
  // List,
  // ListItem,
  // ListItemButton,
  // ListItemIcon,
  // ListItemText,
  // Checkbox,
  // IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import clubs from "mockData/clubs";
import ConfirmDelete from "./ConfirmDelete";
import UserInfo from "./UserInfo";

const MyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 8,
  borderRadius: 4,
}));

const UserSettings = (props) => {
  // const [checked, setChecked] = useState([0]);

  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  return (
    <MyBox>
      <Typography
        variant="h3"
        sx={{
          borderBottomColor: "secondary.main",
          borderBottomWidth: 4,
          borderBottomStyle: "solid",
        }}
      >
        Settings
      </Typography>

      <UserInfo />

      <section>
        <ConfirmDelete />
      </section>
    </MyBox>
  );
};

UserSettings.propTypes = {
  prop: PropTypes.string,
};

export default UserSettings;
