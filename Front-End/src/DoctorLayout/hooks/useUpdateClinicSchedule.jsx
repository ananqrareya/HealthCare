import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// هوك لتحديث بيانات الدكتور
const useUpdateClinicSchedule = () => {
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const apiUrl = import.meta.env.VITE_APP_KEY; // عنوان الـ API من البيئة
  const doctorId=localStorage.getItem("currentUserId");
  // دالة لتحديث بيانات الدكتور
  const updateClinicSchedule = async (data,clinicId,scheduleId) => {
    setLoading(true);
    setError(null);
 
    try {
      const response = await axios.put(`${apiUrl}/api/doctors/${doctorId}/clinics/${clinicId}/schedule/${scheduleId}`, data, {
        headers: {
          "ngrok-skip-browser-warning": "s",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      });
console.log("data",response);
      if (response.status === 200) {
       Swal.fire({
    icon: "success",
    title: "تم الحفظ!",
    text: "تم تحديث المواعيد بنجاح.",
    timer: 3000,
    showConfirmButton: false,
  });

        return response.data; // إرجاع البيانات إذا كان هناك حاجة لاستخدامها
      }
    } catch (error) {
      console.error("Error updating doctor info:", error);
      setError(error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء حفظ التعديلات. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateClinicSchedule, loading, error };
};

export default useUpdateClinicSchedule;
