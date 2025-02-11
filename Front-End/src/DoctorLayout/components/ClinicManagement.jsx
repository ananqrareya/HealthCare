import { Building2, Calendar, Clock, HeartPulse, Hospital, MapPin, Phone, Users } from 'lucide-react';
import React, { useContext, useState } from 'react';
import Loading from '../../Loading';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import WorkHoursModal from './WorkHoursModal';
import useUpdateClinicInfo from '../hooks/useUpdateClinicInfo';
import useUpdateClinicSchedule from '../hooks/useUpdateClinicSchedule';
import { handleSaveSchedule } from '../utils/updateScheduleUtils';
import Loader from './Loader';

export default function ClinicManagement() {
  const [activeClinic, setActiveClinic] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // حالة المودال
  const { updateClinicInfo, loading: updateLoading } = useUpdateClinicInfo();
  const { updateClinicSchedule, loading: updatedScheduleLoading } = useUpdateClinicSchedule();
  const [isModalFavOpen, setIsModalFavOpen] = useState(false);

  const { clinics, setClinics, loading, error, cities, specialties } = useContext(DoctorLayoutContext);




  const [id, setId] = useState();
  const [clinicName, setClinicName] = useState("");
  const [clinicEnName, setClinicEnName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [cityClinic, setCityClinic] = useState({});
  const [specialtyClinic, setSpecialtyClinic] = useState({});

  const [newAppointmentTime, setNewAppointmentTime] = useState(
    clinics?.[activeClinic]?.appointmentTime || null
  );
  const openEditModal = async (clinic) => {
    const addressParts = clinic.address ? clinic.address.split(",").map((part) => part.trim()) : [];
    setId(clinic.id);
    setClinicName(clinic.name);
    setClinicEnName(clinic.en_name);
    setCityClinic({
      name: clinic.city.name,
      id: clinic.city.id,
    });
    setSpecialtyClinic({
      name: clinic.specialtiy.name,
      id: clinic.specialtiy.id,
    });
    setAddressLine1(addressParts[0] || ""); // الخط الأول
    setAddressLine2(addressParts[1] || ""); // الخط الثاني
    setAddressLine3(addressParts[2] || ""); // الخط الثالث
    setClinicPhone(clinic.phone);


    setIsEditModalOpen(true);
  };

  const openModalFav = async (clinic) => {
    const addressParts = clinic.address ? clinic.address.split(",").map((part) => part.trim()) : [];
    setId(clinic.id);
    setClinicName(clinic.name);
    setClinicEnName(clinic.en_name);
    setCityClinic({
      name: clinic.city.name,
      id: clinic.city.id,
    });
    setSpecialtyClinic({
      name: clinic.specialtiy.name,
      id: clinic.specialtiy.id,
    });
    setAddressLine1(addressParts[0] || ""); // الخط الأول
    setAddressLine2(addressParts[1] || ""); // الخط الثاني
    setAddressLine3(addressParts[2] || ""); // الخط الثالث
    setClinicPhone(clinic.phone);

    setIsModalFavOpen(true);
  };
  const closeModalFav = () => {
    setIsModalFavOpen(false);
  };



  console.log("clinic", clinics);


  const handleSaveClinicInfo = async () => {


    const updatedInfo = {
      ar_name: clinicName,
      en_name: clinicEnName,
      address: {
        address_line_1: addressLine1 || "",
        address_line_2: addressLine2 || "",
        address_line_3: addressLine3 || "",
      },
      appointment_time: newAppointmentTime,
      clinic_phone: clinicPhone,
      city_id: cityClinic.id,
      specialist_id: specialtyClinic.id
    };



    const response = await updateClinicInfo(updatedInfo, id);

    if (response) {
      // تحديث البيانات محليًا
      setClinics((prevClinics) =>
        prevClinics.map((clinic) =>
          clinic.id === id
            ? {
              ...clinic,
              name: clinicName,
              en_name: clinicEnName,
              address: `${addressLine1}, ${addressLine2}, ${addressLine3}`,
              phone: clinicPhone,
              city: {
                name: cityClinic.name, // تأكد من أن `cityClinic` يحتوي على اسم المدينة
                id: cityClinic.id,
              },
              specialtiy: {
                name: specialtyClinic.name,
                id: specialtyClinic.id
              },
              appointmentTime: newAppointmentTime
            }
            : clinic
        )
      );
    }

    setIsEditModalOpen(false);
    setIsModalFavOpen(false);
  };


  const handleSave = async (updatedSchedule, clinicId) => {
    await handleSaveSchedule(updatedSchedule, clinicId, updateClinicSchedule, setModalOpen);

  }


  if (loading || updateLoading || updatedScheduleLoading) {
    return (
      <Loader />
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">حدث خطأ!</h1>
          <p className="text-gray-500">{error.message || "عذرًا، حدث خطأ أثناء تحميل البيانات."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة العيادات</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          إضافة عيادة جديدة
        </button>
      </div>
      {clinics != null ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clinics List */}
          <div className="lg:col-span-1 space-y-4">
            {clinics.map((clinic, index) => (
              <button
                key={clinic.id}
                onClick={() => setActiveClinic(index)}
                className={`w-full text-right p-4 rounded-xl border transition-all duration-200
        ${activeClinic === index
                    ? 'border-indigo-200 bg-indigo-50 dark:bg-indigo-800 dark:border-indigo-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/50'
                  }`}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center">
                    <Building2 className="text-indigo-600 dark:text-indigo-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{clinic.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{clinic.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>


          {/* Clinic Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              {/* عنوان القسم */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{clinics[activeClinic].name} </h2>
                <p className="text-gray-500">تفاصيل العيادة وإعدادات الجدول</p>
              </div>

              {/* تفاصيل العيادة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
                {/* تفاصيل العنوان وساعات العمل */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Hospital className="text-gray-400" size={20} />  {/* رمز المستشفى أو العيادة */}
                    <span className="text-gray-600 dark:text-gray-400">{clinics[activeClinic]?.en_name || "غير متوفر"}</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Hospital className="text-gray-400" size={20} />  {/* رمز المستشفى أو العيادة */}
                    <span className="text-gray-600 dark:text-gray-400">{clinics[activeClinic]?.specialtiy?.name || "غير متوفر"}</span>
                  </div>
                  {/* عنوان العيادة */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <MapPin className="text-gray-400" size={20} />
                    <span className="text-gray-600 dark:text-gray-400">{clinics[activeClinic]?.city?.name || "غير متوفر"}</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <MapPin className="text-gray-400" size={20} />
                    <span className="text-gray-600 dark:text-gray-400">{clinics[activeClinic].address || "غير متوفر"}</span>
                  </div>

                  {/* رقم الهاتف */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Phone className="text-gray-400" size={20} />
                    <span className="text-gray-600 dark:text-gray-400">{clinics[activeClinic].phone || "غير متوفر"}</span>
                  </div>

                  {/* ساعات وأيام العمل */}
                  <div className="space-y-4">
                    {/* أيام وساعات العمل */}
                    <div className="flex items-start gap-3">
                      <Calendar className="text-gray-500 dark:text-gray-300" size={20} />
                      <div className="w-full">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 dark:text-gray-200">أيام وساعات العمل</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            {clinics[activeClinic].workingDays
                              ? clinics[activeClinic].workingDays.split(",").map((dayWithTime, index) => (
                                <li
                                  key={index}
                                  className="flex justify-start items-center border-b pb-2 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg"
                                >
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">{dayWithTime}</span>

                                </li>
                              ))
                              : "غير محدد"}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>











                </div>

                {/* إحصائيات سريعة */}
                <div className="bg-indigo-50 dark:bg-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 dark:text-gray-100">إحصائيات سريعة</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* المرضى اليوم */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <Users className="text-indigo-600 " size={20} />
                        <span className="text-gray-600 dark:text-gray-100 ">المرضى اليوم</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-300">24</p>
                    </div>

                    {/* وقت الانتظار */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <Clock className="text-indigo-600" size={20} />
                        <span className="text-gray-600 dark:text-gray-100">وقت الانتظار</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-300">{clinics[activeClinic].appointmentTime} دقيقة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* إعدادات الجدول */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4 dark:text-gray-100">إعدادات الجدول</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ساعات العمل */}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="p-4 text-center rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800"
                  >
                    <Clock className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" size={24} />
                    <span className="text-gray-600 dark:text-gray-200">ساعات العمل</span>
                  </button>


                  {/* زر تعديل معلومات العيادة */}
                  <button
                    onClick={() => openEditModal(clinics[activeClinic])} // تمرير بيانات العيادة الحالية
                    className="p-4 text-center rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800"
                  >
                    <Calendar className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" size={24} />
                    <span className="text-gray-600 dark:text-gray-200">تعديل معلومات العيادة</span>
                  </button>


                  {/* تفضيلات */}
                  <button
                    className="p-4 text-center rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800"
                    onClick={() => openModalFav(clinics[activeClinic])}

                  >
                    <Users className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" size={24} />
                    <span className="text-gray-600 dark:text-gray-200">تفضيلات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : <p className="text-center text-gray-500 dark:text-gray-400">
        لا توجد مواعيد متاحة بناءً على الفلتر المحدد.
      </p>}
      <WorkHoursModal
        clinicName={clinics[activeClinic].name}
        schedule={clinics[activeClinic].fullSchedule} // جدول العمل الحالي للعيادة
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(updatedSchedule) =>
          handleSave(
            updatedSchedule, // الجدول الذي تم تعديله
            clinics[activeClinic].id, // معرف العيادة

          )
        }
      />



      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            {/* زر الإغلاق */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 "
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center dark:text-gray-100">
              تعديل معلومات العيادة
            </h2>

            <div className="space-y-4">
              {/* اسم العيادة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">اسم العيادة</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" > اسم العيادة بالإنجليزي</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clinicEnName}
                  onChange={(e) => setClinicEnName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">التخصص</label>
                <select
                  className="w-full p-3 border rounded-lg dark:bg-gray-700  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={specialtyClinic.id || ""}  // عرض الـ id للمقارنة مع التخصص المحدد
                  onChange={(e) => {
                    const selectedSpecialty = specialties.find(spec => spec.id === parseInt(e.target.value));  // التأكد من مطابقة الـ id
                    if (selectedSpecialty) {
                      setSpecialtyClinic({ name: selectedSpecialty.ar_name, id: selectedSpecialty.id });  // تحديث التخصص
                    }
                  }}
                >
                  <option value="" disabled>اختر التخصص</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.ar_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المدينة</label>
                <select
                  className="w-full p-3 border rounded-lg dark:bg-gray-700  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={cityClinic.id || ""}  // عرض الـ id للمقارنة مع المدينة المحددة
                  onChange={(e) => {
                    const selectedCity = cities.find(city => city.id === parseInt(e.target.value));  // التأكد من مطابقة الـ id
                    if (selectedCity) {
                      setCityClinic({ name: selectedCity.ar_name, id: selectedCity.id });  // تحديث الـ cityClinic
                    }
                  }}
                >
                  <option value="" disabled>اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.ar_name}
                    </option>
                  ))}
                </select>
              </div>



              {/* العنوان */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان - الخط الأول</label>
                <input
                  type="text"
                  className="w-full p-3 dark:bg-gray-700  dark:text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">العنوان - الخط الثاني</label>
                <input
                  type="text"
                  className="w-full p-3 border dark:bg-gray-700  dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان - الخط الثالث</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={addressLine3}
                  onChange={(e) => setAddressLine3(e.target.value)}
                />
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                />
              </div>
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveClinicInfo} // استدعاء الدالة لحفظ التغييرات
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* المودال */}
      {isModalFavOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full sm:w-4/5 md:w-1/2 lg:w-1/3 xl:w-1/4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">تغيير وقت الموعد</h2>

            {/* حقل تغيير وقت الموعد */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">وقت الموعد (دقيقة)</label>
              <input
                type="number"
                value={newAppointmentTime}
                onChange={(e) => setNewAppointmentTime(e.target.value)}
                className="w-full p-3 border dark:bg-gray-700 dark:text-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
              />
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex justify-end gap-4 mt-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500"
                onClick={closeModalFav}
              >
                إغلاق
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out"
                onClick={handleSaveClinicInfo}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );

}