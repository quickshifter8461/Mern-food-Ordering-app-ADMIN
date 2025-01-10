import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Config/api";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/get-all-users");
        setUsers(response.data.users);
      } catch (error) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  console.log("users", users);

  const handleEditUser = (user) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to change the status of this user?"
        )
      ) {
        axiosInstance.patch(`/admin/update-user/${user}`);
        window.location.reload();
      } else {
        return;
      }
    } catch (err) {
      setError(err.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        axiosInstance.delete(`/admin/delete-user/${id}`);
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        return;
      }
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const handleHome = () => {
    navigate("/home");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        User Management
      </Typography>

      <Box
        className="flex flex-col sm:flex-row justify-start mb-2 gap-2"
      >
        <Button className="w-full sm:w-auto" variant="contained" color="primary" onClick={handleHome}>
          Back to Home
        </Button>
        <TextField
          label="Search by name or email"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto sm:m-2"
        />
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
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.status === true ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(user._id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default User;
