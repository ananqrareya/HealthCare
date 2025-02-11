import React from "react";
import { ReportHeader } from "./ReportHeader";
import { FileText } from "lucide-react";
import { DoctorSignature } from "../forms/DoctorSignature";
import { PDFHeader } from "../common/PDFHeader";
 

const MedicalReportTemplate = ({clinic,personalInfo, formData }) => {
  const clinicContact = `Tel: ${clinic.phone} | Licence No: ${clinic.licence_number}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-left max-w-[800px] mx-auto">
      {/* Report Header */}
    <PDFHeader
      hospitalName="HealthCare"
hospitalAddress={`${clinic.name || ''}${clinic.name && clinic.en_name ? ' - ' : ''}${clinic.en_name || ''}`}

      hospitalContact={clinicContact}
    />

      {/* Report Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 ap-2">
        Medical Report
      </h2>
      {/* Report Content */}
      <div className="space-y-6 border-b border-gray-200 ">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Patient Information:
          </h3>

          {/* الاسم و ID */}
          <div className="mb-4">
            <p className="text-sm text-gray-900 font-medium">
              <strong className="text-gray-700">Name:</strong>{" "}
              {formData.patientName}
            </p>
            <p className="text-sm text-gray-900 font-medium">
              <strong className="text-gray-700">ID:</strong>{" "}
              {formData.patientId}
            </p>
          </div>

          {/* تاريخ الميلاد والعمر والجنس */}
          <div className="flex items-center space-x-4 text-sm text-gray-900 font-medium">
            <p>
              <strong className="text-gray-700">Date of Birth:</strong>{" "}
              {formData.date}
            </p>
            <p>
              <strong className="text-gray-700">Age:</strong> {formData.age}
            </p>
            <p>
              <strong className="text-gray-700">Gender:</strong>{" "}
              {formData.gender}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">
            Chief Complaint:
          </h3>
          <p>{formData.chiefComplaint}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">
            History of Present Illness:
          </h3>
          <p>{formData.history}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">
            Examination Findings:
          </h3>
          <p>{formData.findings}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">Diagnosis:</h3>
          <p>{formData.diagnosis}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">Treatment Plan:</h3>
          <p>{formData.treatmentPlan}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">
            Follow-up Instructions:
          </h3>
          <p>{formData.followUp}</p>
        </div>
      </div>
      {/* Footer */}
      <DoctorSignature
 personalInfo={personalInfo}
      />
    </div>
  );
};

export default MedicalReportTemplate;
