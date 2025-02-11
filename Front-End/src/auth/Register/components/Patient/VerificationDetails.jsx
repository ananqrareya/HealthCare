import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Loader } from "lucide-react"; // Icons
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import axios from "axios";

const VerificationDetails = ({ idPhoto, onBack, onComplete, setCurrentStep }) => {
    const [loading, setLoading] = useState(false);
    const isRequestSentRef = useRef(false);

    useEffect(() => {
        const prepareAndSubmit = async () => {
            if (isRequestSentRef.current) return; // إذا تم الإرسال مسبقًا، لا تفعل شيئًا
            isRequestSentRef.current = true; // تعيين الحالة إلى تم الإرسال

            try {
                console.log("تم تحميل صورة الهوية:", idPhoto);
                const userId = localStorage.getItem("userId");

                if (!idPhoto || !userId) {
                    // التحقق من وجود الصورة ومعرف المستخدم
                    Swal.fire({
                        icon: "warning",
                        title: "الصورة غير موجودة",
                        text: "يرجى تحميل صورة الهوية مرة أخرى.",
                    }).then(() => {
                        setCurrentStep(3); // إعادة التوجيه إلى خطوة تحميل الصورة
                    });
                    return; // إيقاف العملية
                }

                const formData = new FormData();
                formData.append("user_id", userId);
                formData.append("reference", idPhoto);



                await handleSubmitDetails(formData);
            } catch (error) {
                console.error("خطأ أثناء إعداد بيانات التحقق:", error);
                Swal.fire({
                    icon: "error",
                    title: "حدث خطأ",
                    text: error.message || "فشل إعداد بيانات التحقق.",
                });
            }
        };

        prepareAndSubmit();
    }, [idPhoto]);


    const apiUrl = import.meta.env.VITE_APP_KEY;

    const handleSubmitDetails = async (formData) => {
        try {
            setLoading(true);

            // إذا كان الدور مريض
            const response = await axios.post(
                `${apiUrl}/api/patient/verification`,
                formData,
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );

            console.log("استجابة التحقق من المريض:", response.data);

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "تم التحقق بنجاح",
                    text: "تم التحقق من هويتك بنجاح! حسابك الآن جاهز للاستخدام.",
                }).then(() => {
                    onComplete(); // إكمال الخطوات
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "فشل التحقق",
                    text: "فشل التحقق. يرجى المحاولة مرة أخرى.",
                });
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                console.error("استجابة الخطأ:", errorData);

                // معالجة الأخطاء الخاصة بالـ API
                if (errorData.redirect === "id_card") {
                    Swal.fire({
                        icon: "warning",
                        title: "مشكلة في صورة الهوية",
                        text: errorData.error || "يرجى تحميل صورة أكثر وضوحًا لبطاقة الهوية.",
                    }).then(() => {
                        setCurrentStep(3); // إعادة التوجيه إلى خطوة تحميل صورة الهوية
                    });
                } else if (errorData.redirect === "user") {
                    Swal.fire({
                        icon: "error",
                        title: "مشكلة في تفاصيل المستخدم",
                        text: errorData.error || "تفاصيلك غير صحيحة. يرجى إعادة إدخال المعلومات.",
                    }).then(async () => {
                        await handleDeleteUser();
                        setCurrentStep(1); // إعادة التوجيه إلى خطوة تسجيل المستخدم
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "خطأ غير متوقع",
                        text: errorData.error || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
                    });
                }
            } else if (error.request) {
                console.error("لا استجابة من الخادم:", error.request);
                Swal.fire({
                    icon: "error",
                    title: "الخادم غير متاح",
                    text: "لم نتمكن من الاتصال بالخادم. يرجى المحاولة لاحقًا.",
                });
            } else {
                console.error("الخطأ:", error.message);
                Swal.fire({
                    icon: "error",
                    title: "خطأ",
                    text: error.message || "حدث خطأ أثناء التحقق.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        const userId = localStorage.getItem("userId");
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));

        if (localStorage.getItem("role") === "patient") {
            try {
                if (userId) {
                    await axios.delete(`${apiUrl}/api/users/${userId}`)
                    console.log(`تم حذف المستخدم ذو الرقم التعريفي ${userId} بنجاح.`);
                }
            } catch (error) {
                console.error("خطأ أثناء حذف المستخدم:", error.response ? error.response.data : error.message);
            }
        } else {
            try {
                if (userId) {
                    await axios.delete(`${apiUrl}/api/users/${userId}`);
                    console.log(`تم حذف المستخدم ذو الرقم التعريفي ${userId} بنجاح.`);
                }
            } catch (error) {
                console.error("خطأ أثناء حذف المستخدم:", error.response ? error.response.data : error.message);
            }
        }
        localStorage.setItem("userDetailsBackup", JSON.stringify(userDetails));
        localStorage.removeItem("role");
        localStorage.removeItem("currentStep");
        localStorage.removeItem("userId");
        localStorage.removeItem("capturedImage");
    };

    return (
        <div className="flex flex-col items-center justify-center mt-5 p-6 bg-white text-gray-800 rounded-lg shadow-md w-full max-w-md mx-auto">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-6">
                <CheckCircle
                    className="h-16 w-16 text-blue-600 animate-pulse"
                    aria-label="Verification in progress"
                />
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                    جاري التحقق من حسابك
                </h2>
            </div>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
                <Loader className="h-6 w-6 text-yellow-500 animate-spin" />
                <span className="text-lg text-gray-600">
                    جاري التحقق من معلوماتك. يرجى الانتظار...
                </span>
            </div>

            {/* Status Messages */}
            <p className="text-center text-gray-500 text-sm mb-6">
                قد يستغرق ذلك بضع لحظات. لا تقم بتحديث الصفحة أو إغلاقها.
            </p>

            {/* Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="w-full bg-gray-200 py-2 px-4 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
                >
                    العودة
                </button>
            </div>
        </div>
    );
};

export default VerificationDetails;
