// scheduleUtils.js

// خريطة الأيام بين العربية والإنجليزية
const dayMapping = {
  "الأحد": "Sunday",
  "الإثنين": "Monday",
  "الثلاثاء": "Tuesday",
  "الأربعاء": "Wednesday",
  "الخميس": "Thursday",
  "الجمعة": "Friday",
  "السبت": "Saturday",
};

/**
 * تحويل الجدول إلى صيغة محددة
 * @param {Array} updatedSchedule - جدول المواعيد المحدث
 * @returns {Array} الجدول المحول
 */
export const convertSchedule = (updatedSchedule) => {
  return updatedSchedule.map((item) => ({
    id: item.id || null,
    day: dayMapping[item.day] || item.day || "Unknown",
    start_time: item.start,
    end_time: item.end,
    available: item.active ? 1 : 0,
  }));
};

/**
 * حفظ الجدول بعد تحويله
 * @param {Array} updatedSchedule - جدول المواعيد المحدث
 * @param {String} clinicId - معرف العيادة
 * @param {Function} updateClinicSchedule - دالة تحديث الجدول
 * @param {Function} setModalOpen - دالة إغلاق المودال
 * @returns {Promise<void>} لا تعيد قيمة
 */
export const handleSaveSchedule = async (
  updatedSchedule,
  clinicId,
  updateClinicSchedule,
  setModalOpen
) => {
  const convertedSchedule = convertSchedule(updatedSchedule);

  console.log("Converted Schedule:", convertedSchedule);

  setModalOpen(false); // إغلاق المودال بعد المعالجة

  for (const schedule of convertedSchedule) {
    const scheduleId = schedule.id; // استخراج `id` من كل عنصر
    const data = {
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      available: schedule.available,
    };

    // استدعاء التحديث لكل عنصر
    await updateClinicSchedule(data, clinicId, scheduleId);
  }
};
