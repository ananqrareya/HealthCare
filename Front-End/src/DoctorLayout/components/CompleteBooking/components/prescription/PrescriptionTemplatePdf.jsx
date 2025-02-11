import React from "react";
import { ReportHeader } from "../medical-report/ReportHeader";
import { DoctorSignature } from "../forms/DoctorSignature";
import { PDFHeader } from "../common/PDFHeader";


const PrescriptionTemplate = ({ clinic,personalInfo, formData }) => {
    const clinicContact = `Tel: ${clinic.phone} | Licence No: ${clinic.licence_number}`;

  return (
    <div className="bg-white  rounded-lg shadow-md p-8 text-left max-w-[800px] mx-auto">
      {/* Report Header */}
    <PDFHeader
      hospitalName="HealthCare"
hospitalAddress={`${clinic.name || ''}${clinic.name && clinic.en_name ? ' - ' : ''}${clinic.en_name || ''}`}

      hospitalContact={clinicContact}
    />

      {/* Prescription Title */}
      <h2 className="text-2xl font-bold text-gray-900 ">
        Prescription
      </h2>

      {/* Patient Information */}
      <div className="space-y-4 border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-700 ">
          Patient Information:
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-sm text-gray-900 ">
            <strong className="text-gray-700 ">Name:</strong>{" "}
            {formData.patientName}
          </p>
          <p className="text-sm text-gray-900 ">
            <strong className="text-gray-700 ">ID:</strong>{" "}
            {formData.patientId}
          </p>
          <p className="text-sm text-gray-900 ">
            <strong className="text-gray-700 ">Age:</strong>{" "}
            {formData.age}
          </p>

        </div>
      </div>

      {/* Medication Section */}
      <div className="space-y-4 border-b border-gray-200 pb-4 mt-6">
        <h3 className="text-lg font-medium text-gray-700 ">
          Prescribed Medications:
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          {formData.medications.map((medication, index) => (
            <li key={index} className="text-sm text-gray-900 ">
              <strong>{medication.name}</strong> - {medication.dosage},{" "}
              {medication.frequency}
            </li>
          ))}
        </ul>
      </div>

      {/* Special Instructions */}
      <div className="space-y-4 border-b border-gray-200 pb-4 mt-6">
        <h3 className="text-lg font-medium text-gray-700 ">
          Special Instructions:
        </h3>
        <p className="text-sm text-gray-900 ">
          {formData.instructions || "No special instructions provided."}
        </p>
      </div>

      {/* Follow-up Instructions */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium text-gray-700 ">
          Follow-up Instructions:
        </h3>
      </div>

      {/* Footer */}
      <DoctorSignature personalInfo={personalInfo} />
    </div>
  );
};

export default PrescriptionTemplate;
