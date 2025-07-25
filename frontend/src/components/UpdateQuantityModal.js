import React, { useState } from 'react';

const UpdateQuantityModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${product.id}/quantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: Number(quantity) })
      });
      if (res.ok) {
        onUpdate();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update quantity');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Quantity</h2>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuantityModal; 