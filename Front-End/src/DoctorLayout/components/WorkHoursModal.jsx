import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

function WorkHoursModal({ clinicName, schedule, isOpen, onClose, onSave }) {
  const [workHours, setWorkHours] = useState([]);
  const [modifiedWorkHours, setModifiedWorkHours] = useState(new Set()); // تتبع العناصر المعدلة

  useEffect(() => {
    // تهيئة بيانات السكاجول عند فتح المودال
    if (Array.isArray(schedule)) {
      const formattedSchedule = schedule.map((item) => ({
        id: item.id,
        day: item.day || "غير معروف",
        start: item.start ? formatTime(item.start) : "00:00", // التعامل مع التنسيق
        end: item.end ? formatTime(item.end) : "00:00", // التعامل مع التنسيق
        active: item.available === true, // تحديد إذا كان اليوم متاحًا
      }));
      setWorkHours(formattedSchedule); // إعداد الحقول في الحالة
    } else {
      console.warn("Schedule is not an array:", schedule);
    }
  }, [schedule]);

  // دالة لتنسيق الوقت
  const formatTime = (time) => {
    if (!time) return "00:00";
    const isPM = time.includes("م");
    const [hour, minute] = time.replace(/[^\d:]/g, "").split(":");
    const formattedHour = isPM ? (+hour % 12) + 12 : +hour % 12;
    return `${String(formattedHour).padStart(2, "0")}:${minute}`;
  };

  const handleToggleDay = (index) => {
    const updatedHours = [...workHours];
    updatedHours[index].active = !updatedHours[index].active;
    setWorkHours(updatedHours);

    // أضف العنصر المعدل إلى المجموعة
    setModifiedWorkHours((prev) => new Set(prev).add(index));
  };

  const handleChangeTime = (index, field, value) => {
    const updatedHours = [...workHours];
    updatedHours[index][field] = value;
    setWorkHours(updatedHours);

    // أضف العنصر المعدل إلى المجموعة
    setModifiedWorkHours((prev) => new Set(prev).add(index));
  };
  const handleSave = () => {
    const modifiedItems = Array.from(modifiedWorkHours).map((index) => workHours[index]);
    onSave(modifiedItems); // إرسال العناصر المعدلة فقط
    setModifiedWorkHours(new Set()); // إعادة التهيئة
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-all duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md md:max-w-2xl h-[90vh] mx-4 md:mx-0 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 dark:border-gray-600 z-10 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">إعداد ساعات العمل</h2>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{clinicName}</h2>
              <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {workHours.length > 0 ? (
              workHours.map((day, index) => (
                <div
                  key={day.id}
                  className={`flex flex-col items-start justify-between p-4 rounded-lg transition-all duration-300 ${day.active
                      ? "bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 border border-green-300 dark:border-green-700"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {/* Day Name and Checkbox */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-gray-800 dark:text-white ${day.active ? "font-semibold" : "font-normal"}`}>
                      {day.day}
                    </span>
                    <input
                      type="checkbox"
                      checked={day.active}
                      onChange={() => handleToggleDay(index)}
                      className={`w-4 h-4 rounded focus:ring-2 ${day.active
                          ? "text-green-600 dark:text-green-500 focus:ring-green-500"
                          : "text-gray-600 dark:text-gray-400 focus:ring-gray-500"
                        }`}
                    />
                  </div>

                  {/* Time Inputs */}
                  <div className="flex flex-col w-full space-y-2">
                    <div className="flex flex-col">
                      <label className="text-gray-600 dark:text-gray-300 text-sm mb-1">وقت البداية</label>
                      <input
                        type="time"
                        value={day.start}
                        onChange={(e) => handleChangeTime(index, "start", e.target.value)}
                        disabled={!day.active}
                        className={`p-2 border rounded-md text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 ${day.active
                            ? "bg-white dark:bg-gray-800 focus:ring-green-500 dark:focus:ring-green-400"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 dark:text-gray-300 text-sm mb-1">وقت النهاية</label>
                      <input
                        type="time"
                        value={day.end}
                        onChange={(e) => handleChangeTime(index, "end", e.target.value)}
                        disabled={!day.active}
                        className={`p-2 border rounded-md text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 ${day.active
                            ? "bg-white dark:bg-gray-800 focus:ring-green-500 dark:focus:ring-green-400"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                      />
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">لا يوجد جدول زمني متوفر</p>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 dark:border-gray-600 z-10 px-6 py-4 border-t flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-indigo-600 dark:bg-indigo-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300"
            >
              حفظ
            </button>
          </div>
        </div>
      </div>




    )
  );
}

export default WorkHoursModal;