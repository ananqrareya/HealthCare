const dayMap = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "مساءً" : "صباحاً";
  const adjustedHours = hours % 12 || 12; // تحويل 0 إلى 12
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// تحقق إذا انتهى اليوم بناءً على الوقت الحالي
const isDayFinished = (workingHour) => {
  const today = new Date();
  const currentTime = today.getHours() * 60 + today.getMinutes();

  const [endHours, endMinutes] = workingHour.end_time.split(":").map(Number);
  const endTimeInMinutes = endHours * 60 + endMinutes;

  // إذا كان اليوم الحالي ووقت العمل انتهى
  return currentTime >= endTimeInMinutes;
};

const calculateDayDates = (workingHours) => {
  const today = new Date(); // التاريخ الحالي
  const currentDayIndex = today.getDay(); // 0 (الأحد) إلى 6 (السبت)

  return workingHours
    .filter(({ available }) => available === 1) // فقط الأيام المتاحة
    .map((workingHour) => {
      const targetDayIndex = Object.keys(dayMap).indexOf(workingHour.day);
      let daysToAdd = targetDayIndex - currentDayIndex;

      // إذا كان اليوم في الأسبوع القادم أو انتهى
      if (daysToAdd < 0 || (daysToAdd === 0 && isDayFinished(workingHour))) {
        daysToAdd += 7; // نقل إلى الأسبوع التالي
      }

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);

      return {
        ...workingHour,
        day: dayMap[workingHour.day], // تحويل اليوم إلى العربية
        date: targetDate.toLocaleDateString("ar-EG"), // صيغة عربية
        dateObject: targetDate,
        time: `${convertTo12HourFormat(
          workingHour.start_time
        )} - ${convertTo12HourFormat(workingHour.end_time)}`,
      };
    });
};

// تصفية الأيام المنتهية
const filterValidDays = (workingHours) => {
  const now = new Date();

  return workingHours.filter(({ dateObject, end_time }) => {
    const endDateTime = new Date(dateObject);
    const [endHours, endMinutes] = end_time.split(":").map(Number);
    endDateTime.setHours(endHours, endMinutes, 0);

    return endDateTime > now; // احتفظ فقط بالأيام التي لم تنته
  });
};

// تحويل جدول المواعيد لكل عيادة إلى تواريخ فعلية
export const formatClinicWorkingHours = (schedule) => {
    if (!Array.isArray(schedule)) {
    console.error("Invalid schedule data:", schedule);
    return [];
  }
  const datedWorkingHours = calculateDayDates(schedule);
  return filterValidDays(datedWorkingHours); // إزالة الأيام المنتهية
};
