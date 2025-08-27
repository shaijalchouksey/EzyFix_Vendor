import { useEffect } from "react";
const RazorpayButton = ({ onPaymentSuccess }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const handleRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const options = {
      key: "rzp_live_7zN94jrBgxVl1T",
      amount: 100,
      currency: "INR",
      name: "EzyFix Vendor",
      description: "Business Registration Fee",
      handler: function (response) {
        console.log("Payment Success:", response);
        onPaymentSuccess();
      },
      prefill: {
        name: "Vendor",
        email: "vendor@email.com",
        contact: "9999999999",
      },
      theme: {
        color: "#10B981",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return (
    <button
      type="button"
      onClick={handleRazorpay}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-300"
    >
      Pay ₹1200 to Register
    </button>
  );
};
export default RazorpayButton;
