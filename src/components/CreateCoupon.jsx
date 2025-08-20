import React, { useState } from 'react';
import { Calendar, Upload, ChevronDown, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VendorHeader from '../components/VendorHeader';

const CouponCreationPage = () => {
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
    couponImage: null,
    category: '',
    price: ''
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.couponImage) newErrors.couponImage = "Coupon image is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const categoryCode = formData.category.slice(0, 3).toUpperCase().replace(/\W/g, '');
      const vendorCode = localStorage.getItem("vendorId") || "VD001";
      // Helper function to generate random code of desired length
      const generateRandomCode = (length = 6) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      };
      
      // Usage:
      const randomCode = generateRandomCode(6);
      const customCouponId = `EZY-${randomCode}`;
      console.log(customCouponId); 


      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
      // Map the key if it's couponImage
      if (key === "couponImage") {
        form.append("companyLogo", value);  // ✅ Match backend key
      } else {
        form.append(key, value);
      }
    });

      form.append("customCouponId", customCouponId);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("VendorToken")}`
        },
        body: form
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("❌ Error:", err);
        alert("Failed to create coupon.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("lastCreatedCouponId", data.coupon_id);
      alert(`✅ Coupon saved!\nCoupon ID: ${data.coupon_id}`);
      navigate("/dashboard", { state: { refresh: true } });
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Network error! Failed to save coupon.");
    }
  };

  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;

  const inputClass = (field) => `w-full px-3 py-2 border ${
    errors[field] ? 'border-red-500' : 'border-gray-300'
  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB5FF]`;

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader />

      {/* Main Form */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Coupon Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Coupon Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Coupon Title</label>
                  <input name="couponTitle" value={formData.couponTitle} onChange={handleInputChange} placeholder="e.g., 20% Off All Coffee" className={inputClass("couponTitle")} />
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
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Short description..." className={inputClass("description") + " resize-none"} />
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
                    <input name="discountValue" value={formData.discountValue} onChange={handleInputChange} placeholder="e.g., 20" className={inputClass("discountValue")} />
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
                  <input name="minimumPurchase" value={formData.minimumPurchase} onChange={handleInputChange} placeholder="e.g., 100" className={inputClass("minimumPurchase")} />
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

          {/* Right: Image & Dates */}
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Coupon Image</h2>
              <div className={`border-2 border-dashed p-6 rounded-lg text-center ${errors.couponImage ? 'border-red-500' : 'border-gray-300'}`}>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
                {!formData.couponImage ? (
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Upload Image</p>
                    <p className="text-sm text-gray-400">PNG or JPG (Max 5MB)</p>
                  </label>
                ) : (
                  <img src={URL.createObjectURL(formData.couponImage)} alt="Preview" className="w-full h-60 object-cover rounded-md" />
                )}
                {renderError("couponImage")}
              </div>
            </div>

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
                  <input type="date" name="expirationDate" min={today} value={formData.expirationDate} onChange={handleInputChange} className={inputClass("expirationDate")} />
                  {renderError("expirationDate")}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="lg:col-span-3 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-[#4a9acb] hover:bg-[#2fa8ec] text-white px-8 py-3 rounded-md flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Coupon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCreationPage;
