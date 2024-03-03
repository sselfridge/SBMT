import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { ApiGet, ApiPut } from "api/api";
import { useNavigate } from "react-router-dom";

import AppContext from "AppContext";

const MyBox = styled(Box)(({ theme }) => ({
  width: "80vw",
  backgroundColor: theme.palette.background.paper,
  overflow: "scroll",
}));

const AdminUsers = (props) => {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  const [updatedUsers, setUpdatedUsers] = useState({});
  console.info("updatedUsers: ", updatedUsers);

  const navigate = useNavigate();

  const refreshUsers = useCallback(() => {
    setUpdatedUsers({});
    ApiGet("/api/admin/users", setUsers, null);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    console.log("user?.athleteId: ", user?.athleteId);
    if (user?.athleteId && user.athleteId !== 1075670) {
      navigate("/");
    }
  }, [navigate, user?.athleteId]);

  const [retVal, setRetVal] = useState({});
  const [error, setError] = useState({});

  const submit = () => {
    Object.keys(updatedUsers).forEach((id, i) => {
      const user = updatedUsers[id];
      console.info("user: ", user);

      ApiPut(
        `/api/admin/users/${id}`,
        user,
        () => {
          if (i === Object.keys(updatedUsers).length - 1) {
            refreshUsers();
          }
        },
        setError
      );
    });
  };

  const columns = [
    {
      field: "athleteId",
      headerName: "AthleteId",
      // flex: 10
    },
    {
      field: "firstname",
      headerName: "Firstname",
      // flex: 10
    },
    {
      field: "lastname",
      headerName: "Lastname",
      // flex: 10
    },
    {
      field: "active",
      headerName: "Active",
      editable: true,
      type: "boolean",
    },
    {
      field: "years",
      headerName: "Years",
      editable: true,
    },
    {
      field: "refreshToken",
      headerName: "RefreshToken",
      // flex: 3
    },
    {
      field: "accessToken",
      headerName: "AccessToken",
      // flex: 3
    },
    {
      field: "expiresAt",
      headerName: "ExpiresAt",
      // flex: 7
    },
    {
      field: "joinDate",
      headerName: "JoinDate",
      // flex: 10
    },
    {
      field: "sex",
      headerName: "Sex",
      // flex: 2
    },
    {
      field: "weight",
      headerName: "Weight",
      // flex: 4
    },
    {
      field: "scope",
      headerName: "Scope",
      editable: true,
      width: 200,
      // flex: 10
    },
    {
      field: "avatar",
      headerName: "Avatar",
      // flex: 1
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <MyBox>
      <Box sx={{ color: "black" }}>{JSON.stringify(error)}</Box>
      <Button
        sx={{ m: 2 }}
        onClick={submit}
        disabled={!Object.keys(updatedUsers).length > 0}
      >
        Save Updates
      </Button>

      <DataGrid
        rows={users || []}
        columns={columns}
        disableColumnMenu
        getRowId={(r) => r.athleteId}
        hideFooter={true}
        editMode="cell"
        onCellEditStart={(params, e, context) => {
          const { id } = params;
          if (id === 1) {
            e.defaultMuiPrevented = true;
          }
        }}
        onCellEditStop={(params, e, a, b, c) => {
          console.info("a,b,c: ", a, b, c);
          console.info("params: ", params);
          const { id, row, field, getValue } = params;
          const value = getValue(id, field);
          console.info("row: ", row);
          setUpdatedUsers((u) => {
            const updated = _.cloneDeep(u);
            console.info("updated: ", updated);
            const user = _.cloneDeep(row);
            user.stravaClubs = [];
            console.info("user: ", user);
            user[field] = value;
            updated[id] = user;
            console.info("updated: ", updated);
            return updated;
          });
        }}
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
