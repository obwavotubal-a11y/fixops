import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import TrackTicket from './TrackTicket';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import CustomerDashboard from './CustomerDashboard';
import Inventory from './Inventory';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const userRole = localStorage.getItem('user_role');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/track" element={<TrackTicket />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
      <Route path="/reset/:uid/:token" element={<ResetPassword />} />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            userRole === 'CUSTOMER' ? (
              <CustomerDashboard />
            ) : (
              <div className="flex h-screen bg-darkBg overflow-hidden font-sans">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-8 text-white">
                    <Routes>
                      <Route path="/" element={
                        <>
                          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                          <Dashboard />
                        </>
                      } />
                      <Route path="/inventory" element={
                        <>
                          <h1 className="text-2xl font-bold mb-6">Inventory</h1>
                          <Inventory />
                        </>
                      } />
                    </Routes>
                  </main>
                </div>
              </div>
            )
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  );
}

export default App;