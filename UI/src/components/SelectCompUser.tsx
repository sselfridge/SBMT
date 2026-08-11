import React, { useState, useContext, useCallback } from "react";
import {
  Box,
  useMediaQuery,
  Avatar,
  Popover,
  TextField,
  ButtonBase,
  IconButton,
  Theme,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import AppContext from "AppContext";
import type { User } from "@/types/StravaUserDTO";
import type { UserSegment } from "@/types/UserSegment";
import { getAthleteEfforts, getAthletes } from "@/services/sbmt";
import { AppState } from "@/AppReducer";
interface SelectCompUserProps {
  setCompSegments: (segments: UserSegment[]) => void;
}

const SelectCompUser = (props: SelectCompUserProps) => {
  const { setCompSegments } = props;

  const { user: meinUser, year }: AppState = useContext(AppContext);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  const [users, setUsers] = useState<User[]>([]);
  const [compUser, setCompUser] = useState(meinUser);
  const [filterText, setFilterText] = useState("");
  const [selectIndex, setSelectIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  React.useEffect(() => {
    const getCompEfforts = async (athleteId: number, year: string | null) => {
      try {
        setLoading(true);
        const newEfforts = await getAthleteEfforts(athleteId, year);
        setCompSegments(newEfforts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isMobile === false && compUser?.athleteId) {
      getCompEfforts(compUser?.athleteId, year);
    }
  }, [isMobile, compUser, setCompSegments, year]);

  const onOpen = useCallback(() => {
    const getUserList = async () => {
      try {
        setListLoading(true);
        const newUsers: User[] = await getAthletes(year);
        const sortedUsers = newUsers
          .slice()
          .sort((a, b) => (a.firstname < b.firstname ? -1 : 1));
        setUsers(sortedUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setListLoading(false);
      }
    };
    setOpen(true);
    if (users.length < 2) {
      getUserList();
    }
  }, [users, year]);

  const filteredUsers = users.filter((u) =>
    `${u.firstname} ${u.lastname}`
      .toLowerCase()
      .includes(filterText.toLowerCase()),
  );

  return (
    <Box>
      <Box
        ref={anchorRef}
        sx={{ maxWidth: "45px", cursor: "pointer" }}
        onClick={onOpen}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            id={`${compUser?.athleteId}`}
            key={compUser?.athleteId}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Avatar src={compUser?.avatar} />
            <ArrowDropDownIcon />
          </Box>
        )}
      </Box>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <TextField
          placeholder="Filter"
          autoFocus
          InputProps={{
            startAdornment: listLoading ? (
              <Box>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <FilterListIcon />
            ),
            endAdornment: (
              <IconButton onClick={() => setFilterText("")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
          value={filterText}
          onChange={(e) => {
            e.stopPropagation();
            setFilterText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (filterText) {
                e.preventDefault();
                e.stopPropagation();
                setFilterText("");
              }
            }
            if (e.key === "ArrowDown") {
              if (selectIndex < filteredUsers.length) {
                setSelectIndex((v) => v + 1);
              }
            }
            if (e.key === "ArrowUp") {
              if (selectIndex >= 0) {
                setSelectIndex((v) => v - 1);
              }
            }
            if (e.key === "Enter") {
              if (selectIndex !== -1 && filteredUsers[selectIndex]) {
                setCompUser(filteredUsers[selectIndex]);
                setOpen(false);
              }
            }
          }}
        />
        <Box sx={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filteredUsers.map((u, i) => {
            return (
              <ButtonBase
                id={`${u.athleteId}`}
                key={`${u.athleteId}`}
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-start",
                  p: 1,
                  backgroundColor:
                    selectIndex === i ? "primary.light" : undefined,
                }}
                onClick={() => {
                  setCompUser(u);
                  setOpen(false);
                }}
              >
                <Avatar src={u.avatar} />
                <Box
                  sx={{ maxWidth: "150px" }}
                >{`${u.firstname} ${u.lastname}`}</Box>
              </ButtonBase>
            );
          })}
        </Box>
        {filteredUsers.length === 0 && <Box>No users match filter</Box>}
      </Popover>
    </Box>
  );
};

export default SelectCompUser;
