import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Eye, PlusCircle, MessageCircle, Edit, Trash, Play, Pause, Check, Package } from 'lucide-react';

// Mock data for orders with items
const mockOrders = [
  {
    id: 1,
    customer_name: 'John Doe',
    phone_number: '123-456-7890',
    status: 'Pending',
    created_at: '2023-04-01',
    items: [
      { id: 1, description: 'T-shirt', quantity: 2, status: 'Pending', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
      { id: 2, description: 'Jeans', quantity: 1, status: 'In Progress', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    ],
  },
  {
    id: 2,
    customer_name: 'Jane Smith',
    phone_number: '234-567-8901',
    status: 'In Progress',
    created_at: '2023-04-02',
    items: [
      { id: 3, description: 'Dress', quantity: 1, status: 'Completed', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    ],
  },
  {
    id: 3,
    customer_name: 'Bob Johnson',
    phone_number: '345-678-9012',
    status: 'Completed',
    created_at: '2023-04-03',
    items: [
      { id: 4, description: 'Shoes', quantity: 1, status: 'Delivered', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
      { id: 5, description: 'Hat', quantity: 1, status: 'Delivered', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    ],
  },
];

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  const handleEditOrder = (order) => {
    setEditedOrder({ ...order });
    setIsEditingOrder(true);
  };

  const handleSaveOrder = () => {
    const updatedOrders = orders.map(order => 
      order.id === editedOrder.id ? editedOrder : order
    );
    setOrders(updatedOrders);
    setIsEditingOrder(false);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
    }
  };

  const sendWhatsAppMessage = (phoneNumber, message) => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const updateItemStatus = (orderId, itemId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        return { ...order, items: updatedItems };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ClipboardList className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Order List</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            {user?.role === 'SuperAdmin' && (
              <button
                onClick={() => navigate('/new-order')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                New Order
              </button>
            )}
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {order.customer_name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.phone_number}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center mr-4"
                        >
                          <Eye className="h-5 w-5 mr-1" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center mr-4"
                        >
                          <Edit className="h-5 w-5 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 flex items-center mr-4"
                        >
                          <Trash className="h-5 w-5 mr-1" />
                          Delete
                        </button>
                        <button
                          onClick={() => sendWhatsAppMessage(order.phone_number, `Order #${order.id} Status: ${order.status}`)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          Send WhatsApp
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                      <ul className="mt-2 divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <li key={item.id} className="py-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img src={item.image} alt={item.description} className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.description}</p>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)} mr-2`}>
                                  {item.status}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeDetails}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Order Details</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Customer:</strong> {selectedOrder.customer_name}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Phone:</strong> {selectedOrder.phone_number}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Created:</strong> {selectedOrder.created_at}
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Items:</h4>
                <ul className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-16 w-16 rounded-md cursor-pointer"
                            src={item.image}
                            alt={item.description}
                            onClick={() => setEnlargedImage(item.image)}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className={`text-sm ${getStatusColor(item.status)} inline-block rounded-full px-2 py-1 mt-1`}>
                            {item.status}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateItemStatus(selectedOrder.id, item.id, 'In Progress')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateItemStatus(selectedOrder.id, item.id, 'Pending')}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateItemStatus(selectedOrder.id, item.id, 'Completed')}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateItemStatus(selectedOrder.id, item.id, 'Delivered')}
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setEnlargedImage(null)}>
          <div className="max-w-3xl max-h-3xl">
            <img src={enlargedImage} alt="Enlarged view" className="max-w-full max-h-full" />
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Order</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveOrder(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={editedOrder.customer_name}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customer_name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={editedOrder.phone_number}
                  onChange={(e) => setEditedOrder({ ...editedOrder, phone_number: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={editedOrder.status}
                  onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingOrder(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;