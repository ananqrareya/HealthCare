import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ClinicContext } from '../../context/ClinicContext';

  export function   Specialties() {
    const { specialties } = useContext(ClinicContext);
    const navigate = useNavigate();

    const handleSpecialtyClick = (specialty) => {
        navigate(`/clinics?specialty=${specialty}`);
        window.scrollTo(0, 0);  

    };

    return (
        <section className="specialities-section py-20 bg-gradient-to-r from-blue-50 to-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-mainColor">التخصصات الطبية</h2>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    breakpoints={{
                        320: { slidesPerView: 1.2, spaceBetween: 10 },
                        480: { slidesPerView: 1.5, spaceBetween: 15 },
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                        1024: { slidesPerView: 4, spaceBetween: 25 },
                        1280: { slidesPerView: 5, spaceBetween: 30 },
                    }}
                    className="specialities-carousel"
                >
                    {specialties.map((specialty) => {
                        const IconComponent = specialty.icon; // الأيقونة مدمجة مع `specialty`
                        return (
                            <SwiperSlide key={specialty.id} className="bg-transparent">
                                <div
                                    className="relative group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                                    onClick={() => handleSpecialtyClick(specialty.ar_name)}
                                >
                                    <div className="absolute inset-0 bg-transparent rounded-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <div className="relative z-10 text-center">
                                        {IconComponent ? (
                                            <IconComponent className="h-16 w-16 mx-auto mb-4 text-mainColor group-hover:text-blue-800 transition-colors duration-300" />
                                        ) : (
                                            <div className="h-16 w-16 mx-auto mb-4 text-red-500">?</div>
                                        )}
                                        <h3 className="font-semibold text-lg text-mainColor group-hover:text-blue-600 transition-colors duration-300">
                                            {specialty.ar_name}
                                        </h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}
 
