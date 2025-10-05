import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";

const AdminDashboard: React.FC = () => {
  const [requests] = useState([
    {
      id: 1,
      companyName: "TechCorp Inc.",
      email: "admin@techcorp.com",
      contactName: "John Smith",
      status: "pending",
      requestDate: "2024-01-15"
    },
    {
      id: 2,
      companyName: "DataFlow Solutions",
      email: "contact@dataflow.com",
      contactName: "Sarah Johnson",
      status: "approved",
      requestDate: "2024-01-14"
    },
    {
      id: 3,
      companyName: "CloudTech Ltd.",
      email: "info@cloudtech.com",
      contactName: "Mike Wilson",
      status: "pending",
      requestDate: "2024-01-13"
    }
  ]);

  const handleApprove = (id: number) => {
    alert(`Request ${id} approved!`);
  };

  const handleReject = (id: number) => {
    alert(`Request ${id} rejected.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mtq-heading-primary">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage tenant requests and platform settings</p>
            </div>
            <Link to="/" className="mtq-nav-link">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mtq-card">
              <h2 className="mtq-heading-tertiary">Tenant Requests</h2>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{request.companyName}</h3>
                        <p className="text-gray-600">{request.contactName} • {request.email}</p>
                        <p className="text-sm text-gray-500">Requested: {request.requestDate}</p>
                      </div>
                      <span className={request.status === 'approved' ? 'mtq-status-active' : 'mtq-status-pending'}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => handleApprove(request.id)}
                        variant="success"
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleReject(request.id)}
                        variant="danger"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="mtq-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Requests</span>
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Approved</span>
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
              </div>
            </div>

            <div className="mtq-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Platform Actions</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  View All Tenants
                </Button>
                <Button variant="secondary" className="w-full">
                  System Settings
                </Button>
                <Button variant="neutral" className="w-full">
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
