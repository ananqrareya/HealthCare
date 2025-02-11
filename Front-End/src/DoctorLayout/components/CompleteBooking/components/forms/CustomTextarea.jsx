export function CustomTextarea({ label, ...props }) {
  return (
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {label}
  </label>
  <textarea
    {...props}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
  />
</div>

  );
}
