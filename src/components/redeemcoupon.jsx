import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import VendorHeader from "../components/VendorHeader"; // ✅ Import Header
const RedeemCouponsVendor = () => {
  const [allRedeemedCoupons, setAllRedeemedCoupons] = useState([]);
  const [successfulRedemptions, setSuccessfulRedemptions] = useState([]);
  const [couponIdInput, setCouponIdInput] = useState("");
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("VendorToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const init = async () => {
      await fetchRedeemedCoupons();
    };
    init();
  }, []);
  const fetchRedeemedCoupons = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/coupons/redeemed/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("VendorToken")}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn("⛔ Unauthorized. Maybe token expired?");
      }
      const errorText = await res.text();
      console.error("❌ API error response:", errorText);
      setAllRedeemedCoupons([]); // prevent crash
      return;
    }
    const data = await res.json();
    setAllRedeemedCoupons(data || []);
    if (Array.isArray(data)) {
      setSuccessfulRedemptions(
        data.filter((c) => (c.status || "").toLowerCase() === "successful")
      );
    } else {
      console.warn("Received non-array data from API:", data);
      setSuccessfulRedemptions([]);
    }
  } catch (err) {
    console.error("❌ Failed to fetch redeemed coupons:", err);
    setAllRedeemedCoupons([]); // fallback
  }
};
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
          redemption_code: couponCodeInput
        })
      });

        const data = await res.json();
        if (data.redeemStatus === "successful") {
          alert("✅ Coupon redeemed successfully!");
          const cd = data.couponData;
    
          setSuccessfulRedemptions((prev) => {
            if (prev.some(x => x.originalCouponId === cd.originalCouponId)) return prev;
            return [...prev, cd];
          });
          await fetchRedeemedCoupons();
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

  const handleVerifyCode = async (couponId, vendorInputCode) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/coupons/verify-redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("VendorToken")}`,
      },
      body: JSON.stringify({
         redeemedCouponId: couponId,
         redemption_code: vendorInputCode
      }),
    });

    const data = await res.json();

    if (data.redeemStatus === "successful") {
      alert("✅ Coupon verified!");
    } else {
      alert("❌ Invalid code.");
    }
  } catch (err) {
    console.error("❌ Verification error:", err);
    alert("❌ Network or server error.");
  }
};
 const filteredCoupons = (allRedeemedCoupons || []).filter((c) => {
  const id = (c?.originalCouponId || "").toLowerCase();
  return id.includes((search || "").toLowerCase().trim());
});
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Include the reusable header */}
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
        {/* Redeemed Coupons Table */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Redeemed Coupons</h2>
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">Coupon ID</th>
                  <th className="p-3">Coupon Code</th>
                  <th className="p-3">Category/Business</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Redeemed At</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">{c.originalCouponId}</td>
                    <td className="p-3">{c.redemption_code}</td>
                    <td className="p-3">{c.category || c.business_name || "-"}</td>
                    <td className="p-3">🪙{c.price}</td>
                    <td className="p-3">
                      {c.redeemed_time ? new Date(c.redeemed_time).toLocaleString() : "-"}
                    </td>
                    <td className="p-3">
                      {(() => {
                        const ok = (c.status || "").toLowerCase() === "successful";
                        return (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              ok ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {c.status || "-"}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Successful Redemption Section */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Successfully Redeemed Coupons
          </h2>
          {successfulRedemptions.length === 0 ? (
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
                  {successfulRedemptions.map((c, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-3">{c.originalCouponId}</td>
                     <td className="p-3">{c.redemption_code}</td>
                     <td className="p-3">🪙{c.price}</td>
                     <td className="p-3">{new Date(c.redeemed_time).toLocaleString()}</td>
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
