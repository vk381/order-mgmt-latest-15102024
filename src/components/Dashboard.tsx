import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, PlusCircle, Users, BarChart2, TrendingUp, Clock } from 'lucide-react';

// Mock data for analytics
const analytics = {
  totalOrders: 150,
  completedOrders: 120,
  pendingOrders: 30,
  averageCompletionTime: '2 days',
};

// Mock data for new orders
const newOrders = [
  { id: 1, customerName: 'John Doe', status: 'New', createdAt: '2023-04-01' },
  { id: 2, customerName: 'Jane Smith', status: 'New', createdAt: '2023-04-02' },
  { id: 3, customerName: 'Bob Johnson', status: 'New', createdAt: '2023-04-03' },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ClipboardList className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Order Management</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name} ({user?.role})</span>
              <button
                onClick={logout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          
          {user?.role !== 'Worker' && (
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <BarChart2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="text-lg font-semibold text-gray-900">{analytics.totalOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed Orders</dt>
                        <dd className="text-lg font-semibold text-gray-900">{analytics.completedOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                        <dd className="text-lg font-semibold text-gray-900">{analytics.pendingOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avg. Completion Time</dt>
                        <dd className="text-lg font-semibold text-gray-900">{analytics.averageCompletionTime}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'Worker' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">New Orders</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {newOrders.map((order) => (
                  <li key={order.id}>
                    <Link to={`/orders/${order.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {order.customerName}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Created on {order.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {user?.role === 'SuperAdmin' && (
              <Link
                to="/new-order"
                className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <PlusCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Create New Order</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">Start here</dd>
                    </dl>
                  </div>
                </div>
              </Link>
            )}
            <Link
              to="/orders"
              className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300 ease-in-out"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">View Orders</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">Manage existing orders</dd>
                  </dl>
                </div>
              </div>
            </Link>
            {user?.role === 'SuperAdmin' && (
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Manage Users</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">Coming soon</dd>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;