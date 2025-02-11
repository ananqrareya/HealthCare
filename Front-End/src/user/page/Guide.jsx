import React from "react";
import { FaClinicMedical, FaVideo, FaSmile, FaClock } from "react-icons/fa";
import { Video, CheckCircle, Link } from "lucide-react";
import Lottie from "lottie-react";
import videoConsultationAnimation from "../../assets/animations/video-consultation.json"; // ملف Lottie
import clinicBookingAnimation from "../../assets/animations/clinic-booking.json"; // ملف Lottie
import { useNavigate } from "react-router-dom";

function Guide() {
  const navigate=useNavigate();
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 animate-fade-in">
            دليلك لحجز موعدك بسهولة
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in-delayed">
            اختر بين الاستشارة عبر الفيديو أو زيارة العيادة واستمتع بتجربة سهلة وسريعة
          </p>
        </div>

        {/* خيارات الحجز */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* الاستشارة عبر الفيديو */}
          <div className="bg-white rounded-xl list-booking  shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-2xl text-right relative">
            <div className="absolute left-0 top-0 w-32 h-32">
              <Lottie animationData={videoConsultationAnimation} loop />
            </div>
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
              استشارة عبر الفيديو
            </h2>
            <p className="text-gray-600 mb-6 rtl">
              احصل على استشارة طبية مباشرة من طبيبك المفضل من خلال مكالمة فيديو عبر منصتنا
            </p>
<ol className="list-decimal list-inside space-y-3 text-gray-700 rtl text-right">
              <li>سجّل دخولك إلى حسابك أو قم بإنشاء حساب جديد.</li>
              <li>اختر الطبيب المناسب من قائمة الأطباء المتاحين.</li>
              <li>حدد الموعد الذي يناسبك لجلسة الفيديو.</li>
              <li>ستصلك تفاصيل الجلسة في خيار حجزك الاونلاين.</li>
                 <li>تصبح كبسة بدأ الجلسة متاحة عندما يحين وقت الموعد.</li>
            </ol>
            <div className="mt-8">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg transition-all flex items-center justify-center"
              onClick={()=>navigate("/doctor")}>
                <FaVideo className="ml-2" />
                احجز استشارتك الآن
              </button>
            </div>
          </div>

          {/* الحجز في العيادة */}
          <div className="bg-white rounded-xl shadow-lg list-booking  p-8 transform transition-all hover:scale-105 hover:shadow-2xl text-right relative">
            <div className="absolute left-0 top-0 w-32 h-32">
              <Lottie animationData={clinicBookingAnimation} loop />
            </div>
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
              الحجز في العيادة
            </h2>
            <p className="text-gray-600 mb-6 ">
              قم بحجز موعد لزيارة الطبيب في عيادته بسهولة من خلال منصتنا
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700   ">
              <li>سجّل دخولك إلى حسابك أو قم بإنشاء حساب جديد.</li>
              <li>اختر الطبيب أو التخصص المناسب.</li>
              <li>حدد العيادة والموعد الذي يناسبك.</li>
              <li>ستستلم تأكيد الحجز.</li>
            </ol>
            <div className="mt-8">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg transition-all flex items-center justify-center"
              onClick={()=>navigate('/all-cities')}>
               
                <FaClinicMedical className="ml-2" />
                اعرف مواقع العيادات
              
              </button>
            </div>
          </div>
        </div>

        {/* مقارنة بين الخيارات */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
            مقارنة بين الخيارات
          </h2>
          <div className="grid grid-cols-1 list-booking  md:grid-cols-2 gap-8 text-right">
            <div className="bg-indigo-50 rounded-lg p-6 shadow-md transform list-booking  transition-all hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-end  space-x-3   mb-4 text-right">
                <Video className="text-indigo-600 w-6 h-6" />
                <h3 className="text-2xl font-semibold text-indigo-600 text-right">
                  استشارة عبر الفيديو
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ">
                <li>استشارة طبية من أي مكان.</li>
                <li>توفير الوقت والجهد.</li>
                <li>مناسب للحالات غير الطارئة.</li>
              </ul>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-end space-x-3   mb-4">
                <FaClinicMedical className="text-indigo-600 w-6 h-6" />
                <h3 className="text-2xl font-semibold text-indigo-600">
                  الحجز في العيادة
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>تواصل مباشر مع الطبيب.</li>
                <li>إجراء الفحوصات الطبية اللازمة.</li>
                <li>مناسب للحالات التي تحتاج إلى متابعة شخصية.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* مميزات المنصة */}
        <div className="mt-20 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-right">
            لماذا تستخدم منصتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <FaSmile className="text-yellow-500 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-indigo-600">
                سهولة الاستخدام
              </h3>
              <p className="text-gray-600">
                واجهة بسيطة تجعل الحجز سهلًا للجميع.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <CheckCircle className="text-green-500 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-indigo-600">
                تأكيد فوري
              </h3>
              <p className="text-gray-600">
                احصل على تأكيد فوري لحجزك.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <FaClock className="text-indigo-500 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-indigo-600">
                مرونة الحجز
              </h3>
              <p className="text-gray-600">
                اختر ما يناسبك بين الاستشارة أو زيارة العيادة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
