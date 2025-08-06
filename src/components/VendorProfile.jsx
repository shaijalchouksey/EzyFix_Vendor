import React, { useEffect, useState } from 'react';
    import {
    LogOut, Mail, Phone, Building2, MapPin, User, Pencil, Save, Upload, ChevronLeft
    } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';

    const VendorProfile = () => {
    const [vendorData, setVendorData] = useState({
        name: '',
        email: '',
        phone: '',
        business: '',
        businessType: '',
        description: '',
        address: '',
        googleMapsLink: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const vendorId = localStorage.getItem("VendorId"); // Move this inside

    console.log("📦 Vendor ID:", vendorId);

    useEffect(() => {
        
        if (!vendorId) return;
    const fetchVendor = async () => {
        if (!vendorId) return;
        try {
            const res = await fetch(`${BASE_URL}/api/auth/profile/${vendorId}`);
            const data = await res.json();
            setVendorData({
            name: data.contact_person || '',
            email: data.email || '',
            phone: data.phone || '',
            business: data.business_name || '',
            businessType: data.business_type || '',
            description: data.description || '',
            address: data.address || '',
            googleMapsLink: data.maps_link || '',
            });
            setProfileImage(data.profileImage || '');
        } catch (err) {
            console.error("Error fetching vendor profile", err);
        }
        };
        fetchVendor();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendorData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
            localStorage.setItem("vendorProfileImage", reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const saveChanges = async () => {
    if (!vendorId) return;

    const payload = {
        contact_person: vendorData.name,
        email: vendorData.email,
        phone: vendorData.phone,
        business_name: vendorData.business,
        business_type: vendorData.businessType,
        description: vendorData.description,
        address: vendorData.address,
        maps_link: vendorData.googleMapsLink,
        profileImage: profileImage,
    };

    console.log("📤 Sending update payload:", payload);

    try {
        const res = await fetch(`${BASE_URL}/api/auth/update/${vendorId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("✅ Update response:", result);

        if (!res.ok) throw new Error("Update failed");

        setEditMode(false);
        alert("Profile updated successfully!");
    } catch (err) {
        console.error("❌ Error updating profile:", err);
        alert("Something went wrong!");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f4ff] to-[#e0f4ff] p-6">
        {/* Header */}
        <header className="bg-white shadow-md border-b-4 border-[#3BB5FF] p-4 rounded-xl mb-6 flex justify-center">
            <h1 className="text-2xl font-bold text-[#3BB5FF]">Vendor Profile</h1>
        </header>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto space-y-6">

            {/* 🔷 Profile Image Section */}
            <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#3BB5FF] overflow-hidden shadow-lg mb-4">
                {profileImage ? (
                <img src={profileImage} alt="Vendor" className="w-full h-full object-cover" />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                )}
            </div>

            {editMode && (
                <label className="cursor-pointer flex items-center text-sm text-[#3BB5FF] hover:underline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Profile Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
            )}
            </div>

            {/* 🔷 Profile Info */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <InputBlock label="Business" name="business" icon={Building2} value={vendorData.business} editMode={editMode} onChange={handleChange} />
            <InputBlock label="Contact Person" name="name" icon={User} value={vendorData.name} editMode={editMode} onChange={handleChange} />
            <InputBlock label="Email" name="email" icon={Mail} value={vendorData.email} editMode={editMode} onChange={handleChange} />
            <InputBlock label="Phone" name="phone" icon={Phone} value={vendorData.phone} editMode={editMode} onChange={handleChange} />
            <InputBlock
            label="Business Type"
            name="businessType"
            icon={Building2}
            value={vendorData.businessType}
            editMode={editMode}
            onChange={handleChange}
            isSelect={true}
            options={[
                "Restaurants/cafe/Dining",
                "Fashion",
                "Hotel & Stays",
                "SPA & Salons",
                "Electronics",
                "Furniture",
                "Fun & Activity",
                "Other Service"
            ]}
            />

            <InputBlock label="Address" name="address" icon={MapPin} value={vendorData.address} editMode={editMode} onChange={handleChange} />
            </div>

            {/* 🔷 Description */}
            <div>
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Business Description:</h3>
            {editMode ? (
                <textarea
                name="description"
                value={vendorData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-xl p-3"
                />
            ) : (
                <p className="text-gray-700">{vendorData.description || 'No description provided.'}</p>
            )}
            </div>

            {/* 🔷 Bottom Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-8 pt-6 border-t">
            {/* 🔙 Back to Dashboard */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
            >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            {/* Edit or Save */}
            {editMode ? (
                <button
                onClick={saveChanges}
                className="flex items-center px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md"
                >
                <Save className="w-4 h-4 mr-2" /> Save
                </button>
            ) : (
                <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md"
                >
                <Pencil className="w-4 h-4 mr-2" /> Edit
                </button>
            )}

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="flex items-center px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
            >
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
            </div>
        </div>
        </div>
    );
    };

    // ✅ Reusable Input Field
    const InputBlock = ({ label, name, icon: Icon, value, editMode, onChange, isSelect = false, options = [] }) => (
        <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">{label}</label>
            <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#3BB5FF]" />
            {editMode ? (
                isSelect ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="">Select a type</option>
                    {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                    ))}
                </select>
                ) : (
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                />
                )
            ) : (
                <div className="pl-10 py-2 text-gray-800 bg-gray-100 rounded-lg">{value || '-'}</div>
            )}
            </div>
        </div>
        );


    export default VendorProfile;
