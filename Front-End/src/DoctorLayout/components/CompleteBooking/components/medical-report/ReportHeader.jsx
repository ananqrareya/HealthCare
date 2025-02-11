import { Hospital } from 'lucide-react';

export function ReportHeader({ hospitalName, hospitalAddress, hospitalContact }) {
  return (
<div className="mb-8">
  <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4">
      {/* أيقونة المستشفى */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-xl">
        <Hospital className="h-8 w-8 text-blue-600 dark:text-blue-300" />
      </div>

      {/* معلومات المستشفى */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          {hospitalName}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <p>{hospitalAddress}</p>
          <p>{hospitalContact}</p>
        </div>
      </div>
    </div>

    {/* تاريخ التقرير */}
    <div className="text-left">
      <p className="text-sm text-gray-500 dark:text-gray-400">Report Date</p>
      <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  </div>
</div>

  );
}
