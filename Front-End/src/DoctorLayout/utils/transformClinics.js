import { generateFullSchedule, generateWorkDays } from "./daysTranslation";

// دالة لتحويل بيانات العيادات مع الجدول الزمني الكامل
export const transformClinics = (clinics) => {
  if (!Array.isArray(clinics)) {
    console.error("clinics is not an array:", clinics);
    return [];
  }

  return clinics.map((clinic) => {
    const schedule = clinic.schedule || []; // جدول زمني افتراضي إذا لم يكن موجودًا

  
  

   

    return {
      id: clinic.id,
      name: clinic.ar_name,
      en_name:clinic.en_name,
      licence_number: clinic.licence_number,
      city:{
        name:clinic.city?.ar_name || "غير متوفر",
        id:clinic.city?.id ||'null',
      },
      specialtiy:{
        name:clinic.specialist?.ar_name || "غير متوفر",
        id:clinic.specialist?.id ||'null'
      },
      address: `${clinic.address?.address_line_1 || ""}, ${clinic.address?.address_line_2 || ""}, ${clinic.address?.address_line_3 || ""}`,
      phone: clinic.clinic_phone || "غير متوفر",
      appointmentTime: clinic.appointment_time || "غير محدد",
      location: { lat: clinic.lat, long: clinic.long },
      workingDays: generateWorkDays(schedule) || "غير متوفر", // إضافة الأيام المتاحة فقط
      fullSchedule:generateFullSchedule(schedule), // إضافة الجدول الزمني الكامل
    };
  });
};
