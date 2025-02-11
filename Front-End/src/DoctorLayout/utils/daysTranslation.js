// خريطة ترجمة أيام الأسبوع
const daysTranslation = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

// تنسيق الوقت إلى نظام 12 ساعة
const formatTimeTo12Hour = (time) => {
  const [hours, minutes] = time.split(":");
  const hour12 = ((+hours + 11) % 12) + 1; // تحويل الساعة إلى نظام 12 ساعة
  const period = +hours >= 12 ? "م" : "ص"; // تحديد الفترة: صباحًا أو مساءً
  return `${hour12}:${minutes} ${period}`;
};

// دالة لإنشاء fullSchedule
export const generateFullSchedule = (schedule) => {
  if (!Array.isArray(schedule)) {
    console.error("Invalid schedule data:", schedule);
    return [];
  }

  return schedule.map((day) => ({
    id: day.id || null, // تأكد من وجود ID
    day: daysTranslation[day.day] || day.day, // ترجمة اليوم
    start: formatTimeTo12Hour(day.start_time), // تنسيق وقت البداية
    end: formatTimeTo12Hour(day.end_time), // تنسيق وقت النهاية
    available: day.available === 1, // إذا كان اليوم متاحًا
  }));
};

// دالة لإنشاء workDays
export const generateWorkDays = (schedule) => {
  if (!Array.isArray(schedule)) {
    console.error("Invalid schedule data:", schedule);
    return "غير متوفر";
  }

  return schedule
    .filter((day) => day.available === 1) // اختيار الأيام المتاحة فقط
    .map(
      (day) =>
        `${daysTranslation[day.day]} (${formatTimeTo12Hour(day.start_time)} - ${formatTimeTo12Hour(
          day.end_time
        )})`
    )
    .join(", "); // دمج الأيام بفاصل ", "
};
