import {
  Activity,
  Bell,
  Building2,
  Calendar,
  ClipboardList,
  DollarSign,
  Link,
  Menu,
  MessageSquare,
  Moon,
  Star,
  Sun,
  User,
  UserCircle,
  Video,
  X
} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { RealTimeContext } from '../context/RealTimeContext';
import { UserContext } from '../context/UserContextProvider';
import Appointments from './components/Appointments';
import Chat from './components/Chat';
import ClinicManagement from './components/ClinicManagement';
import Dashboard from './components/Dashboard';
import MedicalRecords from './components/MedicalRecords';
import OnlineAppointments from './components/OnlineAppointments';
import Profile from './components/Profile';
import Reviews from './components/Reviews';
import FinancialRecords from './components/FinancialRecords';
import { DoctorLayoutContext } from './context/DoctorLayoutContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // حالة القائمة المنسدلة
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, markAllNotificationsAsRead, markNotificationAsRead } = useContext(RealTimeContext);
  const { personalInfo } = useContext(DoctorLayoutContext);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  console.log("Navbar notif", notifications);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleLogout = () => {

    logout(); // استدعاء وظيفة تسجيل الخروج

    navigate("/login"); // توجيه المستخدم إلى صفحة تسجيل الدخول
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <Appointments />;
      case 'online-appointments':
        return <OnlineAppointments />;
      case 'clinic-management':
        return <ClinicManagement />;
      case 'profile':
        return <Profile />;
      case 'reviews':
        return <Reviews />;
      case 'chat':
        return <Chat />;
      case 'medical-records':
        return <MedicalRecords />;
      case 'financial-records':
        return <FinancialRecords />;
      default:
        return <Dashboard />;
    }
  };
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //notications 

  useEffect(() => {
    console.log("Updated notifications:", notifications); // تحقق من الإشعارات التي تم تحديثها
  }, [notifications]);




  return (
    <div dir="rtl" className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center space-x-2 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <img
                src={logo}
                alt="this is logo"
                className="w-44 cursor-pointer "
              />
            </div>
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <Activity size={20} />
              <span>لوحة التحكم</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('appointments');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'appointments'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <Calendar size={20} />
              <span>المواعيد</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('online-appointments');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'online-appointments'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <Video size={20} />
              <span>المواعيد الإلكترونية</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('clinic-management');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'clinic-management'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <Building2 size={20} />
              <span>إدارة العيادات</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('medical-records');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'medical-records'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <ClipboardList size={20} />
              <span>السجلات الطبية</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('financial-records');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'financial-records'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <DollarSign size={20} />
              <span>السجل المالي</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('chat');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'chat'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <MessageSquare size={20} />
              <span>الدردشة</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reviews');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'reviews'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <Star size={20} />
              <span>التقييمات</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 rounded-lg ${activeTab === 'profile'
                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <UserCircle size={20} />
              <span>الملف الشخصي</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white">مرحباً د.{personalInfo.first_name}</h2>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className='relative'>
                <button onClick={toggleNotifications} className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 relative">
                  <Bell size={20} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600" style={{ width: '13rem', zIndex: 99 }}>
                    <div className="p-4">
                      {notifications.filter((n) => !n.read && n.type !== 'rating').length > 0 ? (
                        <div>
                          <h3 className="text-gray-600 dark:text-gray-200 font-semibold mb-2">الإشعارات الجديدة</h3>
                          <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
                              {notifications
                                .filter((n) => !n.read && n.type !== 'rating')
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((notification) => (
                                  <li
                                    key={notification.id}
                                    className="border-b border-gray-200 dark:border-gray-600 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                      markNotificationAsRead(notification.id);
                                      if (notification.source === 'pusher') {
                                        navigate(`/appointment-details/${notification.id}`);
                                      }
                                    }}
                                  >
                                    {notification.message}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-sm">لا توجد إشعارات جديدة.</div>
                      )}

                      {notifications.filter((n) => n.read && n.type !== 'rating').length > 0 ? (
                        <div>
                          <h3 className="text-gray-600 dark:text-gray-200 font-semibold mt-4 mb-2">الإشعارات المقروءة</h3>
                          <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
                              {notifications
                                .filter((n) => n.read && n.type !== 'rating' && n.source === 'pusher')
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((notification) => (
                                  <li
                                    key={notification.id}
                                    className="border-b border-gray-200 dark:border-gray-600 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer bg-gray-100 dark:bg-gray-700"
                                    onClick={() => navigate(`/appointment-details/${notification.id}`)}
                                  >
                                    {notification.message}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-sm">لا توجد إشعارات مقروءة.</div>
                      )}
                    </div>

                    <button onClick={markAllNotificationsAsRead} className="block w-full py-2 text-center text-sm text-blue-500 dark:text-blue-300">
                      علامة كـ "مقروء"
                    </button>
                  </div>
                )}


              </div>
              <div className="relative z-10">

                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>

                </button>
                {isDropdownOpen && (
                  <div className="absolute custome-space w-35 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600" style={{ width: '' }}>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-2 py-2 text-sm text-red-500 hover:bg-gray-100 "
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;