import { useEffect, useState, useRef } from 'react';
import { X, Plus, Search, ImageOff, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    getAllMasterProducts,
    addRetailerProductFromMaster,
    searchMasterProducts,
    getMasterProductSuggestions
} from '@/api/products';
import { CATEGORY_LABELS } from '@/constants';
import { getImageUrl } from '@/utils/api';
import './Modern.css';

const RetailerAllProductsPage = () => {
    const firstRender = useRef(true);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | string | null>(null);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [addForm, setAddForm] = useState({
        price: '',
        mrp: '',
        stock: '',
        discount_percentage: '',
        requires_prescription: false,
        is_loose_available: true
    });

    const fetchMasterProducts = async () => {
        setLoading(true);
        try {
            let data;
            if (query.trim()) {
                data = await searchMasterProducts(query, page, 50);
            } else {
                data = await getAllMasterProducts(page, 50, undefined, undefined);
            }

            const list = Array.isArray(data) ? data : (data?.products || data?.data || []);
            const total = data?.total || 0;

            setProducts(list);
            setTotalPages(Math.ceil(total / 50) || 1);
            setNotice(null);
        } catch (error) {
            setNotice({ type: 'error', text: 'Failed to load master products.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterProducts();
    }, [page]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            if (page === 1) fetchMasterProducts();
            else setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = () => {
        setShowSuggestions(false);
        setPage(1);
        fetchMasterProducts();
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 1) {
            try {
                const results = await getMasterProductSuggestions(value);
                const suggestionList = Array.isArray(results) ? results : (results?.suggestions || []);
                setSuggestions(suggestionList.map((s: any) => typeof s === 'string' ? s : s.product_name || s.name));
                setShowSuggestions(true);
            } catch (err) {
                // Ignore suggestion errors
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        setPage(1);
    };

    const openAddModal = (product: any) => {
        setSelectedProduct(product);
        setAddForm({
            price: '',
            mrp: product.mrp || product.price || '',
            stock: '100',
            discount_percentage: '',
            requires_prescription: product.requires_prescription || false,
            is_loose_available: true
        });
        setShowAddModal(true);
    };

    const handleAddToStore = async () => {
        if (!selectedProduct || !addForm.price) {
            setNotice({ type: 'error', text: 'Price is required.' });
            return;
        }

        const productId = selectedProduct.id || selectedProduct.product_id;
        const productCategoryId = selectedProduct.product_category || selectedProduct.product_category_id || 1;

        setAddingId(productId);

        try {
            await addRetailerProductFromMaster({
                master_product_id: Number(productId),
                price: Number(addForm.price),
                mrp: addForm.mrp ? Number(addForm.mrp) : undefined,
                stock: addForm.stock ? Number(addForm.stock) : undefined,
                discount_percentage: addForm.discount_percentage ? Number(addForm.discount_percentage) : undefined,
                requires_prescription: String(addForm.requires_prescription),
                is_loose_available: String(addForm.is_loose_available),
                product_category_id: Number(productCategoryId)
            });

            setNotice({ type: 'success', text: 'Product added to your store successfully!' });
            setShowAddModal(false);
            setSelectedProduct(null);
        } catch (error) {
            setNotice({ type: 'error', text: 'Failed to add product. It might already exist in your store.' });
        } finally {
            setAddingId(null);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="modern-page">
            {/* Header */}
            <motion.div 
                className="modern-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="modern-header-content">
                    <h1>All Master Products</h1>
                    <p>Browse the master catalog and add items to your inventory.</p>
                </div>
                {/* Search Bar with Suggestions */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, brand, or salt composition..."
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            autoComplete="off"
                        />
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'white',
                                border: '1px solid #e5e5e5',
                                borderRadius: '0 0 8px 8px',
                                marginTop: '-8px',
                                zIndex: 50,
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                            }}
                        >
                        {suggestions.map((suggestion, idx) => (
                            <div
                                key={idx}
                                onClick={() => selectSuggestion(suggestion)}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    borderBottom: idx < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                                    fontSize: '0.875rem',
                                    transition: 'background-color 0.15s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                {suggestion}
                            </div>
                        ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Notice */}
            {notice && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`modern-alert modern-alert-${notice.type === 'success' ? 'success' : 'error'}`}
                >
                    {notice.text}
                    <button 
                        style={{ 
                            position: 'absolute', 
                            right: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            padding: '4px'
                        }} 
                        onClick={() => setNotice(null)}
                    >
                        <X size={14} />
                    </button>
                </motion.div>
            )}

            {/* Products Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="modern-card">
                    {products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Package size={32} />
                            </div>
                            <h3 className="empty-state-title">No products found</h3>
                            <p className="empty-state-description">
                                {query ? 'Try a different search term.' : 'The master catalog appears to be empty.'}
                            </p>
                        </div>
                    ) : (
                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Brand / Salt</th>
                                        <th>Category</th>
                                        <th>Pack Size</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <motion.tr
                                            key={product.id || product.product_id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ 
                                                        width: 48, 
                                                        height: 48, 
                                                        borderRadius: 8, 
                                                        overflow: 'hidden', 
                                                        background: '#f5f5f5', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        flexShrink: 0 
                                                    }}>
                                                        {product.default_image ? (
                                                            <img
                                                                src={getImageUrl(product.default_image)}
                                                                alt={product.product_name || product.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <ImageOff size={20} color="#a3a3a3" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{product.product_name || product.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginTop: '2px' }}>
                                                            {product.pack_size}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold">{product.brand_name || '--'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#737373', marginTop: '2px' }}>
                                                    {product.salt_composition}
                                                </div>
                                            </td>
                                            <td>{product.category?.name || CATEGORY_LABELS[product.category] || product.category || '--'}</td>
                                            <td>{product.pack_size || '--'}</td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => openAddModal(product)}
                                                        disabled={addingId === (product.id || product.product_id)}
                                                    >
                                                        <Plus size={14} />
                                                        {addingId === (product.id || product.product_id) ? 'Adding...' : 'Add'}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.length > 0 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={page === 1 || loading}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="pagination-btn"
                                disabled={page >= totalPages || loading}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Add to Store Modal */}
            {showAddModal && selectedProduct && (
                <div className="modern-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <motion.div 
                        className="modern-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '500px' }}
                    >
                        <div className="modern-modal-header">
                            <div>
                                <h3>Add to Your Store</h3>
                                <p>{selectedProduct.product_name || selectedProduct.name}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modern-modal-body">
                            <div className="modern-alert" style={{ marginBottom: '16px', padding: '12px', fontSize: '0.875rem' }}>
                                Configure your selling price and initial stock for this product.
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                    <label className="form-label">
                                        Your Selling Price <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={addForm.price}
                                        onChange={(e) => {
                                            const newPrice = e.target.value;
                                            const mrp = addForm.mrp;
                                            let discount = addForm.discount_percentage;
                                            if (newPrice && mrp && Number(mrp) > 0) {
                                                discount = String(Math.round(((Number(mrp) - Number(newPrice)) / Number(mrp)) * 10000) / 100);
                                            }
                                            setAddForm({ ...addForm, price: newPrice, discount_percentage: discount });
                                        }}
                                        placeholder="e.g. 100"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="form-label">MRP</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={addForm.mrp}
                                        onChange={(e) => {
                                            const newMrp = e.target.value;
                                            const price = addForm.price;
                                            let discount = addForm.discount_percentage;
                                            if (price && newMrp && Number(newMrp) > 0) {
                                                discount = String(Math.round(((Number(newMrp) - Number(price)) / Number(newMrp)) * 10000) / 100);
                                            }
                                            setAddForm({ ...addForm, mrp: newMrp, discount_percentage: discount });
                                        }}
                                        placeholder="e.g. 120"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label className="form-label">Discount %</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={addForm.discount_percentage}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5', cursor: 'default' }}
                                        placeholder="Auto-calculated"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Initial Stock</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={addForm.stock}
                                        onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                                        placeholder="e.g. 50"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={addForm.requires_prescription}
                                        onChange={(e) => setAddForm({ ...addForm, requires_prescription: e.target.checked })}
                                    />
                                    <span style={{ fontSize: '0.875rem', color: '#525252' }}>Requires Prescription</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={addForm.is_loose_available}
                                        onChange={(e) => setAddForm({ ...addForm, is_loose_available: e.target.checked })}
                                    />
                                    <span style={{ fontSize: '0.875rem', color: '#525252' }}>Loose Available</span>
                                </label>
                            </div>
                        </div>

                        <div className="modern-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleAddToStore}
                                disabled={!addForm.price || addingId === (selectedProduct.id || selectedProduct.product_id)}
                            >
                                {addingId === (selectedProduct.id || selectedProduct.product_id) ? 'Adding...' : 'Add to Store'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default RetailerAllProductsPage;
