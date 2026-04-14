import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, LogOut, Search, PlusCircle, Check, X } from 'lucide-react';

export default function AdminDashboard({ products, onProductAdded }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains',
    price: '',
    stock: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = ["Grains", "Spices", "Dairy", "Cleaning"];

  // API base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/products';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'adminhube') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      
      const res = await fetch(url, {
        method,
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
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) onProductAdded();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || ''
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Grains', price: '', stock: '', image_url: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-teal/20 pb-4 gap-4">
        <h1 className="text-3xl font-bold text-forestGreen font-heading">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded font-semibold hover:bg-red-100 transition-colors self-start md:self-auto border border-red-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border border-teal/10 sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
              <h2 className="text-xl font-bold font-heading">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              {editingId ? <Pencil size={20} className="text-teal" /> : <PlusCircle size={20} className="text-teal" />}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Pure Basmati"
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
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
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
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal font-mono text-xs"
                />
              </div>
              
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full text-white font-bold py-3 rounded transition-colors flex items-center justify-center space-x-2 ${editingId ? 'bg-teal hover:bg-forestGreen' : 'bg-forestGreen hover:bg-teal'} disabled:opacity-50`}
                >
                  {editingId ? <Check size={20} /> : <PlusCircle size={20} />}
                  <span>{loading ? 'Processing...' : (editingId ? 'Update Product' : 'Add Product')}</span>
                </button>
                
                {editingId && (
                  <button 
                    type="button"
                    onClick={cancelEdit}
                    className="w-full bg-gray-100 text-gray-600 font-bold py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X size={18} />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-teal/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold font-heading border-b border-gray-100 pb-2 flex-grow">Inventory Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal w-full sm:w-64 shadow-inner bg-gray-50"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream text-forestGreen border-b-2 border-teal/20">
                    <th className="py-4 px-4 font-bold text-sm uppercase tracking-wider">Product</th>
                    <th className="py-4 px-4 font-bold text-sm uppercase tracking-wider">Category</th>
                    <th className="py-4 px-4 font-bold text-sm uppercase tracking-wider">Price (₹)</th>
                    <th className="py-4 px-4 font-bold text-sm uppercase tracking-wider">Stock</th>
                    <th className="py-4 px-4 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className={`border-b border-gray-100 hover:bg-teal/5 transition-colors ${editingId === product.id ? 'bg-teal/5 ring-1 ring-inset ring-teal/30' : ''}`}>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{product.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {product.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600 italic">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-forestGreen">₹{product.price}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => startEdit(product)}
                            className="p-2 text-teal hover:bg-teal/10 rounded-full transition-all hover:scale-110"
                            title="Edit Product"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all hover:scale-110"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-400 italic">
                        {searchTerm ? `No results for "${searchTerm}"` : 'Your inventory is empty.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-xs text-gray-400 text-right italic">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
