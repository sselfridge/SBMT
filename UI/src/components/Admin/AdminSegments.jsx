import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { ApiGet } from "api/api";
import { useNavigate, Link } from "react-router-dom";

import AppContext from "AppContext";
import StravaButton from "components/Shared/StravaButton";
import { ApiPost } from "api/api";
import { metersToMiles } from "utils/helperFuncs";
import { ApiDelete } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({
  width: "80vw",
  backgroundColor: theme.palette.background.paper,
}));

const AdminSegments = (props) => {
  const { user } = useContext(AppContext);
  const [segments, setSegments] = useState([]);

  const [newSegment, setNewSegment] = useState(null);
  const navigate = useNavigate();

  const [segmentId, setSegmentId] = React.useState(null);
  const [surfaceType, setSurfaceType] = React.useState("road");

  const refreshSegments = useCallback(() => {
    ApiGet("/api/admin/segments", setSegments, null);
  }, []);

  useEffect(() => {
    refreshSegments();
  }, [refreshSegments]);

  const addSegment = () => {
    ApiPost(
      `/api/admin/segments/${segmentId}?surfaceType=${surfaceType}`,
      {},
      (newSegment) => {
        setNewSegment(newSegment);
        refreshSegments();
      },
      () => setNewSegment({ name: "Segment Already exists" })
    );
  };

  useEffect(() => {
    console.log("user?.athleteId: ", user?.athleteId);
    if (user?.athleteId && user.athleteId !== 1075670) {
      navigate("/");
    }
  }, [navigate, user?.athleteId]);

  const columns = [
    {
      field: "name",
      headerName: "Segment",
      flex: 20,
      renderCell: (cell) => {
        const { value, id } = cell;
        return <Link to={`${id}`}>{value}</Link>;
      },
    },
    // {
    //   field: "usage",
    //   headerName: "Total Efforts",
    //   flex: 20,
    //   renderCell: (props) => {
    //     const { value, id } = props;
    //     return 0;
    //   },
    // },
    {
      field: "id",
      headerName: "Action",
      // flex: 4,
      minWidth: 4,
      renderCell: (cell) => {
        const { id } = cell;
        return (
          <Button
            onClick={() => {
              ApiDelete(`/api/admin/segments/${id}`, refreshSegments);
            }}
            sx={{ backgroundColor: "red" }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <MyBox>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", color: "black", p: 1 }}>
          <Button
            onClick={() => {
              navigate("/admin");
            }}
          >
            Back to Admin
          </Button>
          <TextField
            label="Segment ID"
            value={segmentId}
            onChange={(e) => setSegmentId(e.target.value)}
          />
          <Box>
            <FormControl>
              <InputLabel id="surfaceSelectLabel">Surface</InputLabel>
              <Select
                id="hellothere"
                labelId="surfaceSelectLabel"
                label="Surface"
                value={surfaceType}
                onChange={(e) => setSurfaceType(e.target.value)}
              >
                <MenuItem value={"road"}>Road</MenuItem>
                <MenuItem value={"gravel"}>Gravel</MenuItem>
                <MenuItem value={"trail"}>Trail Run</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button onClick={addSegment}>Add Segment</Button>
          {newSegment && (
            <Paper>
              <Typography>Name: {newSegment?.name}</Typography>
              <Typography>
                Distance: {metersToMiles(newSegment?.distance)}mi
              </Typography>
            </Paper>
          )}
        </Box>

        {segments === null && <StravaButton text={"Refresh Admin Cookie"} />}
      </Box>
      <DataGrid
        rows={segments || []}
        columns={columns}
        disableColumnMenu
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

AdminSegments.propTypes = {
  prop: PropTypes.object,
};

export default AdminSegments;
