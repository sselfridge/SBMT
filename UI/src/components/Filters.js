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

import { useSearchParams } from "react-router-dom";

import LabeledSelect from "./Shared/LabeledSelect";

import {
  ageList,
  categoryList,
  genderList,
  surfaceList,
  distanceList,
  elevationList,
} from "utils/constants";
import AppContext from "AppContext";
import StravaButton from "./Shared/StravaButton";

const Filters = (props) => {
  const { onApplyFilters } = props;
  const { user } = useContext(AppContext);

  const [searchParams] = useSearchParams();
  const [surface, setSurface] = useState(surfaceList[1]);
  const [gender, setGender] = useState(genderList[0]);
  const [age, setAge] = useState(ageList[0]);
  const [distance, setDistance] = useState(distanceList[0]);
  const [elevation, setElevation] = useState(elevationList[0]);

  const [category, setCategory] = useState(categoryList[0]);
  const [clubList, setClubList] = useState([]);
  const [clubNode, setClubNode] = useState("");
  const [clubId, setClubId] = useState(null);
  const [stravaBtnText, setStravaBtnText] = useState("");

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const didMount = React.useRef(false);
  useEffect(() => {
    if (didMount.current === false) {
      for (const [key, value] of searchParams) {
        switch (key) {
          case "surface":
            setSurface(value);
            break;
          case "gender":
            setGender(value);
            break;
          case "club":
            setClubId(value);
            break;
          case "category":
            setCategory(value);
            break;
          case "age":
            setAge(value);
            break;
          case "distance":
            setDistance(value);
            break;
          case "elevation":
            setElevation(value);
            break;

          default:
            break;
        }
      }
      didMount.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    const club = clubNode?.key || 0;
    onApplyFilters({
      surface,
      gender,
      age,
      club,
      category,
      distance,
      elevation,
    });
  }, [
    surface,
    gender,
    age,
    category,
    onApplyFilters,
    clubNode,
    distance,
    elevation,
  ]);

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
      if (clubId) {
        const club = clubs.find((c) => c.key === `${clubId}`);
        setClubNode(club || clubs[0]);
      } else {
        setClubNode(clubs[0]);
      }
      setStravaBtnText("");
    } else if (_.isEmpty(user)) {
      setStravaBtnText("Login to filter by Club");
    }
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
      />
      <LabeledSelect
        label={"Recent Distance"}
        value={distance}
        setValue={setDistance}
        list={distanceList}
      />
      <LabeledSelect
        label={"Recent Elevation"}
        value={elevation}
        setValue={setElevation}
        list={elevationList}
      /> */}
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
