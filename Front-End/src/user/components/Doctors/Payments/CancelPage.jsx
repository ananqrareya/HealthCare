import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CancelPage = () => {
  const navigate = useNavigate();
  const appointmentId = localStorage.getItem("appointment_id");
    const apiUrl = "https://c15b-139-190-147-200.ngrok-free.app";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // منع الرجوع باستخدام replace
    navigate(window.location.pathname, { replace: true });

    const handlePopState = () => {
      navigate("/", { replace: true }); // إعادة التوجيه إلى الصفحة الرئيسية
    };

    // إضافة مستمع للحدث popstate
    window.addEventListener("popstate", handlePopState);

    // إرسال طلب الإلغاء وحذف رقم الحجز
    if (appointmentId) {
      axios
        .post(
          `${apiUrl}/api/payment/cancel/${appointmentId}`,
          {},
          {
            headers: {
              "ngrok-skip-browser-warning": "s",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Cancellation Response from API:", response.data);
          localStorage.removeItem("appointment_id"); // حذف رقم الحجز
        })
        .catch((error) => {
          console.error("Error cancelling booking:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("No appointment ID found in localStorage");
      setLoading(false);
    }

    // تنظيف المستمع عند الخروج من الصفحة
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, appointmentId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-6">إلغاء العملية</h1>
        {loading ? (
          <p className="text-lg text-gray-700 flex items-center justify-center">
            جاري إلغاء الحجز...
            <span className="ml-2 animate-spin border-t-2 border-b-2 border-red-500 w-6 h-6 rounded-full"></span>
          </p>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <img
                src="https://img.icons8.com/clouds/100/cancel.png"
                alt="Cancel Icon"
                className="w-20 h-20"
              />
            </div>
            <p className="text-lg font-semibold text-red-600">
              تم إلغاء الحجز بنجاح. نأمل أن تعود مجددًا قريبًا.
            </p>
            <p className="text-gray-600 mt-2">
              إذا كنت بحاجة إلى أي مساعدة، يمكنك التواصل مع فريق الدعم الفني.
            </p>
            <button
              className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
              onClick={() => navigate("/")}
            >
              العودة إلى الصفحة الرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelPage;
