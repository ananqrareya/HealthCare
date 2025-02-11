import React from 'react';
import { Clock } from 'lucide-react';

export function PatientHistory({history}) {
    console.log("history",history);

    

    return (
      <div className="space-y-4">
  <div className="flow-root">
  <ul role="list" className="-mb-8">
  {history.flat().map((event, eventIdx) => (
    <li key={eventIdx}>
      <div className="relative pb-8">
        {eventIdx !== history.flat().length - 1 && (
          <span
            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />
        )}
        <div className="relative flex space-x-3 rtl:space-x-reverse">
          {/* أيقونة الحدث */}
          <div>
            <span className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </span>
          </div>
          {/* تفاصيل الحدث */}
          <div className="flex min-w-0 flex-1 justify-between space-x-4 rtl:space-x-reverse pt-1.5">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{event.visitInfo}</p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-200">{event.time} </span>
              <span className="ml-2">{event.date}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  ))}
</ul>

  </div>
</div>

    );
}
