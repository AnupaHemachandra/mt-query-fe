import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";

const UserLogin: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    if (form.email && form.password) {
      alert("Login successful! Redirecting to documents...");
      navigate("/documents");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mtq-card">
        <div className="text-center mb-8">
          <div className="mtq-icon-container-orange">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="mtq-heading-secondary">
            User Login
          </h1>
          <p className="text-gray-600">Access your organization's query platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="user@yourcompany.com"
            type="email"
            required
          />
          <FormField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
            type="password"
            required
          />
          <Button 
            type="submit" 
            variant="warning"
            className="w-full mb-4"
          >
            Login
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Need access to your organization?</p>
          <Link 
            to="/tenant-request" 
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
          >
            Request organization access
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <Link 
              to="/" 
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
