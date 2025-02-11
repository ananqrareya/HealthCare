// خريطة الأيام إلى اللغة العربية
const dayMap = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

/**
 * دالة لتحويل الوقت من نظام 24 ساعة إلى 12 ساعة
 * @param {string} time - الوقت بصيغة HH:mm:ss
 * @returns {string} الوقت بصيغة 12 ساعة (صباحاً/مساءً)
 */
export const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "مساءً" : "صباحاً";
  const adjustedHours = hours % 12 || 12; // تحويل 0 إلى 12
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();  
}
/**
 * دالة لتحويل جدول المواعيد إلى صيغة مجمعة باللغة العربية
 * @param {Array} schedule - بيانات الجدول من API
 * @returns {Array} جدول زمني باللغة العربية
 */
export const formatScheduleArabic = (schedule) => {


 

  // تنسيق الجدول الزمني بحيث يعرض كل يوم مع توقيته
  return schedule.map(({ day, start_time, end_time }) => {
    const startFormatted = convertTo12HourFormat(start_time);
    const endFormatted = convertTo12HourFormat(end_time);
    return `${dayMap[day]}: ${startFormatted} - ${endFormatted}`; // عرض اليوم مع توقيت البداية والنهاية
  });
};
