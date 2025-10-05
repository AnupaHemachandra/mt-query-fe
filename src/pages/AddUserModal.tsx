import React, { useState } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";

interface AddUserModalProps {
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) {
      alert(`User ${form.name} added successfully!`);
      onClose();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="mtq-card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="mtq-heading-secondary">
            Add New User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter user's full name"
            required
          />
          <FormField
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="user@company.com"
            type="email"
            required
          />
          
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mtq-input"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <Button 
              type="submit"
              variant="success"
              className="flex-1"
            >
              Add User
            </Button>
            <Button 
              type="button"
              onClick={onClose}
              variant="neutral"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            The user will receive an email invitation to join your organization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
