import React, { useContext, useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, Search, Plus, Loader2, Filter, Calendar, Video } from 'lucide-react';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import axios from 'axios';
import Loading from '../../Loading';
import useClinicAppointments from '../hooks/useClinicAppointments';
import { convertStatus, formatDateWithDay, formatTimeTo12Hour } from '../utils/formatDateAndTime';
import Loader from './Loader';
import useCancelAppointments from '../hooks/useCancelAppointments';
import useCancelMissedAppointments from '../hooks/useCancelMissedAppointments';
import Swal from 'sweetalert2';
import CompleteBooking from './CompleteBooking/CompleteBooking';
//import CompleteBooking from './CompleteBooking/CompleteBooking';

export default function Appointments() {
  const { clinics, personalInfo } = useContext(DoctorLayoutContext);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // ✅ فلتر المواعيد (all, today, upcoming)
  const [twentyFourHoursAgoAppointments, setTwentyFourHoursAgoAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { cancelMissedAppointment, loading: cancelMissedAppointmentLoading } = useCancelMissedAppointments();
  const { cancelAppointment, loading: cancelAppointmentLoading } = useCancelAppointments();

  const { clinicAppointments, loading: clinicAppointmentsLoading } = useClinicAppointments();

  useEffect(() => {
    if (!selectedClinic) return;

    const fetchAppointments = async () => {
      setAppointments([]);

      try {
        const { allAppointments, recentAppointments } = await clinicAppointments(selectedClinic.id);

        setAppointments(allAppointments);
        setTwentyFourHoursAgoAppointments(recentAppointments);

      } catch (error) {
        console.error("❌ خطأ أثناء جلب المواعيد:", error);
      }
    };

    fetchAppointments();
  }, [selectedClinic]);

  console.log("📅 جميع المواعيد:", appointments);
  console.log("🕒 المواعيد خلال آخر 24 ساعة:", twentyFourHoursAgoAppointments);


  /*
   <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن موعد..."
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
          </div>
        </div>*/
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date); // تحويل `date` إلى `Date`
    appointmentDate.setHours(0, 0, 0, 0); // ✅ تصفير الوقت لتجنب الفروقات

    const today = new Date();
    today.setHours(0, 0, 0, 0); // ✅ تصفير الوقت لليوم الحالي

    if (filter === "today") {
      return appointmentDate.getTime() === today.getTime(); // ✅ مقارنة التاريخ فقط
    } else if (filter === "upcoming") {
      return appointmentDate.getTime() > today.getTime(); // ✅ مواعيد المستقبل فقط
    } else if (filter === "last24Hours") {
      return twentyFourHoursAgoAppointments.some(
        (recent) => recent.id === appointment.id
      ); // ✅ مقارنة آخر 24 ساعة
    }

    return true; // ✅ جميع المواعيد
  })
    .filter((appointment) =>
      appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );



  // استدعاء البيانات عند اختيار العيادة
  const fetchAppointments = async () => {
    if (!selectedClinic) return;
    setAppointments([]); // إعادة التهيئة لتجنب عرض بيانات قديمة

    try {
      const { allAppointments, recentAppointments } = await clinicAppointments(selectedClinic.id);
      setAppointments(allAppointments); // تحديث جميع المواعيد
      setTwentyFourHoursAgoAppointments(recentAppointments); // تحديث المواعيد خلال آخر 24 ساعة
    } catch (error) {
      console.error("❌ خطأ أثناء جلب المواعيد:", error);
    }
  };

  // استدعاء الدالة عند تغيير العيادة
  useEffect(() => {
    fetchAppointments();
  }, [selectedClinic]);

  // إلغاء الموعد مع التحديث
  async function handleConfirmCancellation(reason, appointment) {
    console.log("cancel", reason, appointment);

    const result = await Swal.fire({
      icon: "warning",
      title: "تأكيد الإلغاء",
      text: `هل أنت متأكد من إلغاء هذا الموعد بسبب ${reason}؟`,
      showCancelButton: true,
      confirmButtonText: "نعم، إلغاء",
      cancelButtonText: "تراجع",
    });

    if (result.isConfirmed) {
      try {
        if (reason === "عدم حضور المريض") {
          await cancelMissedAppointment(appointment.id);
        } else {
          await cancelAppointment(appointment.id);
        }


        const { allAppointments, recentAppointments } = await clinicAppointments(selectedClinic.id);
        setAppointments(allAppointments); // تحديث جميع المواعيد
        setTwentyFourHoursAgoAppointments(recentAppointments); // تحديث المواعيد خلال آخر 24 ساعة


        // إغلاق نافذة التأكيد
        setShowCancelModal(null);

        Swal.fire({
          icon: "success",
          title: "تم الإلغاء",
          text: "تم إلغاء الموعد بنجاح!",
        });
      } catch (error) {
        console.error("❌ خطأ أثناء إلغاء الموعد:", error);
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء إلغاء الموعد. يرجى المحاولة مرة أخرى.",
        });
      }
    }
  }



  return (
    <div className="space-y-6 bg-white-50 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          إدارة المواعيد
        </h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 space-x-reverse">
          <Plus size={20} />
          <span>موعد جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1 rounded-xl shadow-sm p-4">
          <div className="text-center p-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <CalendarIcon className="mx-auto mb-2 text-gray-600 dark:text-gray-300" size={24} />
              <p className="text-gray-600 dark:text-gray-300">العيادات</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              المواعيد المتاحة
            </h3>
            {clinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`w-full text-right px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 ${selectedClinic?.id === clinic.id ? "bg-indigo-100 dark:bg-indigo-800" : ""
                  }`}
              >
                {clinic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-3 rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800">
          {selectedAppointment ? (
            <CompleteBooking appointment={selectedAppointment} clinic={selectedClinic} personalInfo={personalInfo} onClose={() => {
              setSelectedAppointment(null); // إغلاق المكون
              fetchAppointments(); // إعادة تحميل البيانات بعد الإغلاق
            }} />
          ) : selectedClinic === null ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                الرجاء اختيار عيادة لعرض المواعيد
              </p>
            </div>
          ) : (
            <>
              {/* ✅ البحث عن المواعيد */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 البحث عن موعد..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
                </div>
              </div>

              {/* ✅ أزرار الفلترة */}
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2 space-x-reverse">
                  <div className="flex flex-wrap gap-3">
                    <button
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${filter === "all"
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
                        }`}
                      onClick={() => setFilter("all")}
                    >
                      جميع المواعيد
                    </button>

                    <button
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${filter === "today"
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
                        }`}
                      onClick={() => setFilter("today")}
                    >
                      مواعيد اليوم
                    </button>

                    <button
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${filter === "upcoming"
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
                        }`}
                      onClick={() => setFilter("upcoming")}
                    >
                      المواعيد القادمة
                    </button>

                    <button
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${filter === "last24Hours"
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white"
                        }`}
                      onClick={() => setFilter("last24Hours")}
                    >
                      آخر 24 ساعة
                    </button>
                  </div>


                </div>
              </div>

              {/* ✅ عرض اللودينج فقط عند اختيار عيادة */}
              {clinicAppointmentsLoading ? (
                <Loader />
              ) : filteredAppointments.length > 0 ? (
                // ✅ عرض المواعيد إذا كانت موجودة
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="grid grid-cols-1 md:grid-cols-3 items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-100 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/20 transition-all duration-200 w-full gap-4"
                    >
                      {/* ✅ أيقونة الموعد + معلومات المريض */}
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                          <Clock className="text-indigo-600 dark:text-indigo-300" size={24} />
                        </div>
                        <div className="text-right md:text-center">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{appointment.patient.name}</h4>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {formatTimeTo12Hour(appointment.time)}
                          </p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {formatDateWithDay(appointment.date)}
                          </p>
                        </div>
                      </div>

                      {/* ✅ حالة الموعد */}
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${convertStatus(appointment) === "قيد المعالجة"
                            ? "bg-orange-50 text-orange-600 dark:bg-orange-800 dark:text-orange-200"
                            : appointment.relativeDate === "اليوم"
                              ? "bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-200"
                              : appointment.relativeDate === "لاحقاً"
                                ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200"
                                : "bg-indigo-50 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-200"
                            }`}
                        >
                          {convertStatus(appointment)}
                        </span>
                      </div>

                      {/* ✅ الأزرار */}
                      <div className="flex flex-col md:flex-row items-center justify-center md:justify-end space-y-2 md:space-y-0 space-x-0 md:space-x-4 space-x-reverse w-full">
                        {/* ✅ زر إكمال الحجز */}
                        {new Date() - new Date(`${appointment.date}T${appointment.time}`) >= 5 * 60 * 1000 && (
                          <button className="px-4 py-2 w-full md:w-auto rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200"
                            onClick={() => setSelectedAppointment(appointment)}>
                            إكمال الحجز
                          </button>
                        )}

                        {/* ✅ زر الإلغاء */}
                        <button
                          className="px-4 py-2 w-full md:w-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                          onClick={() => setShowCancelModal(appointment)}
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>


                  ))}
                </div>
              ) : (
                // ✅ إظهار هذه الرسالة فقط إذا كانت هناك عيادة مختارة ولكن لا توجد مواعيد
                selectedClinic && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    لا توجد مواعيد متاحة بناءً على الفلتر المحدد.
                  </p>
                )
              )}
            </>
          )}
        </div>

        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            {/* صندوق المودال */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[420px] animate-fade-in scale-95 transition-transform duration-200 ease-out">

              {/* رأس المودال */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">إلغاء الحجز</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  onClick={() => setShowCancelModal(null)}
                >
                  ✕
                </button>
              </div>

              {/* نص التوضيح */}
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">

                يرجى اختيار سبب إلغاء الحجز، إذا كان المريض لم يحضر، يمكنك تحديد الخيار المناسب أدناه.
              </p>


              {/* خيارات الإلغاء */}
              <div className="space-y-4">
                {/* زر إلغاء عادي */}
                <button
                  className="w-full flex items-center justify-center space-x-3 bg-gray-100 text-gray-900 px-5 py-3 rounded-lg shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-200"
                  onClick={() => handleConfirmCancellation("إلغاء عادي", showCancelModal)}
                >
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-white" />
                  <span className="font-medium">إلغاء عادي</span>
                </button>
                {
                  new Date() > new Date(`${showCancelModal.date}T${showCancelModal.time}`) &&
                  new Date() - new Date(`${showCancelModal.date}T${showCancelModal.time}`) >= 5 * 60 * 1000 && (
                    <button
                      className="w-full flex items-center justify-center space-x-3 bg-red-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-200"
                      onClick={() => handleConfirmCancellation("عدم حضور المريض", showCancelModal)}
                    >
                      <Video className="w-6 h-6 text-white" />
                      <span className="font-medium text-lg">إلغاء بسبب عدم حضور المريض</span>
                    </button>
                  )}



              </div>


              {/* زر التراجع */}
              <button
                className="mt-6 w-full bg-gray-400 text-white px-5 py-3 rounded-lg shadow-sm hover:bg-gray-500 transition-all duration-200"
                onClick={() => setShowCancelModal(null)}
              >
                تراجع
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
