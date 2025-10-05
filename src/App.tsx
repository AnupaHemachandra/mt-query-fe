import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import TenantRequest from './pages/TenantRequest';
import AdminDashboard from './pages/AdminDashboard';
import TenantAdminLogin from './pages/TenantAdminLogin';
import TenantAdminDashboard from './pages/TenantAdminDashboard';
import UserLogin from './pages/UserLogin';
import SuperUserLogin from './pages/SuperUserLogin';
import DocumentsDashboard from './pages/DocumentsDashboard';

const Navigation = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MTQuery
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/tenant-request" className="mtq-nav-link">
              Request Access
            </Link>
            <Link to="/tenant-login" className="mtq-nav-link hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-900/20">
              Tenant Login
            </Link>
            <Link to="/tenant-dashboard" className="mtq-nav-link hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20">
              Tenant Dashboard
            </Link>
            <Link to="/user-login" className="mtq-nav-link hover:text-orange-600 hover:bg-orange-50 dark:hover:text-orange-400 dark:hover:bg-orange-900/20">
              User Login
            </Link>
            <Link to="/documents" className="mtq-nav-link hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20">
              Documents
            </Link>
            <button
              onClick={handleToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <Navigation />

        <main>
          <Routes>
            <Route path="/" element={
              <div className="max-w-6xl mx-auto mt-16 p-8">
                <div className="text-center mb-16">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Welcome to MTQuery
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    The ultimate Multi-Tenant Query Platform for modern organizations
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="mtq-card mtq-card-hover flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">For Tenants</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Request access to our query platform and manage your organization's users.
                      </p>
                    </div>
                    <Link to="/tenant-request" className="mtq-button-primary w-full text-center">
                      Request Access
                    </Link>
                  </div>
                  <div className="mtq-card mtq-card-hover flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">For Administrators</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Review tenant requests and manage the query platform.
                      </p>
                    </div>
                    <Link to="/admin" className="mtq-button-success w-full text-center">
                      Admin Dashboard
                    </Link>
                  </div>
                  <div className="mtq-card mtq-card-hover flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">For Users</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Login to access your tenant's query resources and features.
                      </p>
                    </div>
                    <Link to="/user-login" className="mtq-button-secondary w-full text-center">
                      User Login
                    </Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/tenant-request" element={<TenantRequest />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/tenant-login" element={<TenantAdminLogin />} />
            <Route path="/tenant-dashboard" element={<TenantAdminDashboard />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/super-user-login" element={<SuperUserLogin />} />
            <Route path="/documents" element={<DocumentsDashboard />} />
          </Routes>
        </main>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
