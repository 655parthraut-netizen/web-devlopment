import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut, Package, X, Save } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import supabase from '../../supabase/client';
import Loader from '../../components/Loader';

const EMPTY_FORM = {
  name: '',
  brand: 'ElectroNova',
  price: '',
  discount: '0',
  image: '',
  category: 'Mice',
  description: '',
  stock: '',
  rating: '4.5',
  features: '',
};

const CATEGORIES = ['Mice', 'Keyboards', 'Monitors', 'Headphones', 'Webcams', 'Accessories'];

const AdminDashboard = () => {
  const { admin, adminLogout } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
    setMessage('');
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand || 'ElectroNova',
      price: String(product.price),
      discount: String(product.discount || 0),
      image: product.image,
      category: product.category,
      description: product.description,
      stock: String(product.stock),
      rating: String(product.rating),
      features: (product.features || []).join('\n'),
    });
    setModalOpen(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    await supabase.from('products').delete().eq('id', id);
    setMessage('Product deleted.');
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: parseFloat(form.price),
      discount: parseInt(form.discount, 10) || 0,
      image: form.image.trim(),
      images: [form.image.trim()],
      category: form.category,
      description: form.description.trim(),
      stock: parseInt(form.stock, 10) || 0,
      rating: parseFloat(form.rating) || 4.5,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      specifications: {},
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
      setMessage('Product updated successfully.');
    } else {
      await supabase.from('products').insert(payload);
      setMessage('Product created successfully.');
    }

    setSaving(false);
    setModalOpen(false);
    fetchProducts();
  };

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2">
              View store
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
            <p className="text-sm text-gray-500 mt-1">{products.length} items in catalog</p>
          </div>
          <button onClick={openCreate} className="btn-primary rounded-lg shrink-0">
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Stock</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <span className="font-medium text-gray-900 truncate max-w-[160px] sm:max-w-xs">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{product.category}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">${product.price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{product.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                        No products yet. Click "Add product" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100 mt-8">
        Designed by <span className="font-medium text-gray-600">Parth Raut</span>
      </footer>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit product' : 'Add product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="label-text">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Price ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="label-text">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">Stock</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Image URL</label>
                <input
                  required
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="label-text">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div>
                <label className="label-text">Features (one per line)</label>
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary rounded-lg py-3 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
