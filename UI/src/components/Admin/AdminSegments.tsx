import React from "react";
import _ from "lodash";
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
  Autocomplete,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { ApiGet, ApiPut } from "api/api";
import { useNavigate, Link } from "react-router-dom";

import AppContext from "AppContext";
import StravaButton from "components/Shared/StravaButton";
import { ApiPost } from "api/api";
import { metersToMiles } from "utils/helperFuncs";
import { ApiDelete } from "api/api";
import { surfaceList, YEARS, SURFACE } from "utils/constants";

import type { Segment } from "@/types/db/Segment";

type SegmentField = "surfaceType" | "years";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MyBox = styled(Box)(({ theme }) => ({
  width: "80vw",
  backgroundColor: theme.palette.background.paper,
}));

const AdminSegments = () => {
  const { user } = React.useContext(AppContext);
  const [segments, setSegments] = React.useState<Segment[]>([]);

  const [newSegment, setNewSegment] = React.useState<Segment | null>(null);
  const navigate = useNavigate();

  const [segmentId, setSegmentId] = React.useState<string | null>(null);
  const [surfaceType, setSurfaceType] = React.useState(SURFACE.road);

  const [yearCopyFrom, setYearCopyFrom] = React.useState<string>("");
  const [yearCopyTo, setYearCopyTo] = React.useState<string>("");

  const refreshSegments = React.useCallback(() => {
    ApiGet("/api/admin/segments", setSegments, null);
  }, []);

  React.useEffect(() => {
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
      () => setNewSegment({ name: "Segment Already exists" } as Segment),
    );
  };

  const updateSegment = (segmentId: any, field: SegmentField, newVal: any) => {
    const segment = segments.find((s) => s.id === segmentId);
    const newSeg = _.cloneDeep(segment);
    if (newSeg) {
      newSeg[field] = newVal;
      ApiPut(
        `/api/admin/segments/${newSeg.id}`,
        newSeg,
        refreshSegments,
        (err) => {
          console.error(err);
        },
      );
    }
  };

  const copySegmentYear = (to: string, from: string) => {
    const newSegments = _.cloneDeep(segments);

    newSegments.forEach((s) => {
      if (s.years.includes(from) && !s.years.includes(to)) {
        const yearArr = s.years.split(",");
        yearArr.push(to);
        s.years = yearArr.join(",");
        setTimeout(() => {
          updateSegment(s.id, "years", s.years);
        }, 500);
      }
    });
  };

  React.useEffect(() => {
    if (user?.athleteId && user.athleteId !== 1075670) {
      navigate("/");
    }
  }, [navigate, user?.athleteId]);

  const columns = [
    {
      field: "name",
      headerName: "Segment",
      flex: 10,
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
      field: "surfaceType",
      headerName: "Surface",
      flex: 5,
      renderCell: (params) => {
        const { value, id } = params;
        return (
          <Autocomplete
            sx={{ width: "100%" }}
            options={surfaceList.filter(
              (s) => s !== SURFACE.all && s !== SURFACE.bikes,
            )}
            value={value}
            filterOptions={(v) => v}
            onChange={(e, newVal) => {
              updateSegment(id, "surfaceType", newVal);
            }}
            renderInput={(props) => {
              return <TextField {...props} />;
            }}
          />
        );
      },
    },
    {
      field: "years",
      headerName: "Season",
      flex: 15,
      renderCell: (params) => {
        const { value, id } = params;
        const yearsArr = value.split(",") || [];

        return (
          <Autocomplete
            options={YEARS}
            multiple
            disableCloseOnSelect
            disableClearable
            limitTags={1}
            value={yearsArr}
            onChange={(e, newVal) => {
              updateSegment(id, "years", newVal.join(","));
            }}
            renderInput={(props) => {
              return <TextField {...props} />;
            }}
            renderTags={(tags) => (
              <div>
                {tags.map((v, i) => `${v}${i === tags.length - 1 ? "" : ","}`)}
              </div>
            )}
            renderOption={(params, option, { selected }) => {
              const { key, ...optionProps } = params;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              );
            }}
          />
        );
      },
    },
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
  ] as GridColDef<Segment>[];

  if (!user) {
    return null;
  }

  return (
    <MyBox>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            color: "black",
            p: 1,
            justifyContent: "space-between",
            gap: 1,
            width: "100%",
          }}
        >
          <Button
            onClick={() => {
              navigate("/admin");
            }}
          >
            Back to Admin
          </Button>
          <Box sx={{ display: "flex" }}>
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
                  <MenuItem value={SURFACE.road}>Road</MenuItem>
                  <MenuItem value={SURFACE.gravel}>Gravel</MenuItem>
                  <MenuItem value={SURFACE.trail}>Trail Run</MenuItem>
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
          <Box sx={{ display: "flex" }}>
            <Autocomplete
              sx={{ width: "130px" }}
              options={YEARS}
              onChange={(e, newVal) => {
                if (newVal) setYearCopyTo(newVal);
              }}
              renderInput={(props) => {
                return <TextField label="New Season" {...props} />;
              }}
            />
            <Autocomplete
              sx={{ width: "130px" }}
              options={YEARS}
              onChange={(e, newVal) => {
                if (newVal) setYearCopyFrom(newVal);
              }}
              renderInput={(props) => {
                return <TextField label="Copy From" {...props} />;
              }}
            />
            <Button onClick={() => copySegmentYear(yearCopyTo, yearCopyFrom)}>
              Copy
            </Button>
          </Box>
        </Box>

        {segments === null && <StravaButton text={"Refresh Admin Cookie"} />}
      </Box>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
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

export default AdminSegments;
