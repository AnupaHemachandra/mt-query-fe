import React, { useState } from "react";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";

const TenantRequest: React.FC = () => {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    contactName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Request submitted! Admin will review.");
    setForm({ companyName: "", email: "", contactName: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mtq-card">
        <div className="text-center mb-8">
          <div className="mtq-icon-container">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="mtq-heading-secondary">
            Request Access
          </h1>
          <p className="text-gray-600">Join our Multi-Tenant Query Platform</p>
        </div>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Company Name"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Your company name"
          required
        />
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          type="email"
          required
        />
        <FormField
          label="Contact Person"
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          placeholder="Contact person name"
          required
        />
        <Button type="submit" variant="primary" className="w-full">
          Submit Request
        </Button>
      </form>
      </div>
    </div>
  );
};

export default TenantRequest;
