import React, { useState } from 'react';

export default function AdminDashboard({ products, onProductAdded }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains',
    price: '',
    stock: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'adminhube') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });
      
      if (res.ok) {
        onProductAdded();
        setFormData({ name: '', category: 'Grains', price: '', stock: '', image_url: '' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white p-8 rounded-lg shadow-md border border-teal/10">
          <h2 className="text-2xl font-bold mb-6 font-heading text-forestGreen text-center border-b border-gray-100 pb-2">Admin Login</h2>
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-semibold">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-forestGreen text-white font-bold py-3 rounded hover:bg-teal transition-colors mt-4 shadow-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-forestGreen border-b border-teal/20 pb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-teal/10">
          <h2 className="text-xl font-bold mb-6 font-heading border-b border-gray-100 pb-2">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="Grains">Grains</option>
                <option value="Spices">Spices</option>
                <option value="Dairy">Dairy</option>
              </select>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                <input 
                  type="number" 
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
              <input 
                type="text" 
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-forestGreen text-white font-bold py-3 rounded mt-4 hover:bg-teal transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-teal/10 overflow-x-auto">
          <h2 className="text-xl font-bold mb-6 font-heading border-b border-gray-100 pb-2">Current Inventory</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream text-forestGreen border-b-2 border-teal/20">
                <th className="py-3 px-4 font-bold">Name</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Price</th>
                <th className="py-3 px-4 font-bold">Stock</th>
                <th className="py-3 px-4 font-bold">Image Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">₹{product.price}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.image_url ? (
                      <span className="text-xs bg-teal/10 text-teal px-2 py-1 rounded font-bold">Provided</span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 italic">No products in inventory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
