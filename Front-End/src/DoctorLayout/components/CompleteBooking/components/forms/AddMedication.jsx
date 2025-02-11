import { useContext, useState } from "react";
import { DoctorLayoutContext } from "../../../../context/DoctorLayoutContext";

export function AddMedication({ onAdd }) {
  const{medications}=useContext(DoctorLayoutContext);
  const [medication, setMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });

  const handleAdd = () => {
    if (!medication.name || !medication.dosage || !medication.frequency) {
      alert("Please fill in all medication fields!");
      return;
    }
    onAdd(medication); // إرسال الدواء للمكون الأب
    setMedication({ name: "", dosage: "", frequency: "" }); // إعادة تعيين الحقول
  };
 const handleMedicationChange = (e) => {
    const selectedName = e.target.value;
    setMedication((prev) => ({ ...prev, name: selectedName }));

    // البحث عن الدواء المحدد في القائمة
    const selectedMed = medications.find((med) => med.name === selectedName);

    if (selectedMed) {
      setMedication({ name: selectedMed.name, dosage: selectedMed.dosage, frequency: selectedMed.frequency });
    }
  };
 return (
  <div className="space-y-4">
    {/* حقول إدخال الدواء */}
    <div className="grid grid-cols-3 gap-4">
   
      {/* حقل اختيار أو إدخال اسم الدواء */}
      <input
        type="text"
        list="medications"
        placeholder="أدخل اسم الدواء أو اختر من القائمة"
        value={medication.name}
        onChange={handleMedicationChange}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-200 rounded-md px-4 py-2 focus:ring-blue-500 
                   focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 w-full"
      />
      
      {/* قائمة الأدوية */}
      <datalist id="medications">
        {medications.map((med, index) => (
          <option key={index} value={med.name} />
        ))}
      </datalist>

      {/* إدخال الجرعة */}
      <input
        type="text"
        placeholder="Dosage (e.g., 500mg)"
        value={medication.dosage}
        onChange={(e) => setMedication({ ...medication, dosage: e.target.value })}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-200 rounded-md px-4 py-2 focus:ring-blue-500 
                   focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 w-full"
      />

      {/* إدخال التكرار */}
      <input
        type="text"
        placeholder="Frequency (e.g., 3 times a day)"
        value={medication.instructions}
        onChange={(e) => setMedication({ ...medication, frequency: e.target.value })}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-200 rounded-md px-4 py-2 focus:ring-blue-500 
                   focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 w-full"
      />
   
    </div>

    {/* زر إضافة */}
    <button
      type="button"
      onClick={handleAdd}
      className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md 
                 hover:bg-blue-600 dark:hover:bg-blue-800 transition transform hover:scale-105"
    >
      Add Medication
    </button>
  </div>
);

}
