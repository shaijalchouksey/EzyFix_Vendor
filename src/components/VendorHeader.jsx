import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';

const VendorHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(localStorage.getItem('vendorProfileImage') || '');

  // Live sync profile image from localStorage without interval
  useEffect(() => {
    const handleStorageChange = () => {
      const newImage = localStorage.getItem('vendorProfileImage');
      setProfileImage(newImage);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Coupons', path: '/manage-coupons' },
    { name: 'Redeem Coupon', path: '/redeem-coupon' },
  ];

  return (
    <header className="bg-white shadow-md border-b-4 border-[#3BB5FF] w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/ezyfix-logo.jpg" alt="EzyFix Logo" className="w-10 h-10 object-contain rounded-xl" />
          <span className="text-2xl font-bold text-[#3BB5FF] hidden sm:inline">EzyFix</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition ${
                currentPath === item.path
                  ? 'bg-[#3BB5FF] text-white'
                  : 'text-[#3BB5FF] hover:bg-[#1aa0ef] hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Create Button */}
          <Link
            to="/create-coupon"
            className="bg-[#3BB5FF] text-white px-4 py-2 rounded-lg hover:bg-[#1aa0ef] transition font-bold"
          >
            + Create Coupon
          </Link>

          {/* Profile Avatar - Desktop */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3BB5FF] cursor-pointer"
            onClick={() => navigate('/vendor-profile')}
            title="Vendor Profile"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Vendor"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png'; // fallback image
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white font-bold bg-[#3BB5FF]">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Icon + Profile */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#3BB5FF] focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Profile Avatar - Mobile */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3BB5FF] cursor-pointer"
            onClick={() => navigate('/vendor-profile')}
            title="Vendor Profile"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Vendor"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png'; // fallback image
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white font-bold bg-[#3BB5FF]">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-center px-4 py-2 rounded-full text-sm font-medium ${
                currentPath === item.path
                  ? 'bg-[#3BB5FF] text-white'
                  : 'border border-[#3BB5FF] text-[#3BB5FF] bg-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/create-coupon"
            onClick={() => setMenuOpen(false)}
            className="block text-center px-4 py-2 bg-[#3BB5FF] text-white rounded-full text-sm font-bold"
          >
            + Create Coupon
          </Link>
        </div>
      )}
    </header>
  );
};

export default VendorHeader;
