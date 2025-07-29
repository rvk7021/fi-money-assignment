import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductModal from '../components/AddProductModal.js';
import UpdateQuantityModal from '../components/UpdateQuantityModal.js';

const PAGE_SIZE = 5;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [retry, setRetry] = useState(0);
    const navigate = useNavigate();

    const fetchProducts = async (pageNum = page) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products?page=${pageNum}&limit=${PAGE_SIZE}`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
                setTotal(data.total || 0);
            } else {
                setError('Failed to fetch products');
            }
        } catch (err) {
            setError('Network error');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!localStorage.getItem('isAuthenticated')) {
            navigate('/login');
            return;
        }
        fetchProducts();
        // eslint-disable-next-line
    }, [navigate, page, retry]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleOpenUpdate = (product) => {
        setSelectedProduct(product);
        setShowUpdateModal(true);
    };

    // Analytics
    const totalInventory = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const mostStocked = products.reduce((max, p) => (p.quantity > (max?.quantity || 0) ? p : max), null);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Product Inventory
                            </h1>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Total Products</span>
                                    <span className="font-semibold text-gray-900">{total}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Total Inventory</span>
                                    <span className="font-semibold text-gray-900">{totalInventory}</span>
                                </div>
                                {mostStocked && (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Most Stocked</span>
                                        <span className="font-semibold text-gray-900">{mostStocked.name}</span>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                            {mostStocked.quantity}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowAddModal(true)} 
                                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Product</span>
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center py-20 space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-red-600 font-medium">{error}</p>
                            <button 
                                onClick={() => setRetry(r => r + 1)} 
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center py-20 space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No products found</p>
                            <p className="text-gray-400 text-sm">Get started by adding your first product</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Inventory</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {products.map((product, index) => (
                                            <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            {product.image_url ? (
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                                                                    <img 
                                                                        src={product.image_url} 
                                                                        alt={product.name} 
                                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-lg font-semibold text-gray-900 truncate">{product.name}</p>
                                                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {product.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 max-w-xs line-clamp-2" title={product.description}>
                                                            {product.description}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            product.quantity > 50 ? 'bg-green-100 text-green-800' :
                                                            product.quantity > 10 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {product.quantity} units
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <p className="text-lg font-bold text-gray-900">${product.price}</p>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <button 
                                                        onClick={() => handleOpenUpdate(product)} 
                                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 space-x-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        <span>Update</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && !loading && !error && (
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(page * PAGE_SIZE, total)}</span> of{' '}
                                    <span className="font-medium">{total}</span> products
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>
                                    <div className="flex space-x-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setPage(i + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    page === i + 1
                                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Next
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={() => fetchProducts(1)} />
            <UpdateQuantityModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} product={selectedProduct} onUpdate={() => fetchProducts(page)} />
        </div>
    );
};

export default Products;