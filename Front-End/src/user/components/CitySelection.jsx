import React, { useContext } from "react";
import { Building2, MapPin } from "lucide-react";
import { ClinicContext } from "../context/ClinicContext";
import ClinicBanner from "./Clinics/ClinicBanner";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import PageNotFound from "../../PageNotFound";

const CitySelection = ({ onCitySelect }) => {
    const { cities, loading } = useContext(ClinicContext);
    const navigate = useNavigate();

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
            <ClinicBanner
                title="مرحباً بكم في عيادات فلسطين"
                subtitle="صحتكم أولويتنا"
                description="نحن هنا لنقدم لكم أفضل الخدمات الطبية في جميع أنحاء فلسطين. احجز موعدك بكل سهولة وسرعة."
                placholderSearch="ابحث عن مدينة ..."
                buttonText="احجز موعدك الآن"
                backgroundImage="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80"
                cities={cities}
                searchType="cities"
           />

            <div className="px-8 py-12" dir="rtl">
                <h2 className="text-3xl font-bold text-mainColor mb-8 text-center flex items-center justify-center gap-2">
                    <Building2 className="h-8 w-8 text-mainColor" />
                    اختر المدينة
                </h2>

                {/* تحقق من وجود المدن */}
                {cities && Object.keys(cities).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {Object.entries(cities).map(([cityKey, data]) => (
                            <div
                                key={cityKey}
                                onClick={() => navigate(`/cities/${data.id}/clinics`)}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-6 w-6 text-mainColor group-hover:text-blue-800 transition-colors" />
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                                        {data.ar_name}
                                    </h3>
                                </div>
                                <p className="mt-2 text-m text-gray-500">
                                    {data?.count_clinic || 0} عيادات متاحة
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">عذرًا، لا توجد مدن متاحة حاليًا.</h3>
                        <p className="text-gray-500">يرجى المحاولة لاحقًا.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitySelection;
