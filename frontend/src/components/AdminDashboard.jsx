import React, { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2, LogOut, Search, PlusCircle, Check, X, Palette, List, Package, Upload } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AdminDashboard({ 
  products = [], 
  onProductAdded, 
  dynamicCategories = [], 
  refreshCategories,
  activeTheme = 'vintage',
  onThemeChange
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: (Array.isArray(dynamicCategories) && dynamicCategories.length > 0) ? dynamicCategories[0] : 'Grains',
    price: '',
    stock: '',
    image_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Sync category with dynamic categories when they load
  useEffect(() => {
    if (Array.isArray(dynamicCategories) && dynamicCategories.length > 0 && !editingId) {
      setFormData(prev => ({ ...prev, category: dynamicCategories[0] }));
    }
  }, [dynamicCategories, editingId]);

  const themes = [
    { id: 'vintage', name: 'Vintage (Default)', color: '#14452F' },
    { id: 'diwali', name: 'Diwali', color: '#D32F2F' },
    { id: 'holi', name: 'Holi', color: '#E91E63' },
    { id: 'eid', name: 'Eid', color: '#1B5E20' },
    { id: 'christmas', name: 'Christmas', color: '#B71C1C' },
    { id: 'republic', name: 'Republic Day', color: '#FB8C00' },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: uploadData
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image_url: data.url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

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

  const handleChange = (e) => {
    if (!e || !e.target) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE}/products/${editingId}` : `${API_BASE}/products`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price), stock: Number(formData.stock) })
      });
      if (res.ok) {
        onProductAdded();
        setFormData({ 
          name: '', 
          category: (dynamicCategories && dynamicCategories.length > 0) ? dynamicCategories[0] : 'Grains', 
          price: '', 
          stock: '', 
          image_url: '' 
        });
        setEditingId(null);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      onProductAdded();
    } catch (e) { console.error(e); }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({ ...p });
    setActiveTab('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName })
      });
      if (res.ok) {
        setNewCatName('');
        refreshCategories();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await fetch(`${API_BASE}/categories/${name}`, { method: 'DELETE' });
      refreshCategories();
    } catch (e) { console.error(e); }
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => 
      (p && p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p && p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 font-heading text-center border-b pb-2" style={{color: 'var(--primary)'}}>Admin Login</h2>
          {loginError && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm font-semibold">{loginError}</div>}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input type="text" placeholder="Username" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full border p-2 rounded" />
            <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full border p-2 rounded" />
            <button type="submit" className="w-full text-white font-bold py-3 rounded transition-colors brand-bg" style={{backgroundColor: 'var(--primary)'}}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold font-heading" style={{color: 'var(--primary)'}}>Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${activeTab === 'inventory' ? 'bg-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`} style={activeTab === 'inventory' ? {color: 'var(--primary)'} : {}}>
              <Package size={18} />
              <span className="hidden sm:inline">Inventory</span>
            </button>
            <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${activeTab === 'categories' ? 'bg-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`} style={activeTab === 'categories' ? {color: 'var(--primary)'} : {}}>
              <List size={18} />
              <span className="hidden sm:inline">Categories</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${activeTab === 'settings' ? 'bg-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`} style={activeTab === 'settings' ? {color: 'var(--primary)'} : {}}>
              <Palette size={18} />
              <span className="hidden sm:inline">Themes</span>
            </button>
          </div>
          <button onClick={handleLogout} className="bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-4 font-heading border-b pb-2">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Product Name" className="w-full border p-2 rounded focus:ring-1 focus:ring-gray-300 outline-none" />
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-gray-300 outline-none">
                  {(Array.isArray(dynamicCategories) ? dynamicCategories : []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-4">
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" className="w-1/2 border p-2 rounded focus:ring-1 focus:ring-gray-300 outline-none" />
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-1/2 border p-2 rounded focus:ring-1 focus:ring-gray-300 outline-none" />
                </div>
                
                {/* Image Upload UI */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Product Image</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden relative">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-xs text-gray-500 font-medium">{uploading ? 'Processing...' : 'Upload Image'}</p>
                          </div>
                        )}
                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading || uploading} className="w-full text-white font-bold py-3 rounded transition-colors disabled:opacity-50" style={{backgroundColor: 'var(--primary)'}}>
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {
                    setEditingId(null); 
                    setFormData({name:'', category:dynamicCategories[0] || 'Grains', price:'', stock:'', image_url:''})
                  }} className="w-full py-2 text-gray-400 text-xs hover:text-gray-600 transition-colors">
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-gray-100 outline-none" />
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr style={{color: 'var(--primary)'}}>
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredProducts || []).map(p => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-gray-500 italic">{p.category}</td>
                      <td className="p-4 font-bold">₹{p.price}</td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => startEdit(p)} className="p-2 text-teal hover:bg-teal/10 rounded-full transition-colors"><Pencil size={18}/></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400 italic">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold mb-4 font-heading border-b pb-2">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="flex gap-4">
              <input type="text" placeholder="Category Name (e.g. Sweets)" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-grow border p-2 rounded" />
              <button type="submit" className="text-white px-6 py-2 rounded font-bold" style={{backgroundColor: 'var(--primary)'}}>Add</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(dynamicCategories || []).map(cat => (
              <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                <span className="font-semibold text-gray-700">{cat}</span>
                <button onClick={() => handleDeleteCategory(cat)} className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <h3 className="text-2xl font-bold mb-8 font-heading text-center border-b pb-4">Store Appearance Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {themes.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => onThemeChange(t.id)} 
                  className={`relative p-1 rounded-xl transition-all hover:scale-105 border-4 ${activeTheme === t.id ? 'border-primary' : 'border-transparent'}`}
                  style={activeTheme === t.id ? {borderColor: 'var(--primary)'} : {}}
                >
                  <div className="h-24 w-full rounded-t-lg mb-2" style={{backgroundColor: t.color}}></div>
                  <div className="bg-gray-50 h-12 w-full rounded-b-lg flex items-center justify-center font-bold text-xs uppercase tracking-wider">{t.name}</div>
                  {activeTheme === t.id && (
                    <div className="absolute -top-3 -right-3 text-white rounded-full p-1" style={{backgroundColor: 'var(--primary)'}}>
                      <Check size={16}/>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
