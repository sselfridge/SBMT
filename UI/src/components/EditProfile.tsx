import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const EditProfile = () => {
  return <MyBox>Edit Profile</MyBox>;
};

export default EditProfile;
