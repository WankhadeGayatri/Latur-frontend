"use client";
import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Edit, Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

interface Group {
  _id: string;
  moduleId: string;
  moduleName: string;
  name: string;
  dateModified: string;
  roles: string[];
}

interface Role {
  name: string;
  groups: Group[];
  permissions: {
    [key: string]: Permission[];
  };
}

interface Permission {
  _id: string;
  moduleId: string;
  moduleName: string;
  name: string;
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGroups, setSelectedGroups] = useState<{
    [key: string]: string[];
  }>({});
  const [showAddGroupModal, setShowAddGroupModal] = useState<boolean>(false);
  const [showRemoveGroupModal, setShowRemoveGroupModal] =
    useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");
  const [showDeleteRoleModal, setShowDeleteRoleModal] =
    useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<string>("");

  useEffect(() => {
    fetchRolesAndGroups();
  }, []);

  const fetchRolesAndGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Group[]>(
        `${API_BASE_URL}/api/admin/groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Group the groups by role
      const groupedRoles = response.data.reduce((acc: Role[], group) => {
        group.roles.forEach((roleName) => {
          const roleIndex = acc.findIndex((r) => r.name === roleName);
          if (roleIndex === -1) {
            acc.push({
              name: roleName,
              groups: [group],
              permissions: {},
            });
          } else {
            acc[roleIndex].groups.push(group);
          }
        });
        return acc;
      }, []);

      // Fetch permissions for each role
      const promises = groupedRoles.map(async (role) => {
        try {
          const permissionsResponse = await axios.get(
            `${API_BASE_URL}/api/admin/permissions/${role.name}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          role.permissions = permissionsResponse.data.permissions;
        } catch (error) {
          console.error(
            `Error fetching permissions for role ${role.name}:`,
            error
          );
        }
        return role;
      });

      const updatedRoles = await Promise.all(promises);
      setRoles(updatedRoles);
    } catch (error) {
      console.error("Error fetching roles and groups:", error);
      setError("Failed to fetch roles and groups. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGroup = (role: string) => {
    setCurrentRole(role);
    setShowAddGroupModal(true);
  };

  const handleRemoveGroup = (role: string) => {
    setCurrentRole(role);
    setShowRemoveGroupModal(true);
  };

  const assignGroupToRole = async (role: string, groupId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/admin/assign-group-to-role`,
        {
          role: role,
          groupIds: [groupId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchRolesAndGroups();
      setShowAddGroupModal(false);
    } catch (error) {
      console.error("Error assigning group to role:", error);
      alert("Failed to assign group to role. Please try again.");
    }
  };
  const handleAddRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/roles`,
        {
          name: newRoleName,
          description: newRoleDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAddRoleModal(false);
      setNewRoleName("");
      setNewRoleDescription("");
      fetchRolesAndGroups(); // Refresh the roles list
    } catch (error) {
      console.error("Error adding role:", error);
      alert("Failed to add role. Please try again.");
    }
  };
  const handleDeleteRole = async () => {
    if (roleToDelete) {
      if (
        window.confirm(
          `Are you sure you want to delete the role "${roleToDelete}"?`
        )
      ) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `${API_BASE_URL}/api/admin/roles/${roleToDelete}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchRolesAndGroups();
        } catch (error) {
          console.error("Error deleting role:", error);
          alert("Failed to delete role. Please try again.");
        }
      }
      setShowDeleteRoleModal(false);
      setRoleToDelete("");
    }
  };

  const removeGroupFromRole = async (role: string, groupId: string) => {
    try {
      const token = localStorage.getItem("token");

      // Send the delete request to the server
      await axios.post(
        `${API_BASE_URL}/api/admin/remove-permission-from-role`,
        {
          role: role, // This is already a string, so no change needed here
          permissionId: groupId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistically update the UI (keep this part as it is)
      setRoles((prevRoles) =>
        prevRoles.map((r) => {
          if (r.name === role) {
            const updatedPermissions = Object.fromEntries(
              Object.entries(r.permissions).map(([moduleName, perms]) => [
                moduleName,
                perms.filter((p) => p._id !== groupId),
              ])
            );
            return { ...r, permissions: updatedPermissions };
          }
          return r;
        })
      );

      // You might want to call fetchRolesAndGroups() here to refresh the data
    } catch (error) {
      console.error("Error removing group from role:", error);
      alert("Failed to remove group from role. Please try again.");
      fetchRolesAndGroups();
    }
  };

  const updatePermission = async (
    role: string,
    permissionId: string,
    field: keyof Permission,
    value: boolean
  ) => {
    try {
      const token = localStorage.getItem("token");

      // Find the role
      const roleObj = roles.find((r) => r.name === role);
      if (!roleObj) {
        throw new Error("Role not found");
      }

      // Find the permission
      let permission: Permission | undefined;
      let moduleName: string | undefined;

      for (const [module, perms] of Object.entries(roleObj.permissions)) {
        permission = perms.find((p) => p._id === permissionId);
        if (permission) {
          moduleName = module;
          break;
        }
      }

      if (!permission || !moduleName) {
        throw new Error("Permission not found");
      }

      // Create an updated permission object
      const updatedPermission = { ...permission, [field]: value };

      // Optimistically update the UI
      setRoles((prevRoles) =>
        prevRoles.map((r) => {
          if (r.name === role) {
            const updatedPermissions = {
              ...r.permissions,
              [moduleName!]: r.permissions[moduleName!].map((p) =>
                p._id === permissionId ? updatedPermission : p
              ),
            };
            return { ...r, permissions: updatedPermissions };
          }
          return r;
        })
      );

      // Send the update to the server
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/update-role-permissions`,
        {
          role: role,
          permissionId: permissionId,
          update: { [field]: value },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.updatedPermission) {
        // Update was successful, no need to do anything as we've already updated the UI optimistically
        console.log(
          "Permission updated successfully:",
          response.data.updatedPermission
        );
      } else {
        throw new Error("Updated permission not returned from server");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);

      fetchRolesAndGroups();

      alert("Failed to update permission. Please try again.");
    }
  };

  return (
    <div className="bg-white text-sky-900 p-4 sm:p-6 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-700">
          Role Management
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddRoleModal(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add Role
          </button>
          <button
            onClick={() => setShowDeleteRoleModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Trash2 size={16} className="mr-2" /> Delete Role
          </button>
        </div>
      </div>

      {/* Table view */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-100">
                <th className="p-4 text-left text-sky-800">Roles</th>
                <th className="p-4 text-left text-sky-800">Groups</th>
                <th className="p-4 text-left text-sky-800">Permissions</th>
                <th className="p-4 text-left text-sky-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.name} className="border-b border-sky-200">
                  <td className="p-4">{role.name}</td>
                  <td className="p-4">
                    {Object.entries(role.permissions).map(
                      ([moduleName, permissions]) => (
                        <div key={moduleName}>
                          {permissions.map((perm) => (
                            <div
                              key={perm._id}
                              className="mb-2 flex items-center flex-wrap"
                            >
                              <span className="mr-2 text-sky-700">
                                {perm.moduleName}({perm.name}):
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </td>
                  <td className="p-4">
                    {Object.entries(role.permissions).map(
                      ([moduleName, permissions]) => (
                        <div key={moduleName}>
                          {permissions.map((perm) => (
                            <div
                              key={perm._id}
                              className="mb-2 flex items-center flex-wrap"
                            >
                              <span className="mr-2 text-sky-700">
                                ({perm.name}):
                              </span>
                              {["read", "write", "edit", "delete"].map(
                                (action) => (
                                  <label
                                    key={action}
                                    className="mr-2 flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        !!perm[action as keyof Permission]
                                      }
                                      onChange={(e) =>
                                        updatePermission(
                                          role.name,
                                          perm._id,
                                          action as keyof Permission,
                                          e.target.checked
                                        )
                                      }
                                      className={`mr-1 ${
                                        perm[action as keyof Permission]
                                          ? "bg-sky-500"
                                          : "bg-gray-300"
                                      }`}
                                    />
                                    {action}
                                  </label>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddGroup(role.name)}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded flex items-center"
                      >
                        <Plus size={16} className="mr-1" /> Add Group
                      </button>
                      <button
                        onClick={() => handleRemoveGroup(role.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center"
                      >
                        <Minus size={16} className="mr-1" /> Remove Group
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showAddGroupModal && currentRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-sky-700">
              Add Group to {currentRole}
            </h3>
            <div className="max-h-60 overflow-y-auto">
              {roles
                .find((r) => r.name === currentRole)
                ?.groups.filter(
                  (group) =>
                    !Object.values(
                      roles.find((r) => r.name === currentRole)?.permissions ||
                        {}
                    )
                      .flat()
                      .some((perm) => perm.name === group.name)
                )
                .map((group) => (
                  <div
                    key={group._id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-sky-800">
                      {group.moduleName} ({group.name})
                    </span>
                    <button
                      onClick={() => assignGroupToRole(currentRole, group._id)}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded"
                    >
                      Assign
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setShowAddGroupModal(false)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-sky-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showRemoveGroupModal && currentRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-sky-700">
              Remove Group from {currentRole}
            </h3>
            <div className="max-h-60 overflow-y-auto">
              {Object.values(
                roles.find((r) => r.name === currentRole)?.permissions || {}
              )
                .flat()
                .map((perm) => (
                  <div
                    key={perm._id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-sky-800">
                      {perm.moduleName} ({perm.name})
                    </span>
                    <button
                      onClick={() => removeGroupFromRole(currentRole, perm._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setShowRemoveGroupModal(false)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-sky-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-sky-700">
              Add New Role
            </h3>
            <input
              type="text"
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full p-2 mb-2 bg-sky-50 text-sky-800 rounded"
            />
            <input
              type="text"
              placeholder="Role Description"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              className="w-full p-2 mb-4 bg-sky-50 text-sky-800 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddRole}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded mr-2"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddRoleModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-sky-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-sky-700">Delete Role</h3>
            <select
              value={roleToDelete}
              onChange={(e) => setRoleToDelete(e.target.value)}
              className="w-full p-2 mb-4 bg-sky-50 text-sky-800 rounded"
            >
              <option value="">Select a role to delete</option>
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteRole}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteRoleModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-sky-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
