import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Box,
  FormGroup,
  Button,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import LabeledSelect from "./Shared/LabeledSelect";

import {
  ageList,
  categoryList,
  genderList,
  surfaceList,
} from "utils/constants";
import AppContext from "AppContext";
import StravaButton from "./Shared/StravaButton";

const Filters = (props) => {
  const { onApplyFilters } = props;
  const { user } = useContext(AppContext);

  const [surface, setSurface] = useState(surfaceList[1]);
  const [gender, setGender] = useState(genderList[0]);
  const [age] = useState(ageList[0]);
  const [category] = useState(categoryList[0]);
  const [clubList, setClubList] = useState([]);
  const [clubNode, setClubNode] = useState("");
  const [stravaBtnText, setStravaBtnText] = useState("");

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const club = clubNode?.key || 0;
    onApplyFilters({ surface, gender, age, club, category });
  }, [surface, gender, age, category, onApplyFilters, clubNode]);

  useEffect(() => {
    if (user?.scope?.includes("profile:read_all") === false) {
      setClubList([]);
      setStravaBtnText("Enable Clubs");
    } else if (user?.stravaClubs?.length > 0) {
      const emptyClub = (
        <Box id={0} key={0} sx={{ display: "flex" }}>
          {"None"}
        </Box>
      );
      const clubs = user.stravaClubs.map((club) => (
        <Box id={club.id} key={club.id} sx={{ display: "flex" }}>
          <Avatar src={club.profileMedium} />
          {club.name}
        </Box>
      ));
      clubs.unshift(emptyClub);
      setClubList(clubs);
      setClubNode(clubs[0]);
      setStravaBtnText("");
    } else if (_.isEmpty(user)) {
      setStravaBtnText("Login to filter by Club");
    }
    console.info(user);
  }, [user]);

  return (
    <FormGroup
      sx={{
        "& .MuiFormControl-root": {
          paddingRight: "24px",
        },
        justifyContent: "space-around",
      }}
      className="MuiFormGroup-options"
      row
    >
      <LabeledSelect
        label={"Surface"}
        value={surface}
        setValue={setSurface}
        list={surfaceList}
      />
      {/* <ChipSelect
        label={"Surface"}
        list={surfaceList}
        setValue={setSurface}
        value={surface}
      /> */}
      <LabeledSelect
        label={"Gender"}
        value={gender}
        setValue={setGender}
        list={genderList}
      />
      {clubList.length > 0 && (
        <LabeledSelect
          label={"Club"}
          value={clubNode}
          setValue={setClubNode}
          list={clubList}
        />
      )}
      {!!stravaBtnText && (
        <Tooltip
          arrow
          position="left"
          title="Enable 'View Complete Profile' so we can see your club information"
        >
          <Box sx={{ margin: isMobile ? "15px" : "0px 0px 10px" }}>
            <StravaButton text={stravaBtnText} />
          </Box>
        </Tooltip>
      )}
      {/* //TODO Register page isn't ready to take input yet */}
      {/* <LabeledSelect
        label={"Category"}
        value={category}
        setValue={setCategory}
        list={categoryList}
      />
      <LabeledSelect
        label={"Age Group"}
        value={age}
        setValue={setAge}
        list={ageList}
      /> */}

      {/* <Button size="small" variant="contained" onClick={handleApplyChanges}>
        <DoubleArrowIcon fontSize="small" /> Apply
      </Button> */}
    </FormGroup>
  );
};

Filters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
};

const FiltersWithMobile = (props) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return isMobile ? (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Button sx={{ width: "100%" }}>
            Show Filters <FilterListIcon />
          </Button>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingBottom: "6px" }}>
          <Filters {...props} />
        </AccordionDetails>
      </Accordion>
    </Box>
  ) : (
    <Filters {...props} />
  );
};

export default FiltersWithMobile;
