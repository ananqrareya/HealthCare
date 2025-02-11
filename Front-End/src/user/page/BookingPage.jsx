import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import useFetchClinicById from "../hooks/useFetchClinicById";
import useFetchBookedClinicSlots from "../hooks/useFetchBookedClinicSlots";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import { postClinicAppointment } from "../hooks/postClinicAppointment";

const dayMap = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

function BookingPage() {
  const { clinicId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSlots, setShowSlots] = useState(false); // حالة للتحكم في الإظهار/الإخفاء

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const {
    clinic,
    loading: getClinicLoading,
    error: getClinicError,
  } = useFetchClinicById(clinicId);
 console.log("clinic",clinic);
  const {
    bookedSlots,
    loading: slotsLoading,
    error: slotsError,
  } = useFetchBookedClinicSlots(clinicId);

  if (getClinicLoading || slotsLoading) {
    return <Loading />;
  }
  console.log("bookedSlots", bookedSlots);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate || !selectedTimeSlot) {
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "❌ يرجى اختيار تاريخ ووقت قبل تأكيد الحجز",
                confirmButtonText: "حسناً",
            });
            return;
        }

        const appointmentData = {
            date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
            time: selectedTimeSlot.split("-")[0], // وقت البداية فقط
            doctor_id: clinic.doctorId, // معرّف العيادة
        };

        try {
            // إرسال البيانات للخادم باستخدام `postClinicAppointment`
            const response = await postClinicAppointment(clinicId, appointmentData);

            // تنسيق التاريخ والوقت
            const formattedDate = selectedDate.toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            const startTime = selectedTimeSlot.split("-")[0];

            // عرض إشعار النجاح باستخدام SweetAlert2
            Swal.fire({
                icon: "success",
                title: "تم تأكيد الحجز",
                html: `
                <p>✅ تم تأكيد الحجز يوم <strong>${formattedDate}</strong></p>
                <p>في الساعة <strong>${startTime}</strong>.</p>
            `,
                confirmButtonText: "حسناً",
            });

            // عرض البيانات في وحدة التحكم (اختياري)
            console.log("تم إنشاء الحجز بنجاح:", response);
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
        });
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
              });
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
              });

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
    };



  const generateTimeSlots = (workingDay, interval, bookedTimes = []) => {
    const slots = [];
    const [startHour, startMinute] = workingDay.start_time
      .split(":")
      .map(Number);
    const [endHour, endMinute] = workingDay.end_time.split(":").map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    const normalizedBookedTimes = bookedTimes.map(normalizeTime); // تطبيع الأوقات المحجوزة

    while (current < end) {
      const next = new Date(current.getTime() + interval * 60000);
      const startTime = current.toTimeString().slice(0, 5); // وقت البداية
      const endTime = next.toTimeString().slice(0, 5); // وقت النهاية

      const isBooked = normalizedBookedTimes.includes(startTime); // التحقق من الحجز
      slots.push({ start: startTime, end: endTime, isBooked });

      current = next;
    }
    return slots;
  };

  const normalizeTime = (time) => {
    const [timePart, period] = time.split(" "); // تقسيم الوقت إلى HH:MM و AM/PM
    const [hours, minutes] = timePart.split(":").map(Number);
    const isPM = period === "PM" || period === "مساءً"; // دعم الصيغتين الإنجليزية والعربية
    const adjustedHours = isPM ? (hours % 12) + 12 : hours; // تحويل إلى صيغة 24 ساعة
    return `${adjustedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const getAvailableTimeSlots = () => {
    if (!clinic || !clinic.workingHours) return [];
    const dayOfWeek =
      dayMap[selectedDate.toLocaleDateString("en-US", { weekday: "long" })];
    const workingDay = clinic.workingHours.find((wh) => wh.day === dayOfWeek);

    if (!workingDay) return [];

    const dateKey = selectedDate.toISOString().split("T")[0];
    const bookedTimes = (bookedSlots[dateKey] || []).map(normalizeTime); // الأوقات المحجوزة

    return generateTimeSlots(
      workingDay,
      clinic.appointment_time || 15,
      bookedTimes
    );
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const isAM = hour < 12;
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${
      isAM ? "صباحًا" : "مساءً"
    }`;
  };

  const tileClassName = ({ date }) => {
    if (!clinic || !clinic.workingHours) return "";
    const dayOfWeek =
      dayMap[date.toLocaleDateString("en-US", { weekday: "long" })];
    const isAvailable = clinic.workingHours.some((wh) => wh.day === dayOfWeek);
      const isSelectedDate =
          selectedDate && date.toDateString() === selectedDate.toDateString();
      if (isSelectedDate) {
          return isAvailable
              ? "bg-blue-500 text-white font-bold rounded-full" // التاريخ المختار المتاح
              : "bg-red-500 text-white font-bold rounded-full"; // التاريخ المختار غير المتاح
      }
    return isAvailable ? "bg-green-100 text-green-900" : "text-gray-400";
  };

  if (slotsError || getClinicError || !clinic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">
          عذرًا، حدث خطأ أثناء تحميل البيانات.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          حجز موعد
        </h1>

        <ul className="list-none text-right mb-6 space-y-4">
          <li className="text-lg">
            <span className="font-semibold text-gray-800">اسم العيادة:</span>{" "}
            {clinic.name}
          </li>
          <li className="text-lg">
            <span className="font-semibold text-gray-800">العنوان:</span>{" "}
            {clinic.address}
          </li>
          <li className="text-lg">
            <span className="font-semibold text-gray-800">رقم الهاتف:</span>{" "}
            {clinic.phone}
          </li>
        </ul>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-500" />
            اختر التاريخ
          </h2>
                  <Calendar
                      value={selectedDate}
                      onChange={handleDateChange}
                      tileDisabled={({ date }) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today; // تعطيل التواريخ السابقة
                      }}
                      tileClassName={tileClassName}
                      locale="ar-EG"
                      className="mb-4"
                  />


        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            الأوقات المتاحة
          </h2>
          <button
            onClick={() => setShowSlots((prev) => !prev)} // تحديث حالة العرض
            className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {showSlots ? "إخفاء الأوقات" : "إظهار الأوقات"}
          </button>
          {showSlots && ( // عرض الأوقات فقط إذا كانت الحالة مفعّلة
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getAvailableTimeSlots().length > 0 ? (
                getAvailableTimeSlots().map((slot, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      !slot.isBooked &&
                      handleTimeSlotSelection(`${slot.start}-${slot.end}`)
                    }
                    className={`py-3 px-4 rounded-lg font-medium border text-center transition ${
                      slot.isBooked
                        ? "bg-red-200 text-red-800 border-red-500 cursor-not-allowed"
                        : selectedTimeSlot === `${slot.start}-${slot.end}`
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-50 hover:bg-blue-100 hover:text-blue-900 border-gray-300"
                    }`}
                    disabled={slot.isBooked}
                  >
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                    {slot.isBooked && (
                      <span className="block text-sm text-red-600">محجوز</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  لا توجد أوقات متاحة لهذا التاريخ.
                </p>
              )}
            </div>
          )}
        </div>

              <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                  تأكيد الحجز
              </button>
      </div>
    </div>
  );
}

export default BookingPage;
