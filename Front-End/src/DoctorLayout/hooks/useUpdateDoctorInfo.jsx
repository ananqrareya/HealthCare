import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// هوك لتحديث بيانات الدكتور
const useUpdateDoctorInfo = () => {
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const apiUrl = import.meta.env.VITE_APP_KEY; // عنوان الـ API من البيئة
  const doctorId=localStorage.getItem("currentUserId");
  // دالة لتحديث بيانات الدكتور
  const updateDoctorInfo = async (data) => {
    setLoading(true);
    setError(null);
console.log("data",data);
    try {
      const response = await axios.put(`${apiUrl}/api/doctors/${doctorId}/update`, data, {
        headers: {
          "ngrok-skip-browser-warning": "s",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      });

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

  return { updateDoctorInfo, loading, error };
};

export default useUpdateDoctorInfo;
