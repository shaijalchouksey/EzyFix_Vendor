    import React, { useState, useEffect } from 'react';
    import {
    Pencil, Trash2, ChevronLeft, ChevronRight, Mountain,
    } from 'lucide-react';
    import { Link, useNavigate } from 'react-router-dom';
    import VendorHeader from '../components/VendorHeader';

    const ManageCoupons = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // You can change this to 10, etc.
    const totalPages = Math.ceil(coupons.length / itemsPerPage);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/coupons/my-coupons`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("VendorToken")}`,
        },
        })
        .then(res => res.json())
        .then(data => {
            const mapped = data.map(c => ({
            id: c.id,
            couponId: c.couponId || c.customCouponId,
            name: c.title,
            discount: `${c.discountValue} ${c.discountType}`,
            category: c.category || "General",
            status: "Active",
            redeemed: 0,
            price: c.price || 0,
            }));
            setCoupons(mapped);
        })
        .catch(err => console.error("❌ Failed to load coupons:", err));
    }, []);

    const handleDelete = async (couponId, index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
        if (!confirmDelete) return;

        try {
        const res = await fetch(`${API_BASE_URL}/api/coupons/${couponId}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${localStorage.getItem("VendorToken")}`,
            },
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("❌ Failed to delete:", err);
            alert("Failed to delete coupon.");
            return;
        }

        const updated = [...coupons];
        updated.splice(index, 1);
        setCoupons(updated);
        alert("✅ Coupon deleted successfully!");
        } catch (err) {
        console.error("❌ Network error:", err);
        alert("Error deleting coupon.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
        <VendorHeader />

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold">Manage Coupons</h2>
                <p className="text-gray-500">Manage your active, pending, and expired coupons.</p>
            </div>
            </div>

            {/* Table */}
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
                {coupons
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((coupon, index) => (
                    <tr key={index} className={`border-t ${index % 2 === 0 ? '' : 'bg-gray-50'}`}>
                    <td className="p-4 flex items-center space-x-2 font-semibold">
                        <Mountain className="w-4 h-4 text-[#3BB5FF]" />
                        <span>{coupon.name}</span>
                    </td>
                    <td className="p-4">{coupon.discount}</td>
                    <td className="p-4">{coupon.category}</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${coupon.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'}`}>
                        {coupon.status}
                        </span>
                    </td>
                    <td className="p-4 text-right">{coupon.redeemed}</td>
                    <td className="p-4 text-right">₹{coupon.price}</td>
                    <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                        <Link to={`/edit-coupon/${coupon.id}`} title="Edit Coupon">
                            <Pencil className="w-4 h-4 text-[#3BB5FF] hover:text-blue-700 cursor-pointer" />
                        </Link>
                        <button
                            onClick={() => handleDelete(coupon.id, index)}
                            title="Delete Coupon"
                            className="text-red-500 hover:text-red-700"
                        >
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
        </main>
        </div>
    );
    };

    export default ManageCoupons;
