import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Switch,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
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

  const textFieldValRef = useRef("");

  const [isGravel, setIsGravel] = React.useState(false);

  const refreshSegments = useCallback(() => {
    ApiGet("/api/admin/segments", setSegments, null);
  }, []);

  useEffect(() => {
    refreshSegments();
  }, [refreshSegments]);

  const addSegment = () => {
    ApiPost(
      `/api/admin/segments/${textFieldValRef.current}?isGravel=${isGravel}`,
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
            onChange={(e) => (textFieldValRef.current = e.target.value)}
          />
          <Box>
            <FormControlLabel
              labelPlacement="top"
              control={
                <Switch
                  checked={isGravel}
                  onChange={(e) => {
                    setIsGravel(e.target.checked);
                  }}
                />
              }
              label="Gravel?"
            />
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
