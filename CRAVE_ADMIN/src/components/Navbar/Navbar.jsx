import React, { useEffect } from "react";
import Logo from "/Logo.png";
import { Avatar, Button, AppBar, Toolbar, Box } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { useApp } from "../AppContext/AppContext";
const Navbar = ({ user = { initial: "" } }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { appState } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = JSON.parse(localStorage.getItem("loggedIn"));
    if (authToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={2}
      sx={{
        backgroundColor: "background.paper",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        zIndex: 1300,
        borderRadius: "0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, lg: 10 },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <img src={Logo} alt="Crave Logo" width={90} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, lg: 3 },
          }}
        >
          {isLoggedIn ? (
            <>
              <Avatar
                sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
                onClick={() => navigate("/my-profile")}
              >
                {user.initial}
              </Avatar>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/account/login")}
                variant="contained"
                color="secondary"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/account/register")}
                variant="outlined"
                color="secondary"
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
