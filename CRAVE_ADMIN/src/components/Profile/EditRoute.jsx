import { Box, Modal } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditProfileForm from "./EditProfile";


const ROUTES = {
  EDIT_PROFILE: "/edit/profile",
};

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); 
  };

  const isEditProfile = location.pathname === ROUTES.EDIT_PROFILE;
  return (
    <>
      <Modal
        open={
          location.pathname === "/edit/profile" 
        }
        onClose={handleClose}
      >
        <Box >
          {location.pathname === "/edit/profile"?<EditProfileForm/>:null}
        </Box>
      </Modal>
    </>
  );
};

export default Edit;
