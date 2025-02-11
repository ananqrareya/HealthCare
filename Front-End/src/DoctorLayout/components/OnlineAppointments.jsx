import React, { useContext, useEffect, useState } from 'react';
import { Video, Calendar, Clock, Search } from 'lucide-react';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import { availableDay } from '../utils/activeOnlineTime';
import WorkHoursModal from './WorkHoursModal';
import { handleSaveSchedule } from '../utils/updateScheduleUtils';
import useUpdateOnlineSchedule from '../hooks/useUpdateOnlineSchedule';
import Loading from '../../Loading';
import Swal from 'sweetalert2';
import useCancelMissedAppointments from '../hooks/useCancelMissedAppointments';
import { convertStatus, formatDateWithDay, formatTimeTo12Hour } from '../utils/formatDateAndTime';
import Loader from './Loader';
import useCancelAppointments from '../hooks/useCancelAppointments';
import { useNavigate } from 'react-router-dom';

export default function OnlineAppointments() {
  const { preferences, onlineSchedule, loading, onlineAppointment, fetchonlineAppointment } = useContext(DoctorLayoutContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const { updateOnlineSchedule, loading: updatedScheduleLoading } = useUpdateOnlineSchedule();
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [localOnlineSchedule, setLocalOnlineSchedule] = useState(onlineSchedule);
  const [localAppointments, setLocalAppointments] = useState(onlineAppointment);
  const navigate = useNavigate();
  const { cancelMissedAppointment, loading: cancelMissedAppointmentLoading } = useCancelMissedAppointments();
  const { cancelAppointment, loading: cancelAppointmentLoading } = useCancelAppointments();

  useEffect(() => {
    setLocalOnlineSchedule(onlineSchedule);
  }, [onlineSchedule]);


  useEffect(() => {
    setLocalAppointments(onlineAppointment);
  }, [onlineAppointment]);

  const [filter, setFilter] = useState('اليوم');






  const filteredAppointments = localAppointments.filter((appointment) => {
    const today = new Date(); // تاريخ اليوم
    const appointmentDate = new Date(appointment.date); // تاريخ الموعد

    // تصفية المواعيد التي لم تنته بعد
    if (appointmentDate < today.setHours(0, 0, 0, 0)) {
      return false; // الموعد انتهى، لا تعرضه
    }

    // تصفية بناءً على الفلتر (اليوم أو الأيام الأخرى)
    if (filter === 'اليوم') {
      // تصفية المواعيد التي حالتها "اليوم"
      return appointment.status === 'pending' && appointment.relativeDate === 'اليوم';
    }

    if (filter === 'الأيام الأخرى') {
      // تصفية المواعيد التي حالتها ليست "اليوم"
      return appointment.status === 'pending' && appointment.relativeDate !== 'اليوم';
    }

    return false;
  });
  function handleSessionStart(appointment) {
    const now = new Date(); // الوقت الحالي
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`); // تاريخ ووقت الموعد

    if (now < appointmentTime) {
      // إذا كان الوقت الحالي أقل من وقت الموعد
      Swal.fire({
        icon: 'info',
        title: 'لا يمكنك البدء الآن',
        text: `يمكنك بدء الجلسة عند حلول موعد الحجز: ${formatTimeTo12Hour(appointment.time)}`,
        confirmButtonText: 'حسنًا',
      });
      return;
    }

    // إذا كان الوقت الحالي مناسبًا، يمكن بدء الجلسة
    Swal.fire({
      icon: 'success',
      title: 'الجلسة جاهزة',
      text: 'يمكنك بدء الجلسة الآن!',
      confirmButtonText: 'ابدأ الآن',
    }).then(() => {
      navigate('/video');
      // قم بإضافة أي إجراء لبدء الجلسة هنا
    });
    // يمكنك تنفيذ أي إجراء لبدء الجلسة هنا
  }

  async function handleConfirmCancellation(reason, appointment) {
    if (reason === "عدم حضور المريض") {
      const result = await Swal.fire({
        icon: "warning",
        title: "تأكيد الإلغاء",
        text: `هل أنت متأكد من إلغاء هذا الموعد بسبب ${reason}؟`,
        showCancelButton: true,
        confirmButtonText: "نعم، إلغاء",
        cancelButtonText: "تراجع",
      });
      if (result.isConfirmed) {
        await cancelMissedAppointment(appointment.id);
        setLocalAppointments((prevAppointments) =>
          prevAppointments.filter((appt) => appt.id !== appointment.id)
        );

        setShowCancelModal(null);
      }
    } else {
      const result = await Swal.fire({
        icon: "warning",
        title: "تأكيد الإلغاء",
        text: `هل أنت متأكد من إلغاء هذا الموعد بسبب ${reason}؟`,
        showCancelButton: true,
        confirmButtonText: "نعم، إلغاء",
        cancelButtonText: "تراجع",
      });
      if (result.isConfirmed) {
        await cancelAppointment(appointment.id);
        setLocalAppointments((prevAppointments) =>
          prevAppointments.filter((appt) => appt.id !== appointment.id)
        );

        setShowCancelModal(null);
      }
    }
  }





  const handleSave = async (updatedSchedule) => {
    console.log("update", updatedSchedule);
    await handleSaveSchedule(updatedSchedule, 0, updateOnlineSchedule, setModalOpen);
    setLocalOnlineSchedule((prevSchedule) => {
      const updatedDays = updatedSchedule.map(day => day.day);

      return prevSchedule.map(day =>
        updatedDays.includes(day.day)
          ? updatedSchedule.find(updatedDay => updatedDay.day === day.day) // تحديث اليوم المعدل
          : day // إبقاء اليوم كما هو
      );
    });
  }

  if (loading || updatedScheduleLoading) {
    return (
      <Loader />
    )
  }


  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center md:text-left">
          المواعيد الإلكترونية
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Online Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center  ">
              المواعيد القادمة
            </h2>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <button
                onClick={() => setFilter('اليوم')}
                className={`px-4 py-2 rounded-lg w-full md:w-auto ${filter === 'اليوم'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
                  } hover:bg-indigo-700 dark:hover:bg-indigo-800`}
              >
                اليوم
              </button>
              <button
                onClick={() => setFilter('الأيام الأخرى')}
                className={`px-4 py-2 rounded-lg w-full md:w-auto ${filter === 'الأيام الأخرى'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
                  } hover:bg-indigo-700 dark:hover:bg-indigo-800`}
              >
                الأيام الأخرى
              </button>
            </div>
            <>
              {filteredAppointments.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto space-y-4 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-300 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/20 gap-4"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                          <Video className="text-indigo-600 dark:text-indigo-300" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {appointment.patient}
                          </h4>
                          <div className="flex flex-col items-start mt-2 space-y-1">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {formatTimeTo12Hour(appointment.time)}
                            </p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {formatDateWithDay(appointment.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        {/* الحالة */}
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${appointment.relativeDate === 'اليوم'
                            ? 'bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-200'
                            : appointment.relativeDate === 'لاحقاً'
                              ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200'
                              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-200'
                            }`}
                        >
                          {convertStatus(appointment)}
                        </span>

                        {/* زر بدء الجلسة */}
                        {appointment.relativeDate === 'اليوم' && (
                          <button
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95 w-full md:w-auto"
                            onClick={() => handleSessionStart(appointment)}
                          >
                            <span className="font-medium text-lg">بدء الجلسة</span>
                            <Video className="w-6 h-6 text-white" />
                          </button>
                        )}

                        {/* زر إلغاء الحجز */}
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 w-full md:w-auto"
                          onClick={() => setShowCancelModal(appointment)}
                        >
                          إلغاء الحجز
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                //  إظهار هذه الرسالة فقط إذا كانت هناك عيادة مختارة ولكن لا توجد مواعيد


                <p className="text-center text-gray-500 dark:text-gray-400">
                  لا توجد مواعيد متاحة بناءً على الفلتر المحدد.
                </p>
              )}
            </>

          </div>
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
                {preferences.onlinePrice === 0
                  ? 'يرجى اختيار سبب إلغاء الحجز، إذا كان المريض لم يحضر، يمكنك تحديد الخيار المناسب أدناه.'
                  : 'يرجى اختيار   الإلغاء من الخيارات أدناه.'}
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
                {preferences.onlinePrice === 0 &&
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







        {/* Online Consultation Hours */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ساعات الاستشارة عن بعد
            </h2>
            <div className="space-y-4">
              {availableDay(localOnlineSchedule).map((schedule, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-white">{schedule.day}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{schedule.hours}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setModalOpen(true)} className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
              تعديل المواعيد
            </button>
          </div>
        </div>
      </div>
      <WorkHoursModal
        clinicName={""}
        schedule={localOnlineSchedule} // جدول العمل الحالي للعيادة
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(updatedSchedule) => handleSave(updatedSchedule)}

      />
    </div>
  );

}