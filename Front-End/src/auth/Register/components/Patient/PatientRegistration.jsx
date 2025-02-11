"use client";
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Calendar, Droplet, Award, Smile } from 'lucide-react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // استيراد مكتبة التحقق

const validationSchema = Yup.object({
    first_name: Yup.string().required("الاسم الأول مطلوب"),
    last_name: Yup.string().required("الاسم الأخير مطلوب"),
    username: Yup.string().required("اسم المستخدم مطلوب"),
    phone: Yup.string()
        .matches(/^059\d{7}$/, "رقم الهاتف غير صالح")
        .required("رقم الهاتف مطلوب"),

    id_number: Yup.string()
        .length(9, 'لا يقل عن 9 ارقام')
        .required("رقم الهوية مطلوب"),
    dob: Yup.date().required("تاريخ الميلاد مطلوب"),
    gender: Yup.string().required("الجنس مطلوب"),
    blood_type: Yup.string().required("فصيلة الدم مطلوبة"),
    emergency_contact_name: Yup.string(),
    emergency_contact_phone: Yup.string(),
    password: Yup.string()
        .min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل")
        .required("كلمة المرور مطلوبة"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], "كلمة المرور غير متطابقة")
        .required("تأكيد كلمة المرور مطلوب"),
});
export default function PatientRegistration({
    username,
    first_name,
    last_name,
    phone,
    dob,
    id_number,
    gender,
    blood_type,
    onNext,
    onBack
}) {
    const [formData, setFormData] = useState({
        username: username || '',
        password: '',
        password_confirmation: '',
        first_name: first_name || '',
        last_name: last_name || '',
        phone: phone || '',
        dob: dob || '',
        id_number: id_number || '',
        gender: gender || '',
        blood_type: blood_type || '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
    });
    const formik = useFormik({
        initialValues: formData,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values); // هنا يمكن استدعاء عملية التسجيل
        }
    });

    const [loading, setLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState('');

    const apiUrl = import.meta.env.VITE_APP_KEY;

    const handleSubmit = async (values) => {
        console.log("form register", values);
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiUrl}/api/patient/register`,
                values,
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );
            if (response.status === 201) {
                console.log(response.data)
                const userDetails = { ...values };
                localStorage.setItem("userDetails", JSON.stringify(userDetails));


                onNext(values.phone, response.data.user_id, userDetails);

            } else {
                console.log('Unexpected response:', response.data);
            }
        } catch (error) {
            if (error.response?.data) setBackendErrors(error.response.data.error);
        } finally {
            setLoading(false);
        }

    };
    const handleEnglishInputChange = (e) => {
        const { name, value } = e.target;

        // السماح فقط بالأحرف الإنجليزية والمسافات
        const regex = /^[a-zA-Z\s]*$/;

        if (regex.test(value) || value === "") {
            formik.setFieldValue(name, value); // تحديث القيمة في formik
        }
    };
    const handleChange = (e) => {
        formik.handleChange(e);
    };
    const handleArabicInputChange = (e) => {
        const { name, value } = e.target;

        // السماح فقط بالأحرف العربية
        const regex = /^[\u0600-\u06FF\s]*$/;

        if (regex.test(value) || value === "") {
            formik.setFieldValue(name, value); // تحديث القيمة في formik
        }
    };
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 overflow-auto md:overflow-visible  rtl" dir="rtl">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 flex justify-center items-center">
                    أهلاً وسهلاً بك!
                    <Smile className="h-8 w-8 text-blue-600 ml-2" />
                </h1>
                <p className="text-gray-600 mb-4">
                    من فضلك، قم بملء البيانات حسب هويتك الشخصية، حيث أننا سنقوم بالتحقق منها لاحقًا.
                    <br></br>
                    <span className="font-semibold text-gray-700"> لا داعي للقلق، ستكون جميع معلوماتك في أيد أمينة.</span>
                </p>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-lg mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formik.values.first_name}
                            placeholder='صالح'
                            onChange={handleArabicInputChange}
                            className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {formik.errors.first_name && formik.touched.first_name && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.first_name}</p>
                        )}
                        {backendErrors?.first_name && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.first_name}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأخير</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formik.values.last_name}
                            onChange={handleArabicInputChange}
                            placeholder='زيتاوي'
                            className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {formik.errors.last_name && formik.touched.last_name && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.last_name}</p>
                        )}
                        {backendErrors?.last_name && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.last_name}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                value={formik.values.username}
                                onChange={handleEnglishInputChange}
                                placeholder='salehzetawi'
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                        {formik.errors.username && formik.touched.username && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
                        )}
                        {backendErrors.username && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.username[0]}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formik.values.phone}
                            onChange={handleChange}
                            placeholder='0597376520'
                            className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            pattern="\d{10}"
                            required
                        />
                        {formik.errors.phone && formik.touched.phone && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                        )}
                        {backendErrors?.phone && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.phone}</p>
                        )}
                    </div>
                    {/* ID Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="id_number"
                                value={formik.values.id_number}
                                onChange={handleChange}
                                placeholder='47048757'
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                        {formik.errors.id_number && formik.touched.id_number && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.id_number}</p>
                        )}
                        {backendErrors.id_number && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.id_number[0]}</p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="dob"
                                value={formik.values.dob}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                        {formik.errors.dob && formik.touched.dob && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
                        )}
                        {backendErrors.dob && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.dob[0]}</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
                        <div className="relative">
                            <select
                                name="gender"
                                value={formik.values.gender}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">اختر الجنس</option>
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                            </select>
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Blood Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">فصيلة الدم</label>
                        <div className="relative">
                            <select
                                name="blood_type"
                                value={formik.values.blood_type}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">اختر فصيلة الدم</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            <Droplet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                        {formik.errors.blood_type && formik.touched.blood_type && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.blood_type}</p>
                        )}
                        {backendErrors.blood_type && (
                            <p className="text-red-500 text-sm mt-1">{backendErrors.blood_type[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اسم الشخص للطوارئ
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="emergencyContactName"
                                value={formData.emergency_contact_name}
                                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="اختياري"
                            />
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            هاتف شخص الطوارئ
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="emergency_contact_phone"
                                value={formData.emergency_contact_phone}
                                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                                className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="اختياري"
                            />
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                    <input
                        type="password"
                        name="password"
                        placeholder='خلي كلمة سر متقلش عن 6 خانات'
                        value={formik.values.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {formik.errors.password && formik.touched.password && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                    {backendErrors?.password && (
                        <p className="text-red-500 text-sm mt-1">{backendErrors.password}</p>
                    )}
                </div>
                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formik.values.password_confirmation}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none ${formik.values.password !== formik.values.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                        required
                    />
                    {formik.errors.password_confirmation && formik.touched.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password_confirmation}</p>
                    )}
                    {backendErrors?.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{backendErrors.password_confirmation}</p>
                    )}
                </div>
                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        العودة
                    </button>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        ) : (
                            "التالي"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}