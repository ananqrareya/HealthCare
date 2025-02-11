export const cleanSchedule = (schedule) => {

  if (!Array.isArray(schedule) || schedule.length === 0) {
    return []; // إرجاع مصفوفة فارغة إذا لم يكن الجدول صالحًا
  }
  return schedule.filter((entry) => entry.available !== 0);
};
