import React from 'react';

export function Filter({ label, options, value, onChange }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-lg font-medium">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value === "الكل" ? "" : e.target.value)} // إعادة الفلتر إلى قيمة فارغة عند اختيار "الكل"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
                <option value="الكل">الكل</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}
