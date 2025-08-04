import React from 'react';
import { Routes, Route } from 'react-router-dom';

import VendorRegistration from './components/VendorRegistration';
import VendorDashboard from './components/VendorDashboard';
import CreateCoupon from './components/CreateCoupon';
import ManageCoupons from './components/ManageCoupons';
import EditCoupon from "./components/EditCoupon";
import VendorLogin from './components/VendorLogin';
import VendorProfile from './components/VendorProfile';
import RedeemCoupon from './components/redeemcoupon';
import Policy from './components/Policy';
import Terms from './components/Terms';
import Refund from './components/refund';
import Contact from './components/contact';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<><VendorRegistration /></>} />
      <Route path="/dashboard" element={<VendorDashboard />} />
      <Route path="/create-coupon" element={<CreateCoupon />} />
      <Route path="/manage-coupons" element={<ManageCoupons />} />
      <Route path="/edit-coupon/:id" element={<EditCoupon />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/vendor-profile" element={<VendorProfile />} />
      <Route path="/redeem-coupon" element={<RedeemCoupon />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/refund" element={<Refund/>} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;
