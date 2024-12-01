import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserManager: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [currentEdit, setCurrentEdit] = useState<User | null>(null);
  const [currentRoleEdit, setCurrentRoleEdit] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Store Employee" });

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    const { name, email, role } = newUser;

    if (!name || !email || !role) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", { name, email, role });
      alert("User added successfully!");
      setNewUser({ name: "", email: "", role: "Store Employee" });
      loadUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  const removeUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete-user/${id}`, {
        data: { role: "Super Admin" },
      });
      alert("User removed successfully!");
      loadUsers();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const updateUser = async (id: string) => {
    if (!currentEdit) return;

    const { name, email, role } = currentEdit;
    if (!name || !email || !role) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/update-user/${id}`, {
        name,
        email,
        role,
      });
      alert("User updated successfully!");
      setCurrentEdit(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const assignNewRole = async (id: string) => {
    if (!selectedRole || !["Super Admin", "Store Admin", "Store Employee"].includes(selectedRole)) {
      alert("Please select a valid role.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/assign-role/${id}`, { role: selectedRole });
      alert("Role assigned successfully!");
      setCurrentRoleEdit(null);
      setSelectedRole("");
      loadUsers();
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("An error occurred while assigning the role.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">User Management</h1>

      <div className="form-section">
        <h3 className="form-title">Add User</h3>
        <div className="form-inputs">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Store Admin">Store Admin</option>
            <option value="Store Employee">Store Employee</option>
          </select>
        </div>
        <button className="action-button" onClick={addUser}>
          Add User
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user._id}>
              <td>
                {currentEdit && currentEdit._id === user._id ? (
                  <input
                    type="text"
                    value={currentEdit.name}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {currentEdit && currentEdit._id === user._id ? (
                  <input
                    type="email"
                    value={currentEdit.email}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {currentRoleEdit && currentRoleEdit._id === user._id ? (
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="">Select a role</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Store Admin">Store Admin</option>
                    <option value="Store Employee">Store Employee</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {currentEdit && currentEdit._id === user._id ? (
                  <>
                    <button className="action-button" onClick={() => updateUser(user._id)}>
                      Save
                    </button>
                    <button className="cancel-button" onClick={() => setCurrentEdit(null)}>
                      Cancel
                    </button>
                  </>
                ) : currentRoleEdit && currentRoleEdit._id === user._id ? (
                  <>
                    <button className="action-button" onClick={() => assignNewRole(user._id)}>
                      Assign Role
                    </button>
                    <button className="cancel-button" onClick={() => setCurrentRoleEdit(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit-button" onClick={() => setCurrentEdit(user)}>
                      Edit
                    </button>
                    <button className="role-button" onClick={() => setCurrentRoleEdit(user)}>
                      Change Role
                    </button>
                    <button className="delete-button" onClick={() => removeUser(user._id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
