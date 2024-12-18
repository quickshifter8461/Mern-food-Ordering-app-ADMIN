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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiCamera } from "react-icons/fi";
import { axiosInstance } from "../../config/api";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Restaurant name is required"),
  location: Yup.string().required("Location is required"),
  cuisine: Yup.string().required("Cuisine is required"),
  contact: Yup.string().required("Contact is required"),
  status: Yup.string().required("Status is required"),
});

const EditRestaurantForm = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();
  const restaurantId = location.state?.id; 
  const redirectTo = location.state?.from || "/restaurants"; // Redirect to restaurants list after save

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing restaurant data if editing
  useEffect(() => {
    if (restaurantId) {
      const fetchRestaurantDetails = async () => {
        try {
          const response = await axiosInstance.get(`/restaurants/${restaurantId}`);
          const { name, location, cuisine, contact, status, image } = response.data;

          formik.setValues({
            name,
            location,
            cuisine,
            contact,
            status,
          });

          setPreviewImage(image || "https://example.com/default-avatar.jpg");
        } catch (error) {
          console.error("Error fetching restaurant details:", error);
        }
      };
      fetchRestaurantDetails();
    }
  }, [restaurantId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
      cuisine: "",
      contact: "",
      status: "open", // Default status
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("location", values.location);
        formData.append("cuisine", values.cuisine);
        formData.append("contact", values.contact);
        formData.append("status", values.status);
        if (values.image) {
          formData.append("image", values.image);
        }

        let response;
        if (restaurantId) {
          response = await toast.promise(
            axiosInstance.put(`/restaurants/${restaurantId}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }),
            {
              loading: "Updating restaurant...",
              success: <b>Restaurant updated successfully!</b>,
              error: <b>Restaurant update failed. Please try again.</b>,
            }
          );
        } else {
          response = await toast.promise(
            axiosInstance.post("/restaurants", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }),
            {
              loading: "Adding restaurant...",
              success: <b>Restaurant added successfully!</b>,
              error: <b>Restaurant addition failed. Please try again.</b>,
            }
          );
        }

        setLoading(false);
        navigate(redirectTo);
      } catch (error) {
        setLoading(false);
        console.error("Error updating/adding restaurant:", error);
      }
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        formik.setFieldValue("image", file); // Updated from profilePic to image
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
        {restaurantId ? "Edit Restaurant" : "Add New Restaurant"}
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
            alt="Restaurant Image"
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

        {/* Restaurant Form Fields */}
        <TextField
          fullWidth
          label="Restaurant Name"
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
          label="Location"
          id="location"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Cuisine"
          id="cuisine"
          name="cuisine"
          value={formik.values.cuisine}
          onChange={formik.handleChange}
          error={formik.touched.cuisine && Boolean(formik.errors.cuisine)}
          helperText={formik.touched.cuisine && formik.errors.cuisine}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contact"
          id="contact"
          name="contact"
          value={formik.values.contact}
          onChange={formik.handleChange}
          error={formik.touched.contact && Boolean(formik.errors.contact)}
          helperText={formik.touched.contact && formik.errors.contact}
          margin="normal"
        />
        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.status && Boolean(formik.errors.status)}
        >
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
          {formik.touched.status && formik.errors.status && (
            <Typography color="error" variant="caption">
              {formik.errors.status}
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
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {restaurantId ? "Save Changes" : "Add Restaurant"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditRestaurantForm;
