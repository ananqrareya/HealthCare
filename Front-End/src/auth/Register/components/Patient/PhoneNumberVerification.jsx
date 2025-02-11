import React, { useState } from 'react';
import { CheckCircle, Edit, Save } from 'lucide-react';
import axios from 'axios';

export default function PhoneNumberVerification({ phone, user_id, onNext }) {
    const [verificationData, setVerificationData] = useState({
        otp: '',
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
                `${apiUrl}/api/verify-phone`,
                verificationData,
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );

            if (response.status === 200) {
                setSuccess(true);
                setError(null);
                onNext(user_id);
            }
        } catch (error) {
            setError('فشل التحقق. من فضلك حاول مجددًا.');
        } finally {
            setLoading(false);
        }

    };

    const handleResend = async () => {
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            await axios.post(
                `${apiUrl}/api/resend-phone-otp`,
                { user_id: verificationData.user_id },
                { headers: { 'ngrok-skip-browser-warning': 's' } }
            );
            setSuccess("تم إرسال رمز التحقق بنجاح!");
        } catch (error) {
            setError('فشل في إعادة إرسال الرمز. من فضلك حاول مجددًا.');
        } finally {
            setLoading(false);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [newPhone, setNewPhone] = useState(phone);
    const [phoneError, setPhoneError] = useState(null);

    const handleEditPhone = () => setIsEditing(true);

    const handleSavePhone = async () => {
        if (!newPhone.match(/^[0-9]{10}$/)) {
            setPhoneError('يرجى إدخال رقم هاتف صالح.');
            return;
        }
        setLoading(true);

        try {
            const response = await axios.put(
                `${apiUrl}/api/update-phone`,
                { phone: newPhone, user_id: verificationData.user_id },
                { headers: { 'ngrok-skip-browser-warning': 's' } }
            );

            if (response.status === 200) {
                setIsEditing(false);
                setPhoneError(null);
                setSuccess(true);
            } else {
                setError('فشل في تحديث الرقم.');
            }
        } catch (err) {
            setPhoneError('حدث خطأ أثناء تحديث الرقم. من فضلك حاول مجددًا.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center min-h-[50vh] justify-center min-h-screen bg-gray-50 px-4 rtl">
            <div className="w-full max-w-lg p-6 bg-white shadow-lg min-h-[50vh] rounded-lg">
                <div className="text-center mb-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-blue-500" />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                        تحقق من رقم هاتفك
                    </h2>

                    <p className="text-sm text-gray-600 mt-2 mb-6">
                        الرجاء التأكد من أنك قد استلمت رمز التحقق على جوالك.
                    </p>

                    <div className="flex justify-center items-center mt-2 space-x-2">
                        {isEditing ? (
                            <input
                                type="tel"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                className={`text-lg font-semibold text-center border-b-2 ${phoneError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none`}
                                autoFocus
                            />
                        ) : (
                            <span className="text-lg font-semibold">{newPhone}</span>
                        )}
                        <button
                            type="button"
                            onClick={isEditing ? handleSavePhone : handleEditPhone}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                        </button>
                    </div>

                    {phoneError && <p className="mt-2 text-sm text-red-500">{phoneError}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">رمز التحقق</label>
                        <input
                            type="text"
                            value={verificationData.otp}
                            onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                            className="w-full px-4 py-2 mt-1 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل الرمز المؤلف من 6 أرقام"
                            maxLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-white font-medium rounded-md shadow ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {loading ? 'جارٍ التحقق...' : 'تحقق من الهاتف'}
                    </button>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
                {success && (
                    <p className="mt-4 text-center text-sm text-green-500">
                        تم تغير رقم الهاتف بنجاح!
                    </p>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                    لم تستلم الرمز؟{' '}
                    <button
                        type="button"
                        className="text-blue-600 hover:text-blue-500"
                        onClick={handleResend}
                    >
                        إعادة إرسال
                    </button>
                </p>
            </div>
        </div>
    );
}
