import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// هوك   لالغاء الحجز
const useCancelMissedAppointments = () => {
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const apiUrl = import.meta.env.VITE_APP_KEY; // عنوان الـ API من البيئة
  const token=localStorage.getItem("userToken");
  //دالةالغاء الحجز ر
  const cancelMissedAppointment = async (appointmentId) => {
    setLoading(true);
    setError(null);
 
    try {
      const response = await axios.post(
    `${apiUrl}/api/appointments/${appointmentId}/mark-missed`,
    {}, // يجب أن يكون هناك كائن فارغ لأن الطلب من نوع POST
    {
      headers: {
        "ngrok-skip-browser-warning": "s",
        Authorization: `Bearer ${token}`,  
        "Content-Type": "application/json",
      },
    }
  );
      if (response.status === 200) {
Swal.fire({
  icon: "warning", 
  title: "تم الإلغاء!",
  text: "تم إلغاء الحجز لعدم الحضور.",
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

  return { cancelMissedAppointment, loading, error };
};

export default useCancelMissedAppointments;
