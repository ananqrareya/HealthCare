import { useState } from "react";
import axios from "axios";

// هوك لجلب مواعيد العيادة
const useClinicAppointments = () => {
    const [loading, setLoading] = useState(false); // حالة التحميل
    const [error, setError] = useState(null); // حالة الخطأ
    const apiUrl = import.meta.env.VITE_APP_KEY; // عنوان الـ API من البيئة
    const [appointments, setAppointments] = useState([]);
    const [twentyFourHoursAgoAppointments, setTwentyFourHoursAgoAppointments] = useState([]);

    const token = localStorage.getItem("userToken");

    // دالة جلب المواعيد من العيادة
    const clinicAppointments = async (clinicId) => {
        console.log("📡 جلب المواعيد للعيادة:", clinicId);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${apiUrl}/api/clinics/${clinicId}/appointments`,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "s",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                console.log("response:", response.data.data);

                const now = new Date();
                const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

                const appointmentList = response.data.data
                    .filter(item => item.status === "pending") // ✅ تصفية المواعيد التي حالتها "pending"
                    .map((item) => ({
                        id: item.id,
                        patient: {
                            id: `${item.patient?.user.id || "غير معروف"}`,
                            name: `${item.patient?.user.first_name || "غير معروف"} ${item.patient?.user.last_name || ""}`.trim() || "غير معروف",
                            en_name: `${item.patient?.user.username || "غير معروف"}`,
                            bloodType: `${item.patient.blood_type || "غير معروف"}`,
                            idNumber: `${item.patient.id_number || "غير معروف"}`,
                            phone: item.patient?.user.phone || "غير معروف",
                            gender: item.patient?.gender, //=== "male" ? "ذكر" : item.patient?.gender === "female" ? "أنثى" : "غير معروف",
                            dateOfBirthday: item.patient?.user.dob || "غير معروف"
                        },

                        time: item.time,
                        date: item.date.split("T")[0], // استخراج التاريخ فقط
                        createdAt: new Date(item.created_at), // تحويل `created_at` إلى كائن `Date`
                        relativeDate: calculateRelativeDate(item.date),
                        status: item.status,
                    }));

                // ✅ تصفية المواعيد التي تمت إضافتها خلال آخر 24 ساعة
                const recentAppointmentsList = appointmentList.filter(
                    item => item.createdAt >= twentyFourHoursAgo
                );

                // ✅ تحديث حالة المصفوفات
                setAppointments(appointmentList);
                setTwentyFourHoursAgoAppointments(recentAppointmentsList);

                return { allAppointments: appointmentList, recentAppointments: recentAppointmentsList }; // ✅ إرجاع المصفوفتين
            }
        } catch (error) {
            console.error("❌ خطأ في جلب الحجوزات:", error);
            setError(error);
            setAppointments([]);
            setTwentyFourHoursAgoAppointments([]);
            return { allAppointments: [], recentAppointments: [] }; // ✅ إرجاع مصفوفات فارغة عند حدوث خطأ
        } finally {
            setLoading(false);
        }
    };

    // دالة لحساب التاريخ النسبي (اليوم / غدًا / لاحقًا)
    function calculateRelativeDate(date) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const appointmentDate = new Date(date);

        const appointmentDateOnly = new Date(
            appointmentDate.getFullYear(),
            appointmentDate.getMonth(),
            appointmentDate.getDate()
        );

        if (appointmentDateOnly.getTime() === today.getTime()) {
            return "اليوم";
        } else if (appointmentDateOnly.getTime() === tomorrow.getTime()) {
            return "غداً";
        } else {
            return "لاحقاً";
        }
    }

    return { clinicAppointments, appointments, twentyFourHoursAgoAppointments, loading, error };
};

export default useClinicAppointments;
