import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { ApiGet } from "api/api";
import { useNavigate, Link } from "react-router-dom";

import AppContext from "AppContext";
import StravaButton from "components/Shared/StravaButton";

const MyBox = styled(Box)(({ theme }) => ({
  width: "80vw",
  backgroundColor: theme.palette.background.paper,
}));

const columns = [
  {
    field: "name",
    headerName: "Segment",
    flex: 20,
    renderCell: (props) => {
      const { value, id } = props;
      return <Link to={`${id}`}>{value}</Link>;
    },
  },
  {
    field: "usage",
    headerName: "Total Efforts",
    flex: 20,
    renderCell: (props) => {
      const { value, id } = props;
      return 0;
    },
  },
  {
    field: "id",
    headerName: "Action",
    // flex: 4,
    minWidth: 4,
    renderCell: (props) => {
      const { value, id } = props;
      return <Button sx={{ backgroundColor: "red" }}>Delete</Button>;
    },
  },
];

const AdminSegments = (props) => {
  const [segments, setSegments] = useState([]);
  // console.info("segments: ", segments);

  const navigate = useNavigate();
  useEffect(() => {
    ApiGet("/api/admin/segments", setSegments, null);
  }, []);

  const { user } = useContext(AppContext);

  useEffect(() => {
    console.info("user?.athleteId: ", user?.athleteId);
    if (user?.athleteId && user.athleteId !== 1075670) {
      navigate("/beta");
    }
  }, [navigate, user?.athleteId]);

  if (!user) {
    return null;
  }

  return (
    <MyBox>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <TextField />
          <Button>Add Segment</Button>
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
