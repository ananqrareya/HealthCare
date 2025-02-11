import { Calendar, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { BookingCard } from "../components/BookingHistoryCard";
import useFetchBookingPatient from "../hooks/useFetchBookingPatient";
import Loading from "../components/Loading";

export default function OnlineBookingHistory() {
  const { onlineBooking: filteredBookings ,loading} = useFetchBookingPatient(); // استخدام البيانات من السياق
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAll, setShowAll] = useState(false);
  console.log("filteredBookings", filteredBookings)
if(loading){
  return(
  <Loading/>
  );
}
  const getBookingStatus = (bookingDate, bookingTime, status) => {
    const currentDate = new Date(); // الوقت الحالي في الجهاز
    const bookingDateTime = new Date(`${bookingDate} ${bookingTime}`);

    // إضافة 30 دقيقة بعد موعد الحجز
    const missedThresholdTime = new Date(bookingDateTime.getTime() + 30 * 60000);
    console.log("missedThresholdTime", missedThresholdTime);
    // إذا كان الوقت الحالي قد تجاوز وقت الحجز ب30 دقيقة يتم تصنيفه كـ "فائت"
    if (missedThresholdTime < currentDate) {
      return "missed"; 
    }

    // باقي التصنيفات
    if (bookingDateTime > currentDate && ["confirmed", "pending"].includes(status.trim().toLowerCase())) {
      return "upcoming"; // حجز قادم
    }

    return "pending"; // حالة حجز معلقة
  };

  // تصنيف الحجوزات
  // تصنيف الحجوزات بناءً على الوقت
  const upcomingBookings = filteredBookings.filter((booking) =>
    getBookingStatus(booking.bookingDate, booking.bookingTime, booking.status) === "upcoming"
  );

  const completedBookings = filteredBookings.filter((booking) =>
    booking.status.trim().toLowerCase() === "completed"
  );

  const missedBookings = filteredBookings.filter((booking) =>
    getBookingStatus(booking.bookingDate, booking.bookingTime, booking.status) === "missed"
  );



  // التحكم بعدد الحجوزات المعروضة
  const displayedBookings = (bookings) =>
    showAll ? bookings : bookings.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" dir="rtl">
      <div className="max-w-6xl mx-auto p-6">
        {/* العنوان */}
        <div className="flex items-center justify-between mb-8 bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-blue-200">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">حجوزاتي</h1>
            <p className="text-gray-600 text-lg">إدارة مواعيدك الطبية بسهولة وكفاءة</p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-blue-700 bg-blue-100 px-4 py-2 rounded-xl shadow-sm">
            <Calendar className="w-5 h-5" />
            <span className="font-medium text-lg">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* التبويبات */}
        <div className="w-full">
 <div className="w-full flex flex-col sm:flex-row items-center justify-center mb-6 gap-3 sm:gap-4 bg-white/70 backdrop-blur-lg rounded-lg p-4 shadow-md border border-blue-200">
  {/* زر الحجوزات القادمة */}
  <button
    className={`relative group w-full sm:w-auto text-sm sm:text-base rounded-lg transition-all duration-300 px-4 py-2 font-medium ${
      activeTab === "upcoming"
        ? "bg-blue-700 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    onClick={() => setActiveTab("upcoming")}
  >
    <div className="flex items-center gap-2 justify-center">
      <Clock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      <span>الحجوزات القادمة</span>
      {upcomingBookings.length > 0 && (
        <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
          {upcomingBookings.length}
        </span>
      )}
    </div>
    {activeTab === "upcoming" && (
      <span className="absolute inset-0 rounded-lg border border-blue-500 animate-pulse" />
    )}
  </button>

  {/* زر الحجوزات المكتملة */}
  <button
    className={`relative group w-full sm:w-auto text-sm sm:text-base rounded-lg transition-all duration-300 px-4 py-2 font-medium ${
      activeTab === "completed"
        ? "bg-blue-700 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    onClick={() => setActiveTab("completed")}
  >
    <div className="flex items-center gap-2 justify-center">
      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      <span>الحجوزات المكتملة</span>
      {completedBookings.length > 0 && (
        <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
          {completedBookings.length}
        </span>
      )}
    </div>
    {activeTab === "completed" && (
      <span className="absolute inset-0 rounded-lg border border-blue-500 animate-pulse" />
    )}
  </button>
  {/* زر الحجوزات الفائتة */}
<button
  className={`relative group w-full sm:w-auto text-sm sm:text-base rounded-lg transition-all duration-300 px-4 py-2 font-medium ${
    activeTab === "missed"
      ? "bg-blue-700 text-white shadow-md"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
  }`}
  onClick={() => setActiveTab("missed")}
>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>الحجوزات الفائتة</span>
                {missedBookings.length > 0 && (
                  <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
                    {missedBookings.length}
                  </span>
                )}
              </div>
              {activeTab === "missed" && (
                <span className="absolute inset-0 rounded-lg border border-blue-500 animate-pulse" />
              )}
</button>
</div>


          {/* محتوى الحجوزات */}
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {activeTab === "upcoming" && (
              upcomingBookings.length > 0 ? (
                displayedBookings(upcomingBookings).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-md border border-blue-200">
                  <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-900 text-xl font-semibold mb-2">
                    لا توجد حجوزات قادمة
                  </p>
                  <p className="text-gray-600">
                    عندما تقوم بحجز موعد جديد، سيظهر هنا
                  </p>
                </div>
              )
            )}

            {activeTab === "completed" && (
              completedBookings.length > 0 ? (
                displayedBookings(completedBookings).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-md border border-blue-200">
                  <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-900 text-xl font-semibold mb-2">
                    لا توجد حجوزات مكتملة
                  </p>
                  <p className="text-gray-600">ستظهر هنا سجل زياراتك السابقة</p>
                </div>
              )
            )}

            {activeTab === "missed" && (
              missedBookings.length > 0 ? (
                displayedBookings(missedBookings).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-md border border-blue-200">
                  <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-900 text-xl font-semibold mb-2">
                    لا توجد حجوزات فائتة
                  </p>
                  <p className="text-gray-600">عندما تفوت موعدًا، سيظهر هنا</p>
                </div>
              )
            )}
          </div>
          {/* زر عرض المزيد */}
    <div className="text-center mt-6">
  <button
    onClick={() => setShowAll(!showAll)}
    className={`relative text-lg font-bold text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 
      ${
        showAll
          ? "bg-red-600 hover:bg-red-700"
          : "bg-blue-700 hover:bg-blue-800"
      } group`}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-30 rounded-full transition-opacity duration-300"></span>
    <span className="relative">
      {showAll ? "عرض أقل" : "عرض المزيد"}
    </span>
  </button>
</div>

        </div>
      </div>
    </div>
  );
}
