import { Hospital } from 'lucide-react';

export function PDFHeader({ hospitalName, hospitalAddress, hospitalContact }) {
  return (
<div className="mb-8">
  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
    <div className="flex items-center gap-4">
      {/* أيقونة المستشفى */}
      <div className="p-3 bg-blue-50  rounded-xl">
        <Hospital className="h-8 w-8 text-blue-600 " />
      </div>

      {/* معلومات المستشفى */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 ">
          {hospitalName}
        </h1>
        <div className="text-sm text-gray-500  mt-1">
          <p>{hospitalAddress}</p>
          <p>{hospitalContact}</p>
        </div>
      </div>
    </div>

    {/* تاريخ التقرير */}
    <div className="text-left">
      <p className="text-sm text-gray-500 ">Report Date</p>
      <p className="text-lg font-medium text-gray-900 ">
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
