import { ChevronRight, Heart, Mail, Phone } from 'lucide-react';
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import logo from '../../../assets/logo.svg';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#BEC8FF] text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Intro */}
          <div>
            <div className="flex items-center mb-6">
              <img
                src={logo}
                alt="this is logo"
                className="w-40 cursor-pointer"
              />
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              منصتك الطبية الأولى في فلسطين للحجوزات والاستشارات الطبية
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://www.facebook.com/profile.php?id=100010930628618"
                className="text-gray-600 hover:text-blue-500 transition-colors mr-4"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/alhajj_anan?igsh=NTh1cWxpZTVqOGh4&utm_source=qr"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  <ChevronRight className="w-4 h-4 ml-1" />
                  عن المنصة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  <ChevronRight className="w-4 h-4 ml-1" />
                  كيف يعمل
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  <ChevronRight className="w-4 h-4 ml-1" />
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  <ChevronRight className="w-4 h-4 ml-1" />
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              التخصصات
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-700 hover:text-gray-900 transition-colors">
                طب الأطفال
              </li>
              <li className="text-gray-700 hover:text-gray-900 transition-colors">
                طب الأسنان
              </li>
              <li className="text-gray-700 hover:text-gray-900 transition-colors">
                أمراض القلب
              </li>
              <li className="text-gray-700 hover:text-gray-900 transition-colors">
                أمراض الجهاز الهضمي
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              تواصل معنا
            </h3>
            <div className="space-y-4">
              <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors gap-1">
                <Mail className="w-5 h-5 ml-2 text-blue-500" />
                HealthCare@healthcare.ps
              </p>
              <p className="flex items-center text-gray-700 hover:text-gray-900 transition-colors gap-1">
                <Phone className="w-5 h-5 ml-2 text-green-500" />
                +970 59 737 6520
              </p>
              <button className="w-full bg-mainColor hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300">
                <Link to={'/clinics'}>
                      احجز موعدك الآن
                </Link>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-700">
          <p>
            © {new Date().getFullYear()} <span className="text-gray-900">هيلث كير</span>. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
