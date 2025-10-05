import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import AddUserModal from "./AddUserModal";

const TenantAdminDashboard: React.FC = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      role: "User",
      status: "Active",
      lastLogin: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "User",
      status: "Active",
      lastLogin: "2024-01-14"
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@company.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2024-01-10"
    }
  ]);

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };

  const handleRemoveUser = (id: number) => {
    alert(`User ${id} removed successfully`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mtq-heading-primary">
                Tenant Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your organization's users and settings</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="mtq-nav-link">
                ← Back to Home
              </Link>
              <Button 
                onClick={handleAddUser}
                variant="success"
                size="sm"
              >
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mtq-card">
              <h2 className="mtq-heading-tertiary">Organization Users</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">Last login: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={user.status === 'Active' ? 'mtq-status-active' : 'mtq-status-inactive'}>
                          {user.status}
                        </span>
                        <Button 
                          onClick={() => handleRemoveUser(user.id)}
                          variant="danger"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="mtq-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Organization Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Users</span>
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Inactive Users</span>
                  <span className="text-2xl font-bold text-gray-600">1</span>
                </div>
              </div>
            </div>

            <div className="mtq-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  View Documents
                </Button>
                <Button variant="secondary" className="w-full">
                  Organization Settings
                </Button>
                <Button variant="neutral" className="w-full">
                  Usage Analytics
                </Button>
              </div>
            </div>

            <div className="mtq-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">User login</p>
                  <p className="text-gray-500">Sarah Johnson - 2 hours ago</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Document uploaded</p>
                  <p className="text-gray-500">John Smith - 4 hours ago</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">User added</p>
                  <p className="text-gray-500">Mike Wilson - 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddUserModal && (
        <AddUserModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TenantAdminDashboard;
