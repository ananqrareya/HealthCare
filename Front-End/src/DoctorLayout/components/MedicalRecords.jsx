import React, { useContext, useEffect, useState } from 'react';
import { Search, FileText, Download, Filter, Plus, MoreVertical, X, ChevronRight, Activity, Pill, Stethoscope, FileSpreadsheet, CalendarClock, CalendarCheck, StickyNote } from 'lucide-react';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import axios from 'axios';
import Loading from '../../Loading';
import { formatDate, formatTimeTo12Hour } from '../utils/formatDateAndTime';
import { time } from 'framer-motion';

export default function MedicalRecords() {
  const apiUrl = import.meta.env.VITE_APP_KEY;

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordDetails, setRecordDetails] = useState(null);

  const [activeTab, setActiveTab] = useState('details');
  const { historyPatient } = useContext(DoctorLayoutContext);
  const [filteredRecords, setFilteredRecords] = useState(historyPatient);

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
  };



  const fetchRecordDetails = async (recordId) => {
    try {

      // إرسال طلب إلى الـ API باستخدام axios
      const response = await axios.get(`${apiUrl}/api/patients/${recordId}/doctor-appointments`, {
        headers: {
          "ngrok-skip-browser-warning": "s",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      }
      );

      const data = Array.isArray(response.data.data[0]) ? response.data.data[0] : response.data.data;
      data.map((item) => ({
        id: item.id,
        clinicName: item.visit_type === "online" ? null : item.clinic_name, // إذا كانت الزيارة أونلاين، لا يتم عرض اسم العيادة
        date: formatDate(item.date), // تحويل التاريخ إلى الشكل المطلوب
        time: formatTimeTo12Hour(item.time), // تحويل الوقت إلى تنسيق 12 ساعة
        visitType: item.visit_type,
        report: item.report,
        prescription: item.prescription,
        anotherFile: item.another_files && item.another_files.length > 0 ? item.another_files.map((file) => ({
          fileUrl: file.file_path,
          fileExtension: file.extension,
          publicId: file.public_id,
        })) : null,
        patientNote: item.patient_note || null,
        appointmentNote: item.appointment_note || null,
        quickNote: item.quick_note,

      }));
      console.log("detials api", data);


      setRecordDetails(data);
    } catch (err) {
      console.log('فشل في جلب البيانات');
      console.error(err);
    }
  };




  const handleRecordClick = (e, record) => {
    e.preventDefault(); // منع انتشار الحدث إلى العناصر الأخرى

    setSelectedRecord(record);
    fetchRecordDetails(record.id);
  };


  const renderTabContent = (recordDetails) => {
    if (!recordDetails) {
      return <div className='text-gray-800 dark:text-white'>لا توجد بيانات متاحة.</div>;
    }
    switch (activeTab) {

      case 'appointments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {recordDetails
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // ترتيب المواعيد من الأحدث إلى الأقدم

              .map((item, index) => (
                <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden flex flex-col p-4">
                  <div className="space-y-4">
                    <div>
                      <p
                        className="text-gray-800 dark:text-white font-semibold cursor-pointer"
                        onClick={() => handleDateClick(item.date)} // عند الضغط على التاريخ
                      >
                        📅 {item.date} - 🕒 {item.time}
                      </p>
                      {selectedDate === item.date && (
                        <div>
                          <hr className="my-2 border-gray-300 dark:border-gray-600" />

                          {/* التحقق من وجود التقرير */}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">التقرير</h4>
                            {item.report ? (
                              <>
                                <img
                                  src={item.report}
                                  alt="تقرير طبي"
                                  className="w-full h-48 object-contain"
                                />
                                <button
                                  className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-2 space-x-reverse"
                                  onClick={() => window.open(item.report, '_blank')} // لفتح الصورة في نافذة جديدة
                                >
                                  <Download size={16} />
                                  <span>تحميل التقرير</span>
                                </button>
                              </>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">لا يوجد تقرير</p>
                            )}
                          </div>

                          {/* التحقق من وجود الرشيتة */}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">الرشيتة</h4>
                            {item.prescription ? (
                              <>
                                <img
                                  src={item.prescription}
                                  alt="رشيتة طبية"
                                  className="w-full h-48 object-contain"
                                />
                                <button
                                  className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-2 space-x-reverse"
                                  onClick={() => window.open(item.prescription, '_blank')} // لفتح الصورة في نافذة جديدة
                                >
                                  <Download size={16} />
                                  <span>تحميل الرشيتة</span>
                                </button>
                              </>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">لا توجد رشيتة</p>
                            )}
                          </div>

                          {/* التحقق من وجود الملفات الأخرى */}
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">الملفات الأخرى</h4>
                            {item.anotherFile && item.anotherFile.length > 0 ? (
                              item.anotherFile.map((file, idx) => (
                                <div key={idx} className="mt-2">
                                  {file.fileExtension === "jpg" || file.fileExtension === "png" ? (
                                    <img
                                      src={file.fileUrl}
                                      alt="ملف آخر"
                                      className="w-full h-48 object-contain"
                                    />
                                  ) : (
                                    <a
                                      href={file.fileUrl}
                                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                      download
                                    >
                                      تحميل الملف
                                    </a>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">لا توجد ملفات أخرى</p>
                            )}

                            {/* عرض زر تحميل الملفات فقط إذا كانت هناك ملفات أخرى */}
                            {item.anotherFile && item.anotherFile.length > 0 && (
                              <button
                                className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-2 space-x-reverse"
                                onClick={() => {
                                  // تنزيل الملفات الأخرى
                                  item.anotherFile.forEach((file) => {
                                    window.open(file.fileUrl, "_blank");
                                  });
                                }}
                              >
                                <Download size={16} />
                                <span>تحميل الملفات</span>
                              </button>
                            )}
                          </div>



                        </div>
                      )}
                    </div>
                  </div>
                </div>


              ))}
          </div>


        );
      case 'notes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {recordDetails?.map((item, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden flex flex-col p-4">
                <div className="space-y-4">
                  <div>
                    <p
                      className="text-gray-800 dark:text-white font-semibold cursor-pointer"
                      onClick={() => handleDateClick(item.date)} // عند الضغط على التاريخ
                    >
                      📅 {item.date} - 🕒 {item.time}
                    </p>
                    {selectedDate === item.date && (
                      <div>
                        <hr className="my-2 border-gray-300 dark:border-gray-600" />

                        {/* ملاحظات سريعة */}
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">الملاحظات السريعة</h4>
                          {item.quickNote ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.quickNote}</p>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">لا توجد ملاحظات سريعة</p>
                          )}
                        </div>

                        {/* ملاحظات المريض */}
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">ملاحظات المريض</h4>
                          {item.patientNote && item.patientNote.length > 0 ? (
                            item.patientNote.map((note, idx) => (
                              <p key={idx} className="text-sm text-gray-500 dark:text-gray-400">{note}</p>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">لا توجد ملاحظات للمريض</p>
                          )}
                        </div>


                        {/* ملاحظات الحجز */}
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">ملاحظات الحجز</h4>
                          {item.patientNote && item.patientNote.length > 0 ? (
                            item.appointmentNote.map((note, idx) => (
                              <p key={idx} className="text-sm text-gray-500 dark:text-gray-400">{note}</p>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">لا توجد ملاحظات للحجز</p>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>



            ))}
          </div>
        );
      default:
        return (
          <>
            {recordDetails && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse text-blue-600 dark:text-blue-400">
                    <Activity size={20} />
                    <span className="font-semibold"> عدد الزيارات</span>
                  </div>
                  <p className="mt-1 font-semibold text-gray-800 dark:text-gray-600">{recordDetails.length}</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">تواريخ الحجوزات السابقة</p>

                {/* قائمة الحجوزات */}
                <div className="mt-3 space-y-2">
                  {recordDetails && recordDetails.length > 0 ? (
                    recordDetails
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((appointment, index) => (
                        <div key={index} className="p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800">
                          <p className="text-gray-800 dark:text-white font-semibold">
                            📅 {appointment.date} - 🕒 {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            🏥 {appointment.clinicName ? appointment.clinicName : "اونلاين"}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">لا توجد حجوزات سابقة</p>
                  )}
                </div>
              </div>
            )}
          </>
        );
    }
  };



  const filterRecords = () => {
    if (!searchQuery) {
      return historyPatient;
    }
    return historyPatient.filter(record =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  useEffect(() => {
    setFilteredRecords(filterRecords());
  }, [searchQuery]); // التحديث سيحدث فقط عندما يتغير searchQuery
  return (
    <div className="space-y-6">


      <div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex justify-center items-center">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{historyPatient.length}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">إجمالي السجلات</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في السجلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

        </div>

        <div className="mt-6 space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-indigo-50/20 cursor-pointer"
              onClick={(e) => handleRecordClick(e, record)} // إرسال الحدث مع السجل
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={record.avatar}
                  alt={record.patientName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {record.patientName}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({record.patientId})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {record.idNumber}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {record.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4 lg:mt-0 space-x-4 space-x-reverse">
                <span className={`px-3 py-1 text-sm rounded-full 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  }`}>
                  مُكتمل
                </span>

              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <img
                    src={selectedRecord.avatar}
                    alt={selectedRecord.patientName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {selectedRecord.patientName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      رقم المريض: {selectedRecord.patientId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex space-x-4 space-x-reverse border-b dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 px-4 transition-all duration-200 ${activeTab === 'details'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  المواعيد
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`pb-3 px-4 ${activeTab === 'appointments'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  التقارير والملفات
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 px-4 ${activeTab === 'notes'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  الملاحظات
                </button>
              </div>

              {/* استدعاء renderTabContent لعرض المحتوى المناسب */}
              <div className="space-y-6">
                {renderTabContent(recordDetails)} {/* استدعاء الدالة هنا مع تمرير selectedRecord */}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
