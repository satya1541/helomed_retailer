import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRetailerProfile } from '@/api/auth';

interface RetailerAuthContextType {
    isAuthenticated: boolean;
    login: (token: string, retailerData?: any) => void;
    logout: () => void;
    retailer: any | null;
    refreshProfile: () => Promise<void>;
}

const RetailerAuthContext = createContext<RetailerAuthContextType | undefined>(undefined);

export const RetailerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!localStorage.getItem('helo_med_retailer_token');
    });

    const [retailer, setRetailer] = useState<any | null>(() => {
        const saved = localStorage.getItem('helo_med_retailer_user');
        return saved ? JSON.parse(saved) : null;
    });

    const refreshProfile = async () => {
        if (!isAuthenticated) return;
        try {
            const data = await getRetailerProfile();
            setRetailer(data);
            localStorage.setItem('helo_med_retailer_user', JSON.stringify(data));
        } catch (error: any) {
            console.error('Failed to refresh retailer profile:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshProfile();
        }
    }, [isAuthenticated]);

    const login = (token: string, retailerData?: any) => {
        localStorage.setItem('helo_med_retailer_token', token);
        if (retailerData) {
            localStorage.setItem('helo_med_retailer_user', JSON.stringify(retailerData));
            setRetailer(retailerData);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('helo_med_retailer_token');
        localStorage.removeItem('helo_med_retailer_user');
        setIsAuthenticated(false);
        setRetailer(null);
    };

    return (
        <RetailerAuthContext.Provider value={{ isAuthenticated, login, logout, retailer, refreshProfile }}>
            {children}
        </RetailerAuthContext.Provider>
    );
};

export const useRetailerAuth = () => {
    const context = useContext(RetailerAuthContext);
    if (!context) {
        throw new Error('useRetailerAuth must be used within a RetailerAuthProvider');
    }
    return context;
};
