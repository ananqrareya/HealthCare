import React, { useState } from 'react';

export function NotesForm({ type, onSave, onClose }) {
  const title = type === "booking" ? "Booking Notes" : "Patient Notes";
  const [note, setNote] = useState(""); // ✅ حالة لتخزين الملاحظة

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!note.trim()) {
      alert("يرجى إدخال الملاحظة قبل الحفظ!");
      return;
    }

    if (onSave) {
      onSave(note);
    }

    if (onClose) {
      onClose();
    }
    setNote("");
  };

  return (
<form
  className="space-y-6"
  onSubmit={handleSubmit}
  dir={document.documentElement.lang === "ar" ? "rtl" : "ltr"}
>
  {/* عنوان النص */}
  <div>
    <label
      htmlFor="notes"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {title}
    </label>
    <textarea
      id="notes"
      rows={6}
      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 
                 shadow-sm focus:border-blue-500 focus:ring-blue-500 
                 dark:focus:ring-blue-600 dark:focus:border-blue-400 
                 placeholder-gray-400 dark:placeholder-gray-500"
      placeholder={`Enter ${type} notes here...`}
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  </div>

  {/* زر الحفظ */}
  <div>
    <button
      type="submit"
      className="inline-flex justify-center rounded-md border border-transparent 
                 bg-blue-600 dark:bg-blue-700 py-2 px-4 text-sm font-medium 
                 text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-800 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 
                 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      Save Notes
    </button>
  </div>
</form>

  );
}
