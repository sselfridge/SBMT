import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  useLocation,
  useMatch,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Athletes = (props) => {
  const { prop } = props;
  const params = useParams();
  const [isValid, setIsValid] = useState(true);
  React.useEffect(() => {
    if (params.id !== "1234") {
      setIsValid(false);
    }
  }, [params]);

  if (isValid) {
    return <MyBox>Athlete Details {params.id}</MyBox>;
  } else {
    return <MyBox>Athlete Not found {params.id}</MyBox>;
  }
};

Athletes.propTypes = {
  prop: PropTypes.string,
};

export default Athletes;
