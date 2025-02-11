import React from 'react';
import { User, Calendar, Phone, MapPin, Clock, BadgeCheck } from 'lucide-react';
import { formatDateWithDay } from '../../../utils/formatDateAndTime';

export function PatientHeader({ patient, appointmentDate ,appointmentTime }) {
   return (
  <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* معلومات المريض */}
        <div className="flex items-center space-x-4 gap-2">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
              {patient.name || "غير معروف"}
            </h1>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{patient?.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{patient.idNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات الموعد */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-right">
          <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-3">
            الموعد الحالي
          </h2>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" />
              <span>{appointmentDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" />
              <span>اليوم: {formatDateWithDay(appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" />
              <span>{appointmentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
