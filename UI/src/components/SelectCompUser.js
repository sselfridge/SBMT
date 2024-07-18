import React, { useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  useMediaQuery,
  Avatar,
  Popover,
  TextField,
  ButtonBase,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { ApiGet } from "api/api";

import AppContext from "AppContext";

const SelectCompUser = (props) => {
  const { setCompSegments } = props;

  const { user: meinUser } = useContext(AppContext);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [users, setUsers] = useState([meinUser]);
  const [compUser, setCompUser] = useState(meinUser);
  const [filterText, setFilterText] = useState("");
  const [selectIndex, setSelectIndex] = useState(-1);

  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef();
  const selectedItemRef = React.useRef();

  const setSortUsers = (users) =>
    setUsers(
      users.slice().sort((a, b) => (a.firstname < b.firstname ? -1 : 1))
    );

  React.useEffect(() => {
    if (isMobile === false && compUser.athleteId) {
      ApiGet(`/api/athletes/${compUser.athleteId}/efforts`, setCompSegments);
    }
  }, [isMobile, compUser, setCompSegments]);

  const onOpen = useCallback(() => {
    setOpen(true);
    if (users.length < 2) {
      ApiGet("api/athletes", setSortUsers);
    }
  }, [users]);

  const filteredUsers = users.filter((u) =>
    `${u.firstname} ${u.lastname}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  React.useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: "center" });
    }
  }, [selectIndex]);

  return (
    <Box>
      <Box
        ref={anchorRef}
        sx={{ maxWidth: "45px", cursor: "pointer" }}
        onClick={onOpen}
      >
        <Box
          id={compUser.athleteId}
          key={compUser.athleteId}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Avatar src={compUser.avatar} />
          <ArrowDropDownIcon />
        </Box>
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
            startAdornment: <FilterListIcon />,
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
                id={u.athleteId}
                key={u.athleteId}
                ref={selectIndex === i ? selectedItemRef : undefined}
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

SelectCompUser.propTypes = {
  setCompSegments: PropTypes.func.isRequired,
};

export default SelectCompUser;
