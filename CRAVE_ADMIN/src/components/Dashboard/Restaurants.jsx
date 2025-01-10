import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { axiosInstance } from "../../Config/api";
import { useNavigate } from "react-router-dom";

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/restaurants/all-restaurants"
        );
        setRestaurants(response.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentRestaurant, setCurrentRestaurant] = useState({
    id: null,
    name: "",
    location: "",
    cuisine: "",
  });

  const handleOpenDialog = (
    mode,
    restaurant = { id: null, name: "", location: "", cuisine: "" }
  ) => {
    setDialogMode(mode);
    setCurrentRestaurant(restaurant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRestaurant({ id: null, name: "", location: "", cuisine: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveRestaurant = async () => {
    try {
      if (dialogMode === "add") {
        const response = await axiosInstance.post(
          "/restaurants/",
          currentRestaurant
        );
        setRestaurants((prev) => [...prev, response.data]);
      } else if (dialogMode === "edit") {
        const response = await axiosInstance.put(
          `/restaurants/${currentRestaurant.id}`,
          currentRestaurant
        );
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant.id === currentRestaurant.id ? response.data : restaurant
          )
        );
      }
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to save restaurant");
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this restaurant?")) {
        await axiosInstance.delete(`/restaurants/${id}`);
        setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== id)
        );
      } else {
        return;
      }
    } catch (err) {
      setError(err.message || "Failed to delete restaurant");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
      } else {
        setError("Please select a valid image file.");
      }
    }
  };

  const handleAddRestaurant = () => {
    navigate("/edit/restaurants");
  };

  const handleEditRestaurant = (id) => {
    navigate(`/edit/restaurants`, { state: { id } });
  };

  const handleHome = () => {
    navigate("/home");
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Restaurant Management
      </Typography>

      <Box display="flex" gap={2} flexDirection="column" mb={2}>
        <Box  className="flex flex-col sm:flex-row justify-start mb-2 gap-2">
          <Button className="w-full sm:w-auto" variant="contained" color="primary" onClick={handleHome}>
            Back to Home
          </Button>
          <Button
            className="w-full sm:w-auto sm:m-2"
            variant="contained"
            color="primary"
            onClick={handleAddRestaurant}
          >
            Add New Restaurant
          </Button>
        <TextField
          size="small"
          variant="outlined"
          label="Search restaurants by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto sm:m-2"
        />
        </Box>

      </Box>

      {/* Restaurants Table */}
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
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRestaurants.map((restaurant) => (
              <TableRow key={restaurant._id}>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>{restaurant.location}</TableCell>
                <TableCell>{restaurant.status}</TableCell>
                <TableCell>{restaurant.cuisine}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditRestaurant(restaurant._id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRestaurant(restaurant._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === "add" ? "Add New Restaurant" : "Edit Restaurant"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Restaurant Name"
                name="name"
                value={currentRestaurant.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={currentRestaurant.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cuisine"
                name="cuisine"
                value={currentRestaurant.cuisine}
                onChange={handleInputChange}
              />
            </Grid>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              {selectedImage && (
                <Typography variant="body2">{selectedImage.name}</Typography>
              )}
              {currentRestaurant.imageUrl && (
                <img
                  src={currentRestaurant.imageUrl}
                  alt="Restaurant"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                  }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRestaurant} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantPage;
