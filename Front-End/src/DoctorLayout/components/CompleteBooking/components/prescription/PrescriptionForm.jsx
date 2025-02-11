import { useState } from 'react';
import { Send } from 'lucide-react';
import { CustomInput } from '../forms/CustomInput';
import { CustomTextarea } from '../forms/CustomTextarea';
import { DoctorSignature } from '../forms/DoctorSignature';
import { ReportHeader } from '../medical-report/ReportHeader';
import dayjs from 'dayjs';
import { AddMedication } from '../forms/AddMedication';
import PrescriptionTemplate from './PrescriptionTemplatePdf';
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
export function PrescriptionForm({ appointment, clinic, personalInfo, onSave, onClose }) {
  const [medications, setMedications] = useState([]);

  const handleAddMedication = (medication) => {
    setMedications([...medications, medication]); // إضافة الدواء إلى القائمة
  };
  const handleDeleteMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index)); // حذف الدواء حسب الفهرس
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medications.length === 0) {
      alert("Please add at least one medication.");
      return;
    }
    const formData = {
      patientName: e.target.patientName.value,
      patientId: e.target.patientId.value,
      date: e.target.date.value,
      age: e.target.age.value,
      medications: medications,
      instructions: e.target.instructions.value,
    };
    try {
      // إنشاء PDF
const { imgBlob, fileName } = await generateJPG(formData);

      // استدعاء onSave وتمرير بيانات PDF
      if (onSave) {
        onSave(imgBlob, fileName);
      }

      // إغلاق النموذج إذا كان onClose متوفرًا
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  //onSave(formData); // تمرير البيانات للمكون الأب

  const generateJPG = async (formData) => {
    // إنشاء عنصر مؤقت في DOM
    const container = document.createElement("div");
    document.body.appendChild(container);

    // إنشاء `root` باستخدام `createRoot`
    const root = createRoot(container);
    root.render(<PrescriptionTemplate clinic={clinic} personalInfo={personalInfo} formData={formData} />);

    // **إرجاع Promise لضمان التعامل مع الـ PDF عند اكتماله**
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // استخدام html2canvas لتحويل التقرير إلى صورة
          const canvas = await html2canvas(container, {
            scale: 2, // زيادة الجودة
            useCORS: true, // دعم الصور الخارجية
            windowWidth: 754.672, // ضبط العرض
            windowHeight: document.documentElement.scrollHeight, // جعل الارتفاع تلقائيًا
          });

            const imgData = canvas.toDataURL("image/jpeg", 0.9);;

   const byteCharacters = atob(imgData.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const imgBlob = new Blob([byteArray], { type: "image/jpeg" });

          // **تنظيف الـ DOM بعد الانتهاء**
          if (container.parentNode) {
            root.unmount();
            document.body.removeChild(container);
          }

          // **إرجاع الـ Blob واسم الملف**
          resolve({ imgBlob, fileName: `prescription-${appointment.patient.en_name}.jpg` });
        } catch (error) {
          console.error("Error generating PDF:", error);

          // **تأكد من إزالة العنصر حتى في حالة حدوث خطأ**
          if (container.parentNode) {
            root.unmount();
            document.body.removeChild(container);
          }

          reject(error);
        }
      }, 500); // تأخير 500ms لضمان تحميل المحتوى بالكامل
    });
  };








  const clinicContact = `Tel: ${clinic.phone} | Licence No: ${clinic.licence_number}`;
  const calculateAge = (dob) => {
    if (!dob) return "No Data"; // في حال لم يكن هناك تاريخ ميلاد
    return dayjs().diff(dayjs(dob), "year"); // يحسب الفرق بالسنوات
  };

  const age = calculateAge(appointment.patient.dateOfBirthday);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8" dir="ltr">
      <ReportHeader
        hospitalName="HealthCare"
        hospitalAddress={clinic.name}
        hospitalContact={clinicContact}
      />

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-6">
        Prescription</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            name="patientName"
            label="Patient Name"
            placeholder="Enter patient name"
            defaultValue={appointment.patient.name}
            required
          />
          <CustomInput
            name="patientId"
            label="Patient ID"
            placeholder="Enter patient ID"
            defaultValue={appointment.patient.idNumber}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            name="date"
            label="Date"
            type="date"
            defaultValue={appointment.patient.dateOfBirthday}
            required />
          <CustomInput
            name="age"
            label="Age"
            type="number"
            placeholder="Patient age"
            defaultValue={age}

            required
          />
        </div>

        <AddMedication onAdd={handleAddMedication} />

        {/* قائمة الأدوية المضافة */}
        <ul className="list-disc pl-6 space-y-2">
          {medications.map((medication, index) => (
            <li key={index} className="flex justify-between items-center text-gray-900 dark:text-gray-200">
              <span>
                <strong>{medication.name}</strong> - {medication.dosage},{" "}
                {medication.frequency}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteMedication(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {medications.length === 0 && (
          <p className="text-red-500">Please add at least one medication.</p>
        )}
        <CustomTextarea
          name="instructions"
          label="Instructions"
          placeholder="Enter special instructions or notes"
          rows={3}
        />

        <div className="space-y-1">
          {/* العنوان مع شارة "قريبًا" */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 flex items-center gap-2">
            Pharmacy
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
              قريبًا
            </span>
          </label>

          {/* القائمة المنسدلة (معطلة) */}
          <select
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
          >
            <option value="">Select a pharmacy</option>
            <option value="pharmacy1">HealthCare Pharmacy</option>
            <option value="pharmacy2">MediPlus Drugstore</option>
            <option value="pharmacy3">City Pharmacy</option>
          </select>
        </div>

        <DoctorSignature
          personalInfo={personalInfo}
        />


        <div className="flex gap-4">
          <button
            type="button" // ليس "submit" حتى لا يرسل الفورم بالخطأ
            disabled
            className="flex-1 bg-gray-400 dark:bg-gray-600 text-white dark:text-gray-400 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition cursor-not-allowed shadow-md"
          >
            <Send className="h-4 w-4" />
            Send Prescription
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
              قريبًا
            </span>
          </button>

          <button
            type="submit"
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Print Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
