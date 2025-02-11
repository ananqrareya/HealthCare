import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Camera, Calendar, CheckCircle, XCircle, User, Trash2, X } from "lucide-react";
import useFetchPatientByIdData from "../hooks/useFetchPatientByIdData";
import Loading from "../components/Loading";
import axios from "axios";
import Swal from "sweetalert2";
import NewPassword from "../../auth/NewPassword";

export default function PatientProfile() {
    const userId = localStorage.getItem("currentUserId");
    const { patientData, loading, error } = useFetchPatientByIdData(userId);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // إضافة حالة القائمة
  const [showNewPassword, setShowNewPassword] = useState(false);

     const apiUrl =import.meta.env.VITE_APP_KEY;

    if (loading ||!patientData) {
       return <Loading/>
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">حدث خطأ أثناء تحميل البيانات.</div>;
    }

 
    const fullName = `${patientData.user?.first_name || "غير متوفر"} ${patientData.user?.last_name || ""}`.trim();
    const age = new Date().getFullYear() - new Date(patientData.user?.dob || "").getFullYear();
    const accountCreationDate = new Date(patientData.created_at).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });


    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت.");
                return;
            }
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const uploadImage = async () => {
        if (!selectedFile) {
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "يرجى اختيار صورة قبل الإرسال.",
            });
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        try {
            const response = await axios.post(`${apiUrl}/api/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "تم الحفظ!",
                    text: "تم تحديث الصورة الشخصية بنجاح.",
                    timer: 3000,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "حدث خطأ أثناء تحميل الصورة. يرجى المحاولة مرة أخرى.",
            });
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async () => {
        try {
            const confirmation = await Swal.fire({
                title: "هل أنت متأكد؟",
                text: "سيتم حذف الصورة الشخصية بشكل نهائي!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "نعم، احذفها",
                cancelButtonText: "إلغاء",
            });

            if (confirmation.isConfirmed) {
                const response = await axios.delete(`${apiUrl}/api/avatar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "تم الحذف!",
                        text: "تم حذف الصورة الشخصية بنجاح.",
                        timer: 3000,
                        showConfirmButton: false,
                    });

                    // إعادة تعيين الصورة إلى القيمة الافتراضية
                    setPreviewImage(null);
                    patientData.user.avatar = null;
                }
            }
        } catch (err) {
            console.error("Error deleting image:", err);
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "حدث خطأ أثناء حذف الصورة. يرجى المحاولة مرة أخرى.",
            });
        }
    };
     

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8" dir="rtl">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* العنوان الرئيسي */}
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-blue-900">الملف الشخصي</h1>
                    <Link to="/medical-records">
                        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            السجل الطبي
                        </button>
                    </Link>
                </div>

                {/* تفاصيل الملف الشخصي */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* معلومات المستخدم */}
                    <div className="w-full bg-white shadow-lg rounded-lg p-4 md:p-8">
                        <div className="flex flex-col items-center gap-6 mb-6 md:flex-row">
                            {/* الصورة الشخصية */}
                            <div className="relative">
                                <img
                                    src={previewImage || patientData.user?.avatar || "https://via.placeholder.com/150"}
                                    alt="Avatar"
                                    className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-blue-500 cursor-pointer transition-transform duration-300 transform hover:scale-105"
                                />
                                {/* أيقونة الكاميرا */}
                                <button
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 md:p-3 rounded-full hover:bg-blue-700 transition"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <Camera className="h-5 w-5" />
                                </button>
                                {/* قائمة الخيارات */}
                                {isDropdownOpen && (
                                    <div className="absolute bottom-14 right-0 bg-white shadow-lg rounded-lg w-48 text-gray-700 z-10">
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => document.getElementById("picture").click()}
                                        >
                                            <Camera className="w-5 h-5 text-green-500" />
                                            <span>تغيير الصورة</span>
                                            <input
                                                id="picture"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setPreviewImage(reader.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                        setSelectedFile(file);
                                                        uploadImage();
                                                    }
                                                }}
                                            />
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                            onClick={deleteImage}
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                            <span>حذف الصورة</span>
                                        </button>
                                    </div>
                                )}
                                {/* إدخال الصورة */}
                                <input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>

                            {/* معلومات المستخدم */}
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{fullName}</h2>
                                <p className="text-gray-500 mt-1">رقم المريض: {patientData.id_number || "غير متوفر"}</p>
                            </div>
                        </div>

                        {/* معلومات إضافية */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center text-base md:text-lg text-gray-700">
                                <Mail className="h-5 w-5 ml-3" />
                                {patientData.user?.username || "غير متوفر"}
                            </div>
                            <div className="flex items-center text-base md:text-lg text-gray-700">
                                <Phone className="h-5 w-5 ml-3" />
                                {patientData.user?.phone || "غير متوفر"}
                            </div>
                            <div className="flex items-center text-base md:text-lg text-gray-700">
                                <Calendar className="h-5 w-5 ml-3" />
                                تاريخ إنشاء الحساب: {accountCreationDate || "غير متوفر"}
                            </div>
                            <div className="flex items-center text-base md:text-lg">
                                {patientData.user?.["is_active"] ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span>الحساب مفعل</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <XCircle className="h-5 w-5" />
                                        <span>الحساب غير مفعل</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* تفاصيل إضافية */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">تفاصيل إضافية</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">فصيلة الدم</span>
                                <span className="font-semibold text-gray-900">{patientData.blood_type || "غير متوفر"}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">العمر</span>
                                <span className="font-semibold text-gray-900">{age || "غير متوفر"} سنة</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">الجنس</span>
                                <span className="font-semibold text-gray-900">{patientData.gender === "male" ? "ذكر" : "أنثى"}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">تاريخ الميلاد</span>
                                <span className="font-semibold text-gray-900">{patientData.user?.dob || "غير متوفر"}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-sm ">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">الأمان والخصوصية</h2>
                    <div className="space-y-4">
                        <button className="w-full text-right p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800 transition"
                            onClick={() => setShowNewPassword(true)}
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">تغيير كلمة المرور</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                قم بتحديث كلمة المرور الخاصة بك بشكل دوري
                            </p>
                        </button>
                        {showNewPassword && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                                    {/* زر الإغلاق */}
                                    <button
                                        onClick={() => setShowNewPassword(false)}
                                        className="absolute top-4 right-4 text-gray-400 dark:text-gray-600 hover:text-red-500"
                                    >
                                        <X size={20} />
                                    </button>

                                    {/* محتوى النافذة */}
                                    <NewPassword />
                                </div>
                            </div>
                        )}




                    </div>
                </div>
            </div>
          
        </div>
    );
}
