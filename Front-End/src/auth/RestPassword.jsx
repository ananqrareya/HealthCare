import React, { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowRight, Phone, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestPassword() {
    const [step, setStep] = useState('phone');
    const [error, setError] = useState('');

    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [restToken, setRestToken] = useState('');
    const apiUrl = import.meta.env.VITE_APP_KEY;
    const navigate = useNavigate();
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        console.log("phone", emailOrPhone);
        try {
            const response = await axios.post(`${apiUrl}/api/forget-password/send-otp`, {
                email_or_username_or_phone: emailOrPhone,
                headers: { "ngrok-skip-browser-warning": "s" },
            });

            if (response.status === 200) {
                console.log(response.data.user_id)
                setUserId(response.data.user_id);

                setStep('verify');
            } else {
                console.log("Failed to send OTP", response.data);
                if (response.data.message === "Maximum OTP resend attempts reached. Please try again later.") {
                    setError("لقد تجاوزت الحد المسموح لإرسال رمز التحقق. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.");
                } else {
                    setError("حدث خطأ أثناء إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
                }
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setError("حدث خطأ أثناء إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Check if the code is entered
        if (!code) {
            setError('يرجى إدخال رمز التحقق.');
            return;
        }

        try {
            // Send API request to generate token
            const response = await axios.post(`${apiUrl}/api/forget-password/generate-token`, {
                user_id: userId,
                otp: code,
                headers: { "ngrok-skip-browser-warning": "s" }, // optional, based on your setup
            });

            if (response.status === 200) {
                // If the response is successful, move to the reset step
                console.log('Token generated successfully', response.data);
                setRestToken(response.data.reset_token);
                setStep('reset');
            } else {
                // Handle failure, e.g., invalid code
                setError('رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.');
            }
        } catch (error) {
            // Handle network or server errors
            console.error('Error generating token:', error);
            setError('حدث خطأ أثناء التحقق من رمز التحقق. يرجى المحاولة مرة أخرى.');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // Validate the passwords
        if (password !== confirmPassword) {
            setError('كلمة المرور غير متطابقة. يرجى التحقق من المدخلات.');
            return;
        }

        if (password.length < 6) {
            setError('يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.');
            return;
        }

        try {
            // Send API request to reset the password
            const response = await axios.post(`${apiUrl}/api/forget-password/reset-password`, {
                password: password,
                password_confirmation: confirmPassword,
                token: restToken,
            });

            if (response.status === 200) {
                navigate('/login')

            } else {
                // Handle error if reset fails
                setError('حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.');
            }
        } catch (error) {
            // Handle network or server errors
            console.error('Error resetting password:', error);
            setError('حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {step === 'phone' && 'إعادة تعيين كلمة المرور'}
                        {step === 'verify' && 'التحقق من الرمز'}
                        {step === 'reset' && 'تعيين كلمة المرور الجديدة'}
                    </h1>
                    <p className="text-gray-600">
                        {step === 'phone' && 'أدخل   البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم لتلقي رمز التحقق'}
                        {step === 'verify' && 'أدخل الرمز المرسل إلىك'}
                        {step === 'reset' && 'أدخل كلمة المرور الجديدة'}
                    </p>
                </div>

                {step === 'phone' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم"
                                required
                                dir="rtl"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            إرسال رمز التحقق
                            <ArrowRight size={20} />
                        </button>
                    </form>
                )}



                {step === 'verify' && (
                    <form onSubmit={handleVerifySubmit} className="space-y-6">
                        <div className="relative">
                            <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="رمز التحقق"
                                required
                                dir="rtl"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            تحقق من الرمز
                            <ArrowRight size={20} />
                        </button>
                    </form>
                )}

                {step === 'reset' && (
                    <form onSubmit={handleResetSubmit} className="space-y-6">
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="كلمة المرور الجديدة"
                                required
                                dir="rtl"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="تأكيد كلمة المرور"
                                required
                                dir="rtl"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            تغيير كلمة المرور
                            <ArrowRight size={20} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RestPassword;
