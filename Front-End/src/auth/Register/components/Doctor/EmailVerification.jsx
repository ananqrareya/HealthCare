import React, { useState } from "react";
import { CheckCircle, Edit, Save } from "lucide-react";
import axios from "axios";

export default function EmailVerification({ email, user_id, onNext }) {
    const [verificationData, setVerificationData] = useState({
        otp: "",
        user_id: user_id,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_APP_KEY;



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiUrl}/api/verify-email`,
                verificationData,
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );

            if (response.status === 200) {
                setSuccess(true);
                setError(null);
                onNext();
            }
        } catch (error) {
            setError("فشل التحقق. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }

    };

    const handleResend = async () => {
        setError(null);
        setSuccess(false);
        setVerificationData({ ...verificationData, otp: "" });
        setLoading(true);

        try {
            await axios.post(
                `${apiUrl}/api/resend-email-otp`,
                { user_id: verificationData.user_id },
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );
        } catch {
            setError("فشل في إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState(email);
    const [emailError, setEmailError] = useState(null);

    const handleEditEmail = () => setIsEditing(true);

    const handleSaveEmail = async () => {
        if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setEmailError("يرجى إدخال بريد إلكتروني صالح.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(
                `${apiUrl}/api/update-email`,
                { email: newEmail, user_id: verificationData.user_id },
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );

            if (response.status === 200) {
                setIsEditing(false);
                setEmailError(null);
                setSuccess(true);
            } else {
                setError("فشل في تحديث البريد الإلكتروني.");
            }
        } catch {
            setEmailError("خطأ أثناء تحديث البريد الإلكتروني. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-lg">
            {/* العنوان */}
            <div className="text-center mb-10">
                <CheckCircle className="h-12 w-12 text-blue-500 mx-auto" />
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900">تحقق من بريدك الإلكتروني</h2>
                <div className="flex justify-center items-center mt-4 space-x-2">
                    {isEditing ? (
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className={`text-lg font-semibold text-center border-b-2 ${emailError ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                                } focus:outline-none`}
                            autoFocus
                        />
                    ) : (
                        <span className="text-lg font-semibold">{newEmail}</span>
                    )}
                    <button
                        type="button"
                        onClick={isEditing ? handleSaveEmail : handleEditEmail}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                    </button>
                </div>
                {emailError && <p className="mt-2 text-sm text-red-500">{emailError}</p>}
            </div>

            {/* نموذج التحقق */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700">رمز التحقق</label>
                    <input
                        type="text"
                        placeholder="وصلك كود على الأيميل"
                        value={verificationData.otp}
                        onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                        className="w-3/4 px-4 py-2 mx-auto mt-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={6}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-md text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        } transition-colors`}
                >
                    {loading ? "جاري التحقق..." : "تحقق من البريد الإلكتروني"}
                </button>
            </form>

            {/* رسائل الخطأ أو النجاح */}
            {error && <p className="mt-6 text-sm text-red-500 text-center">{error}</p>}
            {success && (
                <div className="mt-6 text-green-500 text-center">
                    <CheckCircle className="mx-auto h-12 w-12" />
                    <p>تم التحقق من البريد الإلكتروني بنجاح!</p>
                </div>
            )}

            {/* رابط إعادة الإرسال */}
            <p className="mt-6 text-center text-sm text-gray-600">
                لم يصلك الرمز؟{" "}
                <button type="button" onClick={handleResend} className="text-blue-600 hover:underline">
                    أعد الإرسال
                </button>
            </p>
        </div>

    );

}
