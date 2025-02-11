import React, { useState } from "react";
import {
  FileText,
  Pill,
  StickyNote,
  History,
  ClipboardList,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";
import { saveAs } from "file-saver";
import { PatientHeader } from "./components/PatientHeader";
import { ActionButton } from "./components/ActionButton";
import { MedicalReport } from "./components/medical-report/MedicalReport";
import { PrescriptionForm } from "./components/prescription/PrescriptionForm";
import { NotesForm } from "./components/forms/NotesForm";
import { PatientHistory } from "./components/PatientHistory";
import { formatTimeTo12Hour } from "../../utils/formatDateAndTime";
import useHistoryAppointmentsPaitent from "../../hooks/useHistoryAppointmentsPaitent";
import { useEffect } from "react";
import useCompleteAppointment from "../../hooks/useCompleteAppointment";
import Loader from "../Loader";
import Swal from "sweetalert2";

function CompleteBooking({ appointment, clinic, personalInfo, onClose }) {
  const [currentAction, setCurrentAction] = useState(null);
  const [status, setStatus] = useState("in-progress");
  const [quickNotes, setQuickNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { historyPaitent } = useHistoryAppointmentsPaitent();
  const [patientHistory, setPaitentHistory] = useState([]);
  const { completeAppointmentNote, completeAppointmentReport, completeAppointmentPrescriptions, loading } = useCompleteAppointment();
  const [formData, setFormData] = useState({
    reports: [],
    prescriptions: [],
    bookingNotes: [],
    patientNotes: [],

  });

  const toggleAction = (action) => {
    setCurrentAction((prevAction) => (prevAction === action ? null : action));
  };
  const convertBlobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: "application/pdf" });
  };

  const completeBooking = async () => {
    const prescriptionFiles = formData.prescriptions.map((prescription) =>
      convertBlobToFile(prescription.file, prescription.name)
    );
    const reportFile = formData.reports.map((report) =>
      convertBlobToFile(report.file, report.name)
    );

    const completeData = new FormData();
    const reportsData = new FormData();
    const prescriptionData = new FormData();
    completeData.append("quick_note", JSON.stringify(quickNotes || ""));
    completeData.append("appointment_note", JSON.stringify(formData.bookingNotes || ""));
    completeData.append("patient_note", JSON.stringify(formData.patientNotes || ""));

    // التأكد من وجود الملفات قبل إضافتها

    if (prescriptionFiles.length > 0) {

      prescriptionFiles.forEach((file) => prescriptionData.append("prescription_file[]", file));
    }
    if (reportFile.length > 0) {
      reportFile.forEach((file) => reportsData.append("report_file[]", file));
    }
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => completeData.append("another_files[]", file));
    } else {
      completeData.append("another_files", JSON.stringify()); // إرسال مصفوفة فارغة لتجنب الخطأ
    }

    try {
      // **إرسال تقرير الموعد**
      console.log("data", completeData)
      console.log("prescriptionFiles", prescriptionFiles)
      if (reportFile) {
        const reportSuccess = await completeAppointmentReport(reportsData, appointment.id);
        console.log("return this", reportSuccess);
        if (reportSuccess === "200") {
          // في حال تم إضافة التقرير بنجاح، يمكن إضافة الوصفة الطبية فقط إذا كانت موجودة
          if (prescriptionFiles) {
            console.log(prescriptionData);
            const prescriptionSuccess = await completeAppointmentPrescriptions(prescriptionData, appointment.id);
            if (prescriptionSuccess === "200") {
              // إرسال ملاحظات الموعد إذا تمت إضافة الوصفة بنجاح
              await completeAppointmentNote(completeData, appointment.id);
            }
          } else {
            // إرسال ملاحظات الموعد إذا لم تكن هناك وصفة طبية
            await completeAppointmentNote(completeData, appointment.id);
          }
        }
      }

      // **إظهار إشعار عند النجاح**
      Swal.fire({
        icon: "success",
        title: "تم حفظ الملاحظات!",
        text: "تم إكمال الموعد بنجاح.",
        timer: 2000,
        showConfirmButton: false,
      });
      onClose(true);
    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء إكمال الموعد، يرجى المحاولة مرة أخرى.",
      });

      return; // 
    }

  };

  useEffect(() => {
    if (!appointment?.patient?.id) return;

    const fetchHistoryPaitent = async () => {
      try {
        setPaitentHistory(await historyPaitent(appointment.patient.id));
      } catch (error) {
        console.error("❌ خطأ أثناء جلب السجل الطبي:", error);
      }
    };

    fetchHistoryPaitent();
  }, [appointment]);
  if (loading) {
    return (
      <Loader />
    )
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const renderContent = () => {
    switch (currentAction) {
      case "report":
        return (
          <MedicalReport
            appointment={appointment}
            clinic={clinic}
            personalInfo={personalInfo}
            onSave={(imgBlob, fileName) =>
              setFormData((prev) => ({
                ...prev,
                reports: [...prev.reports, { file: imgBlob, name: fileName }],
              }))
            }
            onClose={() => setCurrentAction(null)}
          />
        );
      case "prescription":
        return (
          <PrescriptionForm
            appointment={appointment}
            clinic={clinic}
            personalInfo={personalInfo}
            onSave={(imgBlob, fileName) =>
              setFormData((prev) => ({
                ...prev,
                prescriptions: [...prev.prescriptions, { file: imgBlob, name: fileName }],
              }))
            }


            onClose={() => setCurrentAction(null)}
          />
        );
      case "booking-notes":
        return (
          <NotesForm

            type="booking"
            onSave={(note) =>
              setFormData((prev) => ({
                ...prev,
                bookingNotes: [...prev.bookingNotes, note],
              }))
            }
            onClose={() => setCurrentAction(null)}
          />
        );
      case "patient-notes":
        return (
          <NotesForm
            type="patient"
            notes={formData.patientNotes}
            onSave={(note) =>
              setFormData((prev) => ({
                ...prev,
                patientNotes: [...prev.patientNotes, note],
              }))
            }
          />
        );
      case "history":
        return <PatientHistory
          history={patientHistory}
        />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <p className="text-xl font-semibold">اختر إجراءً لعرض التفاصيل</p>
          </div>
        );
    }
  };
  const handleDelete = (type, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index)
    }));
  };
  return (
    <div dir="rtl" className=" relative  min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">

      <button
        onClick={onClose}
        className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-transform transform hover:scale-110"
      >
        <XCircle className="h-6 w-6" />
      </button>

      {/* Patient Header */}
      <PatientHeader
        patient={appointment.patient}
        appointmentDate={appointment.date}
        appointmentTime={formatTimeTo12Hour(appointment.time)}
      />

      {/* Booking Status */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            {status === "completed" ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">الحالة: مكتمل</span>
              </div>
            ) : status === "cancelled" ? (
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">الحالة: ملغي</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-700">
                <ClipboardList className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  الحالة: جاري التنفيذ
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={completeBooking}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              إكمال الحجز
            </button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
            {/* ملاحظات سريعة */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">ملاحظات سريعة</h2>
            <textarea
              rows="4"
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 
                   shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 
                   transition duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="اكتب الملاحظات هنا..."
            ></textarea>

            {/* رفع الملفات */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-6 mb-4">رفع الملفات</h2>
            <div className="border-2 border-dashed dark:border-gray-700 rounded-md p-6 text-center">
              <input id="file-upload" type="file" multiple onChange={handleFileUpload} className="hidden" />
              <label htmlFor="file-upload" className="text-blue-500 dark:text-blue-400 cursor-pointer underline">
                اضغط للرفع
              </label>
            </div>

            {/* عرض الملفات المرفوعة */}
            <ul className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow text-gray-900 dark:text-gray-200">
                  {file.name}
                </li>
              ))}
            </ul>

            {/* البيانات المخزنة */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 البيانات المضافة</h2>

              {/* التقارير الطبية */}
              {formData.reports.length > 0 && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">📄 التقارير الطبية</h3>
                  <ul className="list-none mt-3 space-y-2">
                    {formData.reports.map((report, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-700 rounded-md shadow-sm">
                        <span className="text-gray-900 dark:text-gray-300 text-sm truncate">{report.name}</span>
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 dark:bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                            onClick={() => saveAs(report.file, report.name)}
                          >
                            ⬇
                          </button>
                          <button
                            className="bg-red-600 dark:bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition"
                            onClick={() => handleDelete("reports", index)}
                          >
                            ❌
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* 💊 الوصفات الطبية*/}
              {formData.prescriptions.length > 0 && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"> 💊 الوصفات الطبية</h3>
                  <ul className="list-none mt-3 space-y-2">
                    {formData.prescriptions.map((prescriptions, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-700 rounded-md shadow-sm">
                        <span className="text-gray-900 dark:text-gray-300 text-sm truncate">{prescriptions.name}</span>
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 dark:bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                            onClick={() => saveAs(prescriptions.file, prescriptions.name)}
                          >
                            ⬇
                          </button>
                          <button
                            className="bg-red-600 dark:bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition"
                            onClick={() => handleDelete("prescriptions", index)}
                          >
                            ❌
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* عرض البيانات الأخرى (الوصفات الطبية - ملاحظات الحجز - ملاحظات المريض) */}
              {[
                { label: "📝 ملاحظات الحجز", key: "bookingNotes" },
                { label: "📋 ملاحظات المريض", key: "patientNotes" },
              ].map(({ label, key }) =>
                formData[key].length > 0 ? (
                  <div key={key} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">{label}</h3>
                    <ul className="mt-3 space-y-2">
                      {formData[key].map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-700 rounded-md shadow-sm">
                          <span className="text-gray-900 dark:text-gray-300 text-sm truncate">{item}</span>
                          <button
                            className="bg-red-600 dark:bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition"
                            onClick={() => handleDelete(key, index)}
                          >
                            حذف
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}

              {/* رسالة في حال عدم وجود بيانات */}
              {Object.keys(formData).every((key) => formData[key].length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center">لا توجد بيانات مضافة بعد.</p>
              )}
            </div>
          </div>

          {/* Main Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 shadow rounded-lg">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-200 dark:divide-gray-700">
                <ActionButton icon={FileText} label="كتابة تقرير" active={currentAction === "report"} onClick={() => toggleAction("report")} />
                <ActionButton icon={Pill} label="وصفة طبية" active={currentAction === "prescription"} onClick={() => toggleAction("prescription")} />
                <ActionButton icon={ClipboardList} label="ملاحظات الحجز" active={currentAction === "booking-notes"} onClick={() => toggleAction("booking-notes")} />
                <ActionButton icon={StickyNote} label="ملاحظات المريض" active={currentAction === "patient-notes"} onClick={() => toggleAction("patient-notes")} />
                <ActionButton icon={History} label="تاريخ المريض" active={currentAction === "history"} onClick={() => toggleAction("history")} />
              </div>
            </div>
            <div className="p-6">{renderContent()}</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CompleteBooking;
