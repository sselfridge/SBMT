import React, { useState, useContext, useEffect, useCallback } from "react";
import _, { cloneDeep } from "lodash";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ApiGet, ApiPatch } from "api/api";
import { useNavigate } from "react-router-dom";

import AppContext from "AppContext";

import { ADMIN_ATHLETE_ID, APP_ATHLETE_ID } from "utils/constants";
import { AdminUser } from "@/types/StravaUserDTO";

const MyBox = styled(Box)(({ theme }) => ({
  width: "80vw",
  backgroundColor: theme.palette.background.paper,
  overflow: "scroll",
}));

type UpdatableFields = "years" | "active";

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
  {
    field: "email",
    headerName: "Email",
  },
] as GridColDef<AdminUser>[];

const AdminUsers = () => {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [updatedUsers, setUpdatedUsers] = useState<Record<string, AdminUser>>(
    {},
  );
  const [error, setError] = useState<unknown>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(true);
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

  const submit = () => {
    const users: AdminUser[] = [];
    console.log("updatedUsers: ", updatedUsers);

    Object.keys(updatedUsers).forEach((athleteId, i) => {
      const user = updatedUsers[athleteId];
      user.athleteId = Number(athleteId);
      users.push(user);
    });
    ApiPatch(
      `/api/admin/users`,
      users,
      () => {
        refreshUsers();
      },
      setError,
    );
  };

  if (!user) {
    return null;
  }

  const updatedKeys = Object.keys(updatedUsers);
  const hasKeys = updatedKeys.length > 0;

  const disableSave = !hasKeys;

  return (
    <MyBox>
      <Button
        onClick={() => {
          navigate("/admin");
        }}
      >
        Back to Admin
      </Button>
      <Button sx={{ m: 2 }} onClick={submit} disabled={disableSave}>
        Save Updates
      </Button>
      {!showConfirm && (
        <Button
          onClick={() => {
            setShowConfirm(true);
            setTimeout(() => setDisableConfirm(false), 1500);

            //reset to initial
            setTimeout(() => setDisableConfirm(true), 4500);
            setTimeout(() => setShowConfirm(false), 4500);
          }}
        >
          Mark All Inactive
        </Button>
      )}
      {showConfirm && (
        <Button
          disabled={disableConfirm}
          onClick={() => {
            setUpdatedUsers((prev) => {
              const updated = cloneDeep(prev);
              users.forEach((u) => {
                const { athleteId } = u;
                if (
                  athleteId === APP_ATHLETE_ID ||
                  athleteId === ADMIN_ATHLETE_ID
                ) {
                  return;
                }
                const updateUser: AdminUser =
                  updated[athleteId] || ({} as AdminUser);
                updateUser.active = false;
                updated[athleteId] = updateUser;
              });
              return updated;
            });
          }}
        >
          Confirm?
        </Button>
      )}
      <Box sx={{ color: "black" }}>{JSON.stringify(error)}</Box>

      <DataGrid
        rows={users || []}
        columns={columns}
        disableColumnMenu
        getRowId={(r) => {
          return r.athleteId;
        }}
        hideFooter={true}
        editMode="cell"
        onCellEditStart={(params, e, context) => {
          const { id } = params;
          if (id === APP_ATHLETE_ID) {
            e.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={(newRow, oldRow) => {
          const { athleteId } = newRow;
          const editableFields: UpdatableFields[] = ["years", "active"];

          setUpdatedUsers((u) => {
            const updated = _.cloneDeep(u);

            let changed = false;
            const updateUser: AdminUser =
              updated[athleteId] || ({} as AdminUser);
            editableFields.forEach((f) => {
              if (newRow[f] !== oldRow[f]) {
                changed = true;
                const newVal = newRow[f];
                updateUser[f] = newVal as never;
              }
            });
            updated[athleteId] = updateUser;

            return changed ? updated : u;
          });

          return newRow;
        }}
        onProcessRowUpdateError={(error) => {
          console.error("UpdateError", error);
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

export default AdminUsers;
