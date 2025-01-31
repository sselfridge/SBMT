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
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import ClearIcon from "@mui/icons-material/Clear";

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
import { ApiPost } from "api/api";

const Filters = (props) => {
  const { onApplyFilters, searchParams } = props;
  const { user, dispatch } = useContext(AppContext);

  const setUser = (user) => dispatch({ type: "setUser", user });

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

  const [savedFiltersActive, setSavedFiltersActive] = useState(false);

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

  //Check if the current filters are the user's favorites
  useEffect(() => {
    let userFilters = user?.savedFilters;
    if (userFilters) {
      if (typeof userFilters === "string") {
        userFilters = JSON.parse(userFilters);
      }

      const clubId = clubNode?.key;
      const filters = {
        surface,
        gender,
        age,
        category,
        distance,
        elevation,
        clubId,
      };

      let savedFiltersActiveCheck = true;
      for (let filterName in userFilters) {
        if (Object.hasOwnProperty.call(userFilters, filterName)) {
          let userValue = userFilters[filterName];
          let filterValue = filters[filterName];

          if (filterName === "clubId") {
            userValue = Number(userValue);
            filterValue = Number(filterValue);
          }

          if (userValue !== filterValue) {
            savedFiltersActiveCheck = false;
            break;
          }
        }
      }
      if (savedFiltersActiveCheck !== savedFiltersActive) {
        setSavedFiltersActive(savedFiltersActiveCheck);
      }
    }
  }, [
    surface,
    gender,
    age,
    category,
    clubNode,
    distance,
    elevation,
    user,
    savedFiltersActive,
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
      setStravaBtnText("Login for more filters");
    }
  }, [clubId, user]);

  useEffect(() => {
    if (user?.savedFilters) {
      for (const filter in user.savedFilters) {
        if (Object.hasOwnProperty.call(user.savedFilters, filter)) {
          const value = user.savedFilters[filter];
          if (!value) continue;
          switch (filter) {
            case "surface":
              setSurface(value);
              break;
            case "gender":
              setGender(value);
              break;
            case "clubId":
              setClubId(Number(value));
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
      }
    }
  }, [user]);

  const onSaveFilters = () => {
    setSavedFiltersActive(true);
    const filters = {
      surface,
      gender,
      age,
      category,
      distance,
      elevation,
      clubId: 0,
    };

    const clubKey = Number(clubNode.key);
    if (clubKey) {
      filters.clubId = clubKey;
    }
    ApiPost("/api/saveFilters", filters, setUser);
  };

  const onClearSavedFilters = () => {
    setSavedFiltersActive(false);

    const filters = {
      surface: null,
      gender: null,
      age: null,
      category: null,
      distance: null,
      elevation: null,
      clubId: 0,
    };

    ApiPost("/api/saveFilters", filters, setUser);
  };

  const onClearFilters = () => {
    setSurface(surfaceList[1]);
    setGender(genderList[0]);
    setClubId(null);
    setCategory(categoryList[0]);
    setAge(ageList[0]);
    setDistance(distanceList[0]);
    setElevation(elevationList[0]);
    setClubNode(clubList?.[0] || "");
  };

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
      {/* <Button onClick={onSaveFilters}>Save Filters</Button>
      <Button onClick={onClearSavedFilters}>clear Filters</Button> */}

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
          maxWidth={45}
          minWidth={45}
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
      {!stravaBtnText && (
        <React.Fragment>
          <LabeledSelect
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
          {/* <LabeledSelect
            label={"Recent Distance"}
            value={distance}
            setValue={setDistance}
            list={distanceList}
            helpText="Riders within the selected range of your weekly distance totals"
          />
          <LabeledSelect
            label={"Recent Elevation"}
            value={elevation}
            setValue={setElevation}
            list={elevationList}
            helpText="Riders within the selected range of your weekly climbing totals"
          /> */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {savedFiltersActive ? (
              <Tooltip arrow title={"Remove favorite filters"}>
                <IconButton onClick={onClearSavedFilters}>
                  <StarIcon sx={{ color: "strava.main" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip
                arrow
                title={
                  <Box>
                    <Box>
                      <b>Favorite current filters</b>
                    </Box>
                    <Box>
                      Your favorite filters will load by default when you load
                      the leaderboard until they are cleared.
                    </Box>
                  </Box>
                }
              >
                <IconButton onClick={onSaveFilters}>
                  <StarOutlineIcon sx={{ color: "strava.main" }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip arrow title={"Reset all filters"}>
              <IconButton onClick={onClearFilters}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </React.Fragment>
      )}
    </FormGroup>
  );
};

Filters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
  searchParams: PropTypes.object.isRequired,
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
