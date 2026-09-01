import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BetaRedirect = () => {
  const params = useParams();
  const navigate = useNavigate();

  const splat = params["*"];

  useEffect(() => {
    navigate(`/${splat}`);
  }, [navigate, splat]);

  return <></>;
};

export default BetaRedirect;
