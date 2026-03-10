import { useEffect, useMemo, useRef, useState } from 'react';
import { X, ImageOff, Plus, Search, Edit, Eye, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    addRetailerProduct,
    getRetailerProducts,
    getRetailerSingleProduct,
    searchRetailerProducts,
    updateRetailerProduct
} from '@/api/products';
import {
    CATEGORY_LABELS,
    PRODUCT_CATEGORY_LABELS,
    DOSAGE_FORM_LABELS,
    AGE_GROUP_LABELS,
    CATEGORY,
    PRODUCT_CATEGORY,
    DOSAGE_FORM,
    AGE_GROUP
} from '@/constants';
import { getImageUrl } from '@/utils/api';
import './Modern.css';

const RetailerProductsPage = () => {
    const firstRender = useRef(true);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | string | null>(null);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        product_name: '',
        salt_composition: '',
        brand_name: '',
        pack_size: '',
        mrp: '',
        price: '',
        discount_percentage: '',
        stock: '',
        requires_prescription: false,
        description: '',
        category: '',
        product_category_id: '',
        tags: '',
        dosage_form: '',
        age_group: '',
        is_loose_available: false
    });
    const [image, setImage] = useState<File | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({
        price: '',
        mrp: '',
        stock: '',
        requires_prescription: false,
        is_loose_available: false,
        is_active: true
    });

    const extractProducts = (payload: any): any[] => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.products)) return payload?.products;
        if (Array.isArray(payload?.data?.products)) return payload?.data?.products;
        if (Array.isArray(payload?.data)) return payload?.data;
        if (Array.isArray(payload?.items)) return payload?.items;
        return [];
    };

    const extractTotal = (payload: any): number => {
        return payload?.total || payload?.data?.total || payload?.meta?.total || 0;
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getRetailerProducts(page, 20, undefined);
            const list = extractProducts(data);
            const total = extractTotal(data);
            setProducts(list);
            setTotalPages(Math.ceil(total / 20) || 1);
            setNotice(null);
        } catch (error) {
            setNotice({ type: 'error', text: 'Failed to load products. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let data;
            if (query.trim()) {
                data = await searchRetailerProducts(query, page, 20);
            } else {
                data = await getRetailerProducts(page, 20, undefined);
            }

            const list = extractProducts(data);
            const total = extractTotal(data);

            setProducts(list);
            setTotalPages(Math.ceil(total / 20) || 1);
            setNotice(null);
        } catch (error) {
            setNotice({ type: 'error', text: 'Failed to load products.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [page]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            if (page === 1) handleSearch();
            else setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSubmit = async () => {
        try {
            const payload = new FormData();
            payload.append('product_name', form.product_name);
            payload.append('salt_composition', form.salt_composition);
            payload.append('brand_name', form.brand_name);
            payload.append('pack_size', form.pack_size);
            payload.append('mrp', form.mrp);
            payload.append('price', form.price);
            payload.append('discount_percentage', form.discount_percentage);
            if (form.stock) payload.append('stock', form.stock);
            payload.append('requires_prescription', String(form.requires_prescription));
            payload.append('description', form.description);
            if (form.category && form.category.trim()) payload.append('category', form.category);
            if (form.product_category_id && form.product_category_id.trim()) payload.append('product_category_id', form.product_category_id);
            payload.append('tags', form.tags);
            if (form.dosage_form && form.dosage_form.trim()) payload.append('dosage_form', form.dosage_form);
            if (form.age_group && form.age_group.trim()) payload.append('age_group', form.age_group);
            payload.append('is_loose_available', String(form.is_loose_available));

            if (image) payload.append('product_image', image);

            await addRetailerProduct(payload);
            setNotice({ type: 'success', text: 'Product added successfully!' });
            setShowForm(false);
            setForm({
                product_name: '',
                salt_composition: '',
                brand_name: '',
                pack_size: '',
                mrp: '',
                price: '',
                discount_percentage: '',
                stock: '',
                requires_prescription: false,
                description: '',
                category: '',
                product_category_id: '',
                tags: '',
                dosage_form: '',
                age_group: '',
                is_loose_available: false
            });
            setImage(null);
            fetchProducts();
        } catch (error: any) {
            setNotice({ type: 'error', text: error?.response?.data?.message || 'Failed to add product. Please check all fields.' });
        }
    };

    const handleViewProduct = async (product: any) => {
        const productId = product.id || product.product_id;
        try {
            const details = await getRetailerSingleProduct(productId);
            setSelectedProduct(details?.data ?? details);
        } catch (error) {
            setNotice({ type: 'error', text: 'Failed to fetch product details.' });
        }
    };

    const handleEditProduct = (product: any) => {
        setEditProduct(product);
        setEditForm({
            price: String(product.price),
            mrp: String(product.mrp || ''),
            stock: String(product.stock || ''),
            requires_prescription: product.requires_prescription || false,
            is_loose_available: product.is_loose_available || false,
            is_active: product.is_active ?? true
        });
        setShowEditModal(true);
    };

    const handleUpdateStoreProduct = async () => {
        if (!editProduct) return;
        const productId = editProduct.id || editProduct.product_id;
        setActionLoadingId(productId);

        try {
            const payload = {
                stock: Number(editForm.stock),
                price: Number(editForm.price),
                mrp: Number(editForm.mrp),
                requires_prescription: String(editForm.requires_prescription),
                is_loose_available: String(editForm.is_loose_available),
                is_active: editForm.is_active
            };

            const updated = await updateRetailerProduct(productId, payload);
            const updatedProduct = updated?.data ?? updated;

            setProducts((prev) => prev.map((item) => {
                const itemId = item.id || item.product_id;
                if (itemId !== productId) return item;
                return { ...item, ...updatedProduct };
            }));

            setNotice({ type: 'success', text: 'Product updated successfully.' });
            setShowEditModal(false);
            setEditProduct(null);
        } catch (error) {
            setNotice({ type: 'error', text: 'Failed to update product.' });
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredProducts = useMemo(() => products, [products]);

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
                    <h1>My Products</h1>
                    <p>Manage your inventory and pricing.</p>
                </div>
                {/* Search Bar */}
                <div className="search-bar" style={{ flex: '0 1 320px', maxWidth: '320px' }}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search products by name, brand, or salt..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <motion.button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={16} />
                    Add Product
                </motion.button>
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
                </motion.div>
            )}

            {/* Products Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="modern-card">
                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Package size={32} />
                            </div>
                            <h3 className="empty-state-title">No products found</h3>
                            <p className="empty-state-description">
                                {query ? 'Try a different search term.' : 'Get started by adding your first product.'}
                            </p>
                        </div>
                    ) : (
                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Brand / Salt</th>
                                        <th>Price</th>
                                        <th>MRP</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, index) => (
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
                                                        {product.product_image ? (
                                                            <img
                                                                src={getImageUrl(product.product_image)}
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
                                                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                                            {(product.requires_prescription === true || product.requires_prescription === 'true') && (
                                                                <span className="badge badge-error">Rx</span>
                                                            )}
                                                            {(product.is_loose_available === true || product.is_loose_available === 'true') && (
                                                                <span className="badge badge-success">Loose</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold">{product.brand_name || '--'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#737373', marginTop: '2px' }}>
                                                    {product.salt_composition || ''}
                                                </div>
                                            </td>
                                            <td><span className="font-semibold">₹{product.price}</span></td>
                                            <td>₹{product.mrp || '--'}</td>
                                            <td>{product.stock ?? '--'}</td>
                                            <td>
                                                <span className={`status-badge status-${product.is_active ? 'active' : 'inactive'}`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => handleViewProduct(product)}
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </button>
                                                    <button 
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => handleEditProduct(product)}
                                                    >
                                                        <Edit size={14} />
                                                        Edit
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

            {/* Add Product Modal */}
            {showForm && (
                <div className="modern-modal-overlay" onClick={() => setShowForm(false)}>
                    <motion.div 
                        className="modern-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '700px' }}
                    >
                        <div className="modern-modal-header">
                            <div>
                                <h3>Add Product</h3>
                                <p>Create a custom product for your store.</p>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modern-modal-body">
                            {/* Product Details */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#171717' }}>Product Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label className="form-label">Product Name</label>
                                        <input 
                                            className="form-input"
                                            value={form.product_name} 
                                            onChange={(e) => setForm({ ...form, product_name: e.target.value })} 
                                            placeholder="e.g. Dolo 650" 
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Brand Name</label>
                                        <input 
                                            className="form-input"
                                            value={form.brand_name} 
                                            onChange={(e) => setForm({ ...form, brand_name: e.target.value })} 
                                            placeholder="e.g. Micro Labs" 
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Salt Composition</label>
                                        <input 
                                            className="form-input"
                                            value={form.salt_composition} 
                                            onChange={(e) => setForm({ ...form, salt_composition: e.target.value })} 
                                            placeholder="e.g. Paracetamol" 
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Pack Size</label>
                                        <input 
                                            className="form-input"
                                            value={form.pack_size} 
                                            onChange={(e) => setForm({ ...form, pack_size: e.target.value })} 
                                            placeholder="e.g. 15 tablets" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Inventory */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#171717' }}>Pricing & Inventory</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label className="form-label">MRP</label>
                                        <input 
                                            className="form-input"
                                            type="number" 
                                            value={form.mrp} 
                                            onChange={(e) => {
                                                const newMrp = e.target.value;
                                                const price = form.price;
                                                let discount = '';
                                                if (newMrp && price && Number(newMrp) > 0) {
                                                    discount = String(Math.round(((Number(newMrp) - Number(price)) / Number(newMrp)) * 10000) / 100);
                                                }
                                                setForm({ ...form, mrp: newMrp, discount_percentage: discount });
                                            }} 
                                            placeholder="120" 
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Selling Price</label>
                                        <input 
                                            className="form-input"
                                            type="number" 
                                            value={form.price} 
                                            onChange={(e) => {
                                                const newPrice = e.target.value;
                                                const mrp = form.mrp;
                                                let discount = '';
                                                if (mrp && newPrice && Number(mrp) > 0) {
                                                    discount = String(Math.round(((Number(mrp) - Number(newPrice)) / Number(mrp)) * 10000) / 100);
                                                }
                                                setForm({ ...form, price: newPrice, discount_percentage: discount });
                                            }} 
                                            placeholder="100" 
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Discount %</label>
                                        <input 
                                            className="form-input"
                                            type="number" 
                                            value={form.discount_percentage} 
                                            onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} 
                                            placeholder="20" 
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Stock</label>
                                        <input 
                                            className="form-input"
                                            type="number" 
                                            value={form.stock} 
                                            onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                                            placeholder="50" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Classification */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#171717' }}>Classification</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-select"
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {Object.values(CATEGORY).map((id) => (
                                                <option key={id} value={id}>{CATEGORY_LABELS[id]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Product Category</label>
                                        <select
                                            className="form-select"
                                            value={form.product_category_id}
                                            onChange={(e) => setForm({ ...form, product_category_id: e.target.value })}
                                        >
                                            <option value="">Select Type</option>
                                            {Object.values(PRODUCT_CATEGORY).map((id) => (
                                                <option key={id} value={id}>{PRODUCT_CATEGORY_LABELS[id]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Dosage Form</label>
                                        <select
                                            className="form-select"
                                            value={form.dosage_form}
                                            onChange={(e) => setForm({ ...form, dosage_form: e.target.value })}
                                        >
                                            <option value="">Select Form</option>
                                            {Object.values(DOSAGE_FORM).map((id) => (
                                                <option key={id} value={id}>{DOSAGE_FORM_LABELS[id]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Age Group</label>
                                        <select
                                            className="form-select"
                                            value={form.age_group}
                                            onChange={(e) => setForm({ ...form, age_group: e.target.value })}
                                        >
                                            <option value="">Select Age Group</option>
                                            {Object.values(AGE_GROUP).map((id) => (
                                                <option key={id} value={id}>{AGE_GROUP_LABELS[id]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#171717' }}>Additional Info</h4>
                                <div>
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        className="form-textarea"
                                        value={form.description} 
                                        onChange={(e) => setForm({ ...form, description: e.target.value })} 
                                        rows={3} 
                                        placeholder="Product description..." 
                                    />
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <label className="form-label">Tags</label>
                                    <input 
                                        className="form-input"
                                        value={form.tags} 
                                        onChange={(e) => setForm({ ...form, tags: e.target.value })} 
                                        placeholder="e.g. fever, pain" 
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.requires_prescription}
                                            onChange={(e) => setForm({ ...form, requires_prescription: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: '#525252' }}>Requires Prescription</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.is_loose_available}
                                            onChange={(e) => setForm({ ...form, is_loose_available: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: '#525252' }}>Loose Available</span>
                                    </label>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <label className="form-label">Product Image</label>
                                    <input 
                                        className="form-input"
                                        type="file" 
                                        onChange={(e) => setImage(e.target.files?.[0] || null)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modern-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>Save Product</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editProduct && (
                <div className="modern-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <motion.div 
                        className="modern-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '500px' }}
                    >
                        <div className="modern-modal-header">
                            <div>
                                <h3>Edit Product</h3>
                                <p>Update inventory and pricing for {editProduct.product_name || editProduct.name}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowEditModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modern-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label className="form-label">Selling Price</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">MRP</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={editForm.mrp}
                                        onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Stock</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Available</label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={editForm.is_active === true}
                                            onChange={() => setEditForm({ ...editForm, is_active: true })}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: '#525252' }}>Yes</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={editForm.is_active === false}
                                            onChange={() => setEditForm({ ...editForm, is_active: false })}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: '#525252' }}>No</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editForm.requires_prescription}
                                        onChange={(e) => setEditForm({ ...editForm, requires_prescription: e.target.checked })}
                                    />
                                    <span style={{ fontSize: '0.875rem', color: '#525252' }}>Requires Prescription</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editForm.is_loose_available}
                                        onChange={(e) => setEditForm({ ...editForm, is_loose_available: e.target.checked })}
                                    />
                                    <span style={{ fontSize: '0.875rem', color: '#525252' }}>Loose Available</span>
                                </label>
                            </div>
                        </div>

                        <div className="modern-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleUpdateStoreProduct} 
                                disabled={actionLoadingId === (editProduct.id || editProduct.product_id)}
                            >
                                {actionLoadingId === (editProduct.id || editProduct.product_id) ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* View Product Modal - Simplified */}
            {selectedProduct && (
                <div className="modern-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <motion.div 
                        className="modern-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '600px' }}
                    >
                        <div className="modern-modal-header">
                            <div>
                                <h3>Product Details</h3>
                                <p>{selectedProduct.product_name || selectedProduct.name}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProduct(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modern-modal-body">
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {selectedProduct.product_image && (
                                    <div>
                                        <img
                                            src={getImageUrl(selectedProduct.product_image)}
                                            alt={selectedProduct.product_name}
                                            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                                <div>
                                    <strong>Brand:</strong> {selectedProduct.brand_name || '--'}
                                </div>
                                <div>
                                    <strong>Salt Composition:</strong> {selectedProduct.salt_composition || '--'}
                                </div>
                                <div>
                                    <strong>Pack Size:</strong> {selectedProduct.pack_size || '--'}
                                </div>
                                <div>
                                    <strong>Price:</strong> ₹{selectedProduct.price} <span style={{ color: '#737373' }}>(MRP: ₹{selectedProduct.mrp})</span>
                                </div>
                                <div>
                                    <strong>Stock:</strong> {selectedProduct.stock ?? '--'}
                                </div>
                                {selectedProduct.description && (
                                    <div>
                                        <strong>Description:</strong> <p style={{ marginTop: '4px', color: '#525252' }}>{selectedProduct.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modern-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Close</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default RetailerProductsPage;
