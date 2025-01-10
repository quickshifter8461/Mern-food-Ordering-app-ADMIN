import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
} from '@mui/material';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleRestaurants = () =>{
    navigate("/restaurants");
  }
  const handleMenus =() =>{
    navigate("/menus");
  }
  const handleOrders =() =>{
    navigate("/orders");
  }
  const handleCoupons =() =>{
    navigate("/coupons");
  }
  const handleUsers =() =>{
    navigate("/users");
  }
  return (
    <Box display="flex" height="100vh" bgcolor="background.default" color="text.primary">
      <Box component="main" flex={1} p={3} sx={{maxHeight:"70vh"}}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to CraveCart Admin Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Restaurants
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Manage your restaurant listings
                </Typography>
                <Button variant="contained" color="primary" onClick={handleRestaurants}>
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Menus
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Add or edit menu items
                </Typography>
                <Button variant="contained" color="primary" onClick={handleMenus}>
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Orders
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Track and manage orders
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOrders}>
                  Track
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Coupons
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Create new coupon or edit existing one
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCoupons}>
                  create
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Users
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Manage users
                </Typography>
                <Button variant="contained" color="primary" onClick={handleUsers}>
                  manage
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
