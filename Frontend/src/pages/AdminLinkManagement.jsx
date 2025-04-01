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
import { Box, Popover, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { BaseUrl } from "../../constant";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4f46e5",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function LinkManagementTable() {
  const [links, setLinks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedUrl, setUpdatedUrl] = useState("");
  const [updateIsApproved,setUpdateIsApproved]=useState("");
  const [updateId, setUpdateId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [updatedCategory, setUpdatedCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/category/getCategories", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
 
  

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/link/getLinks`,{
        withCredentials: true,
      });
      setLinks(response.data);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchCategories();
  }, []);

  const handleOpenPopover = (event, link) => {
    setAnchorEl(event.currentTarget);
    setSelectedLink(link);
    setUpdatedTitle(link.name || "");
    setUpdatedUrl(link.url || "");
    setUpdateId(link.id);
    setUpdateIsApproved(link.isApproved);
    setUpdatedCategory(link.category_name);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedLink(null);
  };

  const handleUpdateLink = async () => {
    try {
      await axios.put(`${BaseUrl}/api/link/updateLink/${updateId}`, {
        name: updatedTitle,
        url: updatedUrl,
        category:updatedCategory,
        isApproved: updateIsApproved
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      await fetchLinks();
      toast.success("Link updated successfully!");
    } catch (error) {
      console.error("Error updating link:", error);
    }
    handleClosePopover();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/api/link/deleteLink/${id}`,{
        withCredentials:true,
      });
      setLinks(links.filter((link) => link.id !== id));
      toast.success("Link deleted successfully!");
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  return (
    <Box className="p-4">
      <TableContainer component={Paper} className="mx-auto max-w-3xl">
        <Table aria-label="link management table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>URL</StyledTableCell>
              <StyledTableCell>Update</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>isApproved</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link) => (
              <StyledTableRow key={link.id}>
                <StyledTableCell>{link.name}</StyledTableCell>
                <StyledTableCell>{link.url}</StyledTableCell>
                <StyledTableCell>
                  <Button variant="contained" color="primary" onClick={(e) => handleOpenPopover(e, link)}>
                    Update
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <Button variant="contained" color="error" onClick={() => handleDelete(link.id)}>
                    Delete
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                <Checkbox
                    checked={Boolean(link.isApproved )}
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box p={2} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Title" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} fullWidth />
          <TextField label="URL" value={updatedUrl} onChange={(e) => setUpdatedUrl(e.target.value)} fullWidth />
          <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
            <InputLabel>Is Approved</InputLabel>
            <Select value={updateIsApproved==true?true:false} onChange={(e) => setUpdateIsApproved(e.target.value)}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleUpdateLink}>Save</Button>
        </Box>
      </Popover>
    </Box>
  );
}
