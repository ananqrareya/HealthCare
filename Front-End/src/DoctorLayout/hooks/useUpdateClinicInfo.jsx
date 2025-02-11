import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// هوك لتحديث بيانات الدكتور
const useUpdateClinicInfo = () => {
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const apiUrl = import.meta.env.VITE_APP_KEY; // عنوان الـ API من البيئة

  // دالة لتحديث بيانات الدكتور
  const updateClinicInfo = async (data,clinicId) => {
    setLoading(true);
    setError(null);
 console.log("clinc id",clinicId)
    try {
      const response = await axios.put(`${apiUrl}/api/clinics/${clinicId}`, data, {
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
    text: "تم تحديث بياناتك بنجاح.",
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

  return { updateClinicInfo, loading, error };
};

export default useUpdateClinicInfo;
