import { useContext, useState } from 'react';
import React from "react";
import { DoctorLayoutContext } from '../../../../context/DoctorLayoutContext';

export function DoctorSignature({personalInfo}) {
  const [date] = useState(() => new Date().toLocaleDateString());
 

  return (
<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
  <div className="flex justify-start">
    <div className="space-y-4">
      {/* صورة التوقيع */}
      <img
        src="/signature.png"
        alt="Digital Signature"
        className="h-16 mb-2"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* معلومات الطبيب */}
      <div className="space-y-1">
        <p className="font-semibold text-gray-900 dark:text-gray-400">
          {personalInfo.en_full_name.charAt(0).toLocaleUpperCase() + personalInfo.en_full_name.slice(1)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{personalInfo.speciality}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Date: {date}</p>
      </div>
    </div>
  </div>
</div>

  );
}
