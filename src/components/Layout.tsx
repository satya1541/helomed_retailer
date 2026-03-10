import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useRetailerAuth } from '@/context/AuthContext';
import { retailerLogout } from '@/api/auth';
import { AnimatedNavigationTabs } from '@/components/ui/animated-navigation-tabs';
import { Footer } from '@/components/ui/modem-animated-footer';
import './Layout.css';

const RetailerLayout = ({ children }: { children: React.ReactNode }) => {
    const { logout } = useRetailerAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await retailerLogout();
        } catch (error) {
            // Continue with local logout even if API call fails
        } finally {
            logout();
            // Redirect to main login
            navigate('/login');
        }
    };

    const navigationItems = [
        { id: 1, title: "Dashboard", href: "/dashboard" },
        { id: 2, title: "All Products", href: "/all-products" },
        { id: 3, title: "My Products", href: "/products" },
        { id: 4, title: "Orders", href: "/orders" },
        { id: 5, title: "Payments", href: "/payments" },
        { id: 6, title: "Profile", href: "/profile" },
    ];

    const footerNavLinks = [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Cancellation Policy", href: "/cancellation-policy" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <div className="retailer-shell-header">
            <header className="retailer-header">
                <div className="retailer-header-left">
                    <div className="retailer-brand-header" onClick={() => navigate('/dashboard')}>
                        <img src="/images/logo.png" alt="HeloMed" />
                        <div className="retailer-brand-text">
                            <h3>Retailer</h3>
                            <p>HeloMed</p>
                        </div>
                    </div>
                </div>

                <div className="retailer-header-center">
                    <AnimatedNavigationTabs items={navigationItems} />
                </div>

                <div className="retailer-header-right">
                    <button className="retailer-logout-header" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </header>

            <main className="retailer-content-header">
                {children}
            </main>

            <Footer
                brandName="HeloMed"
                navLinks={footerNavLinks}
                creatorName="Udi Digi Swasthyatech Pvt Ltd"
                creatorUrl="https://helomed.app/"
            />
        </div>
    );
};

export default RetailerLayout;
