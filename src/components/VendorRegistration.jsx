import { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, MapPin, Building2, Lock, Eye, EyeOff, Star, Sparkles, Gift, TrendingUp, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import RazorpayButton from "./RazorpayHostedButton";
import Popup from "./Popup";


const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, required = false, options = null, value, onChange, error }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#3BB5FF]" />
            )}
            {options ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${error ? 'border-red-500' : 'border-gray-200 focus:border-[#3BB5FF]'}`}
                >
                    <option value="" disabled>-- Select Option --</option>
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${error ? 'border-red-500' : 'border-gray-200 focus:border-[#3BB5FF]'}`}
                />
            )}
        </div>
        {error && (
            <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" /> {error}
            </p>
        )}
    </div>
);

// 🟩 TextAreaField
const TextAreaField = ({ label, name, placeholder, required = false, value, onChange, error }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="4"
            placeholder={placeholder}
            className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg resize-none ${error ? 'border-red-500' : 'border-gray-200 focus:border-[#3BB5FF]'}`}
        />
        {error && (
            <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" /> {error}
            </p>
        )}
    </div>
);
// 🟦 Email OTP Field
const EmailOtpField = ({
    otp,
    setOtp,
    otpVerified,
    otpSent,
    sendOtpToEmail,
    verifyEmailOtp,
    resendTimer,
    sending = false,
    verifying = false,
    email = ""
}) => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verify Email Address <span className="text-red-500">*</span>
            </label>

            {!otpVerified ? (
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className="col-span-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BB5FF]"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={!otpSent || verifying}
                    />
                    <button
                        onClick={verifyEmailOtp}
                        disabled={!otpSent || otp.length < 4 || verifying}
                        className={`bg-green-500 text-white px-4 py-3 rounded-lg transition hover:bg-green-600 disabled:opacity-50`}
                    >
                        {verifying ? "Verifying..." : "Verify"}
                    </button>
                </div>
            ) : (
                <div className="text-green-600 font-semibold">✅ Email Successfully Verified</div>
            )}

            {/* Send / Resend */}
            {!otpVerified && (
                <div className="mt-1">
                    {!otpSent ? (
                        <button
                            type="button"
                            onClick={sendOtpToEmail}
                            disabled={!isEmailValid || sending}
                            className="text-[#3BB5FF] flex items-center text-sm hover:underline disabled:opacity-50"
                            title={!isEmailValid ? "Enter a valid email first" : ""}
                        >
                            <Send className="w-4 h-4 mr-1" />
                            {sending ? "Sending..." : "Send OTP to Email"}
                        </button>
                    ) : resendTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend OTP in <span className="font-semibold text-[#3BB5FF]">{resendTimer}</span> seconds
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={sendOtpToEmail}
                            disabled={sending}
                            className="text-[#3BB5FF] flex items-center text-sm hover:underline"
                        >
                            <Send className="w-4 h-4 mr-1" />
                            {sending ? "Sending..." : "Resend OTP"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const VendorRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasPaid, setHasPaid] = useState(false); // ✅ Payment confirmation state
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const mapLinkRegex = /^https:\/\/(www\.)?google\.[a-z]+\/maps\?q=(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)$/;
    const [popup, setPopup] = useState({ message: '', type: 'info', visible: false });
    const [tooltipVisible, setTooltipVisible] = useState(true);
    const { signUp, isLoaded } = useSignUp();
    const { setActive } = useAuth();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        businessDescription: '',
        contactPerson: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        province: '',
        postalCode: '',
        googleMapsLink: '',
        username: '',
        password: ''
    });

    const [timerIntervalId, setTimerIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("Tick");
    }, 1000);
    setTimerIntervalId(id);

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, []);

    const showPopupMessage = (message, type = 'info', duration = 4000) => {
        setPopup({ message, type, visible: true });
        setTimeout(() => {
            setPopup(prev => ({ ...prev, visible: false })); 
        }, duration);
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    // Send OTP with Clerk (email_code)

    const handlePhoneChange = (e) => {
        let value = e.target.value;
    
        // Agar +91 se start nahi hota toh lagao
        if (!value.startsWith("+91")) {
            value = "+91";
        }
    
        // Sirf +91 ke baad ke digits lo
        let digits = value.replace("+91", "").replace(/\D/g, ""); 
    
        // 10 digits limit
        if (digits.length > 10) {
            digits = digits.slice(0, 10);
        }
    
        // Final value = +91 + digits
        value = "+91" + digits;
    
        setFormData(prev => ({
            ...prev,
            phone: value
        }));
    
        // Clear error
        if (errors.phone) {
            setErrors(prev => ({
                ...prev,
                phone: ''
            }));
        }
    };

    const handlePostalCodeChange = (e) => {
        let value = e.target.value;
    
        // Sirf digits hi allow karo
        if (!/^\d*$/.test(value)) {
            // ❌ Agar number ke alawa kuch daala → ignore
            return;
        }
    
        // Max 6 digits
        if (value.length > 6) {
            value = value.slice(0, 6);
        }
    
        setFormData(prev => ({
            ...prev,
            postalCode: value
        }));
    
        if (errors.postalCode) {
            setErrors(prev => ({
                ...prev,
                postalCode: ''
            }));
        }
    };


    const sendOtpToEmail = async () => {
        if (!isLoaded || !signUp) return;          // Clerk not ready
        if (resendTimer > 0 || sendingOtp) return; // rate-limit
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showPopupMessage("Please enter a valid email address.", "error");
            return;
        }

        try {
            setSendingOtp(true);
            await signUp.create({ emailAddress: formData.email });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setOtpSent(true);
            showPopupMessage("OTP sent to your email.", "success");
            startResendTimer();
        } catch (error) {
            console.error("Clerk Email OTP send error:", error);
            const msg =
                error?.errors?.[0]?.longMessage ||
                error?.errors?.[0]?.message ||
                "OTP sending failed. Please check your email address.";
            showPopupMessage(msg, "error");
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyEmailOtp = async () => {
        if (!isLoaded || !signUp) return;
        if (!otp || verifyingOtp) return;

        try {
            setVerifyingOtp(true);

            const result = await signUp.attemptEmailAddressVerification({ code: otp });

            if (result.status === "complete") {
                // If you want to force adding password after verify:
                // if (formData.password) {
                //   await signUp.update({ password: formData.password });
                // }
                await setActive({ session: result.createdSessionId });
                setOtpVerified(true);
                showPopupMessage("Email verified successfully!", "success");
            } else {
                showPopupMessage("OTP verification incomplete. Please try again.", "error");
            }
        } catch (error) {
            console.error("Clerk Email OTP verification error:", error);
            const msg =
                error?.errors?.[0]?.longMessage ||
                error?.errors?.[0]?.message ||
                "Invalid OTP. Please try again.";
            showPopupMessage(msg, "error");
        } finally {
            setVerifyingOtp(false);
        }
    };
    // Resend timer (60s)
    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        setTimerIntervalId(interval);
    };


    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
            if (!formData.businessType) newErrors.businessType = 'Business type is required';
        }

        if (step === 2) {
            if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
            //if (!otpVerified) newErrors.phone = 'Please verify your phone number';
            if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
            if (!formData.city.trim()) newErrors.city = 'City is required';
            if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
            if (!formData.googleMapsLink.trim()) {
                newErrors.googleMapsLink = 'Google Maps link is required';
            } else if (
                !/^https:\/\/(www\.)?google\.(com|co\.in|[a-z]{2,})\/maps\/place|\/maps\/.*\?/.test(formData.googleMapsLink.trim())
            ) {
                newErrors.googleMapsLink = 'Enter a valid Google Maps link';
            }

        }
        if (step === 3) {
            if (!formData.username.trim()) newErrors.username = 'Username is required';
            if (!formData.password.trim()) newErrors.password = 'Password is required';
            else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleRazorpaySuccess = async () => {
        setHasPaid(true);
        showPopupMessage("Payment successful! Your request is being sent to admin...", 'success');
       // await sendRequestToAdmin();
    };

    // const sendRequestToAdmin = async () => {
    //     setIsSubmitting(true);
    //     try {
    //         const response = await fetch(`${BASE_URL}/api/vendor/request`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         if (!response.ok) {
    //             showPopupMessage("Failed to send request. Please try again.", 'error');
    //             return;
    //         }

    //         showPopupMessage("Your request has been sent to admin. It will be approved within 24 hours.", 'info', 6000);
    //         // Optionally, disable further actions or redirect to a waiting page
    //         setTimeout(() => {
    //             navigate('/vendor-request-pending');
    //         }, 3000);

    //     } catch (error) {
    //         showPopupMessage("Network error. Please try again.", 'error');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                console.error("Error parsing JSON from backend:", jsonError);
                showPopupMessage("Something went wrong. Please try again.", 'error');
                return;
            }

            console.error("Registration failed:", errorData);

            if (errorData?.msg === "Email already registered") {
                showPopupMessage("This email is already registered. Please login or use a different email.", 'error');
            } else if (errorData?.msg) {
                showPopupMessage(errorData.msg, 'error');
            } else {
                showPopupMessage("Registration failed. Please try again.", 'error');
            }

            return;
        }

        const data = await response.json();
        console.log("Registered successfully:", data);

        // ✅ Show direct success message
        showPopupMessage("Registration successful! Welcome to EzyFix!", 'success');

        // ✅ Save user info to localStorage
        if (data.id) {
            localStorage.setItem("VendorId", data.id);
        } else {
            console.error("VendorId missing in response");
        }

        localStorage.setItem("VendorToken", data.token);
        localStorage.setItem("vendorName", formData.contactPerson);
        localStorage.setItem("vendorEmail", formData.email);
        localStorage.setItem("vendorPhone", formData.phone);
        localStorage.setItem("vendorBusiness", formData.businessName);
        localStorage.setItem("vendorBusinessType", formData.businessType);
        localStorage.setItem("vendorAddress", formData.streetAddress);
        localStorage.setItem("vendorGoogleMapsLink", formData.googleMapsLink || "");
        localStorage.setItem("vendorDescription", formData.businessDescription || "");

        // ✅ Redirect to dashboard immediately
        navigate('/dashboard');

    } catch (error) {
        console.error("Network error during registration:", error);
        showPopupMessage("Network error. Please try again.", 'error');
    } finally {
        setIsSubmitting(false);
    }
};
    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    }

    const businessTypes = [
        'Restaurants/cafe/Dining',
        'Fashion',
        'Hotel & Stays',
        'SPA & Salons',
        'Electronics',
        'Furniture',
        'Fun & Activity',
        'Other Service',
    ];

    const provinces = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry"
    ];


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f4ff] via-[#e0f4ff] to-[#e0f4ff]">
            {/* Header */}
            <header className="bg-white shadow-md border-b-4 border-[#3BB5FF]">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="/ezyfix-logo.jpg"
                            alt="EzyFix Logo"
                            className="w-10 h-10 object-contain rounded-xl"
                        />
                        <span className="text-2xl font-bold text-[#3BB5FF] hidden sm:inline">EzyFix</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-[#3BB5FF] text-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Register Your Business
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join EzyFix and start attracting new customers to your local business with amazing deals and offers!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-blue-100">
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-300" />
                            <span>Increase Sales</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Gift className="w-5 h-5 text-yellow-300" />
                            <span>Attract Customers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-yellow-300" />
                            <span>Grow Business</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                {/* Progress Stepper */}
                <div className="flex justify-center mb-12 px-4">
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-6 sm:space-y-0 w-full max-w-4xl">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
                                {/* Step Circle */}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${currentStep >= step
                                        ? 'bg-[#3BB5FF] text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {currentStep > step ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        step
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="mt-2 sm:mt-0 sm:ml-3 text-center sm:text-left">
                                    <p
                                        className={`text-sm font-semibold ${currentStep >= step ? 'text-[#3BB5FF]' : 'text-gray-500'
                                            }`}
                                    >
                                        {step === 1 && 'Business Info'}
                                        {step === 2 && 'Contact Details'}
                                        {step === 3 && 'Account Setup'}
                                    </p>
                                </div>

                                {/* Connector Line */}
                                {step < 3 && (
                                    <div
                                        className={`hidden sm:block w-16 h-1 mx-4 rounded ${currentStep > step ? 'bg-[#3BB5FF]' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-[#3BB5FF] max-w-4xl mx-auto">
                    <div className="p-8 md:p-12">
                        {/* Step 1: Business Information */}
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <Building2 className="w-16 h-16 text-[#3BB5FF] mx-auto mb-4" />
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Business Information</h3>
                                    <p className="text-gray-600">Tell us about your amazing business</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <InputField
                                        label="Business Name"
                                        name="businessName"
                                        placeholder="Enter your business name"
                                        icon={Building2}
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        error={errors.businessName}
                                        required
                                    />
                                    <InputField
                                        label="Business Type"
                                        name="businessType"
                                        placeholder="Enter your business name"
                                        options={businessTypes}
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        error={errors.businessType}
                                        required
                                    />
                                    <TextAreaField
                                        label="Business Description"
                                        name="businessDescription"
                                        placeholder="Describe what makes your business special..."
                                        value={formData.businessDescription}
                                        onChange={handleInputChange}
                                        error={errors.businessDescription}
                                    />

                                </div>
                            </div>
                        )}

                        {/* Step 2: Contact Information */}
                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <User className="w-16 h-16 text-[#3BB5FF] mx-auto mb-4" />
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Contact Information</h3>
                                    <p className="text-gray-600">How can customers reach you?</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <InputField
                                        label="Contact Person"
                                        name="contactPerson"
                                        placeholder="Your full name"
                                        icon={User}
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        error={errors.contactPerson}
                                        required
                                    />
                                    <InputField
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        placeholder="9876543210"
                                        icon={Phone}
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        error={errors.phone}
                                        required
                                    />


                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        icon={Mail}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={errors.email}
                                        required
                                    />
                                    <EmailOtpField
                                        otp={otp}
                                        setOtp={setOtp}
                                        otpVerified={otpVerified}
                                        otpSent={otpSent}
                                        sendOtpToEmail={sendOtpToEmail}
                                        verifyEmailOtp={verifyEmailOtp}
                                        resendTimer={resendTimer}
                                        sending={sendingOtp}
                                        verifying={verifyingOtp}
                                        email={formData.email}
                                    />

                                    <InputField
                                        label="Street Address"
                                        name="streetAddress"
                                        placeholder="Street address"
                                        icon={MapPin}
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        error={errors.streetAddress}
                                        required
                                    />
                                    <InputField
                                        label="City"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        error={errors.city}
                                        required
                                    />
                                    <InputField
                                        label="Province/State"
                                        name="province"
                                        options={provinces}
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        error={errors.province}
                                    />
                                    <InputField
                                        label="Postal/Zip Code"
                                        name="postalCode"
                                        type="text"
                                        inputMode="numeric"      
                                        pattern="[0-9]*"         
                                        placeholder="Postal Code"
                                        value={formData.postalCode}
                                        onChange={handlePostalCodeChange}
                                        error={errors.postalCode}
                                        required
                                    />

                                    <div className="relative group w-full">
                                        <InputField
                                            label="Google Maps Link"
                                            name="googleMapsLink"
                                            placeholder="https://www.google.com/maps/place/..."
                                            value={formData.googleMapsLink}
                                            onChange={handleInputChange}
                                            error={errors.googleMapsLink}
                                            required
                                        />

                                        {/* Tooltip */}
                                        {/* Tooltip */}
                                        {tooltipVisible && (
                                            <div className="absolute top-0 left-0 sm:left-full sm:ml-2 mt-2 sm:mt-0 w-full sm:w-72 p-3 bg-white text-gray-800 text-sm rounded-lg shadow-lg z-50 hidden group-hover:block">
                                                {/* Close Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTooltipVisible(false);
                                                    }}
                                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <p className="font-semibold text-yellow-500 mb-2">
                                                    How to get Google Maps Link:
                                                </p>
                                                <ol className="list-decimal list-inside space-y-1 text-wrap break-words">
                                                    <li>Go to Google Maps on a desktop browser and search for your location (e.g., “Khor Darwaja, Jawad, Madhya Pradesh”).</li>
                                                    <li>Click on the place name or marker.</li>
                                                    <li>Copy the link from the browser address bar and paste it here.</li>
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Account Setup */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <Lock className="w-16 h-16 text-[#3BB5FF] mx-auto mb-4" />
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Account Setup</h3>
                                    <p className="text-gray-600">Create your secure account</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                                    <InputField
                                        label="Username"
                                        name="username"
                                        placeholder="Choose a username"
                                        icon={User}
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        error={errors.username}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#3BB5FF]" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Create a strong password"
                                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-lg ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#3BB5FF]'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3BB5FF] hover:text-[#32A4E5] transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm flex items-center mt-1">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <div className="bg-[#e6f6ff] p-6 rounded-2xl border border-[#3BB5FF]/40">
                                    <h4 className="font-semibold text-[#3BB5FF] mb-3 flex items-center">
                                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                                        What happens next?
                                    </h4>
                                    <ul className="space-y-2 text-[#3BB5FF]">
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-[#3BB5FF] rounded-full"></div>
                                            <span>Instant access to your vendor dashboard</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-[#3BB5FF] rounded-full"></div>
                                            <span>Start creating amazing coupon deals</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-[#3BB5FF] rounded-full"></div>
                                            <span>Attract new customers immediately</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-8 py-4 border-2 border-[#3BB5FF] text-[#3BB5FF] rounded-xl font-semibold hover:bg-[#e0f4ff] transition-all duration-300"
                                >
                                    Previous
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="ml-auto px-8 py-4 bg-[#3BB5FF] text-white rounded-xl font-semibold hover:bg-[#1aa0ef] transition-all duration-300 shadow-lg"
                                >
                                    Next Step
                                </button>
                            ) : (

                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-end items-center">
                                    {/* ✅ Razorpay Payment Button */}
                                    {!hasPaid && (
                                        <RazorpayButton onPaymentSuccess={handleRazorpaySuccess} />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmation(true)}
                                        disabled={!hasPaid || isSubmitting}
                                        className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold sm:font-bold text-base sm:text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm sm:text-base">Registering...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                                                <span className="text-sm sm:text-base">Register Your Business</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Login Redirect Section */}
                <div className="text-center mt-12">
                    <p className="text-lg text-gray-700">
                        Already have an account?
                    </p>
                    <button
                        onClick={navigateToLogin}
                        className="mt-2 px-6 py-3 bg-white text-[#3BB5FF] border border-[#3BB5FF] rounded-full font-semibold hover:bg-[#3BB5FF] hover:text-white transition duration-300"
                    >
                        Login Here
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
              <div className="container mx-auto px-6 text-center">
                {/* Logo */}
                <div className="flex justify-center items-center space-x-3 mb-6">
                  <img
                    src="/ezyfix-logo.jpg"
                    alt="EzyFix Logo"
                    className="w-10 h-10 object-contain rounded-xl"
                  />
                  <span className="text-2xl font-bold text-[#3BB5FF] hidden sm:inline">EzyFix</span>
                </div>
            
                <p className="text-gray-400 mb-4">
                  Connecting businesses with customers through amazing deals
                </p>
                <p className="text-gray-500 text-sm">© 2025 EzyFix. All rights reserved.</p>
                <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-gray-500">
                  <Link to="/policy" className="hover:underline">Policy</Link>
                  <Link to="/terms" className="hover:underline">Terms</Link>
                  <Link to="/refund" className="hover:underline">Refund</Link>
                  <Link to="/contact" className="hover:underline">ContactUs</Link>
                </div>
              </div>
            </footer>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Registration</h2>
                        <p className="text-gray-600 mb-6">
                            Your request will be submitted and sent to admin. Access will be granted only after approval. We will reach out to you soon.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmation(false);
                                    handleSubmit();
                                }}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold shadow"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {popup.visible && (
                <Popup
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup({ ...popup, visible: false })}
                />
            )}
        </div>
    );
};

export default VendorRegistration;
