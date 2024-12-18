import { Box, Modal } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegistrationForm from "./Register";
import LoginCard from "./Login";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/");
  };

  return (
    <>
      <Modal
        open={
          location.pathname === "/account/register" ||
          location.pathname === "/account/login"
        }
        onClose={handleClose}
      >
        <Box>
          {location.pathname === "/account/register" ? (
            <RegistrationForm />
          ) : (
            <LoginCard />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Auth;
