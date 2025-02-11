  export function formatTimeTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);

    const period = hourInt >= 12 ? "م" : "ص"; // م = PM، ص = AM
    const formattedHour = hourInt % 12 || 12; // إذا كانت الساعة 0 أو 12، تُعرض كـ 12
    return `${formattedHour}:${minute} ${period}`;
  }

  const monthNamesArabic = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export function formatMonthToArabic(dateString) {
  const monthNumber = parseInt(dateString.split('-')[1], 10); // استخراج رقم الشهر
  return monthNamesArabic[monthNumber - 1]; // جلب اسم الشهر بناءً على الرقم
}
  export function formatDateWithDay(date) {
    const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ];

    const parsedDate = new Date(date);
    const dayName = daysOfWeek[parsedDate.getDay()];
    const day = parsedDate.getDate();
    const month = months[parsedDate.getMonth()];

    return `${dayName}, ${day} ${month}`;
  }
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();  
}

export function convertStatus(appointment) {
  const now = new Date();
  const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);

  // ✅ إذا بدأ الموعد، قم بتغيير الحالة إلى "قيد المعالجة"
  if (now >= appointmentTime) {
    return "قيد المعالجة";
  }

  switch (appointment.relativeDate) {
    case "اليوم":
      return "في الإنتظار";
    case "غداً":
      return "في الغد";
    case "لاحقاً":
      return "في يوماً قريب";
    default:
      return appointment.relativeDate;
  }
}
