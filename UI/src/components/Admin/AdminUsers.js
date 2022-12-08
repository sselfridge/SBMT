import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { ApiGet } from "api/api";
import { useNavigate } from "react-router-dom";

import AppContext from "AppContext";

const MyBox = styled(Box)(({ theme }) => ({
  width: "80vw",
  backgroundColor: theme.palette.background.paper,
}));

const AdminUsers = (props) => {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const refreshUsers = useCallback(() => {
    ApiGet("/api/admin/users", setUsers, null);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    console.info("user?.athleteId: ", user?.athleteId);
    if (user?.athleteId && user.athleteId !== 1075670) {
      navigate("/");
    }
  }, [navigate, user?.athleteId]);

  const columns = [
    { field: "athleteId", headerName: "AthleteId", flex: 10 },
    { field: "firstname", headerName: "Firstname", flex: 10 },
    { field: "lastname", headerName: "Lastname", flex: 10 },
    { field: "refreshToken", headerName: "RefreshToken", flex: 3 },
    { field: "accessToken", headerName: "AccessToken", flex: 3 },
    { field: "expiresAt", headerName: "ExpiresAt", flex: 7 },
    { field: "joinDate", headerName: "JoinDate", flex: 10 },
    { field: "sex", headerName: "Sex", flex: 2 },
    { field: "weight", headerName: "Weight", flex: 4 },
    { field: "scope", headerName: "Scope", flex: 10 },
    { field: "avatar", headerName: "Avatar", flex: 1 },
  ];

  if (!user) {
    return null;
  }

  return (
    <MyBox>
      <DataGrid
        rows={users || []}
        columns={columns}
        disableColumnMenu
        getRowId={(r) => r.athleteId}
        hideFooter={true}
        sx={{
          boxShadow: 2,
          border: 2,
          height: "80vh",
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
      />
    </MyBox>
  );
};

AdminUsers.propTypes = {
  prop: PropTypes.object,
};

export default AdminUsers;
