import React, { useState, useEffect } from "react";
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
import { axiosInstance } from "../../Config/api"; // Ensure axiosInstance is properly set up
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CouponPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentCoupon, setCurrentCoupon] = useState({
    _id: null,
    code: "",
    discountPercentage: "",
    maxDiscountValue: "",
    minOrderValue: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/coupon/get-coupons");
        setCoupons(response.data.coupons);
      } catch (err) {
        setError(err.message || "Failed to fetch coupons.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleOpenDialog = (
    mode,
    coupon = {
      _id: null,
      code: "",
      discountPercentage: "",
      maxDiscountValue: "",
      minOrderValue: "",
      expiryDate: "",
    }
  ) => {
    setDialogMode(mode);
    setCurrentCoupon(coupon);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCoupon({
      _id: null,
      code: "",
      discountPercentage: "",
      maxDiscountValue: "",
      minOrderValue: "",
      expiryDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCoupon = async () => {
    try {
      if (dialogMode === "add") {
        const response = await axiosInstance.post(
          "/coupon/create-coupon",
          currentCoupon
        );
        toast.success("Coupon created successfully!");
        setCoupons((prev) => [...prev, response.data.coupon]);
      } else if (dialogMode === "edit") {
        const response = await axiosInstance.put(
          `/coupon/update-coupon/${currentCoupon._id}`,
          currentCoupon
        );
        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon._id === currentCoupon._id ? response.data.coupon : coupon
          )
        );
        toast.success("Coupon updated successfully!");
      }
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to save coupon.");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this coupon?")) {
        await axiosInstance.delete(`/coupon/delete-coupon/${id}`);
        setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
        toast.success("Coupon deleted successfully!");
      }
    } catch (err) {
      setError(err.message || "Failed to delete coupon.");
    }
  };
  const handleHome = () => {
    navigate("/home");
  };

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
        Coupon Management
      </Typography>

      {/* Add New Coupon Button */}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button variant="contained" color="primary" onClick={handleHome}>
          Back to Home
        </Button>
        <Button
          sx={{ marginLeft: 2 }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("add")}
        >
          Add New Coupon
        </Button>
      </Box>

      {/* Coupons Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coupon Code</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Maximum Discount</TableCell>
              <TableCell>Minimum order value</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>₹{coupon.maxDiscountValue}</TableCell>
                <TableCell>₹{coupon.minOrderValue}</TableCell>
                <TableCell>
                  {new Date(coupon.expiryDate).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog("edit", coupon)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCoupon(coupon._id)}
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
          {dialogMode === "add" ? "Add New Coupon" : "Edit Coupon"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Code"
                name="code"
                value={currentCoupon.code}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discount (%)"
                name="discountPercentage"
                value={currentCoupon.discountPercentage}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Maximum Discount"
                name="maxDiscountValue"
                value={currentCoupon.maxDiscountValue}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Minimum order value"
                name="minOrderValue"
                value={currentCoupon.minOrderValue}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                value={currentCoupon.expiryDate}
                onChange={handleInputChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveCoupon} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CouponPage;
