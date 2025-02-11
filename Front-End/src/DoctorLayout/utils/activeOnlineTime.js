 
// دالة لتحويل بيانات الجدول إلى صيغة مناسبة
export const availableDay = (scheduleData) => {
  if (!scheduleData || scheduleData.length === 0) {
    console.warn("No schedule data available.");
    return [];
  }

  return scheduleData
    .map((item) => {
      // تنسيق نطاق الوقت
      const timeRange = `${item.start} - ${item.end}`;

      return {
        id: item?.id || null,
        day: item.day, // اليوم باللغة العربية كما هو
        hours: timeRange, // نطاق الوقت
        available: item?.available === true, // إذا كان اليوم متاحًا
      };
    })
    .filter((item) => item.available); // تصفية العناصر المتاحة فقط
};

