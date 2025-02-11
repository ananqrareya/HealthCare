import React, { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { X } from "lucide-react";

function BookingForm({ open, onClose, doctor, clinic, date, timeSlot }) {
    const [formData, setFormData] = useState({ name: "", phone: "", reason: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert("تم الحجز بنجاح، سيتم التواصل معك قريباً لتأكيد الموعد.");
        setIsSubmitting(false);
        onClose();
        setFormData({ name: "", phone: "", reason: "" });
    };

    return (
        open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white max-w-lg w-full p-8 rounded-lg shadow-xl relative">
                    {/* زر الإغلاق */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* العنوان */}
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">تأكيد الحجز</h2>
                        <p className="text-sm text-gray-500">يرجى ملء البيانات التالية</p>
                    </div>

                    {/* تفاصيل الحجز */}
                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <p>الطبيب: {doctor.name}</p>
                        <p>العيادة: {clinic.name}</p>
                        <p>
                            التاريخ:{" "}
                            {format(date, "EEEE d MMMM yyyy", {
                                locale: ar,
                            })}
                        </p>
                        <p>
                            الوقت: {timeSlot.startTime} - {timeSlot.endTime}
                        </p>
                    </div>

                    {/* النموذج */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                الاسم الكامل
                            </label>
                            <input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="أدخل اسمك"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                رقم الهاتف
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="أدخل رقم هاتفك"
                            />
                        </div>

                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                سبب الزيارة
                            </label>
                            <textarea
                                id="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="أدخل سبب زيارتك"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white py-3 rounded-lg transition-all duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                                }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "جاري الحجز..." : "تأكيد الحجز"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
}

export default BookingForm;
