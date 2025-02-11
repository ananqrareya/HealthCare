import React, { useEffect, useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import PatientFlow from './PatientFlow';
import DoctorFlow from './DoctorFlow';
import axios from 'axios';
import { motion } from 'framer-motion';
import registerAi from '../../assets/animations/register.json'

import { Link, NavLink, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
export default function RegisterForm() {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true); // حالة تحميل
    const [showResumePrompt, setShowResumePrompt] = useState(false); // لإظهار إشعار الاستمرار

    // Load the saved role from localStorage on component mount
    useEffect(() => {
        const savedRole = localStorage.getItem('role');  // احصل على الدور المخزن
        const savedStep = localStorage.getItem('currentStep');

        if (savedRole && savedStep) {
            setRole(savedRole);  // إذا كان الدور موجودًا، قم بتعيينه
            setShowResumePrompt(true);  // عرض رسالة الاستئناف
        } else {
            setRole(null);  // تأكد من تعيينه لـ null إذا لم يتم العثور على الدور
            setShowResumePrompt(false);  // إخفاء الإشعار
        }

        setLoading(false);  // بعد الانتهاء من تحميل البيانات، قم بتعيين حالة التحميل إلى false
    }, []);


    // Save the role to localStorage whenever it changes
    useEffect(() => {
        if (role) {
            localStorage.setItem('role', role);
        }
    }, [role]);



    const apiUrl = import.meta.env.VITE_APP_KEY;
    const handleBackToRoleSelection = async () => {
        const userId = localStorage.getItem('userId'); // الحصول على user_id من localStorage


        try {
            if (userId && role) {
                let endpoint = '';

                // Determine the endpoint based on the role
                if (role === 'patient') {
                    endpoint = ` ${apiUrl}/api/patients/${userId}`;
                } else if (role === 'doctor') {
                    endpoint = `${apiUrl}/api/doctors/${userId}`;
                } else {
                    throw new Error('Invalid user role.');
                }

                // Send DELETE request
                await axios.delete(endpoint);
                console.log(`User with ID ${userId} and role ${role} deleted successfully.`);
            } else {
                console.warn('User ID or role is missing.');
            }
        } catch (error) {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
        }
        // إعادة تعيين القيم وحذف البيانات من localStorage
        setRole(null);
        localStorage.removeItem('role');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('userId');
        setShowResumePrompt(false); // إزالة الإشعار
    };

    const handleResumeRegistration = () => {
        const savedRole = localStorage.getItem('role');
        setRole(savedRole);
        setShowResumePrompt(false); // إخفاء الإشعار
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50" dir={role === "doctor" ? "ltr" : "rtl"}>
            {showResumePrompt ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg w-full"
                >
                    <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
                        لديك عملية تسجيل جارية
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        هل ترغب في استئناف التسجيل من حيث توقفت أو البدء من جديد؟
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button
                            type="button"
                            onClick={handleResumeRegistration}
                            className="w-full sm:w-40 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="w-5 h-5" />
                            استئناف
                        </button>
                        <button
                            type="button"
                            onClick={handleBackToRoleSelection}
                            className="w-full sm:w-40 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 hover:shadow-lg transition-all duration-300"
                        >
                            <span className="inline-flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                البدء من جديد
                            </span>
                        </button>
                    </div>
                </motion.div>
            )
                : !role ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                            قم بالتسجيل في منصتنا
                        </h1>
                        <p className="text-sm text-gray-600 mb-6">
                            اختر دورك لبدء عملية التسجيل
                        </p>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('patient')}
                                className="flex-1 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                            >
                                <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <span className="block text-sm font-medium">مريض</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('doctor')}
                                className="flex-1 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                            >
                                <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <span className="block text-sm font-medium">دكتور</span>
                            </button>
                        </div>
                    </motion.div>
                ) : role === 'patient' ? (
                    <PatientFlow onBackToRoleSelection={handleBackToRoleSelection} />
                ) : (
                    <DoctorFlow onBackToRoleSelection={handleBackToRoleSelection} />
                )}

            <div>
                <div className='w-full flex items-center justify-center '>
                    <Lottie animationData={registerAi} loop className="w-20" />
                </div>

                {/* رابط تسجيل الدخول */}
                <p className="mt-4 text-sm text-gray-600">
                    هل لديك حساب؟{' '}
                    <Link
                        to="/login"
                        className="text-blue-600 underline hover:text-blue-800 transition-colors"
                    >
                        سجل الدخول هنا
                    </Link>
                </p>
            </div>
        </div>
    );

};


