import React from 'react';

const Refund = () => {
  return (
    <div className="bg-white px-6 sm:px-12 py-12 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-brandBlue">
        Cancellation & Refund Policy
      </h1>

      <section className="space-y-6">
        <p>
          <strong>MEBIT EZYFIX PVT LTD</strong> believes in helping its customers as far as possible,
          and has therefore a liberal cancellation policy. Please read the terms below carefully:
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">🕒 Cancellation Window</h2>
          <p>
            Cancellations will be considered only if the request is made within <strong>3–5 days</strong> of placing the order. However, the request may not be entertained if the order has already been communicated to the vendor/merchant and shipping has been initiated.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">❌ Non-Cancellable Items</h2>
          <p>
            MEBIT EZYFIX PVT LTD does not accept cancellation requests for perishable items like flowers or eatables. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">🚫 Not As Expected?</h2>
          <p>
            If the product is not as shown on the site or does not meet your expectations, please contact our Customer Service Team within <strong>3–5 days</strong> of receiving the product. After reviewing your complaint, we will take an appropriate decision.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">🔧 Warranty Products</h2>
          <p>
            For products that come with a manufacturer's warranty, please contact the manufacturer directly for any issues or replacements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">💸 Refund Timeline</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>In case of any refunds approved by <strong>MEBIT EZYFIX PVT LTD</strong>, processing will take <strong>3–5 business days</strong>.</li>
            <li>The refund will be made to the original payment method used during the purchase.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📞 Need Help?</h2>
          <p>
            For further queries or support, contact our Customer Service:
          </p>
          <ul className="list-none mt-2 space-y-1">
            <li>📧 Email: <a href="mailto:support@ezyfix.in" className="text-blue-600 hover:underline">support@ezyfix.in</a></li>
            <li>📞 Phone: <span className="text-gray-700">+91-7615930145</span></li>
            <li>🌐 Website: <a href="https://ezyfix.in" className="text-blue-600 hover:underline">https://ezyfix.in</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Refund;
