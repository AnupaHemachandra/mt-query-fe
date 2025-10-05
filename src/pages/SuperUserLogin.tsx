import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";

const SuperUserLogin: React.FC = () => {
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
      alert("Super user login successful! Redirecting to admin dashboard...");
      navigate("/admin");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mtq-card">
        <div className="text-center mb-8">
          <div className="mtq-icon-container-red">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="mtq-heading-secondary">
            Super User Login
          </h1>
          <p className="text-gray-600">Access the platform administration</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Super User Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="superuser@platform.com"
            type="email"
            required
          />
          <FormField
            label="Super User Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your super user password"
            type="password"
            required
          />
          <Button 
            type="submit" 
            variant="danger"
            className="w-full mb-4"
          >
            Login as Super User
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Regular user?</p>
          <Link 
            to="/user-login" 
            className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
          >
            Go to regular user login
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

export default SuperUserLogin;
