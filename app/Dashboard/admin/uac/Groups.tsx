import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Edit, Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API_BASE_URL } from "@/config/api";

interface Group {
  _id: string;
  name: string;
  moduleId: string;
  moduleName: string;
  dateModified: string;
  roles: Role[];
}

interface NewGroup {
  moduleId: string;
  moduleName: string;
  roleIds: string[];
}

interface Role {
  _id: string;
  name: string;
  description: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#87CEEB", // Sky blue
    },
    background: {
      default: "#FFFFFF", // White
    },
  },
});

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #87CEEB",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Groups: React.FC = () => {
  const [newGroup, setNewGroup] = useState<NewGroup>({
    moduleId: "",
    moduleName: "",
    roleIds: [],
  });

  const [groups, setGroups] = useState<Group[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchGroups();
    fetchRoles();
  }, []);

  const fetchGroups = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get<Group[]>(
        `${API_BASE_URL}/api/admin/groups`,
        config
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchRoles = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get<Role[]>(
        `${API_BASE_URL}/api/admin/getroles`,
        config
      );
      console.log("Fetched roles:", response.data);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => {
    setOpen(false);
    setEditingGroup(null);
    setNewGroup({ moduleId: "", moduleName: "", roleIds: [] });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "roleIds") {
      const selectedRoles = Array.isArray(value) ? value : [value];
      const validRoles = selectedRoles.filter(
        (role) => role && role.trim() !== ""
      );
      setNewGroup({ ...newGroup, [name]: validRoles });
    } else {
      setNewGroup({ ...newGroup, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const validRoleIds = newGroup.roleIds.filter(
        (id) => id && id.trim() !== ""
      );

      const dataToSend = {
        ...newGroup,
        roleIds: validRoleIds,
      };

      if (editingGroup) {
        await axios.put(
          `${API_BASE_URL}/api/admin/groups/${editingGroup._id}`,
          dataToSend,
          config
        );
      } else {
        await axios.post(
          "${API_BASE_URL}/api/admin/groups",
          dataToSend,
          config
        );
      }
      fetchGroups();
      handleClose();
    } catch (error) {
      console.error("Error adding/updating group:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("Server response:", error.response.data);
      }
    }
  };

  const handleEdit = (group: Group): void => {
    setEditingGroup(group);
    setNewGroup({
      moduleId: group.moduleId,
      moduleName: group.moduleName,
      roleIds: group.roles.map((role) => role._id),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(
          `${API_BASE_URL}/api/admin/groups/${id}`,
          config
        );
        fetchGroups();
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-white text-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0 text-sky-500">
            Groups
          </h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            className="w-full sm:w-auto"
          >
            Create
          </Button>
        </div>

        {/* Table view for larger screens */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-sky-100">
                <th className="border border-sky-200 p-4 text-left rounded-tl-lg">
                  ID
                </th>
                <th className="border border-sky-200 p-4 text-left">
                  Module ID
                </th>
                <th className="border border-sky-200 p-4 text-left">
                  Module Name
                </th>
                <th className="border border-sky-200 p-4 text-left">Role</th>
                <th className="border border-sky-200 p-4 text-left">
                  Date Modified
                </th>
                <th className="border border-sky-200 p-4 text-left rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr
                  key={group._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}
                >
                  <td className="border border-sky-100 p-4">{group.name}</td>
                  <td className="border border-sky-100 p-4">
                    {group.moduleId}
                  </td>
                  <td className="border border-sky-100 p-4">
                    {group.moduleName}
                  </td>
                  <div className="mb-2">
                    <td>
                      {Array.isArray(group.roles)
                        ? group.roles.join(", ")
                        : typeof group.roles === "string"
                        ? group.roles
                        : "No roles specified"}
                    </td>
                  </div>
                  <td className="border border-sky-100 p-4">
                    {new Date(group.dateModified).toLocaleDateString()}
                  </td>
                  <td className="border border-sky-100 p-4">
                    <IconButton
                      onClick={() => handleEdit(group)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(group._id)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card view for smaller screens */}
        <div className="sm:hidden space-y-4">
          {groups.map((group) => (
            <div key={group._id} className="bg-sky-50 rounded-lg p-4 shadow">
              <div className="mb-2">
                <span className="font-semibold">ID:</span> {group.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Module ID:</span>{" "}
                {group.moduleId}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Module Name:</span>{" "}
                {group.moduleName}
              </div>
              <div className="mb-2">
                {Array.isArray(group.roles)
                  ? group.roles.join(", ")
                  : typeof group.roles === "string"
                  ? group.roles
                  : "No roles specified"}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date Modified:</span>{" "}
                {new Date(group.dateModified).toLocaleDateString()}
              </div>
              <div className="flex justify-end mt-2">
                <IconButton onClick={() => handleEdit(group)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(group._id)}
                  color="secondary"
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <h2
              id="modal-title"
              className="text-2xl font-bold mb-4 text-sky-500"
            >
              {editingGroup ? "Edit Group" : "Add New Group"}
            </h2>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Module ID"
                name="moduleId"
                value={newGroup.moduleId}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Module Name"
                name="moduleName"
                value={newGroup.moduleName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Roles"
                name="roleIds"
                value={newGroup.roleIds}
                onChange={handleChange}
                select
                SelectProps={{
                  multiple: true,
                }}
                required
              >
                {roles
                  .filter((role) => role && role._id)
                  .map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </TextField>
              <div className="flex flex-col sm:flex-row justify-end mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="mb-2 sm:mb-0 sm:mr-2"
                >
                  {editingGroup ? "Update Group" : "Add Group"}
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="secondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default Groups;
