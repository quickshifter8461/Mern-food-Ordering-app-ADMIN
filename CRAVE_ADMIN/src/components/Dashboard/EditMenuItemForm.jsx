import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiCamera } from "react-icons/fi";
import { axiosInstance } from "../../config/api";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().required("Price is required"),
  category: Yup.string().required("Category is required"),
  isAvailable: Yup.boolean().required("Availability is required"),
});

const EditMenuItemForm = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();
  const menuItemId = location.state?.menuItemId;
  const restaurantId = location.state?.restaurantId;
  const redirectTo = location.state?.from || "/menus"; // Redirect after save

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing menu item data if editing
  useEffect(() => {
    if (menuItemId) {
      const fetchMenuItemDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/restaurants/${restaurantId}/${menuItemId}`
          );
          const { name, description, price, category, image, isAvailable } =
            response.data;

          formik.setValues({
            name,
            description,
            price,
            category,
            isAvailable,
            image,
          });

          setPreviewImage(image || "https://example.com/default-avatar.jpg");
        } catch (error) {
          console.error("Error fetching menu item details:", error);
        }
      };
      fetchMenuItemDetails();
    }
  }, [menuItemId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
      image: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("image", values.image);
        formData.append("isAvailable", values.isAvailable);

        let response;
        if (menuItemId) {
          response = await toast.promise(
            axiosInstance.put(
              `/restaurants/menuitems/${restaurantId}/${menuItemId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            ),
            {
              loading: "Updating menu item...",
              success: <b>Menu item updated successfully!</b>,
              error: <b>Menu item update failed. Please try again.</b>,
            }
          );
        } else {
          response = await toast.promise(
            axiosInstance.post(
              `/restaurants/${restaurantId}/addMenu`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            ),
            {
              loading: "Adding menu item...",
              success: <b>Menu item added successfully!</b>,
              error: <b>Menu item addition failed. Please try again.</b>,
            }
          );
        }

        setLoading(false);
        navigate(redirectTo);
      } catch (error) {
        setLoading(false);
        console.error("Error updating/adding menu item:", error);
      }
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        formik.setFieldValue("image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isSmallScreen ? "90%" : 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        sx={{ marginBottom: "1.5rem", color: "#E1E1E1", textAlign: "center" }}
      >
        {menuItemId ? "Edit Menu Item" : "Add New Menu Item"}
      </Typography>

      {/* Form Start */}
      <Box component="form" onSubmit={formik.handleSubmit}>
        {/* Avatar Section */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: "1.5rem",
            position: "relative",
          }}
        >
          <Avatar
            src={previewImage}
            alt="Menu Item Image"
            sx={{
              width: theme.spacing(15),
              height: theme.spacing(15),
              margin: "0 auto",
              border: "4px solid #fff",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          <input
            accept="image/*"
            type="file"
            id="image"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="image">
            <IconButton
              component="span"
              sx={{
                position: "absolute",
                bottom: 0,
                right: "50%",
                transform: "translate(50%, 50%)",
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <FiCamera />
            </IconButton>
          </label>
        </Box>

        {/* Menu Item Form Fields */}
        <TextField
          fullWidth
          label="Name"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Price"
          id="price"
          name="price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
          margin="normal"
        />

        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.category && Boolean(formik.errors.category)}
        >
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            <MenuItem value="veg">Veg</MenuItem>
            <MenuItem value="non-veg">Non-Veg</MenuItem>
            {/* <MenuItem value="dessert">Dessert</MenuItem>
            <MenuItem value="beverage">Beverage</MenuItem> */}
          </Select>
          {formik.touched.category && formik.errors.category && (
            <Typography color="error" variant="caption">
              {formik.errors.category}
            </Typography>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={
            formik.touched.isAvailable && Boolean(formik.errors.isAvailable)
          }
        >
          <InputLabel id="isAvailable-label">Availability</InputLabel>
          <Select
            labelId="isAvailable-label"
            id="isAvailable"
            name="isAvailable"
            value={formik.values.isAvailable}
            onChange={formik.handleChange}
          >
            <MenuItem value={true}>Available</MenuItem>
            <MenuItem value={false}>Out of stock</MenuItem>
          </Select>
          {formik.touched.isAvailable && formik.errors.isAvailable && (
            <Typography color="error" variant="caption">
              {formik.errors.isAvailable}
            </Typography>
          )}
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "1.5rem" }}
          disabled={loading || !formik.isValid}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : menuItemId ? (
            "Save Changes"
          ) : (
            "Add Menu Item"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default EditMenuItemForm;
