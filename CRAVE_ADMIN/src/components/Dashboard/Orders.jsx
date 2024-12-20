import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
} from "@mui/material";
import { axiosInstance } from "../../Config/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();
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

  const fetchOrders = async (restaurantId) => {
    try {
      const response = await axiosInstance.get(
        `/order/get-all-restaurant-orders/${restaurantId}`
      );
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchOrders(restaurant._id);
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const response = await axiosInstance.patch(
        `/order/update-order-status/${orderId}`
      );
      const updatedOrder = response.data.order;

      // Update the `orders` state
      const updatedOrders = orders.map((order) =>
        order._id === updatedOrder._id
          ? {
              ...order,
              status: updatedOrder.status,
              updatedAt: updatedOrder.updatedAt,
            }
          : order
      );
      setOrders(updatedOrders);

      // Update the `filteredOrders` state
      const updatedFilteredOrders = filterStatus
        ? updatedOrders.filter((order) => order.status === filterStatus)
        : updatedOrders;
      setFilteredOrders(updatedFilteredOrders);

      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setFilterStatus(selectedStatus);

    if (selectedStatus === "") {
      setFilteredOrders(orders); // Show all orders if no filter is applied
    } else {
      const filtered = orders.filter(
        (order) => order.status === selectedStatus
      );
      setFilteredOrders(filtered); // Update filtered orders
    }
  };

  const handleHome = () => {
    navigate("/home");
  }
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
            All Orders of {selectedRestaurant.name}
          </Typography>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedRestaurant(null)}
              sx={{ marginBottom: 2 }}
            >
              Back to Restaurants
            </Button>

            <FormControl sx={{ minWidth: 200, marginBottom: 2, marginLeft: 2 }}>
              <InputLabel id="filter-label">Filter by Status</InputLabel>
              <Select
                labelId="filter-label"
                value={filterStatus}
                onChange={handleFilterChange}
                label="Filter by Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="preparing">Preparing</MenuItem>
                <MenuItem value="out for delivery">Out for Delivery</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Order placed at</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last status update</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-IN",
                            { hour12: false }
                          )}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          {new Date(order.updatedAt).toLocaleTimeString(
                            "en-IN",
                            { hour12: false }
                          )}
                        </TableCell>
                        <TableCell>{order.user?.name}</TableCell>
                        <TableCell>{order.finalPrice}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateStatus(order._id)}
                            disabled={order.status === "delivered"}
                          >
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Orders;
