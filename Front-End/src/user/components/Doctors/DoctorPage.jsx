import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetchBookedClinicSlots from "../../hooks/useFetchBookedClinicSlots";
import useFetchDoctorById from "../../hooks/useFetchDoctorById";
import { generateTimeSlots } from "../../utils/generateTimeSlots";
import Loading from "../Loading";

import Swal from "sweetalert2";
import { postClinicAppointment } from "../../hooks/postClinicAppointment";
import { postOnlineAppointment } from "../../hooks/postOnlineAppointment";
import useFetchBookedOnlineSlots from "../../hooks/useFetchBookedOnlineSlots";
import { UserContext } from "../../../context/UserContextProvider";
const dayMap = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};
function DoctorPage() {
  useEffect(() => {
    window.scrollTo(0, 0); // إعادة التمرير إلى الأعلى عند تحميل الصفحة
  }, []);
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const {
    doctor,
    loading: doctorLoading,
    error: doctorError,
  } = useFetchDoctorById(doctorId);
  const { isLoggedIn } = useContext(UserContext); // الحصول على حالة تسجيل الدخول
console.log("test",doctor);
  const [viewOnlineBooking, setViewOnlineBooking] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    bookedSlots,
    loading: slotsLoading,
    error: slotsError,
  } = useFetchBookedClinicSlots(selectedClinic?.id);
  const {
    bookedOnlineSlots,
    loading: onlineslotsLoading,
    error: onlineslotsError,
  } = useFetchBookedOnlineSlots(doctorId);

  const dateKey = selectedDate.toISOString().split("T")[0];

const handleClinicSelection = (clinic) => {
  if (selectedClinic?.id === clinic.id) {
    // إذا كانت العيادة المحددة هي نفسها العيادة التي تم النقر عليها، قم بإلغاء التحديد
    setSelectedClinic(null);
    setSelectedDate(new Date());
    setSelectedTimeSlot(null);
  } else {
    // تحديد العيادة الجديدة
    setSelectedClinic(clinic);
    setSelectedDate(new Date());
    setSelectedTimeSlot(null);
  }
};

  const handleDateChange = (date) => {
    // ضبط التاريخ ليكون في منتصف الليل في التوقيت المحلي
    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0); // ضمان استخدام وقت وسط اليوم لتفادي الفروقات الزمنية

    setSelectedDate(adjustedDate);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelection = (slot) => {
    setSelectedTimeSlot(slot);
  };

const handleClinicBookingConfirmation = async () => {
  if (!selectedDate || !selectedTimeSlot) {
    Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "❌ يرجى اختيار تاريخ ووقت قبل تأكيد الحجز",
      confirmButtonText: "حسناً",
    });
    return;
  }

const startTime = selectedTimeSlot.split("-")[0].trim(); // استخراج الوقت بدون AM/PM
const isPM = startTime.includes("PM");
const isAM = startTime.includes("AM");

// إزالة AM/PM وتحويله إلى رقم
let [hours, minutes] = startTime.replace(/AM|PM/g, "").trim().split(":").map(Number);

if (isPM && hours !== 12) {
  hours += 12; // تحويل PM إلى توقيت 24 ساعة
} else if (isAM && hours === 12) {
  hours = 0; // تحويل 12 AM إلى 00
}

// تنسيق الوقت بصيغة 24 ساعة
const startTime24h = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const appointmentData = {
    date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
    time: startTime24h, // وقت البداية فقط
    doctor_id: doctorId, // معرّف العيادة
  };

try {
 
  const response = await postClinicAppointment(selectedClinic.id, appointmentData);

  // Format date and time
  const formattedDate = selectedDate.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Show success notification
  Swal.fire({
    icon: "success",
    title: "تم تأكيد الحجز",
    html: `
      <p>✅ تم تأكيد الحجز يوم <strong>${formattedDate}</strong></p>
      <p>في الساعة <strong>${startTime}</strong>.</p>
    `,
    confirmButtonText: "حسناً",
  }).then(() => setIsModalOpen(false));
} catch (error) {
  console.error("Error Details:", error);

  // Extract error message
  const errorMessage = error.response?.data?.message || error.message;

  if (errorMessage === "exist") {
  Swal.fire({
      icon: "warning",
      title: "عزيزي، لا يمكنك الحجز!",
      html: `
        <p>😅 لقد حجزت بالفعل موعدًا في هذا اليوم مع هذه العيادة.</p>
        <p>دع غيرك يستفيد من الأوقات المتبقية، واختر يومًا آخر للحجز.</p>
      `,
       confirmButtonText: "تمام، فهمت!",
    customClass: {
      popup: "swal2-rtl", // تضيف اتجاه النصوص إلى RTL
    },
    didOpen: () => {
      document.querySelector(".swal2-container").setAttribute("dir", "rtl");
    },
    }).then(() => setIsModalOpen(false));
  } else if (errorMessage === "You have appointment in another clinic") {
    Swal.fire({
      icon: "error",
      title: "عذرًا، لديك حجز آخر",
      html: `
        <p>
          😞 يبدو أنك قمت بحجز موعد في عيادة أخرى.
        </p>
        <p>
          يُرجى التحقق من مواعيدك أو اختيار عيادة أخرى للحجز.
        </p>
      `,
       confirmButtonText: "تمام، فهمت!",
    customClass: {
      popup: "swal2-rtl", // تضيف اتجاه النصوص إلى RTL
    },
    didOpen: () => {
      document.querySelector(".swal2-container").setAttribute("dir", "rtl");
    },
    }).then(() => setIsModalOpen(false));
  } else if (errorMessage === "blocked") {
    Swal.fire({
      icon: "error",
      title: "عذرًا، لا يمكنك الحجز",
      html: `
        <p>
          😞 لقد تم حظرك لمدة شهر بسبب عدم الالتزام بمواعيدك السابقة.
        </p>
        <p>
          يُرجى التواصل مع الدعم الفني أو انتظار انتهاء فترة الحظر لإعادة الحجز.
        </p>
      `,
      confirmButtonText: "تمام، فهمت!",
      customClass: {
        popup: "swal2-rtl", // تضيف اتجاه النصوص إلى RTL
      },
      didOpen: () => {
        document.querySelector(".swal2-container").setAttribute("dir", "rtl");
      },
    }).then(() => setIsModalOpen(false));
}

  else {
    console.log("Unexpected error message:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "حدث خطأ",
      html: `
        <p style="text-align: right; font-size: 16px; line-height: 1.8;">
          ⚠️ حدث خطأ غير متوقع. يُرجى المحاولة مرة أخرى لاحقًا.
        </p>
      `,
      confirmButtonText: "حسنًا",
    });
  }
}

}
const handleOnlineBookingConfirmation=async()=>{
   if (!selectedDate || !selectedTimeSlot) {
    Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "❌ يرجى اختيار تاريخ ووقت قبل تأكيد الحجز",
      confirmButtonText: "حسناً",
    });
    return;
  }
const startTime = selectedTimeSlot.split("-")[0].trim(); // استخراج الوقت بدون AM/PM
const isPM = startTime.includes("PM");
const isAM = startTime.includes("AM");

// إزالة AM/PM وتحويله إلى رقم
let [hours, minutes] = startTime.replace(/AM|PM/g, "").trim().split(":").map(Number);

if (isPM && hours !== 12) {
  hours += 12; // تحويل PM إلى توقيت 24 ساعة
} else if (isAM && hours === 12) {
  hours = 0; // تحويل 12 AM إلى 00
}

// تنسيق الوقت بصيغة 24 ساعة
const startTime24h = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  const appointmentData = {
    date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
    time: startTime24h, // وقت البداية فقط
    doctor_id: doctorId, // معرّف العيادة
    _token:"F7BlCl7UiMXkxPllKKwKfdd0c0wN36T442tIlM79"
  };
  console.log("app",appointmentData);
  try {
  const response = await postOnlineAppointment(doctor.id, appointmentData);
   const stripeUrl = response.url;  
   

    if (!stripeUrl) {
      throw new Error("Failed to retrieve Stripe URL.");
    }
        // تخزين رقم الحجز في localStorage
    if (response.appointment_id) {
      localStorage.setItem('appointment_id', response.appointment_id);
    }
    localStorage.setItem("payment_in_progress", "true");
        window.location.href = stripeUrl;

  // Format date and time


  // Show success notification
    setIsModalOpen(false);
} catch (error) {
  console.error("Error Details:", error);

  // Extract error message
  const errorMessage = error.response?.data?.message || error.message;

  if (errorMessage === "exist") {
  Swal.fire({
      icon: "warning",
      title: "عزيزي، لا يمكنك الحجز!",
      html: `
        <p>😅 لقد حجزت بالفعل موعدًا في هذا اليوم مع هذه العيادة.</p>
        <p>دع غيرك يستفيد من الأوقات المتبقية، واختر يومًا آخر للحجز.</p>
      `,
       confirmButtonText: "تمام، فهمت!",
    customClass: {
      popup: "swal2-rtl", // تضيف اتجاه النصوص إلى RTL
    },
    didOpen: () => {
      document.querySelector(".swal2-container").setAttribute("dir", "rtl");
    },
    }).then(() => setIsModalOpen(false));
  } else if (errorMessage === "You have appointment in another doctor") {
    Swal.fire({
      icon: "error",
      title: "عذرًا، لديك حجز آخر",
      html: `
        <p>
          😞 يبدو أنك قمت بحجز موعد اونلاين أخر.
        </p>
        <p>
          يُرجى التحقق من مواعيدك أو اختيار دكتور او مواعيد أخرى للحجز.
        </p>
      `,
       confirmButtonText: "تمام، فهمت!",
    customClass: {
      popup: "swal2-rtl", // تضيف اتجاه النصوص إلى RTL
    },
    didOpen: () => {
      document.querySelector(".swal2-container").setAttribute("dir", "rtl");
    },
    }).then(() => setIsModalOpen(false));
  }
  else if (errorMessage === "blocked") {
    Swal.fire({
      icon: "error",
      title: "عذرًا، لا يمكنك الحجز",
      html: `
        <p>
          😞 لقد تم حظرك لمدة شهر بسبب عدم الالتزام بمواعيدك السابقة.
        </p>
        <p>
          يُرجى التواصل مع الدعم الفني أو انتظار انتهاء فترة الحظر لإعادة الحجز.
        </p>
      `,
      confirmButtonText: "تمام، فهمت!",
      customClass: {
        popup: "swal2-rtl", // تضيف اتجاه النصوص إلى RTL
      },
      didOpen: () => {
        document.querySelector(".swal2-container").setAttribute("dir", "rtl");
      },
    }).then(() => setIsModalOpen(false));
}
  else {
    console.log("Unexpected error message:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "حدث خطأ",
      html: `
        <p style="text-align: right; font-size: 16px; line-height: 1.8;">
          ⚠️ حدث خطأ غير متوقع. يُرجى المحاولة مرة أخرى لاحقًا.
        </p>
      `,
      confirmButtonText: "حسنًا",
    });
  }
}
}



const normalizeTime = (time) => {
  const arabicPeriods = { صباحاً: "AM", مساءً: "PM" };

  let [timePart, period] = time.split(" ");
  if (arabicPeriods[period]) {
    period = arabicPeriods[period];
  }

  const [hours, minutes] = timePart.split(":").map(Number);
  const isPM = period === "PM";
  const adjustedHours = isPM && hours !== 12 ? hours + 12 : hours;

  return `${adjustedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};


const getOnlineTimeSlots = () => {
  
  if (!doctor?.onlineSchedule || doctor.onlineSchedule.length === 0) {
    return [];
  }

  const dayOfWeekArabic =
    dayMap[selectedDate.toLocaleDateString("en-US", { weekday: "long" })];

  const onlineDay = doctor.onlineSchedule.find(
    (schedule) => schedule.day === dayOfWeekArabic
  );

  if (!onlineDay) {
    return [];
  }

  const workingHour = {
    time: `${onlineDay.start_time} - ${onlineDay.end_time}`,
  };

  const availableSlots = generateTimeSlots(
    workingHour,
    doctor.online_appointment_time || 15
  );
  const bookedOnlineTimes = (bookedOnlineSlots[dateKey] || []).map(normalizeTime);
  // لا حاجة للتحقق من الحجز للمواعيد الإلكترونية هنا إذا لم يكن هناك حجز
   return availableSlots.map((slot) => {
     const normalizedSlot = normalizeTime(extractStartTime(slot));
     return {
       time: slot,
       isBooked: bookedOnlineTimes.includes(normalizedSlot),
     };
   });
};

 const getClinicTimeSlots = () => {
   if (!selectedClinic) return [];

   const dayOfWeekArabic =
     dayMap[selectedDate.toLocaleDateString("en-US", { weekday: "long" })];

   const workingDay = selectedClinic.workingHours.find(
     (wh) => wh.day === dayOfWeekArabic
   );

   if (!workingDay) return [];

   const workingHour = {
     time: `${workingDay.start_time} - ${workingDay.end_time}`,
   };

   const availableSlots = generateTimeSlots(
     workingHour,
     selectedClinic.appointment_time || 15
   );

   const bookedTimes = (bookedSlots[dateKey] || []).map(normalizeTime); // الأوقات المحجوزة

   return availableSlots.map((slot) => {
     const normalizedSlot = normalizeTime(extractStartTime(slot));
     return {
       time: slot,
       isBooked: bookedTimes.includes(normalizedSlot),
     };
   });
 };
  console.log("availableSlots", bookedSlots);



  const extractStartTime = (timeRange) => {
    if (!timeRange.includes("-")) return timeRange; // إذا لم يكن النطاق يتضمن "-"، نعتبره وقتًا فقط
    return timeRange.split("-")[0].trim(); // استخراج وقت البداية قبل "-"
  };

  const tileClassName = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return "text-gray-400";

    const dayOfWeekArabic = normalizeText(
      date.toLocaleDateString("ar-EG", { weekday: "long" })
    );

    const isAvailable = viewOnlineBooking
      ? doctor.onlineSchedule.some(
          (schedule) => normalizeText(schedule.day) === dayOfWeekArabic
        )
      : selectedClinic &&
        selectedClinic.workingHours.some(
          (wh) => normalizeText(wh.day) === dayOfWeekArabic
        );
    const isSelectedDate =
      selectedDate && date.toDateString() === selectedDate.toDateString();
    if (isSelectedDate) {
      return isAvailable
        ? "bg-blue-500 text-white font-bold rounded-full" // التاريخ المختار المتاح
        : "bg-red-500 text-white font-bold rounded-full"; // التاريخ المختار غير المتاح
    }

    return isAvailable
      ? "bg-green-100 hover:bg-green-200 text-green-900 font-semibold rounded-md"
      : "text-gray-400";
  };

  const normalizeText = (text) =>
    text
      .trim()
      .normalize("NFD")
      .replace(/[\u064B-\u065F]/g, "");

  const formatTimeRangeToArabic = (timeRange) => {
    if (
      !timeRange ||
      typeof timeRange !== "string" ||
      !timeRange.includes("-")
    ) {
      return "نطاق وقت غير صالح"; // إذا كان النطاق غير صحيح
    }

    // تقسيم النص إلى وقتين
    const [startTime, endTime] = timeRange
      .split("-")
      .map((time) => time.trim());

    // تنسيق كل وقت بشكل منفصل
    const formatTime = (time) => {
      const [timePart, period] = time.split(" "); // تقسيم الوقت إلى HH:MM و AM/PM
      const [hours, minutes] = timePart.split(":").map(Number);
      const isPM = period === "PM";
      const adjustedHours = isPM ? (hours % 12) + 12 : hours; // تحويل إلى صيغة 24 ساعة
      const arabicPeriod = isPM ? "مساءً" : "صباحًا";
      return `${adjustedHours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${arabicPeriod}`;
    };

    // تنسيق البداية والنهاية
    const startFormatted = formatTime(startTime);
    const endFormatted = formatTime(endTime);

    return `${startFormatted} - ${endFormatted}`;
  };
  if (doctorLoading || slotsLoading||onlineslotsLoading) {
    return <Loading />;
  }
 if (doctorError || slotsError || !doctor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">
         
        </p>
      </div>
    );
  } 

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      // عرض SweetAlert مع رسالة باللغة العربية و RTL
      Swal.fire({
        title: "👋 مرحباً بك!",
        html: `
                    <p style="font-size: 18px; line-height: 1.8; color: #444; text-align:  ;">
                        لتتمكن من حجز موعدك بسهولة وراحة، نرجو منك تسجيل الدخول أولاً.
                        <br />
                        لا تقلق، العملية بسيطة وسريعة جدًا!
                    </p>
                `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "تسجيل الدخول الآن",
        cancelButtonText: "لاحقًا",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        customClass: {
          popup: "swal2-rtl", // جعل المحتوى من اليمين إلى اليسار
        },
        didOpen: () => {
          document.querySelector(".swal2-container").setAttribute("dir", "rtl");
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // إذا ضغط المستخدم على "تسجيل الدخول"، يمكن توجيهه إلى صفحة تسجيل الدخول
          window.location.href = "/login";
        }
      });
    } else {
    
      setIsModalOpen(true);
    }
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-r from-blue-100 to-white py-6 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="container mx-auto py-4">
        {/* زر العودة */}
        <button
          className="mb-6 flex items-center text-white bg-mainColor hover:bg-blue-700 py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2 md:h-5 md:w-5" />
          العودة إلى قائمة الأطباء
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* معلومات الطبيب */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md mx-auto mb-4"
            />
            <h1 className="text-xl md:text-2xl font-semibold text-center mb-2">
              {doctor.name}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground text-center mb-2">
              {doctor.speciality}
            </p>
            <div className="text-center text-yellow-500 text-base md:text-lg">
              {Array.from({ length: Math.floor(doctor.rating) }, (_, index) => (
                <span key={index}>★</span>
              ))}
              {doctor.rating % 1 >= 0.5 && <span>★</span>}
              {Array.from(
                { length: 5 - Math.ceil(doctor.rating) },
                (_, index) => (
                  <span key={index} className="text-gray-300">
                    ★
                  </span>
                )
              )}
            </div>
            {/* عرض رقم الهاتف */}
            {doctor.phone && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-mainColor mb-1 text-right">
                  رقم الهاتف
                </h2>
                <p className="text-sm md:text-base text-gray-700 text-right flex items-center">
                  <Phone className="inline-block w-5 h-5 text-gray-500 ml-2" />
                  {doctor.phone}
                </p>
                  {/* عرض النبذة */}
    {doctor.about && doctor.about.overview && (
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-mainColor mb-1 text-right">
          نبذة عن الطبيب
        </h2>
        <p className="text-sm md:text-base text-gray-700 text-right">
          {doctor.about.overview}
        </p>
      </div>
    )}
                <div className="fixed bottom-8 right-8 z-50">
                  <button
                    className="flex items-center gap-2 bg-green-500 text-white py-3 px-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                     onClick={() => navigate(`/chat${doctorId ? `?doctorId=${doctorId}` : ""}`)}

                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7.828-7.828a4 4 0 115.656 0L12 9.172l-.828-.828a4 4 0 00-5.656 0zm2.12 2.12L12 13.172l.828-.828a4 4 0 005.656 0m-7.828-7.828a4 4 0 015.656 0L12 9.172l-.828-.828a4 4 0 00-5.656 0zm2.12 2.12L12 13.172l.828-.828a4 4 0 005.656 0"
                      />
                    </svg>
                    <span className="font-semibold">تواصل مع الطبيب</span>
                  </button>
                </div>
              </div>
            )}

            {/* قسم المؤهلات */}
            {doctor.about && doctor.about.qualifies && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-mainColor mb-3 text-start">
                  المؤهلات
                </h2>
                <ul className="bg-gray-100 p-3 rounded-lg text-sm md:text-base text-gray-700 list-disc list-inside">
                  {Object.entries(doctor.about.qualifies).map(
                    ([key, value]) => (
                      <li key={key}>
                        <span className="font-semibold">{value.name}</span> -{" "}
                        {value.position}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {!viewOnlineBooking && (
              <div className="mt-4">
                {doctor.clinics.length > 0 && (
                  <h2 className="text-xl font-semibold mb-3 text-mainColor text-start">
                    {doctor.clinics.length === 1 ? "عيادة" : "العيادات"}
                  </h2>
                )}

                <div className="space-y-3">
                  {doctor.clinics.map((clinic, index) => (
                    <div
                      key={index}
                      className={`p-3 cursor-pointer border-2 rounded-lg ${
                        selectedClinic?.id === clinic.id
                          ? "border-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => handleClinicSelection(clinic)}
                    >
                      <h3 className="font-semibold text-sm md:text-base mb-1">
                        {clinic.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 flex items-center">
                        <MapPin className="inline-block w-4 h-4 mr-1" />
                        {clinic.address}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 flex items-center">
                        <Phone className="inline-block w-4 h-4 mr-1" />
                        {clinic.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* التقويم والمواعيد */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-mainColor">
              <CalendarIcon className="h-5 w-5" />
              {viewOnlineBooking
                ? "المواعيد الإلكترونية"
                : doctor.clinics.length > 0
                ? "مواعيد العيادة"
                : ""}
            </h2>
            {/* أزرار التبديل */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {doctor.clinics.length > 0 && (
                <button
                  className={`py-2 px-3 text-sm md:text-base rounded-lg ${
                    !viewOnlineBooking
                      ? "bg-mainColor text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setViewOnlineBooking(false)}
                >
                  مواعيد العيادة
                </button>
              )}
              {doctor.onlineActive &&(
              <button
                className={`py-2 px-3 text-sm md:text-base rounded-lg ${
                  viewOnlineBooking
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setViewOnlineBooking(true)}
              >
                المواعيد الإلكترونية
              </button>
              )
}
            </div>
            {/* التقويم */}
            <Calendar
              value={selectedDate}
              onChange={(date) => {
                handleDateChange(date);
              }}
              tileDisabled={({ date }) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              tileClassName={tileClassName}
              locale="ar-EG"
              className="mb-4"
            />
            {/* عرض اليوم */}
            <div className="mb-4 text-center relative">
              {(() => {
                if (!selectedClinic && !viewOnlineBooking) {
                  // إذا لم يتم اختيار عيادة ولم يكن عرض المواعيد الإلكترونية
                  return (
                    <h3 className="text-sm md:text-lg font-semibold text-blue-900">
                      {selectedDate.toLocaleDateString("ar-EG", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                  );
                }

                const dayLabel = selectedDate.toLocaleDateString("ar-EG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <h3 className="text-sm md:text-lg font-semibold text-blue-900">
                    {viewOnlineBooking
                      ? `المواعيد الإلكترونية ليوم: ${dayLabel}`
                      : `المواعيد المتاحة في العيادة ليوم: ${dayLabel}`}
                  </h3>
                );
              })()}
            </div>

            {/* الأوقات المتاحة */}
            <div className="space-y-4">
              {(() => {
                const availableTimeSlots = viewOnlineBooking
                  ? getOnlineTimeSlots()
                  : getClinicTimeSlots();

                if (availableTimeSlots.length > 0) {
                  return (
                    <>
                      <h3 className="text-lg font-semibold text-blue-900">
                        {viewOnlineBooking
                          ? "المواعيد الإلكترونية"
                          : "الأوقات المتاحة"}
                      </h3>
                      <div className="max-h-60 overflow-y-auto space-y-3 px-2 border border-gray-300 rounded-md">
                        {availableTimeSlots.map((slot, index) => (
                          <button
                            key={index}
                            className={`w-full py-3 px-6 text-center rounded-md border transition-all duration-200 ${
                              slot.isBooked
                                ? "bg-red-200 text-red-800 cursor-not-allowed shadow-md"
                                : selectedTimeSlot === slot.time
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-gray-50 text-gray-800 hover:bg-blue-100 hover:text-blue-600"
                            }`}
                            onClick={() =>
                              !slot.isBooked &&
                              handleTimeSlotSelection(slot.time)
                            }
                            disabled={slot.isBooked}
                          >
                            {formatTimeRangeToArabic(slot.time)}{" "}
                            {slot.isBooked && (
                              <span className="ml-2 text-sm">(محجوز)</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  );
                } else {
                  return (
                    <div className="text-center bg-yellow-100 text-yellow-800 py-4 px-6 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">
                        {viewOnlineBooking
                          ? "لا توجد مواعيد إلكترونية متاحة"
                          : "لا توجد مواعيد متاحة"}
                      </h3>
                      {!viewOnlineBooking && (
                        <p className="text-sm">
                          اختر عيادة من القائمة تحت 
                           <br />
                           "المواعيد باللون الاخضر عزيزي" لإظهار المواعيد
                        </p>
                      )}
                    </div>
                  );
                }
              })()}
            </div>

            {/* زر الحجز الآن */}
            {selectedTimeSlot && (
              <div className="mt-4 text-center">
                <button
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                  onClick={handleBookingClick}
                >
                  احجز الآن
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* موديل التأكيد */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-blue-900">
              تأكيد الحجز
            </h3>
            <p className="text-gray-600 mb-4">
              هل أنت متأكد من حجز الموعد التالي؟
            </p>
            <p className="text-gray-800 font-semibold mb-4">
              {selectedTimeSlot}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </button>
            <button
    className={`py-2 px-6 rounded-lg transition ${
      selectedTimeSlot
        ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
    onClick={viewOnlineBooking ? handleOnlineBookingConfirmation : handleClinicBookingConfirmation}
    disabled={!selectedTimeSlot} // تعطيل الزر إذا لم يتم اختيار وقت
  >
    احجز الآن
  </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorPage;
