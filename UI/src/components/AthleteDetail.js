import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { users } from "mockData/data";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  color: theme.palette.common.black,
  backgroundColor: theme.palette.background.paper,
}));
const ProfileImg = styled("img")(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  height: 40,
  width: 40,
  color: theme.palette.common.black,
  backgroundColor: theme.palette.background.paper,
  fontSize: 3,
}));

const Athletes = (props) => {
  const params = useParams();
  const [user, setUser] = useState(undefined);
  React.useEffect(() => {
    console.info(params.id);
    const result = users.find((u) => {
      return `${u.id}` === `${params.id}`;
    });
    if (result) {
      setUser(result);
    }
  }, [params]);

  if (user) {
    return (
      <MyBox>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: "flex" }}>
                <ProfileImg src={user.profile} alt="profile_img" />{" "}
                <div>
                  {user.firstname} {user.lastname}
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{user.sex}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{(user.weight * 2.2).toFixed(0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {user.city}, {user.state}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </MyBox>
    );
  } else {
    return <MyBox>Athlete Not found {params.id}</MyBox>;
  }
};

Athletes.propTypes = {
  prop: PropTypes.string,
};

export default Athletes;
