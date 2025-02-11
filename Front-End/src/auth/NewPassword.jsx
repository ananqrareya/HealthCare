import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

function NewPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_APP_KEY;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');




        if (newPassword !== confirmPassword) {
            setError('كلمة المرور الجديدة غير متطابقة');
            return;
        }

        if (newPassword.length < 6) {
            setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
            return;
        }


        try {
            // إرسال الطلب إلى API
            const formData = new FormData();
            formData.append('old_password', currentPassword);
            formData.append('password', newPassword);
            formData.append('password_confirmation', confirmPassword);
            // إرسال الطلب إلى API
            const { data } = await axios.post(`${apiUrl}/api/reset/password`, formData, {
                headers: {
                    "ngrok-skip-browser-warning": "s",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // عرض رسالة النجاح
            Swal.fire({
                icon: 'success',
                title: 'تم تغيير كلمة المرور بنجاح',
                text: data.message || 'لقد تم تغيير كلمة المرور بنجاح.',
                confirmButtonText: 'موافق'
            });
            // إعادة تعيين الحقول بعد نجاح التغيير
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const errorMessages = {
                "Your current password does not match our records.": "كلمة المرور الحالية غير صحيحة",
                "New password must be at least 6 characters long.": "يجب أن تحتوي كلمة المرور الجديدة على 6 أحرف على الأقل",
                "New password cannot be the same as the current password.": "لا يمكن أن تكون كلمة المرور الجديدة مطابقة للحالية",
                "User not found.": "المستخدم غير موجود",
                "Something went wrong. Please try again.": "حدث خطأ ما، يرجى المحاولة مرة أخرى",
                "The password field format is invalid.": "تنسيق حقل كلمة المرور غير صحيح"
            };

            // عرض رسالة الخطأ القادمة من الـ API
            const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور';

            // تحويلها إلى العربية إن أمكن، وإلا إبقاء الرسالة الأصلية
            setError(errorMessages[errorMessage] || 'حدث خطأ غير متوقع');

        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    تغيير كلمة المرور
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    قم بإدخال كلمة المرور الحالية وكلمة المرور الجديدة
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="كلمة المرور الحالية"
                        required
                        dir="rtl"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="كلمة المرور الجديدة"
                        required
                        dir="rtl"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="تأكيد كلمة المرور الجديدة"
                        required
                        dir="rtl"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                    تغيير كلمة المرور
                    <ArrowRight size={20} />
                </button>
            </form>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                <p>كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل</p>
            </div>
        </div>

    );
}

export default NewPassword;