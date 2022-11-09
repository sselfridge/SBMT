import React, { useState } from "react";
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

const MyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 8,
  borderRadius: 4,
  "& section": {
    marginBottom: 50,
  },
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
        User Settings
      </Typography>

      {/* <section>
        <List
          sx={{
            color: "text.primary",
            maxWidth: 650,
            width: "95vw",

            bgcolor: "background.paper",
          }}
        >
          {clubs.map((club, idx) => {
            console.log("club: ", club);
            const labelId = `checkbox-list-label-${idx}`;

            return (
              <ListItem
                key={idx}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <Avatar src={club.avatar} />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(club.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(club.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      // whiteSpace: "nowrap",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      "& > span": {
                        width: "95%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      },
                    }}
                    id={labelId}
                    primary={club.name}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </section> */}
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
