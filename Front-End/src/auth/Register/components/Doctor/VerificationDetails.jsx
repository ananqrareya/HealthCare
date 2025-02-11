import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Loader } from "lucide-react"; // Icons
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import axios from "axios";

const VerificationDetails = ({ idPhoto, onBack, onComplete, setCurrentStep }) => {
    const [loading, setLoading] = useState(false);
    const isRequestSentRef = useRef(false);
    const apiUrl = import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        const prepareAndSubmit = async () => {
            if (isRequestSentRef.current) return;
            isRequestSentRef.current = true;

            try {
                console.log("Uploaded ID Photo:", idPhoto);

                const role = localStorage.getItem("role");
                const capturedPhotoBase64 = localStorage.getItem("capturedImage");
                const userId = localStorage.getItem("userId");

                if (!idPhoto || !userId) {
                    Swal.fire({
                        icon: "warning",
                        title: "الصورة مفقودة",
                        text: "يرجى تحميل صورة الهوية مرة أخرى.",
                    }).then(() => {
                        setCurrentStep(5);
                    });
                    return;
                }

                const formData = new FormData();
                formData.append("user_id", userId);
                formData.append("reference", idPhoto);

                if (role === "doctor" && capturedPhotoBase64) {
                    const capturedPhotoBlob = base64ToBlob(capturedPhotoBase64, "image/png");
                    formData.append("face", capturedPhotoBlob, "captured_photo.png");
                }

                await handleSubmitDetails(formData);
            } catch (error) {
                console.error("Error preparing verification data:", error);
                Swal.fire({
                    icon: "error",
                    title: "خطأ",
                    text: error.message || "فشل في تجهيز بيانات التحقق.",
                });
            }
        };

        prepareAndSubmit();
    }, [idPhoto]);

    const base64ToBlob = (base64, contentType) => {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = Array.from(byteCharacters).map((char) =>
            char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };




    const handleDeleteUser = async () => {
        const userId = localStorage.getItem("userId");
        const userDetails = JSON.parse(localStorage.getItem("userDetails"));

        if (localStorage.getItem("role") === "patient") {
            try {
                if (userId) {
                    await axios.delete(`${apiUrl}/api/users/${userId}`);
                    console.log(`تم حذف المستخدم بمعرف ${userId} بنجاح.`);
                }
            } catch (error) {
                console.error("خطأ أثناء حذف المستخدم:", error.response ? error.response.data : error.message);
            }
        } else {
            try {
                if (userId) {
                    await axios.delete(`${apiUrl}/api/doctors/${userId}`);
                    console.log(`تم حذف المستخدم بمعرف ${userId} بنجاح.`);
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

    const handleSubmitDetails = async (formData) => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/face/verification`,
                formData,
                { headers: { "ngrok-skip-browser-warning": "s" } }
            );

            console.log("Response Data:", response.data.face_verification?.decision);

            if (
                ["accept", "review"].includes(response.data.face_verification?.decision)
            ) {
                Swal.fire({
                    icon: "success",
                    title: "تم التحقق بنجاح",
                    text: "تم التحقق من هويتك  ",
                }).then(() => {
                    localStorage.setItem("verificationResult", JSON.stringify(response.data));
                    onComplete();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "فشل التحقق",
                    text: "لم يتم التحقق من هويتك. يرجى المحاولة مرة أخرى.",
                }).then(() => {
                    setCurrentStep(4);
                });
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                console.error("Error Response:", errorData);

                if (errorData.redirect === "id_card") {
                    Swal.fire({
                        icon: "warning",
                        title: "مشكلة في صورة الهوية",
                        text: errorData.error || "يرجى تحميل صورة أوضح للهوية.",
                    }).then(() => {
                        setCurrentStep(5);
                    });
                } else if (errorData.redirect === "user") {
                    Swal.fire({
                        icon: "error",
                        title: "مشكلة في بيانات المستخدم",
                        text: errorData.error || "البيانات غير صحيحة. يرجى إعادة إدخال المعلومات.",
                    }).then(async () => {
                        await handleDeleteUser();
                        setCurrentStep(1);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "خطأ غير متوقع",
                        text: errorData.error || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
                    });
                }
            } else if (error.request) {
                console.error("No Response from Server:", error.request);
                Swal.fire({
                    icon: "error",
                    title: "الخادم غير متصل",
                    text: "تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.",
                });
            } else {
                console.error("Error:", error.message);
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

    return (
        <div
            className="flex flex-col items-center justify-center p-6 bg-white text-gray-800 rounded-lg shadow-md w-full max-w-md mx-auto"
            dir="rtl"
        >
            {/* قسم الرأس */}
            <div className="flex flex-col items-center mb-6">
                <CheckCircle
                    className="h-16 w-16 text-blue-600 animate-pulse"
                    aria-label="جاري التحقق"
                />
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                    جاري التحقق من حسابك
                </h2>
            </div>

            {/* مؤشر التحميل */}
            <div className="flex items-center justify-center space-x-4 mb-6">
                <Loader className="h-6 w-6 text-yellow-500 animate-spin" />
                <span className="text-lg text-gray-600">
                    يتم التحقق من معلوماتك، يرجى الانتظار...
                </span>
            </div>

            {/* الرسائل */}
            <p className="text-center text-gray-500 text-sm mb-6">
                قد يستغرق ذلك بضع دقائق. يرجى عدم تحديث أو إغلاق الصفحة.
            </p>

            {/* الأزرار */}
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
