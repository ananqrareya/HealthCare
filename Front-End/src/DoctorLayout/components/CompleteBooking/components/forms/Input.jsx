export function Input({ label, required, ...props }) {
  return (
    <FormField label={label} required={required}>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400"
      />
    </FormField>
  );
}
