import { formatClinicWorkingHours } from "./formatClinicWorkingHours";

export const transformDoctorData = (doctorData) => {
  if (!doctorData) {
    return null; // في حالة عدم وجود بيانات
  }

 

  return {
    id: String(doctorData.id),
    name: doctorData.ar_full_name || "اسم غير متوفر",
    enName:doctorData.en_full_name ||"اسم غير متوفر",
    speciality: doctorData.speciality || "تخصص غير محدد",
    avatar: doctorData.avatar || "صورة غير متوفرة",
     about: typeof doctorData.about === "string"
      ? JSON.parse(doctorData.about || "{}")
      : doctorData.about || {},
    phone: doctorData.phone || "غير متوفر",
    rating: doctorData.rating || 0,
    fee: doctorData.fee || 0,
    onlineFee: doctorData.online_fee || 0,
    onlineActive: doctorData.online_active === 1,
    online_appointment_time:doctorData.online_appointment_time,
    onlineSchedule: formatClinicWorkingHours(doctorData.online_schedule || []), // الحجز الإلكتروني
    clinics: Array.isArray(doctorData.clinics?.data)
      ? doctorData.clinics.data.map((clinic) => ({
          id: clinic.id,
          name: clinic.ar_name || "اسم غير متوفر",
          city: clinic.city?.ar_name || "مدينة غير محددة",
          address: clinic.address
            ? Object.values(clinic.address)
                .filter(Boolean) // إزالة القيم غير الصحيحة
                .join("، ") // دمج العنوان
            : "عنوان غير متوفر",
          phone: clinic.doctor?.phone || "غير متوفر",
          workingHours: formatClinicWorkingHours(clinic.schedule || []), // مواعيد العيادة
          appointment_time: clinic.appointment_time || 15, // وقت الحجز الافتراضي
        }))
      : [],
  };
};
