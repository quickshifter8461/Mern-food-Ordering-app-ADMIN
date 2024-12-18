import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { axiosInstance } from "../../Config/api";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const navigate = useNavigate();

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(
          "/restaurants/all-restaurants"
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch menu items for the selected restaurant
  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await axiosInstance.get(
        `/restaurants/${restaurantId}/menu`
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // Handle restaurant selection
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMenuItems(restaurant._id);
  };

  // Handle deleting a menu item
  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      // Confirm deletion before proceeding
      if (window.confirm("Are you sure you want to delete this menu item?")) {
        await axiosInstance.delete(
          `/restaurants/menuitems/${selectedRestaurant._id}/${menuItemId}`
        );
        setMenuItems((prev) => prev.filter((item) => item._id !== menuItemId));
      } else {
        return;
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  // Navigate to edit menu item page
  const handleEditMenuItem = (menuItemId, restaurantId) => {
    navigate(`/edit/menus`, {
      state: { menuItemId: menuItemId, restaurantId: restaurantId },
    });
  };

  // Navigate to add new menu item page
  const handleAddMenuItem = () => {
    navigate(`/edit/menus`, {
      state: { restaurantId: selectedRestaurant._id },
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      {!selectedRestaurant ? (
        <>
          <Typography variant="h4" gutterBottom>
            Select a Restaurant
          </Typography>
          <Grid container spacing={2}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                <Card
                  onClick={() => handleRestaurantClick(restaurant)}
                  sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
                >
                  <CardContent>
                    <Typography variant="h6">{restaurant.name}</Typography>
                    <Typography variant="body2">
                      {restaurant.location}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Menu for {selectedRestaurant.name}
          </Typography>
          <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedRestaurant(null)}
          >
            Back to Restaurants
          </Button>
          <Button
          sx={{marginLeft: 2}}
            variant="contained"
            color="secondary"
            onClick={handleAddMenuItem}
          >
            Add Menu Item
          </Button>
          </Box>
          <Grid container spacing={2}>
            {menuItems.map((menuItem) => (
              <Grid item xs={12} sm={6} md={4} key={menuItem._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{menuItem.name}</Typography>
                    <Typography variant="body2">
                      {menuItem.description}
                    </Typography>
                    <Typography variant="body2">
                      Price: ₹{menuItem.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      {menuItem.isAvailable ? "Available" : "Out of stock"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      onClick={() =>
                        handleEditMenuItem(menuItem._id, selectedRestaurant._id)
                      }
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteMenuItem(menuItem._id)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
        </>
      )}
    </Box>
  );
};

export default MenuPage;
