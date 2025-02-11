import { FileText } from "lucide-react";
import { CustomInput } from "../forms/CustomInput";
import { CustomTextarea } from "../forms/CustomTextarea";
import { DoctorSignature } from "../forms/DoctorSignature";
import { ReportHeader } from "./ReportHeader";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import MedicalReportTemplate from "./PdfTemplete";
import dayjs from "dayjs";


 

export function MedicalReport({appointment, clinic,personalInfo,onSave, onClose }) {
 
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    patientName: e.target.patientName.value,
    patientId: e.target.patientId.value,
    date: e.target.date.value,
    age: e.target.age.value,
    gender: e.target.gender.value,
    chiefComplaint: e.target.chiefComplaint.value,
    history: e.target.history.value,
    findings: e.target.findings.value,
    diagnosis: e.target.diagnosis.value,
    treatmentPlan: e.target.treatmentPlan.value,
    followUp: e.target.followUp.value,
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


// دالة تصدير التقرير كـ PDF
const generateJPG = async (formData) => {
  // إنشاء عنصر مؤقت في DOM
  const container = document.createElement("div");
  document.body.appendChild(container);

  // إنشاء `root` باستخدام `createRoot`
  const root = createRoot(container);
  root.render(<MedicalReportTemplate clinic={clinic} personalInfo={personalInfo} formData={formData} />);

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
    
        const canvas = await html2canvas(container, {
          scale: 2, // تحسين الجودة
          useCORS: true, // دعم الصور الخارجية
          windowWidth: 754.672,
          windowHeight: container.scrollHeight,
        });

 
        const imgData = canvas.toDataURL("image/jpeg", 0.9); // الجودة 90%

    
        const byteCharacters = atob(imgData.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const imgBlob = new Blob([byteArray], { type: "image/jpeg" });

     
        if (container.parentNode) {
          root.unmount();
          document.body.removeChild(container);
        }

       
        resolve({ imgBlob, fileName: `medical-report-${appointment.patient.en_name}.jpg` });

      } catch (error) {
        console.error("Error generating JPG:", error);

        // 🧹 تنظيف الـ DOM حتى لو حدث خطأ
        if (container.parentNode) {
          root.unmount();
          document.body.removeChild(container);
        }

        reject(error);
      }
    }, 500); 
  });
};






const clinicContact = `Tel: ${clinic.phone} | Licence No: ${clinic.licence_number}`;
const calculateAge = (dob) => {
  if (!dob) return "No Data"; // في حال لم يكن هناك تاريخ ميلاد
  return dayjs().diff(dayjs(dob), "year"); // يحسب الفرق بالسنوات
};

const age = calculateAge(appointment.patient.dateOfBirthday);
return (
<div
  className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 text-left overflow-y-auto max-h-[80vh] custom-scrollbar"
  id="medical-report-content"
  dir="ltr"
>
    <ReportHeader
      hospitalName="HealthCare"
hospitalAddress={`${clinic.name || ''}${clinic.name && clinic.en_name ? ' - ' : ''}${clinic.en_name || ''}`}

      hospitalContact={clinicContact}
    />

<h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-6 flex items-center gap-2">
      <FileText className="h-5 w-5" />
      Medical Report
    </h2>

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

      <div className="grid grid-cols-3 gap-4">
        <CustomInput
          name="date"
          label="Date"
          type="date"
          defaultValue={appointment.patient.dateOfBirthday}
          required
        />
        <CustomInput
          name="age"
          label="Age"
          type="number"
          placeholder="Patient age"
          defaultValue={age}
          required
        />
        <CustomInput
          name="gender"
          label="Gender"
          placeholder="Patient gender"
          defaultValue={appointment.patient.gender}
          required
        />
      </div>

      <CustomTextarea
        name="chiefComplaint"
        label="Chief Complaint"
        placeholder="Describe the patient's primary symptoms and concerns"
        rows={3}
        required
      />

      <CustomTextarea
        name="history"
        label="History of Present Illness"
        placeholder="Document symptom onset, progression, associated factors, and any prior treatments"
        rows={4}
        required
      />

      <CustomTextarea
        name="findings"
        label="Physical Examination Findings"
        placeholder="Record physical examination observations, including vital signs and clinical findings"
        rows={4}
        required
      />

      <CustomTextarea
        name="diagnosis"
        label="Medical Diagnosis"
        placeholder="Enter the clinical diagnosis based on symptoms and examination results"
        rows={3}
        required
      />

      <CustomTextarea
        name="treatmentPlan"
        label="Treatment Plan"
        placeholder="Outline the recommended treatment, including medications, dosages, and procedures"
        rows={4}
        required
      />

      <CustomTextarea
        name="followUp"
        label="Follow-Up Instructions"
        placeholder="Specify follow-up appointments, medical advice, and necessary future tests"
        rows={3}
        required
      />

      <DoctorSignature 
      personalInfo={personalInfo}
      />

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Report
        </button>
      </div>
    </form>
  </div>
);

}
