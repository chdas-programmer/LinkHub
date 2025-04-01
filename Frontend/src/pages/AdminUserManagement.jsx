import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Box, Popover, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../constant";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4f46e5",
    color: theme.palette.common.white,
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    paddingLeft: "16px",
    paddingRight: "16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedIsAdmin, setUpdatedIsAdmin] = useState(null);
  const [updatedIsVerified, setUpdatedIsVerified] = useState(null);
  const [updateId, setUpdateId] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/getAllUser", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // If using cookies for authentication
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open popover for update
  const handleOpenPopover = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
    setUpdatedName(user.name || "");
    setUpdatedEmail(user.email || "");
    setUpdatedIsAdmin(Boolean(user.isAdmin) ?? null);
    setUpdatedIsVerified(Boolean(user.isVerified) ?? null);
    setUpdateId(user.id);
  };

  // Close popover
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // Handle user update
  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `${BaseUrl}api/user/updateUser/${updateId}`,
        {
          name: updatedName,
          email: updatedEmail,
          isAdmin: updatedIsAdmin,
          isVerified: updatedIsVerified,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      await fetchUsers(); // Fetch updated user list
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }

    handleClosePopover();
  };

  // Handle delete user (Frontend only; you need an API call for real deletion)
  const handleDelete = async (id,isAdmin,isVerified) => {
    
    if (isAdmin && isVerified) {
        toast.error("Admin users cannot be deleted!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        console.log("Admin users cannot be deleted!")
        return;
      }
    
    try {
      await axios.delete(`${BaseUrl}/api/user/deleteUser/${id}`, {
        withCredentials: true,
      });

      setUsers(users.filter((user) => user.id !== id));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle active status toggle
  const handleStatusChange = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)));
  };

  return (
    <Box className="p-4">
      <TableContainer component={Paper} className="mx-auto max-w-3xl">
        <Table aria-label="user management table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User Name</StyledTableCell>
              <StyledTableCell>Update</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>isAdmin and isVerified</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.id}>
                <StyledTableCell>{user.name}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4f46e5",
                      "&:hover": { backgroundColor: "#4338ca" },
                    }}
                    onClick={(e) => handleOpenPopover(e, user)}
                  >
                    Update
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#fca5a5",
                      color: "#7f1d1d",
                      "&:hover": { backgroundColor: "#f87171" },
                    }}
                    onClick={() => handleDelete(user.id,user.isAdmin,user.isVerified)}
                  >
                    Delete
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                <Checkbox
                    checked={user.isAdmin && user.isVerified}
                    disabled // ✅ This makes the checkbox read-only
                    sx={{
                        color: "#4f46e5",
                        "&.Mui-checked": { color: "#4f46e5" },
                    }}
                    />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popover for User Update */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box p={2} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="User Name" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} fullWidth />
          <TextField label="Email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} fullWidth />

          <FormControl fullWidth>
            <InputLabel>Is Admin</InputLabel>
            <Select value={updatedIsAdmin} onChange={(e) => setUpdatedIsAdmin(e.target.value)}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Is Verified</InputLabel>
            <Select value={updatedIsVerified} onChange={(e) => setUpdatedIsVerified(e.target.value)}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleUpdateUser}>Save</Button>
        </Box>
      </Popover>
    </Box>
  );
}
