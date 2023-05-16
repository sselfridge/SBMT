import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectLanding = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/`);
  }, [navigate]);

  return <></>;
};

export default RedirectLanding;
