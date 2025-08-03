// src/components/EditCoupon.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Save, ChevronLeft } from 'lucide-react';
import VendorHeader from '../components/VendorHeader';

const EditCoupon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        couponTitle: '',
        description: '',
        discountType: 'Percentage (%)',
        discountValue: '',
        minimumPurchase: '',
        termsAndConditions: '',
        activationDate: '',
        expirationDate: '',
        category: '',
        price: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("VendorToken")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("🟢 Coupon fetched data:", data);
                setFormData({
                    couponTitle: data.title || '',
                    description: data.description || '',
                    discountType: data.discount_type || 'Percentage (%)',
                    discountValue: data.discount_value || '',
                    minimumPurchase: data.minimum_purchase || '',
                    termsAndConditions: data.terms_and_conditions || '',
                    activationDate: data.activation_date || '',
                    expirationDate: data.expiration_date || '',
                    couponImage: null,
                    category: data.category || '',
                    price: data.price !== undefined ? String(data.price) : ''
                });
            })
            .catch(err => {
                console.error("❌ Failed to load coupon:", err);
                alert("Failed to load coupon details.");
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, couponImage: file }));
    };

    const handleSave = async () => {
        const newErrors = {};

        if (!formData.couponTitle) newErrors.couponTitle = "Coupon Title is required.";
        if (!formData.category) newErrors.category = "Category is required.";
        if (!formData.description) newErrors.description = "Description is required.";
        if (!formData.discountType) newErrors.discountType = "Discount type is required.";
        if (!formData.discountValue) newErrors.discountValue = "Discount value is required.";
        if (formData.minimumPurchase && isNaN(formData.minimumPurchase)) {
            newErrors.minimumPurchase = "Minimum purchase must be a valid number.";
        }
        if (!formData.price) newErrors.price = "Coupon price is required.";
        if (!formData.termsAndConditions) newErrors.termsAndConditions = "Terms and Conditions are required.";
        if (!formData.activationDate) newErrors.activationDate = "Activation date is required.";
        if (!formData.expirationDate) newErrors.expirationDate = "Expiration date is required.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const payload = new FormData();

            // Match backend field names exactly
            payload.append("title", formData.couponTitle);
            payload.append("description", formData.description);
            payload.append("discount_type", formData.discountType);
            payload.append("discount_value", formData.discountValue);
            payload.append("minimum_purchase", formData.minimumPurchase);
            payload.append("terms_and_conditions", formData.termsAndConditions);
            payload.append("activation_date", formData.activationDate);
            payload.append("expiration_date", formData.expirationDate);
            payload.append("category", formData.category);
            payload.append("price", formData.price);
            if (formData.couponImage) {
                payload.append("image", formData.couponImage);
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("VendorToken")}`
                },
                body: payload
            });

            if (response.ok) {
                alert("✅ Coupon updated successfully!");
                navigate("/manage-coupons");
            } else {
                const errText = await response.text();
                console.error("❌ Backend error:", errText);
                alert("❌ Failed to update coupon.");
            }
        } catch (error) {
            console.error("❌ Network error:", error);
            alert("Network error while updating coupon.");
        }
    };


    const renderError = (field) =>
        errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;

    const inputClass = (field) => `w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB5FF]`;

    return (
        <div className="min-h-screen bg-gray-50">
            <VendorHeader />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Coupon</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Coupon Title</label>
                                    <input name="couponTitle" value={formData.couponTitle} onChange={handleInputChange} className={inputClass("couponTitle")} />
                                    {renderError("couponTitle")}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className={inputClass("category")}>
                                        <option value="">-- Select a category --</option>
                                        <option value="Restaurants/cafe/Dining">Restaurants/cafe/Dining</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Hotel & Stays">Hotel & Stays</option>
                                        <option value="SPA & Salons">SPA & Salons</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Fun & Activity">Fun & Activity</option>
                                        <option value="Other Services">Other Services</option>
                                    </select>
                                    {renderError("category")}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className={inputClass("description") + " resize-none"} />
                                    {renderError("description")}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border p-6">
                            <h2 className="text-lg font-semibold mb-4">Discount & Terms</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">Discount Type</label>
                                        <select name="discountType" value={formData.discountType} onChange={handleInputChange} className={inputClass("discountType")}>
                                            <option>Percentage (%)</option>
                                            <option>Fixed Amount</option>
                                        </select>
                                        {renderError("discountType")}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Discount Value</label>
                                        <input name="discountValue" value={formData.discountValue} onChange={handleInputChange} className={inputClass("discountValue")} />
                                        {renderError("discountValue")}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Price (₹)</label>
                                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} className={inputClass("price")} />
                                    {renderError("price")}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Minimum Purchase (₹)</label>
                                    <input name="minimumPurchase" value={formData.minimumPurchase} onChange={handleInputChange} className={inputClass("minimumPurchase")} />
                                    {renderError("minimumPurchase")}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Terms & Conditions</label>
                                    <textarea name="termsAndConditions" value={formData.termsAndConditions} onChange={handleInputChange} rows={3} className={inputClass("termsAndConditions") + " resize-none"} />
                                    {renderError("termsAndConditions")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">

                        <div className="bg-white border rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Validity Dates</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Activation Date</label>
                                    <input
                                        type="date"
                                        name="activationDate"
                                        min={today}
                                        value={formData.activationDate}
                                        onChange={handleInputChange}
                                        className={inputClass("activationDate")}
                                    />
                                    {renderError("activationDate")}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Expiration Date</label>
                                    <input
                                        type="date"
                                        name="expirationDate"
                                        min={today}
                                        value={formData.expirationDate}
                                        onChange={handleInputChange}
                                        className={inputClass("expirationDate")}
                                    />
                                    {renderError("expirationDate")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                    <button onClick={() => navigate('/manage-coupons')} className="text-[#3BB5FF] flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Manage Coupons
                    </button>

                    <button onClick={handleSave} className="bg-[#4a9acb] hover:bg-[#2fa8ec] text-white px-8 py-3 rounded-md flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCoupon;
