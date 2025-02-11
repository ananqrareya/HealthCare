export function Textarea({ label, required, ...props }) {
  return (
    <FormField label={label} required={required}>
      <textarea
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 
                   transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 
                   min-h-[100px]"
      />
    </FormField>
  );
}
