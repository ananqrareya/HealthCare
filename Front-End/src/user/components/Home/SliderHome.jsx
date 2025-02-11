import { ArrowLeft, Building2, Calendar, Clock, Home, MapPin, Stethoscope } from 'lucide-react';
import React, { useContext } from 'react';
import 'swiper/css'; // استيراد الأنماط الخاصة بـ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // Import Autoplay module
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ClinicContext } from '../../context/ClinicContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContextProvider';

const backgroundImage = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80'

function SliderHome() {
    const {cities}=useContext(ClinicContext); 
    const navigate=useNavigate();
    const { isLoggedIn }=useContext(UserContext);
    return (
        <div className="w-full bg-gradient-to-b from-blue-50 to-white " style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)))`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            overflow: "hidden",
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="relative">
                    <Swiper
                        spaceBetween={30} // المسافة بين العناصر
                        slidesPerView={1} // عرض شريحة واحدة في كل مرة
                        loop={true} // تكرار الشرائح
                        autoplay={{
                            delay: 3000, // تغيير الشريحة كل 3 ثواني
                            disableOnInteraction: false, // استمر في التمرير حتى بعد التفاعل
                            pauseOnMouseEnter: true, // تعطيل التمرير التلقائي عند مرور الماوس
                        }}
                        modules={[Autoplay]}
                        pagination={{
                            clickable: true, // قابلية النقر على النقاط للتنقل بين الشرائح
                        }}
                        className="h-full"
                    >
                        {/* Slide 1 - Book from Home */}
                        {!isLoggedIn&&(
                        <SwiperSlide className="flex-[0_0_100%] min-w-0 relative">
                            <div className="h-[600px] relative rounded-2xl overflow-hidden"
                                style={{ background: "rgb(95 111 255 / var(--tw-border-opacity, 1))" }}>
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569383746724-6f1b882b8f46')] bg-center bg-cover opacity-80">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/50"></div>
                                </div>
                                <div className="relative h-full flex items-center">
                                    <div className="max-w-2xl mx-auto text-center text-white p-6">
                                        <h1 className="text-4xl font-bold mb-6">كل المدن <span className='text-5xl'>الفلسطينية</span> في مكان واحد</h1>
                                        <p className="text-xl mb-8"> احجز موعدك من بيتك في أي مدينة تريد</p>
                                        <button className="bg-white text-green-800 hover:bg-customText group px-8 py-3 rounded-lg text-lg font-medium transition duration-300 gap-2 transform hover:scale-105">
                                          <Link to={'/register'}>
                                                    <span>سجل الآن</span>   
                                          </Link>
                                            <ArrowLeft className="mr-2 h-5 w-5 group-hover:rotate-90 group-hover:translate-x-2 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        )
}




                        {/* Slide 2 */}
                        <SwiperSlide className="flex-[0_0_100%] min-w-0 relative">
                            <div
                                className="h-[600px] relative rounded-2xl overflow-hidden"
                                style={{ background: "rgb(95 111 255 / var(--tw-border-opacity, 1))" }}
                            >
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80')] bg-center bg-cover opacity-20"></div>
                                <div className="absolute inset-0 flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8">
                                        <div className="text-white space-y-6">
                                            <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                                <MapPin
                                                    className="h-5 w-5"
                                                    style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}
                                                />
                                                <span style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}>
                                                    فلسطين
                                                </span>
                                                <Home
                                                    className="h-5 w-5"
                                                    style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}
                                                />
                                                <span style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}>
                                                    احجز من بيتك
                                                </span>
                                            </div>
                                            <h1 className="text-5xl font-bold leading-tight">
                                                سهّلنا عليك
                                                <br />
                                                <span style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}>
                                                    حجز موعدك الطبي
                                                </span>
                                            </h1>
                                            <p className="text-xl text-gray-100">
                                                خدمة حجز المواعيد الطبية متوفرة في جميع المدن الفلسطينية
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8">
                                        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                                            {/* المدن - تظهر فقط على الشاشات الكبيرة */}
                                            {cities.slice(0, 4).map((city, index) => (
                                                <div
                                                    key={city.ar_name}
                                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all group cursor-pointer hidden md:block"
                                                >
                                                    <Link to={`/cities/${city.id}/clinics`}>
                                                        <div className="flex items-center gap-3">
                                                            <Building2
                                                                className="h-6 w-6"
                                                                style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}
                                                            />
                                                            <div className="text-white">
                                                                <div className="font-semibold">{city.ar_name}</div>
                                                                <div
                                                                    className="text-sm"
                                                                    style={{ color: "rgb(186 412 290 / var(--tw-text-opacity, 1))" }}
                                                                >
                                                                    متوفر الآن
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}

                                            {/* زر "عرض جميع المدن" - يظل ظاهرًا دائمًا */}
                                            <div
                                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:scale-105 transition-all duration-300 ease-in-out group cursor-pointer flex items-center justify-center"
                                                onClick={() => navigate('all-cities')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-medium text-white transition-colors duration-300 group-hover:text-white">
                                                        عرض جميع المدن
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        style={{ color: "white" }}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>




                        {/* Slide 3 */}
                        <SwiperSlide className="relative w-full h-[600px] rounded-2xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                                alt="Doctor consultation"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40">
                                <div className="h-full flex items-center">
                                    <div className="max-w-2xl mx-8 text-white">
                                        <h1 className="text-5xl font-bold mb-6">خدمات طبية متكاملة</h1>
                                        <p className="text-xl mb-8">نقدم خدمات طبية شاملة بأعلى المعايير العالمية</p>
                                        <div className="grid grid-cols-3 gap-6 mb-8">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <Calendar className="h-6 w-6" />
                                                <span>حجز سريع</span>
                                            </div>
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <Clock className="h-6 w-6" />
                                                <span>متابعة ٢٤/٧</span>
                                            </div>
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <Stethoscope className="h-6 w-6" />
                                                <span>أطباء متخصصون</span>
                                            </div>
                                        </div>
                                        <button className="bg-mainColor hover:bg-blue-600 px-6 py-3 rounded-lg text-lg transition duration-300">
                                            تعرف على خدماتنا
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>


                       
                      

                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default SliderHome;
