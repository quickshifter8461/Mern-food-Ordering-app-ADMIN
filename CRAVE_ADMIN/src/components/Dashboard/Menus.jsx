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
  CardMedia,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
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

  const handleHome = () => {
    navigate("/home");
  };

  return (
    <Box sx={{ padding: 4 }}>
      {!selectedRestaurant ? (
        <>
          <Typography variant="h4" gutterBottom>
            Select a Restaurant
          </Typography>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Button variant="contained" color="primary" onClick={handleHome}>
              Back to Home
            </Button>
          </Box>
          <Grid container spacing={2}>
            {restaurants.map((restaurant) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={restaurant._id}
              >
                <Card
                  onClick={() => handleRestaurantClick(restaurant)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 },
                    width: 250,
                  }}
                >
                  <CardMedia
                    sx={{
                      width: { xs: "100%", sm: 250 },
                      height: { xs: "auto", sm: 200 },
                      borderRadius: 2,
                      objectFit: "cover",
                    }}
                    image={restaurant.image}
                    title={restaurant.name}
                  />
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
              sx={{ marginLeft: 2 }}
              variant="contained"
              color="secondary"
              onClick={handleAddMenuItem}
            >
              Add Menu Item
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "background.paper",
              boxShadow: 3,
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((menuItem) => (
                  <TableRow key={menuItem._id}>
                    <TableCell>{menuItem.name}</TableCell>
                    <TableCell>{menuItem.description}</TableCell>
                    <TableCell>₹{menuItem.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {menuItem.isAvailable ? "Available" : "Out of stock"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleEditMenuItem(
                            menuItem._id,
                            selectedRestaurant._id
                          )
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default MenuPage;
