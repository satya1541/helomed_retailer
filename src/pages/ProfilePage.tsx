import { useEffect, useState } from 'react';
import { Phone, Mail, Store, UserRound, MapPin, Building2, Landmark, ShieldCheck, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRetailerAuth } from '@/context/AuthContext';
import { setRetailerOnlineStatus, updateRetailerLocation, updateRetailerProfile } from '@/api/auth';
import './Modern.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDpyclQV4dQAs4q2UcfnmZ2lwzXPmIVe7E';

const ROLE_LABELS: Record<number, string> = {
    2: 'Retailer',
    3: 'User',
};

const RetailerProfilePage = () => {
    const { retailer, refreshProfile } = useRetailerAuth();
    const [isOnline, setIsOnline] = useState<boolean>(!!retailer?.is_online);
    const [form, setForm] = useState({
        shop_name: retailer?.shop_name || '',
        owner_name: retailer?.owner_name || '',
        email: retailer?.email || '',
        full_address: retailer?.full_address || ''
    });
    const [location, setLocation] = useState({
        latitude: retailer?.latitude || '',
        longitude: retailer?.longitude || '',
        full_address: retailer?.full_address || '',
        pincode: retailer?.pincode || ''
    });
    const [saving, setSaving] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        refreshProfile();
    }, []);

    useEffect(() => {
        setIsOnline(!!retailer?.is_online);
    }, [retailer]);

    const handleProfileSave = async () => {
        setSaving(true);
        try {
            const payload = new FormData();
            payload.append('shop_name', form.shop_name);
            payload.append('owner_name', form.owner_name);
            payload.append('email', form.email);
            payload.append('full_address', form.full_address);
            await updateRetailerProfile(payload);
            await refreshProfile();
        } finally {
            setSaving(false);
        }
    };

    const handleLocationSave = async () => {
        await updateRetailerLocation({
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            full_address: location.full_address,
            pincode: location.pincode
        });
        await refreshProfile();
    };

    const toggleOnline = async () => {
        const next = !isOnline;
        setIsOnline(next);
        await setRetailerOnlineStatus(next);
        await refreshProfile();
    };

    const handleUseCurrentLocation = async () => {
        setLocationError('');

        const reverseGeocode = async (lat: number, lng: number) => {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();

            if (!response.ok || !Array.isArray(data?.results) || data.results.length === 0) {
                throw new Error(data?.error_message || 'Address lookup failed');
            }

            const formattedAddress = data.results[0]?.formatted_address || '';
            const postalComp = data.results
                .flatMap((result: any) => result.address_components || [])
                .find((component: any) => component.types?.includes('postal_code'));

            setLocation((prev) => ({
                ...prev,
                latitude: Number(lat).toFixed(6),
                longitude: Number(lng).toFixed(6),
                full_address: formattedAddress || prev.full_address,
                pincode: postalComp?.long_name || prev.pincode
            }));
        };

        const fallbackToGoogleGeolocation = async () => {
            const response = await fetch(
                `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const data = await response.json();
            if (!response.ok || !data?.location) {
                throw new Error(data?.error?.message || 'Unable to detect location');
            }

            await reverseGeocode(data.location.lat, data.location.lng);
        };

        try {
            setLocating(true);

            if ('geolocation' in navigator) {
                await new Promise<void>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            try {
                                await reverseGeocode(position.coords.latitude, position.coords.longitude);
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        },
                        () => reject(new Error('Browser geolocation failed')),
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                });
            } else {
                await fallbackToGoogleGeolocation();
            }
        } catch {
            try {
                await fallbackToGoogleGeolocation();
            } catch {
                setLocationError('Unable to detect location. Please enter latitude and longitude manually.');
            }
        } finally {
            setLocating(false);
        }
    };

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
                    <h1>Profile</h1>
                    <p>Manage your profile, location and availability.</p>
                </div>
                <motion.button
                    className={`btn ${isOnline ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={toggleOnline}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isOnline ? 'Online' : 'Offline'}
                </motion.button>
            </motion.div>

            {/* Shop Details & Bank Info */}
            <div className="modern-grid modern-grid-2">
                {/* Shop Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="modern-card">
                        <div className="modern-card-header">
                            <h3 className="modern-card-title">Shop Details</h3>
                            <p className="modern-card-subtitle">Your store information</p>
                        </div>
                        <div className="modern-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Store size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Shop Name</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.shop_name || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <UserRound size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Owner Name</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.owner_name || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Phone size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Phone</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.phone || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Mail size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Email</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.email || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <MapPin size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Address</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.full_address || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Building2 size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Pincode</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.pincode || '--'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bank & Verification */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="modern-card">
                        <div className="modern-card-header">
                            <h3 className="modern-card-title">Bank & Verification</h3>
                            <p className="modern-card-subtitle">Account and verification details</p>
                        </div>
                        <div className="modern-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Landmark size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Account Number</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.account_number || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <Landmark size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>IFSC Code</div>
                                        <div style={{ fontWeight: 500 }}>{retailer?.ifsc_code || '--'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <ShieldCheck size={18} style={{ marginTop: '2px', color: '#737373', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Role Type</div>
                                        <div style={{ fontWeight: 500 }}>
                                            {typeof retailer?.role_type === 'number'
                                                ? (ROLE_LABELS[retailer.role_type] || `Role ${retailer.role_type}`)
                                                : '--'}
                                        </div>
                                    </div>
                                </div>
                                <div className="modern-alert" style={{ marginTop: '8px', padding: '12px', fontSize: '0.875rem' }}>
                                    Keep these details updated to avoid payout or order settlement issues.
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                style={{ marginTop: '32px' }}
            >
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#171717' }}>Edit Profile</h2>

                <div className="modern-grid modern-grid-2">
                    {/* Profile Details Form */}
                    <div className="modern-card">
                        <div className="modern-card-header">
                            <h3 className="modern-card-title">Profile Details</h3>
                            <p className="modern-card-subtitle">Update your store information</p>
                        </div>
                        <div className="modern-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label className="form-label">Shop Name</label>
                                    <input 
                                        className="form-input"
                                        value={form.shop_name} 
                                        onChange={(e) => setForm({ ...form, shop_name: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Owner Name</label>
                                    <input 
                                        className="form-input"
                                        value={form.owner_name} 
                                        onChange={(e) => setForm({ ...form, owner_name: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input 
                                        className="form-input"
                                        type="email"
                                        value={form.email} 
                                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Full Address</label>
                                    <input 
                                        className="form-input"
                                        value={form.full_address} 
                                        onChange={(e) => setForm({ ...form, full_address: e.target.value })} 
                                    />
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleProfileSave} 
                                    disabled={saving}
                                    style={{ marginTop: '8px' }}
                                >
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Location Form */}
                    <div className="modern-card">
                        <div className="modern-card-header">
                            <h3 className="modern-card-title">Update Location</h3>
                            <p className="modern-card-subtitle">Set your store location</p>
                        </div>
                        <div className="modern-card-body">
                            <button 
                                className="btn btn-outline" 
                                onClick={handleUseCurrentLocation} 
                                disabled={locating}
                                style={{ marginBottom: '16px', width: '100%' }}
                            >
                                <Navigation size={16} />
                                {locating ? 'Detecting Location...' : 'Use Current Location'}
                            </button>

                            {locationError && (
                                <div className="modern-alert modern-alert-error" style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
                                    {locationError}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label className="form-label">Latitude</label>
                                        <input 
                                            className="form-input"
                                            value={location.latitude} 
                                            onChange={(e) => setLocation({ ...location, latitude: e.target.value })} 
                                            placeholder="e.g. 28.6139"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Longitude</label>
                                        <input 
                                            className="form-input"
                                            value={location.longitude} 
                                            onChange={(e) => setLocation({ ...location, longitude: e.target.value })} 
                                            placeholder="e.g. 77.2090"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Full Address</label>
                                    <input 
                                        className="form-input"
                                        value={location.full_address} 
                                        onChange={(e) => setLocation({ ...location, full_address: e.target.value })} 
                                        placeholder="Complete address"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Pincode</label>
                                    <input 
                                        className="form-input"
                                        value={location.pincode} 
                                        onChange={(e) => setLocation({ ...location, pincode: e.target.value })} 
                                        placeholder="e.g. 110001"
                                    />
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleLocationSave}
                                    style={{ marginTop: '8px' }}
                                >
                                    Save Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RetailerProfilePage;
