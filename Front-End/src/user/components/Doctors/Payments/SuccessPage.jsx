import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const appointmentId = localStorage.getItem("appointment_id");
  const apiUrl = import.meta.env.VITE_APP_KEY;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // منع الرجوع باستخدام replace
    navigate(window.location.pathname, { replace: true });

    const handlePopState = () => {
      navigate("/", { replace: true }); // إعادة التوجيه إلى الصفحة الرئيسية
    };

    // إضافة مستمع للحدث popstate
    window.addEventListener("popstate", handlePopState);

    // إرسال الطلب وحذف رقم الحجز
    if (sessionId && appointmentId) {
      axios
        .post(`${apiUrl}/api/payment/success/${appointmentId}`,{},
          {
            headers: {
              "ngrok-skip-browser-warning": "s",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Response from API:", response.data);
          localStorage.removeItem("appointment_id"); // حذف رقم الحجز
        })
        .catch((error) => {
          console.error("Error confirming booking:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // تنظيف المستمع عند الخروج من الصفحة

  }, [sessionId, appointmentId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">شكراً لك!</h1>
        {loading ? (
          <p className="text-lg text-gray-700 flex items-center justify-center">
            جاري تأكيد الحجز...
            <span className="ml-2 animate-spin border-t-2 border-b-2 border-blue-500 w-6 h-6 rounded-full"></span>
          </p>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <img
                src="https://img.icons8.com/clouds/100/checked.png"
                alt="Success Icon"
                className="w-20 h-20"
              />
            </div>
            <p className="text-lg font-semibold text-blue-600">
              تم تأكيد حجزك! نحن مسرورون بتعاملك مع منصتنا ❤️
            </p>
            <p className="text-gray-600 mt-2">
              نأمل أن تكون تجربتك معنا مميزة وناجحة.
            </p>
            <button
              className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
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

export default SuccessPage;
