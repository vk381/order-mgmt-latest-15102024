import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewOrder from './components/NewOrder';
import OrderList from './components/OrderList';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/new-order" element={<PrivateRoute element={<NewOrder />} />} />
            <Route path="/orders" element={<PrivateRoute element={<OrderList />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;