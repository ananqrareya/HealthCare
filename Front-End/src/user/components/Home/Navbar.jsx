import axios from 'axios';
import { Bell, LogIn, Menu, User, X } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useChatContext } from 'stream-chat-react';
import logo from '../../../assets/logo.svg';
import { RealTimeContext } from '../../../context/RealTimeContext';
import { UserContext } from '../../../context/UserContextProvider';

export default function Header() {

    const { isLoggedIn, logout } = useContext(UserContext);
    const {notifications,unreadCount,markAllNotificationsAsRead,markNotificationAsRead}=useContext(RealTimeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { client } = useChatContext(); // الوصول إلى Stream Chat Client
    const apiUrl = import.meta.env.VITE_APP_KEY;

    console.log("Navbar notif",notifications);

    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false); // حالة فتح/إغلاق المودال
const [selectedNotification, setSelectedNotification] = useState(null); // الإشعار المحدد


const [isDropdownOpen, setIsDropdownOpen] = useState(false); // حالة القائمة المنسدلة
const dropdownRef = useRef(null);
   // const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // حالة القائمة المنسدلة للموبايل
const navigate = useNavigate();
 
const [isNotificationOpen, setIsNotificationOpen] = useState(false);



useEffect(() => {
  console.log("Updated notifications:", notifications); // تحقق من الإشعارات التي تم تحديثها
}, [notifications]); // هذا سيعمل عندما تتغير الإشعارات


    
    

    



    // استماع لإشعارات Stream (الرسائل الجديدة)
    useEffect(() => {
        if (!client) {
            console.error("Stream Chat client is not initialized.");
            return;
        }

        const handleNewMessage = (event) => {
            if (event.channel_type === "messaging" && event.user.id !== client.userID) {
                const newNotification = {
                    id: event.message.id,
                    senderId: event.user.id,
                    senderName: event.user.name,
                    message: event.message.text,
                    channelId: event.channel_id,
                    source: 'stream',
                    read: false, // تعيين الإشعار كغير مقروء
                };

                //setNotifications((prev) => [...prev, newNotification]);
                //setUnreadCount((prev) => prev + 1);
            }
        };

        client.on("message.new", handleNewMessage);

        return () => {
            client.off("message.new", handleNewMessage);
        };
    }, [client]);







    const handleLoginClick = () => {
        navigate('/login'); // يقوم بالتنقل إلى صفحة /login عند الضغط
    };
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('notifications');

        logout(); // استدعاء وظيفة تسجيل الخروج

        navigate("/login"); // توجيه المستخدم إلى صفحة تسجيل الدخول
    };
    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);

        } else {
            document.removeEventListener("mousedown", handleClickOutside);


        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);


        };
    }, [isDropdownOpen]);


    const toggleNotifications = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const sendRating = async (ratingData) => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/ratings`,
                ratingData,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "s",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log('تم إرسال التقييم بنجاح:', ratingData);
            alert('تم إرسال التقييم بنجاح! شكرًا لتقييمك 😊');
        } catch (error) {
            console.error('خطأ أثناء إرسال التقييم:', error);
            alert('حدث خطأ أثناء إرسال التقييم. حاول مرة أخرى.');
        }
    };
    return (
        <header className="text-sm py-4 mb-5 border-b border-b-[#ADADAD]" dir="rtl">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* الشعار والعلامة التجارية */}
                    <div className="flex items-center space-x-4">
                        <Link to={"/"}>
                            <img
                                src={logo}
                                alt="this is logo"
                                className="w-44 cursor-pointer "
                            />
                        </Link>
                    </div>






                    {/* التنقل لسطح المكتب */}
                    <nav className="hidden md:flex items-center space-x-12" dir="rtl">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-blue-200 text-blue-600 px-4 py-2 rounded-lg text-darkText transition-all duration-200 font-medium font-arabic text-xl custom-margin'
                                    : 'text-darkText hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 font-medium font-arabic text-xl custom-margin'
                            }
                        >
                            الرئيسية
                        </NavLink>
                        <NavLink
                            to="/clinics"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-blue-200 text-blue-600 px-4 py-2 rounded-lg text-darkText transition-all duration-200 font-medium font-arabic text-xl'
                                    : 'text-darkText hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 font-medium font-arabic text-xl'
                            }
                        >
                            العيادات
                        </NavLink>
                        <NavLink
                            to="/doctor"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-blue-200 text-blue-600 px-4 py-2 rounded-lg text-darkText transition-all duration-200 font-medium font-arabic text-xl'
                                    : 'text-darkText hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 font-medium font-arabic text-xl'
                            }
                        >
                            الدكاترة
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-blue-200 text-blue-600 px-4 py-2 rounded-lg text-darkText transition-all duration-200 font-medium font-arabic text-xl'
                                    : 'text-darkText hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 font-medium font-arabic text-xl'
                            }
                        >
                            عنّا
                        </NavLink>
                        <NavLink
                            to="/guide"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-blue-200 text-blue-600 px-4 py-2 rounded-lg text-darkText transition-all duration-200 font-medium font-arabic text-xl'
                                    : 'text-darkText hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 font-medium font-arabic text-xl'
                            }
                        >
                            دليلك
                        </NavLink>


                    </nav>


                    {/* زر الدخول أو القائمة المنسدلة حسب حالة المستخدم */}
                    <div className="hidden md:flex items-center" ref={dropdownRef}>
                        {isLoggedIn &&
                            <div className="relative z-10 ml-2">
                                <button
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 relative"
                                    onClick={toggleNotifications}
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">

                                        <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg">
                                        <div className="p-4">
                                            {notifications.filter((n) => !n.read).length > 0 && (
                                                <div>
                                                    <h3 className="text-gray-600 font-semibold mb-2">الإشعارات الجديدة</h3>
                                                    <div className="max-h-48 overflow-y-auto">
                                                        <ul className="text-gray-700 text-sm space-y-2">
                                                            {notifications
                                                                .filter((n) => !n.read)
                                                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                .map((notification) => (
                                                                    <li
                                                                        key={notification.id}
                                                                        className="border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        onClick={() => {
                                                                            if (notification.type === 'rating') {
                                                                                // تحديث الإشعار ليصبح مقروء
                                                                            markNotificationAsRead(notification.id);

                                                                                // حفظ جميع بيانات الإشعار
                                                                                setSelectedNotification({
                                                                                    id: notification.id,
                                                                                    patient_id: notification.patient_id,
                                                                                    appointmentId: notification.appointment_id,
                                                                                    doctor_name: notification.doctor_name,
                                                                                    doctor_id: notification.doctor_id,
                                                                                    message: notification.message,
                                                                                    type: notification.type,
                                                                                    created_at: notification.created_at,
                                                                                    rating: 0, // التقييم الافتراضي
                                                                                    comment: '', // التعليق الافتراضي
                                                                                });
                                                                                setIsRatingModalOpen(true); // فتح المودال
                                                                            } else {
                                                                                // باقي العمليات للإشعارات الأخرى
                                                                                markNotificationAsRead(notification.id);

                                                                                if (notification.source === 'pusher') {
                                                                                    navigate(`/appointment-details/${notification.id}`);
                                                                                } else if (notification.source === 'stream') {
                                                                                    navigate(`/chat?doctorId=${notification.senderId}`);
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        {notification.message}
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                            {notifications.filter((n) => n.read).length > 0 && (
                                               <div>
                    <h3 className="text-gray-600 font-semibold mt-4 mb-2">الإشعارات المقروءة</h3>
                    <div className="max-h-48 overflow-y-auto">
                        <ul className="text-gray-700 text-sm space-y-2">
                            {notifications
                                .filter((n) => n.read && n.source === 'pusher')
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((notification) => (
                                    <li
                                        key={notification.id}
                                        className="border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer bg-gray-100"
                                        onClick={() => navigate(`/appointment-details/${notification.id}`)}
                                    >
                                        <strong></strong> {notification.message}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
                                            )}
                                        </div>
                                        <button onClick={markAllNotificationsAsRead} className="block w-full py-2 text-center text-sm text-blue-500">
                                            علامة كـ "مقروء"
                                        </button>
                                    </div>
                                )}




                            </div>

                        }
                        {isRatingModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fade-in">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                        تقييم الخدمة
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 text-center">
                                        الدكتور: {selectedNotification?.doctor_name}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4 text-center">
                                        {selectedNotification?.message}
                                    </p>
                                    {/* اختيار النجوم */}
                                    <div className="flex items-center justify-center mb-4 space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={star <= (selectedNotification?.rating || 0) ? '#FFD700' : '#E5E7EB'}
                                                className={`w-10 h-10 cursor-pointer transition-transform duration-200 ${star <= (selectedNotification?.rating || 0) ? 'scale-110' : 'hover:scale-110'
                                                    }`}
                                                onClick={() =>
                                                    setSelectedNotification((prev) => ({
                                                        ...prev,
                                                        rating: star,
                                                    }))
                                                }
                                                aria-label={`تقييم ${star} نجوم`}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* إدخال التعليق */}
                                    <textarea
                                        className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="اكتب تعليقك هنا..."
                                        value={selectedNotification?.comment || ''}
                                        onChange={(e) =>
                                            setSelectedNotification((prev) => ({
                                                ...prev,
                                                comment: e.target.value,
                                            }))
                                        }
                                    />
                                    {/* أزرار الإرسال والإغلاق */}
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                                            onClick={() => setIsRatingModalOpen(false)}
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-lg transition-all text-white ${selectedNotification?.rating
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : 'bg-blue-300 cursor-not-allowed'
                                                }`}
                                            onClick={() => {
                                                if (selectedNotification?.rating) {
                                                    // إعداد بيانات التقييم
                                                    const ratingData = {
                                                        patient_id: selectedNotification.patient_id,
                                                        doctor_id: selectedNotification.doctor_id,
                                                        rating: selectedNotification.rating,
                                                        review: selectedNotification.comment || '',
                                                    };

                                                    // استدعاء الدالة لإرسال التقييم
                                                    sendRating(ratingData);

                                                    // إغلاق المودال
                                                    setIsRatingModalOpen(false);
                                                }
                                            }}
                                            disabled={!selectedNotification?.rating}
                                        >
                                            إرسال التقييم
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoggedIn ? (

                            <div className="relative z-10">

                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                        <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>

                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute custome-space w-40 mt-2 bg-white shadow-lg rounded-lg border border-gray-200">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            الملف الشخصي
                                        </Link>
                                        <Link to="/booking-history-online" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            حجزك الأونلاين
                                        </Link>
                                        <Link to="/medical-record" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            السجل الطبي
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                        >
                                            تسجيل الخروج
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginClick}
                                className="flex items-center space-x-3 px-6 py-3 rounded-full bg-transparent text-[rgb(95,111,255)] border-2 border-[rgb(95,111,255)] hover:bg-[rgb(95,111,255)] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(95,111,255)]"
                            >
                                <LogIn size={20} className="transition-transform duration-300 transform hover:rotate-180" />
                                <span className="font-medium">تسجيل الدخول</span>
                            </button>
                        )}
                    </div>

                    {/* زر القائمة للموبايل */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-[rgb(95,111,255)]/80 transition-colors duration-200"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* التنقل للموبايل */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-4`}>
                    <nav className="flex flex-col space-y-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-black font-bold text-[rgb(95,111,255)]'
                                    : 'text-[rgb(95,111,255)] hover:text-black transition-colors duration-200 font-medium text-2xl'
                            }
                        >
                            الرئيسية
                        </NavLink>
                        <NavLink
                            to="/doctors"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-black font-bold text-[rgb(95,111,255)]'
                                    : 'text-[rgb(95,111,255)] hover:text-black transition-colors duration-200 font-medium text-2xl'
                            }
                        >
                            الأطباء
                        </NavLink>
                        <NavLink
                            to="/clinics"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-black font-bold text-[rgb(95,111,255)]'
                                    : 'text-[rgb(95,111,255)] hover:text-black transition-colors duration-200 font-medium text-2xl'
                            }
                        >
                            العيادات
                        </NavLink>
                        <NavLink
                            to="/doctor"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-black font-bold text-[rgb(95,111,255)]'
                                    : 'text-[rgb(95,111,255)] hover:text-black transition-colors duration-200 font-medium text-2xl'
                            }
                        >
                            الدكاترة
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-black font-bold text-[rgb(95,111,255)]'
                                    : 'text-[rgb(95,111,255)] hover:text-black transition-colors duration-200 font-medium text-2xl'
                            }
                        >
                            عنّا
                        </NavLink>
                        <NavLink
                            to="/guide"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-black font-bold text-[rgb(95,111,255)]'
                                    : 'text-[rgb(95,111,255)] hover:text-black transition-colors duration-200 font-medium text-2xl'
                            }
                        >
                            دليلك
                        </NavLink>
                    </nav>

                    {/* زر التسجيل أو الدخول - للموبايل */}
                    <div className="flex flex-col md:flex items-center space-y-2 mt-4 pb-2">
                        <div className='flex items-center'>
                            {isLoggedIn &&
                                <div className="relative z-10 ml-2">
                                    <button
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 relative"
                                        onClick={toggleNotifications}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">

                                            <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                        {isNotificationOpen && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg">
                                        <div className="p-4">
                                            {notifications.filter((n) => !n.read).length > 0 && (
                                                <div>
                                                    <h3 className="text-gray-600 font-semibold mb-2">الإشعارات الجديدة</h3>
                                                    <div className="max-h-48 overflow-y-auto">
                                                        <ul className="text-gray-700 text-sm space-y-2">
                                                            {notifications
                                                                .filter((n) => !n.read)
                                                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                .map((notification) => (
                                                                    <li
                                                                        key={notification.id}
                                                                        className="border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer"
                                                                        onClick={() => {
                                                                            if (notification.type === 'rating') {
                                                                                // تحديث الإشعار ليصبح مقروء
                                                                            markNotificationAsRead(notification.id);

                                                                                // حفظ جميع بيانات الإشعار
                                                                                setSelectedNotification({
                                                                                    id: notification.id,
                                                                                    patient_id: notification.patient_id,
                                                                                    appointmentId: notification.appointment_id,
                                                                                    doctor_name: notification.doctor_name,
                                                                                    doctor_id: notification.doctor_id,
                                                                                    message: notification.message,
                                                                                    type: notification.type,
                                                                                    created_at: notification.created_at,
                                                                                    rating: 0, // التقييم الافتراضي
                                                                                    comment: '', // التعليق الافتراضي
                                                                                });
                                                                                setIsRatingModalOpen(true); // فتح المودال
                                                                            } else {
                                                                                // باقي العمليات للإشعارات الأخرى
                                                                                markNotificationAsRead(notification.id);

                                                                                if (notification.source === 'pusher') {
                                                                                    navigate(`/appointment-details/${notification.id}`);
                                                                                } else if (notification.source === 'stream') {
                                                                                    navigate(`/chat?doctorId=${notification.senderId}`);
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        {notification.message}
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                            {notifications.filter((n) => n.read).length > 0 && (
                                               <div>
                    <h3 className="text-gray-600 font-semibold mt-4 mb-2">الإشعارات المقروءة</h3>
                    <div className="max-h-48 overflow-y-auto">
                        <ul className="text-gray-700 text-sm space-y-2">
                            {notifications
                                .filter((n) => n.read && n.source === 'pusher')
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((notification) => (
                                    <li
                                        key={notification.id}
                                        className="border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer bg-gray-100"
                                        onClick={() => navigate(`/appointment-details/${notification.id}`)}
                                    >
                                        <strong>  </strong> {notification.message}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
                                            )}
                                        </div>
                                        <button onClick={markAllNotificationsAsRead} className="block w-full py-2 text-center text-sm text-blue-500">
                                            علامة كـ "مقروء"
                                        </button>
                                    </div>
                                )}
                                </div>

                            }
                            {isLoggedIn ? (
                                <div className="relative z-10">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                            <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 w-48 mt-2 bg-white shadow-lg rounded-lg border border-gray-200">
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                الملف الشخصي
                                            </Link>
                                            <Link to="/booking-history-online" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                حجزك الأونلاين
                                            </Link>
                                            <Link to="/medical-record" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                السجل الطبي
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                            >
                                                تسجيل الخروج
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="flex items-center space-x-3 px-6 py-3 rounded-full bg-transparent text-[rgb(95,111,255)] border-2 border-[rgb(95,111,255)] hover:bg-[rgb(95,111,255)] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(95,111,255)]"
                                >
                                    <LogIn size={20} className="transition-transform duration-300 transform hover:rotate-180" />
                                    <span className="font-medium">تسجيل الدخول</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}