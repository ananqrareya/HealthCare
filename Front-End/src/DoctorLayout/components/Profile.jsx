import { Calendar, Camera, FileText, IdCard, Mail, MapPin, Phone, Trash2, User, UserCircle, X } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import useUpdateDoctorInfo from '../hooks/useUpdateDoctorInfo';
import Loading from '../../Loading';
import Loader from './Loader';
import NewPassword from '../../auth/NewPassword';



export default function Profile() {
  const apiUrl = import.meta.env.VITE_APP_KEY;

  const { personalInfo, setPersonalInfo, preferences, setPreferences, overview, setOverview, loading, qualifications, setQualifications, error } = useContext(DoctorLayoutContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة فتح/إغلاق المودال
  const { updateDoctorInfo, loading: loadingUpdate, error: updateError } = useUpdateDoctorInfo();

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // إضافة حالة القائمة

  const [newQualification, setNewQualification] = useState({ name: "", position: "" });

  // إضافة شهادة جديدة

  const handleAddQualification = () => {
    if (newQualification.name && newQualification.position) {
      setQualifications([...qualifications, newQualification]);
      setNewQualification({ name: "", position: "" });
    }
  };
  const handleDeleteQualification = (index) => {
    // إزالة الشهادة بناءً على الفهرس
    const updatedQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(updatedQualifications);
  };

  // حفظ النبذة والشهادات
  const handleSave = async () => {
    const aboutData = {
      overview, // النبذة
      qualifies: qualifications, // الشهادات
    };

    console.log("About Data:", aboutData);

    try {
      // تحويل الكائن إلى JSON
      const dataToSend = {
        about: JSON.stringify(aboutData), // تحويل `aboutData` إلى JSON string
      };

      // إرسال البيانات إلى الخادم
      await updateDoctorInfo(dataToSend);

      // إغلاق المودال بعد الحفظ
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving about data:", error);
    }
  };




  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false); // حالة المودال

  const handleSavePersonalInfo = async () => {
    const updatedData = {
      first_name: personalInfo.first_name,
      last_name: personalInfo.last_name,
      en_first_name: personalInfo.en_first_name,
      en_last_name: personalInfo.en_last_name,
      phone: personalInfo.phone,
      username: personalInfo.username,
    };
    await updateDoctorInfo(updatedData);

    setIsPersonalModalOpen(false); // إغلاق المودال بعد الحفظ
  };


  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // حالة فتح/إغلاق المودال

  const handleUpdatePreferences = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
  };

  // حفظ البيانات
  const handleSavePreferences = async () => {
    const updatePreferences = {
      online_appointment_time: preferences.waitingTime,
      online_fee: preferences.onlinePrice,
      fee: preferences.clinicPrice
    }

    await updateDoctorInfo(updatePreferences);
    setIsBookingModalOpen(false); // إغلاق المودال بعد الحفظ
  };


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت.");
        return;
      }
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadImage = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "يرجى اختيار صورة قبل الإرسال.",
      });
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await axios.post(`${apiUrl}/api/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "تم الحفظ!",
          text: "تم تحديث الصورة الشخصية بنجاح.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تحميل الصورة. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async () => {
    try {
      const confirmation = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "سيتم حذف الصورة الشخصية بشكل نهائي!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم، احذفها",
        cancelButtonText: "إلغاء",
      });

      if (confirmation.isConfirmed) {
        const response = await axios.delete(`${apiUrl}/api/avatar`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "تم الحذف!",
            text: "تم حذف الصورة الشخصية بنجاح.",
            timer: 3000,
            showConfirmButton: false,
          });

          // إعادة تعيين الصورة إلى القيمة الافتراضية
          setPreviewImage(null);
          personalInfo.image = null;
        }
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء حذف الصورة. يرجى المحاولة مرة أخرى.",
      });
    }
  };

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
  if (loadingUpdate || loading || uploading) {
    return (
      <Loader />
    )
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-6 space-x-reverse mb-6">
          <div className="relative">
            {/* الصورة الشخصية */}
            <img
              src={previewImage || personalInfo.image || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="h-40 w-40 rounded-full object-cover border-4 border-blue-500 dark:border-blue-300 cursor-pointer transition-transform duration-300 transform hover:scale-105"
            />
            {/* أيقونة الكاميرا */}
            <button
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Camera className="h-5 w-5" />
            </button>
            {/* قائمة الخيارات */}
            {isDropdownOpen && (
              <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-48 text-gray-700 dark:text-gray-200 z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                  onClick={() => document.getElementById("picture").click()}
                >
                  <Camera className="w-5 h-5 text-green-500" />
                  <span>تغيير الصورة</span>
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // قم بتحديث الصورة في المعاينة
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result); // تحديث الصورة في الواجهة
                        };
                        reader.readAsDataURL(file);

                        // استدعاء وظيفة تحميل الصورة
                        setSelectedFile(file); // تخزين الملف في حالة للاستخدام في `uploadImage`
                        uploadImage(); // استدعاء الوظيفة لتحميل الصورة
                      }
                    }}
                  />
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                  onClick={deleteImage}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span>حذف الصورة</span>
                </button>
              </div>
            )}
            {/* إدخال الصورة */}
            <input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          <div className="mt-3 space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              د. {personalInfo.ar_full_name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{personalInfo.speciality}</p>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin className="text-mainColor" size={18} />
              <span className="text-gray-500 dark:text-gray-400">{personalInfo.location}</span>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-lg border-b border-gray-300 dark:border-gray-600 pb-2">
              المعلومات الشخصية
            </h2>
            <div className="space-y-4">
              {/* الاسم الكامل ورقم الهوية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">الاسم الكامل بالإنجليزية</label>
                  <div className="flex items-center gap-3">
                    <User className="text-mainColor" size={24} />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{personalInfo.en_full_name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">الاسم الكامل بالعربي</label>
                  <div className="flex items-center gap-3">
                    <User className="text-mainColor" size={24} />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{personalInfo.ar_full_name}</span>
                  </div>
                </div>
              </div>

              {/* الإيميل واسم المستخدم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">البريد الإلكتروني</label>
                  <div className="flex items-center gap-3">
                    <Mail className="text-mainColor" size={24} />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{personalInfo.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">اسم المستخدم</label>
                  <div className="flex items-center gap-3">
                    <UserCircle className="text-mainColor" size={24} />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{personalInfo.username}</span>
                  </div>
                </div>
              </div>

              {/* رقم الهاتف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">رقم الهوية</label>
                  <div className="flex items-center gap-3">
                    <IdCard className="text-mainColor" size={24} />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{personalInfo.id_number}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">رقم الهاتف</label>
                  <div className="flex items-center gap-3">
                    <Phone className="text-mainColor" size={24} />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{personalInfo.phone}</span>
                  </div>
                </div>
              </div>

              {/* تاريخ الانضمام */}
              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">تاريخ الانضمام</label>
                <div className="flex items-center gap-3">
                  <Calendar className="text-mainColor" size={24} />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">انضممت في {personalInfo.joinedDate}</span>
                </div>
              </div>

              {/* آخر تحديث */}
              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">آخر تحديث</label>
                <div className="flex items-center gap-3">
                  <Calendar className="text-mainColor" size={24} />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {personalInfo.lastUpdated || "غير متوفر"}
                  </span>
                </div>
              </div>
            </div>


          </div>


          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-4 border-b border-gray-300 pb-2">
              التخصصات والشهادات
            </h2>
            <div className="space-y-4">
              {/* لمحة عامة */}
              <p className="text-gray-600   dark:text-gray-100 leading-relaxed">{overview}</p>

              {/* قائمة الشهادات */}
              <div className="space-y-3 ">
                {qualifications.map((qualify, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800  rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold text-gray-500 dark:text-gray-100">{qualify.name}</p>
                    <p className="text-sm text-gray-500">{qualify.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">الإعدادات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setIsPersonalModalOpen(true)} // فتح المودال
              className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800">
              <User className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" size={24} />
              <span className="text-gray-600 dark:text-gray-200">تعديل الملف الشخصي</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)} // فتح المودال عند الضغط
              className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800">

              <FileText className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" size={24} />
              <span className="text-gray-600 dark:text-gray-200">الوثائق والشهادات</span>
            </button>
            <button className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Calendar className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" size={24} />
              <span className="text-gray-600 dark:text-gray-200"> تفضيلات الحجز </span>
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4 relative">
            {/* زر إغلاق */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">الوثائق والشهادات</h2>

            {/* حقل نبذة عنك */}
            <textarea
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              rows="3"
              placeholder="نبذة عنك..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            />

            {/* حقل إضافة شهادة */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="اسم الشهادة"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={newQualification.name}
                onChange={(e) => setNewQualification({ ...newQualification, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="الجهة"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={newQualification.position}
                onChange={(e) =>
                  setNewQualification({ ...newQualification, position: e.target.value })
                }
              />
            </div>
            <button
              onClick={handleAddQualification}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              إضافة شهادة
            </button>

            {/* قائمة الشهادات */}
            <div className="space-y-2">
              {qualifications.map((qualify, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{qualify.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{qualify.position}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteQualification(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* زر الحفظ */}
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              حفظ
            </button>
          </div>
        </div>
      )}


      {isPersonalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl h-full max-h-[90vh] overflow-y-scroll p-6 relative transform transition-transform scale-95 animate-fade-in">
            {/* زر الإغلاق */}
            <button
              onClick={() => setIsPersonalModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X size={28} />
            </button>

            {/* عنوان المودال */}
            <div className="mb-6 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                تعديل المعلومات الشخصية
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                يمكنك تعديل البيانات الشخصية باستثناء الحقول الثابتة.
              </p>
            </div>

            {/* عرض البيانات */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* الاسم الأول */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  الاسم الأول
                </label>
                <input
                  type="text"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  value={personalInfo.first_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, first_name: e.target.value })
                  }
                />
              </div>

              {/* اسم العائلة */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  اسم العائلة
                </label>
                <input
                  type="text"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  value={personalInfo.last_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, last_name: e.target.value })
                  }
                />
              </div>

              {/* الاسم الأول بالإنجليزية */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  الاسم الأول بالإنجليزية
                </label>
                <input
                  type="text"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  value={personalInfo.en_first_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, en_first_name: e.target.value })
                  }
                />
              </div>

              {/* اسم العائلة بالإنجليزية */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  اسم العائلة بالإنجليزية
                </label>
                <input
                  type="text"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  value={personalInfo.en_last_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, en_last_name: e.target.value })
                  }
                />
              </div>

              {/* رقم الهوية (غير قابل للتعديل) */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  رقم الهوية
                </label>
                <p className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg w-full text-gray-600 dark:text-gray-300">
                  {personalInfo.id_number}
                </p>
              </div>

              {/* اسم المستخدم */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  value={personalInfo.username}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* تعديل البيانات القابلة للتعديل */}
            <div className="mt-6 border-t dark:border-gray-600 pt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* رقم الهاتف */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  placeholder="أدخل رقم الهاتف"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone: e.target.value })
                  }
                />
              </div>

              {/* البريد الإلكتروني (غير قابل للتعديل) */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  البريد الإلكتروني
                </label>
                <p className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg w-full text-gray-600 dark:text-gray-300">
                  {personalInfo.email}
                </p>
              </div>
            </div>

            {/* زر الحفظ */}
            <div className="mt-6 text-center">
              <button
                onClick={handleSavePersonalInfo}
                className="px-4 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-transform w-full md:w-auto"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}



      {/* المودال */}

      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-8 relative space-y-6">
            {/* زر إغلاق المودال */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-red-500"
            >
              <X size={20} />
            </button>

            {/* عنوان المودال */}
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              تفضيلات الحجز
            </h2>

            {/* الحقول */}
            <div className="space-y-6">
              {/* سعر الحجز الأونلاين */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  سعر الحجز أونلاين
                </label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">₪</span>
                  <input
                    type="number"
                    className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2 text-gray-800 dark:text-gray-100 dark:bg-gray-700"
                    value={preferences.onlinePrice}
                    onChange={(e) =>
                      handleUpdatePreferences("onlinePrice", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>السعر الحالي: </span><span>₪{preferences.onlinePrice}</span>
                </div>
              </div>

              {/* سعر الحجز في العيادة */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  سعر الحجز في العيادة
                </label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">₪</span>
                  <input
                    type="number"
                    className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2 text-gray-800 dark:text-gray-100 dark:bg-gray-700"
                    value={preferences.clinicPrice}
                    onChange={(e) =>
                      handleUpdatePreferences("clinicPrice", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>السعر الحالي: </span><span>₪{preferences.clinicPrice}</span>
                </div>
              </div>

              {/* وقت الانتظار */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  وقت الانتظار (بالدقائق)
                </label>
                <div className="flex items-center space-x-2 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                  <input
                    type="number"
                    className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2 text-gray-800 dark:text-gray-100 dark:bg-gray-700"
                    value={preferences.waitingTime}
                    onChange={(e) =>
                      handleUpdatePreferences("waitingTime", parseInt(e.target.value))
                    }
                  />
                  <span className="text-gray-500 dark:text-gray-400">دقيقة</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>الوقت الحالي: </span><span>{preferences.waitingTime} دقيقة</span>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">الأمان والخصوصية</h2>
        <div className="space-y-4">
          <button className="w-full text-right p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-800 transition"
            onClick={() => setShowNewPassword(true)}
          >
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">تغيير كلمة المرور</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              قم بتحديث كلمة المرور الخاصة بك بشكل دوري
            </p>
          </button>
          {showNewPassword && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                {/* زر الإغلاق */}
                <button
                  onClick={() => setShowNewPassword(false)}
                  className="absolute top-4 right-4 text-gray-400 dark:text-gray-600 hover:text-red-500"
                >
                  <X size={20} />
                </button>

                {/* محتوى النافذة */}
                <NewPassword />
              </div>
            </div>
          )}




        </div>
      </div>

    </div>
  );
}