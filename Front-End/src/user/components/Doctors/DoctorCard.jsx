import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Star, Phone, Video, MessageCircle } from "lucide-react";

function DoctorCard({ doctor }) {
    const navigate = useNavigate();

    if (!doctor) return null;

    const handleClick = () => {
        navigate(`/doctor/${doctor.id}`);
    };

    //للنجوم 
    const fullStars = Math.floor(doctor.rating); // النجوم الممتلئة
    const halfStars = doctor.rating % 1 >= 0.5 ? 1 : 0; // إذا كان هناك نصف نجم
    const emptyStars = 5 - fullStars - halfStars; // النجوم الفارغة

    return (
        <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg" dir="rtl">
            {/* صورة الطبيب */}
            <div className="relative">
                <img
                    src={doctor.avatar}
                    alt={doctor.ar_full_name}
                    className="w-full h-56 object-contain"
                />
                {doctor.online_active === 1 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 text-xs rounded-full">
                        متاح للحجز الإلكتروني
                    </div>
                )}
            </div>

            {/* معلومات الطبيب */}
            <div className="p-4 text-right">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {doctor.ar_full_name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{doctor.specialityAr}</p>

                {/* التقييم */}
                <div className="flex items-center justify-end gap-1 mb-3">
                    {/* النجوم الممتلئة */}
                    {Array.from({ length: fullStars }, (_, index) => (
                        <Star
                            key={`full-${index}`}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                    ))}

                    {/* النجوم نصف المملوءة */}
                    {Array.from({ length: halfStars }, (_, index) => (
                        <Star
                            key={`half-${index}`}
                            className="w-5 h-5 fill-yellow-200 text-yellow-200"
                        />
                    ))}

                    {/* النجوم الفارغة */}
                    {Array.from({ length: emptyStars }, (_, index) => (
                        <Star
                            key={`empty-${index}`}
                            className="w-5 h-5 text-gray-300"
                        />
                    ))}
                </div>
                {/* الرسوم */}
                <div className="text-sm text-gray-600 mb-4 space-y-2">
                    <p>
                        <span className="font-semibold text-gray-800">رسوم العيادة:</span>{" "}
                        <span className="text-blue-600">{doctor.fee} ₪</span>
                    </p>
                    <p>
                        <span className="font-semibold text-gray-800">رسوم الحجز الإلكتروني:</span>{" "}
                        {doctor.online_fee === 0 ? (
                            <span className="text-green-600 font-semibold">مجاني</span>
                        ) : (
                            <span className="text-green-600">{doctor.online_fee} ₪</span>
                        )}
                    </p>
                </div>

                {/* أزرار */}
                <div className="flex items-center justify-between">
                    <button
                          onClick={() => navigate(`/chat${doctor.id ? `?doctorId=${doctor.id}` : ""}`)} // رابط واتساب كأداة للتشات
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        راسل
                    </button>

                    <button
                        onClick={handleClick}
                        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                        <User className="w-5 h-5 text-gray-700" />
                        التفاصيل
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoctorCard;
