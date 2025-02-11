import React, { useContext } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { formatScheduleArabic } from "../../utils/scheduleFormatter";
import Swal from "sweetalert2";

import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContextProvider";

export const ClinicCard = ({ clinic, onBooking }) => {
    const { isLoggedIn } = useContext(UserContext); // الحصول على حالة تسجيل الدخول
    const navigate = useNavigate();
    console.log("clinic in city", clinic);
    const formattedSchedule = clinic.schedule ? clinic.schedule : ["غير محدد"];
    const handleBookingClick = () => {
        if (!isLoggedIn) {
            // عرض SweetAlert إذا لم يكن المستخدم مسجلًا
            Swal.fire({
                title: "👋 مرحباً بك!",
                html: `
                               <p style="font-size: 18px; line-height: 1.8; color: #444; text-align:  ;">
                                   لتتمكن من حجز موعدك بسهولة وراحة، نرجو منك تسجيل الدخول أولاً.
                                   <br />
                                   لا تقلق، العملية بسيطة وسريعة جدًا!
                               </p>
                           `,
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "تسجيل الدخول الآن",
                cancelButtonText: "لاحقًا",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                customClass: {
                    popup: "swal2-rtl", // جعل المحتوى من اليمين إلى اليسار
                },
                didOpen: () => {
                    document.querySelector(".swal2-container").setAttribute("dir", "rtl");
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // توجيه المستخدم إلى صفحة تسجيل الدخول
                    window.location.href = "/login";
                }
            });
        } else {
            // استدعاء دالة الحجز إذا كان المستخدم مسجل الدخول

            navigate(`/clinic/booking/${clinic.id}`);

        }
    };
    return (
        <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            {/* الصورة */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                    {clinic.doctor && clinic.doctor.avatar ? (
                        <img
                            src={clinic.doctor.avatar}
                            alt={clinic.doctor.ar_full_name || "صورة الطبيب"}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 sm:border-6 border-white shadow-md"
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/64" // صورة افتراضية عند عدم وجود صورة
                            alt="صورة افتراضية"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 sm:border-6 border-white shadow-md"
                        />
                    )}
                </div>
                <div>
                    {/* اسم العيادة */}
                    <h3 className="text-xl font-bold text-blue-900">{clinic.ar_name}</h3>
                    <p className="text-m text-gray-800">عيادة</p>
                </div>
            </div>

            {/* التفاصيل */}
            <div className="space-y-4 text-gray-600">
                {/* الطبيب */}
                <p className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-semibold">الطبيب:</span>
                    {clinic.doctor?.ar_full_name || "غير محدد"}
                </p>

                {/* العنوان */}
                <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="font-semibold">العنوان:</span>
                    {clinic.address
                        ? `${clinic.address.address_line_1 || ""}، ${clinic.address.address_line_2 || ""}، ${clinic.address.address_line_3 || ""}`
                        : `عنوان غير محدد`}
                </p>
                {/* مدة الحجز */}
                <p className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="font-semibold">المدة الزمنية لكل حجز:</span>
                    {clinic.appointment_time} دقيقة
                </p>
                {/* الجدول */}
                <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                        <span className="font-semibold">الجدول الزمني:</span>
                        <ol className="list-disc pl-5 text-sm mt-1">
                            {clinic.schedule && clinic.schedule.length > 0
                                ? formatScheduleArabic(clinic.schedule).map((entry, index) => (
                                    <li key={index} className="font-semibold text-blue-900">
                                        {entry}
                                    </li>
                                ))
                                : "غير متوفر"}
                        </ol>
                    </div>

                </div>
            </div>

            {/* زر الحجز */}
            <div className="mt-6">
                <button
                    onClick={handleBookingClick}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                >
                    <Calendar className="w-5 h-5 ml-2" />
                    حجز موعد
                </button>
            </div>
        </div>
    );

};
