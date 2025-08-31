    import React, { useState, useEffect } from 'react';
    import { useNavigate, Link, useLocation } from 'react-router-dom';
    import {
    Search, Edit2, Trash2, CheckCircle, Mountain
    } from 'lucide-react';

    import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
    } from 'recharts';
    import VendorHeader from '../components/VendorHeader';

    const VendorDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const couponsPerPage = 10;

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("VendorToken");

        if (!token) {
        console.warn("🔐 No token found. Redirecting to login...");
        navigate("/vendor-login");
        return;
        }

        fetch(`${API_BASE_URL}/api/coupons/my-coupons`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        })
        .then(async res => {
            if (!res.ok) {
            const errorData = await res.json();
            console.error("❌ API error:", errorData);
            if (res.status === 401) {
                navigate("/vendor-login");
            }
            throw new Error(errorData.message || "Unauthorized");
            }
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
            console.error("❌ Expected array but got:", data);
            return;
            }

            const mapped = data.map((c) => {
                return {
                id: c.id,
                couponId: c.couponId || c.customCouponId || "N/A",
                name: c.title || "Untitled",
                discount: `${c.discountValue || 0} ${c.discountType || ""}`,
                category: c.category || "General",
                status: c.status || "Active",
                redeemed: c.redeemed || 0,
                purchased: c.purchased || 0,
                price: c.price || 0,
            };
            });


            mapped.sort((a, b) => b.id - a.id);
            setCoupons(mapped);
        })
        .catch(err => {
            console.error("❌ Failed to load coupons:", err);
        });
    }, [location.state?.refresh]);

    const handleDelete = (index) => {
        const updatedCoupons = [...coupons];
        updatedCoupons.splice(index, 1);
        setCoupons(updatedCoupons);
    };

    const handleEdit = (couponId) => {
        navigate(`/edit-coupon/${couponId}`);
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCoupon = currentPage * couponsPerPage;
    const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
    const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
    const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);

    return (
        <div className="min-h-screen bg-[#f4fbff] text-gray-800">
        <VendorHeader />

        {/* Stats */}
        <section className="container mx-auto px-6 py-8 grid md:grid-cols-4 gap-6">
            {[
            { label: 'Total Coupons', value: coupons.length },
            { label: 'Active Offers', value: coupons.filter(c => c.status === 'Active').length },
            { label: 'Total Redeemed', value: coupons.reduce((sum, c) => sum + c.redeemed, 0) },
            { label: 'Revenue Generated', value: `₹${(coupons.reduce((sum, c) => sum + c.redeemed * 5, 0)).toLocaleString()}` },
            ].map((item, idx) => (
            <div key={idx} className="bg-white shadow rounded-xl p-6 border-t-4 border-[#3BB5FF]">
                <h3 className="text-sm text-gray-500 mb-1">{item.label}</h3>
                <p className="text-2xl font-bold text-[#3BB5FF]">{item.value}</p>
            </div>
            ))}
        </section>

        {/* Recent Activity */}
        <section className="container mx-auto px-6 py-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
            {coupons.slice(0, 3).map((coupon, idx) => (
                <div key={coupon.id || idx} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <p>{coupon.name} - {coupon.discount}</p>
                <CheckCircle className="text-green-500" />
                </div>
            ))}
            </div>
        </section>

        {/* Performance Chart */}
        <section className="container mx-auto px-6 py-6">
            <h2 className="text-xl font-bold mb-4">Coupon Performance</h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coupons} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="redeemed" fill="#3BB5FF" name="Redeemed" />
                <Bar dataKey="purchased" fill="#66D3FA" name="Purchased" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </section>

        {/* Table of Coupons */}
        {/* Coupon Table (Same as ManageCoupons) */}
        <section className="container mx-auto px-6 py-8">
        <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border rounded-lg w-full border-gray-300 focus:border-[#3BB5FF] focus:outline-none"
            />
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead>
                <tr style={{ backgroundColor: '#E3F5FF' }} className="text-gray-700">
                <th className="p-4 text-left">Coupon Name</th>
                <th className="p-4 text-left">Discount</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Redeemed</th>
                <th className="p-4 text-right">Price (₹)</th>
                <th className="p-4 text-center">Actions</th>
                <th className="p-4 text-left">Coupon ID</th>
                </tr>
            </thead>
            <tbody>
                {currentCoupons.map((coupon, idx) => (
                <tr key={coupon.id || idx} className={`border-t ${idx % 2 === 0 ? '' : 'bg-gray-50'}`}>
                    <td className="p-4 flex items-center space-x-2 font-semibold">
                    <Mountain className="w-4 h-4 text-[#3BB5FF]" />
                    <span>{coupon.name}</span>
                    </td>
                    <td className="p-4">{coupon.discount}</td>
                    <td className="p-4">{coupon.category}</td>
                    <td className="p-4">
                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                        coupon.status?.toLowerCase().trim() === 'active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                    >
                        {coupon.status}
                    </span>
                    </td>
                    <td className="p-4 text-right">{coupon.redeemed}</td>
                    <td className="p-4 text-right">₹{coupon.price || 0}</td>
                    <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                        <button onClick={() => handleEdit(coupon.couponId)} className="text-[#3BB5FF] hover:text-[#1aa0ef]">
                        <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    </td>
                    <td className="p-4">{coupon.couponId}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-6">
            <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
            Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`px-3 py-1 rounded border ${pg === currentPage ? 'bg-[#3BB5FF] text-white' : 'bg-white border-gray-300 hover:bg-[#e0f4ff]'}`}
            >
                {pg}
            </button>
            ))}

            <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
            Next
            </button>
        </div>
        </section>



        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
            &copy; 2025 EzyFix Vendor Portal
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-gray-500">
            <Link to="/policy" className="hover:underline">Policy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/refund" className="hover:underline">Refund</Link>
            <Link to="/contact" className="hover:underline">ContactUs</Link>
        </div>
        </footer>
        </div>
    );
    };

    export default VendorDashboard;
