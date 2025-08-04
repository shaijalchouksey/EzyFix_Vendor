import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brandBlue">
        Contact Us
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">📛 Merchant Legal Entity</h2>
          <p><strong>MEBIT EZYFIX PVT LTD</strong></p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">🏢 Registered Address</h2>
          <p>P.N. D-155-A/G-1, Taranagar-D, Jaipur, Rajasthan 302012</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">🏬 Operational Address</h2>
          <p>D-155, Tara Nagar D, Near Khirani Phatak Flyover, Jhotwara, Jaipur, Rajasthan 302012</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">📞 Telephone</h2>
          <p>+91-7615930145</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">📧 Email</h2>
          <a href="mailto:support@ezyfix.in" className="text-blue-600 hover:underline">
            support@ezyfix.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
