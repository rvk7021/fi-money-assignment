import React, { useState } from 'react';

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    sku: '',
    image_url: '',
    description: '',
    quantity: '',
    price: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
        })
      });
      if (res.ok) {
        onAdd();
        onClose();
        setForm({ name: '', type: '', sku: '', image_url: '', description: '', quantity: '', price: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add product');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full px-3 py-2 border rounded mb-2" required />
            <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="w-full px-3 py-2 border rounded mb-2" />
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full px-3 py-2 border rounded mb-2" required />
            <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL" className="w-full px-3 py-2 border rounded mb-2" />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded mb-2" />
            <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="w-full px-3 py-2 border rounded mb-2" required />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="w-full px-3 py-2 border rounded mb-2" required />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal; 