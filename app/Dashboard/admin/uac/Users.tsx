import React, { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config/api";

interface User {
  id: string;
  email: string;
  roleName: string;
  lastLogin?: string;
  roleId: string | null;
  lastLogout?: string;
  userType: "student" | "owner";
  name: string;
  isApproved: boolean;
  password?: string;
}

interface NewUser {
  email: string;
  password: string;
  roleName: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  total: number;
  students: number;
  owners: number;
  roles: Role[];
  users: User[];
}

interface UpdateUserData {
  roleName: string;
  email: string;
  password?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  console.log("userss", users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    password: "",
    roleName: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response: AxiosResponse<Role[]> = await axios.get(
        `${API_BASE_URL}/api/admin/getroles`,
        config
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${API_BASE_URL}/api/admin/users`,
        config
      );

      if (response.data.success) {
        const formattedUsers = response.data.users.map((user) => ({
          ...user,
          _id: user.id, // Maintain compatibility with existing code
          roleName: user.roleName || "No Role Assigned",
        }));
        setUsers(formattedUsers);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      setError("Error fetching users. Please try again.");
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (user: User): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`${API_BASE_URL}/api/admin/users/${user.id}`, config);
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (error) {
      setError("Error deleting user. Please try again.");
      console.error("Error deleting user:", error);
    }
    setLoading(false);
  };

  const handleEdit = (user: User): void => {
    setSelectedUser({
      ...user,
      roleName: user.roleName || "No Role Assigned",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = (): void => {
    setNewUser({ email: "", password: "", roleName: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isEditing && selectedUser) {
        const updateData: UpdateUserData = {
          roleName: selectedUser.roleName,
          email: selectedUser.email,
        };
        if (selectedUser.password) {
          updateData.password = selectedUser.password;
        }

        if (!updateData.roleName) {
          throw new Error("Role name is required");
        }

        const response: AxiosResponse<User> = await axios.put(
          `${API_BASE_URL}/api/admin/users/${selectedUser.id}/role`,
          updateData,
          config
        );
      } else {
        if (!newUser.email || !newUser.password || !newUser.roleName) {
          throw new Error("Please fill in all fields");
        }
        await axios.post(`${API_BASE_URL}/api/admin/users`, newUser, config);
      }

      setShowModal(false);
      setSelectedUser(null);
      setNewUser({ email: "", password: "", roleName: "" });
      await fetchUsers();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error: ${error.response.data.message}`);
        console.error("Server response:", error.response.data);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error saving user:", error);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-sky-600">Loading...</div>;

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0 text-sky-600">
          Users
        </h2>
        <div>
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Table view for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-sky-100 text-sky-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Last Login</th>
              <th className="px-4 py-2 text-left">Last Logout</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-sky-100">
                <td className="px-4 py-2 truncate text-gray-800">{user.id}</td>
                <td className="px-4 py-2 text-gray-800">{user.roleName}</td>
                <td className="px-4 py-2 truncate text-gray-800">
                  {user.email}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {user.lastLogout
                    ? new Date(user.lastLogout).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded text-sm mr-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for smaller screens */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg p-4 shadow-md border border-sky-100"
          >
            <div className="mb-2">
              <span className="font-semibold text-sky-600">ID:</span>
              <span className="ml-2 text-gray-800 truncate">{user.id}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-sky-600">Role:</span>
              <span className="ml-2 text-gray-800">{user.roleName}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-sky-600">Email:</span>
              <span className="ml-2 text-gray-800 truncate">{user.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-sky-600">Last Login:</span>
              <span className="ml-2 text-gray-800">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-sky-600">Last Logout:</span>
              <span className="ml-2 text-gray-800">
                {user.lastLogout
                  ? new Date(user.lastLogout).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded text-sm flex-grow"
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex-grow"
                onClick={() => handleDelete(user)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-sky-600">
              {isEditing ? "Edit User" : "Add User"}
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sky-600">Email:</label>
                <input
                  type="email"
                  className="w-full border border-sky-300 px-3 py-2 rounded bg-white text-gray-800"
                  value={isEditing ? selectedUser!.email : newUser.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    isEditing
                      ? setSelectedUser({
                          ...selectedUser!,
                          email: e.target.value,
                        })
                      : setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sky-600">Password:</label>
                <input
                  type="password"
                  className="w-full border border-sky-300 px-3 py-2 rounded bg-white text-gray-800"
                  value={
                    isEditing ? selectedUser!.password || "" : newUser.password
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    isEditing
                      ? setSelectedUser({
                          ...selectedUser!,
                          password: e.target.value,
                        })
                      : setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder={
                    isEditing ? "Leave blank to keep current password" : ""
                  }
                />
              </div>
              <div>
                <label className="block text-sky-600">Role:</label>
                <select
                  className="w-full border border-sky-300 px-3 py-2 rounded bg-white text-gray-800"
                  value={isEditing ? selectedUser!.roleName : newUser.roleName}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    isEditing
                      ? setSelectedUser({
                          ...selectedUser!,
                          roleName: e.target.value,
                        })
                      : setNewUser({ ...newUser, roleName: e.target.value })
                  }
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sky-600">Last Login:</label>
                <input
                  type="text"
                  className="w-full border border-sky-300 px-3 py-2 rounded bg-white text-gray-800"
                  value={
                    selectedUser?.lastLogin
                      ? new Date(selectedUser.lastLogin).toLocaleString()
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sky-600">Last Logout:</label>
                <input
                  type="text"
                  className="w-full border border-sky-300 px-3 py-2 rounded bg-white text-gray-800"
                  value={
                    selectedUser?.lastLogout
                      ? new Date(selectedUser.lastLogout).toLocaleString()
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-sky-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
