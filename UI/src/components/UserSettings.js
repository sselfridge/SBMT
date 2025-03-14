import React, { useContext, useState, Fragment } from "react";
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
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import clubs from "mockData/clubs";
import ConfirmDelete from "./ConfirmDelete";
import UserInfo from "./UserInfo";
import AppContext from "AppContext";
import StravaButton from "./Shared/StravaButton";

const MyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 1,
  padding: 8,
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
}));

const UserSettings = (props) => {
  const { user } = useContext(AppContext);
  const [noClubScope, setNoClubScope] = useState(false);
  const [noActivityScope, setNoActivityScope] = useState(false);
  React.useEffect(() => {
    if (user?.scope?.includes("profile:read_all") === false) {
      setNoClubScope(true);
    }

    if (user?.scope?.includes("activity:read") === false) {
      setNoActivityScope(true);
    }
  }, [user?.scope]);

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
      {noActivityScope ? (
        <Box>
          <Typography variant="h6">
            Looks like you haven't enabled view activity scope. Without this
            permission SBMT won't be able to get any info for your rides.
          </Typography>
          <br />
          <Typography variant="h6">
            In order to proceed, click the link below and make sure the checkbox
            for <br />
            <b>View data about your activities</b>
            <br /> is enabled.
          </Typography>
          <br />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <StravaButton text='Add "Activity" scope' />
          </Box>
        </Box>
      ) : (
        <Fragment>
          {noClubScope && (
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 3,
              }}
            >
              <Typography
                sx={{ color: "warning.main", fontWeight: 800 }}
                variant="h4"
              >
                Warning
              </Typography>
              <Typography>
                You haven't given 'complete profile' permission, without this
                you won't be able to view or be seen on club based leaderboards.
              </Typography>
              <StravaButton text='Add "View Complete Profile" scope' />
            </Paper>
          )}
          <UserInfo />
          <section>
            <ConfirmDelete />
          </section>
        </Fragment>
      )}
    </MyBox>
  );
};

UserSettings.propTypes = {
  prop: PropTypes.string,
};

export default UserSettings;
