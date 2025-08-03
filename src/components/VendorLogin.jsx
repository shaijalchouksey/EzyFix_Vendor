    // src/components/VendorLogin.jsx
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    const VendorLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            console.log("🟢 VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            credentials: "include", // include cookies for session
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.msg || "Login failed");
            return;
        }

        localStorage.setItem("VendorToken", data.access_token); // Save token if needed
        localStorage.setItem("VendorId", data.vendor.id);
        alert("Login successful!");
        navigate("/dashboard");
        } catch (err) {
        console.error("Login error:", err);
        alert("Login failed!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full space-y-6 border-t-4 border-[#3BB5FF]">
            <h2 className="text-2xl font-bold text-center text-[#3BB5FF]">Vendor Login</h2>
            <input
            type="email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BB5FF]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BB5FF]"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button
            onClick={handleLogin}
            className="w-full bg-[#3BB5FF] text-white py-3 rounded-lg hover:bg-[#1aa0ef] transition"
            >
            Login
            </button>
            {/* Register Redirect Button */}
            <div className="text-center">
            <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <button
                onClick={() => navigate('/')}
                className="text-[#3BB5FF] font-medium hover:underline"
                >
                Register here
                </button>
            </p>
            </div>
        </div>
        </div>
    );
    };

    export default VendorLogin;
