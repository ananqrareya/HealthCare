import { useState, useEffect } from "react";
import useFetchPatientMedicalRecord from "../hooks/useFetchPatientMedicalRecord";
import { Download, X } from 'lucide-react';
import Loading from "../components/Loading";

export default function PatientMedicalRecord() {
    const { recordDetails, loading, error } = useFetchPatientMedicalRecord();
    const [activeTab, setActiveTab] = useState('appointments');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    console.log("recordDetails", recordDetails);
    useEffect(() => {
     }, [selectedAppointment]);

    const handleAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const closeModal = () => {
        setSelectedAppointment(null);
        setActiveTab('appointments');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return (
                    <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                        {recordDetails?.map((item, index) => (
                            <div key={index} className="border dark:border-gray-700 rounded-lg p-6 mx-auto max-w-3xl shadow-md hover:shadow-lg transition-all ease-in-out">
                                <div className="space-y-4">
                                    <p
                                        className="text-gray-800 dark:text-white font-semibold cursor-pointer"
                                        onClick={() => handleAppointmentClick(item)} // Set the clicked appointment
                                    >
                                        📅 {item.date} - 🕒 {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'notes':
                return (
                    <div className="grid grid-cols-1 gap-6">
                        {recordDetails?.map((item, index) => (
                            <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden flex flex-col p-6">
                                <div className="space-y-4">
                                    <p className="text-gray-800 dark:text-white font-semibold cursor-pointer">
                                        📅 {item.date} - 🕒 {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return  (
            <Loading/>
        );
    }

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }

    return (
        <div className="space-y-6 mb-10" dir="rtl">
          
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mx-auto max-w-5xl border dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">سجلك الطبي</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">إجمالي السجلات: {recordDetails?.length}</p>

                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center p-6 bg-indigo-50 dark:bg-indigo-900 rounded-xl shadow-md border dark:border-indigo-700">
                        <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">تقاريرك</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">عرض تقاريرك الطبية السابقة هنا. اضغط على أي تقرير لعرض التفاصيل.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-indigo-50 dark:bg-indigo-900 rounded-xl shadow-md border dark:border-indigo-700">
                        <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">تفاصيل الحجوزات السابقة</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">عرض تفاصيل حجوزاتك السابقة هنا. اضغط على أي تاريخ لعرض التفاصيل الكاملة.</p>
                    </div>
                </div>
            </div>




            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-4 space-x-reverse">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                            {selectedAppointment.clinicName || 'معلومات العيادة'}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            تاريخ الحجز: {selectedAppointment.date || 'غير محدد'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex space-x-4 space-x-reverse border-b dark:border-gray-700 mb-6">
                                <button
                                    onClick={() => setActiveTab('appointments')}
                                    className={`pb-3 px-4 ${activeTab === 'appointments' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    التقارير والملفات
                                </button>

                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`pb-3 px-4 ${activeTab === 'notes' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    الملاحظات
                                </button>
                            </div>

                            <div className="space-y-6">
                                {activeTab === 'appointments' && (
                                    <>
                                        {/* تقرير */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-white">التقرير</h4>
                                            {selectedAppointment.report ? (
                                                <>
                                                    <img
                                                        src={selectedAppointment.report}
                                                        alt="تقرير طبي"
                                                        className="w-full h-48 object-contain"
                                                    />
                                                    <button
                                                        className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-2"
                                                        onClick={() => window.open(selectedAppointment.report, '_blank')}
                                                    >
                                                        <Download size={16} />
                                                        <span>تحميل التقرير</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400">لا يوجد تقرير</p>
                                            )}
                                        </div>

                                        {/* الرشيتة */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-white">الرشيتة</h4>
                                            {selectedAppointment.prescription ? (
                                                <>
                                                    <img
                                                        src={selectedAppointment.prescription}
                                                        alt="رشيتة طبية"
                                                        className="w-full h-48 object-contain"
                                                    />
                                                    <button
                                                        className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-2"
                                                        onClick={() => window.open(selectedAppointment.prescription, '_blank')}
                                                    >
                                                        <Download size={16} />
                                                        <span>تحميل الرشيتة</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400">لا توجد رشيتة</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'notes' && (
                                    <>
                                        {/* ملاحظات الحجز */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-white">ملاحظات الحجز</h4>
                                            {selectedAppointment.appointmentNote ? (
                                                selectedAppointment.appointmentNote.map((note, idx) => (
                                                    <p key={idx} className="text-sm text-gray-500 dark:text-gray-400">{note}</p>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400">لا توجد ملاحظات للحجز</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">{renderTabContent()}</div>
        </div>
    );
}
