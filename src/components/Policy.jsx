import React from 'react';

const Policy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-brandBlue mb-10">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-base leading-relaxed">
        <p>
          This Privacy Policy sets out how <strong>MEBIT EZYFIX PVT LTD</strong> uses and protects any
          information that you give when you visit our website and/or agree to purchase from us.
        </p>

        <p>
          <strong>MEBIT EZYFIX PVT LTD</strong> is committed to ensuring that your privacy is protected. Should
          we ask you to provide certain information by which you can be identified when using this
          website, you can be assured that it will only be used in accordance with this privacy
          statement.
        </p>

        <p>
          We may change this policy from time to time by updating this page. Please check this page
          periodically to ensure you are aware of any changes.
        </p>

        <h2 className="text-xl font-semibold text-brandBlue">Information We May Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name</li>
          <li>Contact information including email address</li>
          <li>Demographic information such as postcode, preferences and interests</li>
          <li>Other information relevant to customer surveys and/or offers</li>
        </ul>

        <h2 className="text-xl font-semibold text-brandBlue">What We Do With the Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Internal record keeping</li>
          <li>To improve our products and services</li>
          <li>
            To send periodic promotional emails about new products, special offers, or other
            information using the email address you have provided
          </li>
          <li>
            To contact you for market research purposes via email, phone, fax, or mail
          </li>
          <li>To customize the website according to your interests</li>
        </ul>

        <h2 className="text-xl font-semibold text-brandBlue">Security</h2>
        <p>
          We are committed to ensuring that your information is secure. In order to prevent
          unauthorized access or disclosure, we have put in place suitable physical, electronic,
          and managerial procedures to safeguard and secure the information we collect online.
        </p>

        <h2 className="text-xl font-semibold text-brandBlue">How We Use Cookies</h2>
        <p>
          A cookie is a small file that asks permission to be placed on your computer's hard drive.
          Once you agree, the file is added and helps analyze web traffic or lets you know when you
          visit a particular site.
        </p>

        <p>
          Cookies allow web applications to respond to you as an individual and tailor their
          operations to your preferences. We use traffic log cookies to identify which pages are
          being used. This helps us analyze data and improve our website.
        </p>

        <p>
          Cookies do not give us access to your computer or any personal information, other than
          what you choose to share with us. You can choose to accept or decline cookies. Most web
          browsers automatically accept cookies, but you can modify your settings to decline them if
          you prefer. This may prevent you from taking full advantage of the website.
        </p>

        <h2 className="text-xl font-semibold text-brandBlue">Controlling Your Personal Information</h2>
        <p>You may choose to restrict the collection or use of your personal information:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            When filling out a form on the website, look for a box to opt out of direct marketing.
          </li>
          <li>
            You can change your preferences at any time by writing to or emailing us at:{" "}
            <a href="mailto:mebitezyfix@gmail.com" className="text-blue-600 hover:underline">
              mebitezyfix@gmail.com
            </a>
          </li>
        </ul>

        <p>
          We will not sell, distribute, or lease your personal information to third parties unless
          we have your permission or are required by law. We may send you promotional information
          about third parties if you opt in.
        </p>

        <h2 className="text-xl font-semibold text-brandBlue">Correcting Your Information</h2>
        <p>
          If you believe any information we are holding about you is incorrect or incomplete, please
          contact us as soon as possible:
        </p>

        <div className="pl-4 border-l-4 border-brandBlue italic">
          <p>P.N. D-155-A/G-1, Taranagar-D, Jaipur, Rajasthan 302012</p>
          <p>
            Phone:{" "}
            <a href="tel:+917615930145" className="text-blue-600 hover:underline">
              +91 7615930145
            </a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:mebitezyfix@gmail.com" className="text-blue-600 hover:underline">
              mebitezyfix@gmail.com
            </a>
          </p>
        </div>

        <p>We will promptly correct any information found to be incorrect.</p>
      </div>
    </div>
  );
};

export default Policy;
