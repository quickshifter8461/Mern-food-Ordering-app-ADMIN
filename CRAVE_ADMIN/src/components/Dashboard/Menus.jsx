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
  CircularProgress,
  TextField,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { axiosInstance } from "../../Config/api";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantSearchQuery, setRestaurantSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/restaurants/all-restaurants"
        );
        setRestaurants(response.data);
      } catch (error) {
        setError(error.message || "Failed to fetch restaurants.");
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const fetchMenuItems = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/restaurants/${restaurantId}/menu`
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMenuItems(restaurant._id);
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
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

  const handleEditMenuItem = (menuItemId, restaurantId) => {
    navigate(`/edit/menus`, {
      state: { menuItemId: menuItemId, restaurantId: restaurantId },
    });
  };

  const handleAddMenuItem = () => {
    navigate(`/edit/menus`, {
      state: { restaurantId: selectedRestaurant._id },
    });
  };

  const handleHome = () => {
    navigate("/home");
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(restaurantSearchQuery.toLowerCase())
  );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-500 pb-10">Something went wrong: {error}</p>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );

  return (
    <Box sx={{ padding: 4 }}>
      {!selectedRestaurant ? (
        <>
          <Typography variant="h4" gutterBottom>
            Select a Restaurant
          </Typography>
          <Box className="flex flex-col sm:flex-row justify-start mb-2 gap-2">
            <Button className="w-full sm:w-auto" variant="contained" color="primary" onClick={handleHome}>
              Back to Home
            </Button>
            <TextField
              label="Search restaurants"
              variant="outlined"
              size="small"
              value={restaurantSearchQuery}
              onChange={(e) => setRestaurantSearchQuery(e.target.value)}
              
              className="w-full sm:w-auto sm:m-2"
            />
          </Box>
          <Grid container spacing={2}>
            {filteredRestaurants.map((restaurant) => (
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
          <Box display="flex" gap={2} flexDirection="column" mb={2}>
            <Box className="flex flex-col sm:flex-row justify-start mb-2 gap-2">
              <Button
              className="w-full sm:w-auto"
                variant="contained"
                color="primary"
                onClick={() => setSelectedRestaurant(null)}
              >
                Back to Restaurants
              </Button>
              <Button
               className="w-full sm:w-auto"
                variant="contained"
                color="secondary"
                onClick={handleAddMenuItem}
              >
                Add Menu Item
              </Button>
              <TextField
                label="Search menu items"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full sm:w-auto sm:m-2"
              />
            </Box>
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
                {filteredMenuItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {menuItems.length === 0
                        ? "No menu items available."
                        : "No matching menu items found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMenuItems.map((menuItem) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default MenuPage;
