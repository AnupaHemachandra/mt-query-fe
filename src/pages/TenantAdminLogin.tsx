import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";

const TenantAdminLogin: React.FC = () => {
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
      alert("Login successful! Redirecting to dashboard...");
      navigate("/tenant-dashboard");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mtq-card">
        <div className="text-center mb-8">
          <div className="mtq-icon-container-purple">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="mtq-heading-secondary">
            Tenant Admin Login
          </h1>
          <p className="text-gray-600">Access your tenant management dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@yourcompany.com"
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
            variant="secondary"
            className="w-full mb-4"
          >
            Login
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Don't have access?</p>
          <Link 
            to="/tenant-request" 
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
          >
            Request tenant access
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

export default TenantAdminLogin;
