import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Video } from "lucide-react";

// دمج التاريخ والوقت
const combineDateAndTime = (date, time) => {
  const [day, month, year] = date.split('-');
  const [hours, minutes] = time.split(':');
  return new Date(year, month - 1, day, hours, minutes);
};

// تحويل التاريخ إلى يوم الأسبوع
const getDayName = (date) => {
  const [day, month, year] = date.split('-');
  const formattedDate = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(formattedDate);
};

export function BookingCard({ booking }) {
  const [canStartCall, setCanStartCall] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState(booking.status); // متابعة حالة الحجز

  useEffect(() => {
    const updateTime = () => {
      const bookingDateTime = combineDateAndTime(booking.bookingDate, booking.bookingTime);
      const now = new Date();
      const difference = bookingDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        if (status === 'confirmed' || status === 'pending') {
          setStatus('missed'); // تغيير الحالة إلى "missed"
        }
      } else if (difference > 0 && status === 'confirmed') {
        setCanStartCall(now >= bookingDateTime && status === 'confirmed');
      }

      if (difference > 0) {
        const totalSeconds = Math.floor(difference / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);

        const hours = totalHours;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        setTimeLeft(`${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`);
      } else {
        setTimeLeft('حان موعد المكالمة');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [booking, status]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      case 'missed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const handleStartCall = () => {
    if (!canStartCall) {
      alert('عذراً، لا يمكن بدء المكالمة قبل موعد الحجز');
      return;
    }
    console.log('Starting video call...');
  };

  return (
    <div className="w-full p-6 border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
            <img
              src={booking.image}
              alt={booking.doctorName}
              className="object-cover w-full h-full"
            />
          </div>
          <span className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-md ${getStatusColor(status)}`}>
            {status === 'confirmed' && <CheckCircle className="w-4 h-4" />}
            {status === 'pending' && <Clock className="w-4 h-4" />}
            {status === 'missed' && <AlertCircle className="w-4 h-4" />}
            {status === 'completed' && <CheckCircle className="w-4 h-4" />}
            <span>
              {status === 'confirmed'
                ? 'مؤكد'
                : status === 'pending'
                ? 'قيد الانتظار'
                : status === 'missed'
                ? 'فائت'
                : 'مكتمل'}
            </span>
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {booking.doctorName}
            </h3>
            <p className="text-blue-600 font-medium">{booking.specialization}</p>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>
                {`${booking.bookingDate} (${getDayName(booking.bookingDate)}) ${booking.bookingTime}`}
              </span>
            </div>
            {status !== 'completed' && status !== 'missed' && (
              <p className="text-blue-600 font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {timeLeft}
              </p>
            )}
          </div>
     {status === 'confirmed' && canStartCall && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleStartCall}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl rounded-lg text-lg font-medium transition-all"
              >
                <Video className="w-5 h-5" />
                بدء المكالمة
              </button>
            </div>
          )}
          {status === 'missed' && (
            <p className="text-red-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              تم تجاوز موعد الحجز دون الحضور
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
