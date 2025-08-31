import React, { useState } from "react";
import { Search } from "lucide-react";
import VendorHeader from "../components/VendorHeader"; 

const RedeemCouponsVendor = () => {
  const [successfulRedemptions, setSuccessfulRedemptions] = useState([]);
  const [couponIdInput, setCouponIdInput] = useState("");
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [search, setSearch] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleRedeemConfirm = async () => {
    if (!couponIdInput || !couponCodeInput) {
      alert("⚠️ Please enter both Coupon ID and Code");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons/verify-redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("VendorToken")}`,
        },
        body: JSON.stringify({
          redeemedCouponId: couponIdInput,
          redemption_code: couponCodeInput,
        }),
      });

      const data = await res.json();

      if (data.redeemStatus === "successful") {
        alert("✅ Coupon redeemed successfully!");
        const cd = data.couponData;

        setSuccessfulRedemptions((prev) => {
          if (prev.some((x) => x.originalCouponId === cd.originalCouponId)) return prev;
          return [...prev, cd];
        });
      } else {
        alert("❌ " + (data.message || "Verification failed"));
      }

      setCouponIdInput("");
      setCouponCodeInput("");
    } catch (err) {
      console.error("❌ Redeem confirm error:", err);
      alert("❌ Something went wrong while redeeming coupon.");
    }
  };

  const filteredCoupons = successfulRedemptions.filter((c) =>
    (c?.originalCouponId || "").toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader />

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-brandBlue">Redeem Coupons</h1>

        {/* Confirm Redemption Section */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Redeem Client Coupon</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Enter Coupon ID"
              value={couponIdInput}
              onChange={(e) => setCouponIdInput(e.target.value)}
              className="border p-2 rounded w-full md:w-1/3"
            />
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCodeInput}
              onChange={(e) => setCouponCodeInput(e.target.value)}
              className="border p-2 rounded w-full md:w-1/3"
            />
            <button
              onClick={handleRedeemConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Confirm Redemption
            </button>
          </div>
        </div>

        {/* ✅ Only Successful Redemption Table */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Successfully Redeemed Coupons</h2>
          <div className="flex items-center mb-3">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Coupon ID"
              className="border p-2 rounded w-full md:w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredCoupons.length === 0 ? (
            <p className="text-gray-500">No successful redemptions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3">Coupon ID</th>
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Redeemed At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((c, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-3">{c.originalCouponId}</td>
                      <td className="p-3">{c.redemption_code}</td>
                      <td className="p-3">🪙{c.price}</td>
                      <td className="p-3">
                        {c.redeemed_time ? new Date(c.redeemed_time).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RedeemCouponsVendor;
