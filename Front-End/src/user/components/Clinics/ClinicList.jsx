import React from "react";
import { useNavigate, useParams } from "react-router-dom";
 
import useFetchClinics from "../../hooks/useFetchClinicsByCity";
import Loading from "../Loading";
import { ClinicCard } from "./ClinicCard";

const ClinicList = () => {
    const { cityKey } = useParams();
    const navigate = useNavigate();
    const { specificClinics, loading, error } = useFetchClinics(cityKey);
 
    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="text-center py-12" dir="rtl">
                <p className="text-red-500 text-lg">حدث خطأ أثناء جلب العيادات. حاول مرة أخرى لاحقاً.</p>
                <button onClick={() => navigate("/all-cities")} className="text-blue-900 hover:text-blue-700">
                    العودة للمدن
                </button>
            </div>
        );
    }

    if (!specificClinics || specificClinics.length === 0) {
        return (
            <div className="text-center py-12" dir="rtl">
                <p className="text-gray-500 text-lg">لا توجد عيادات متاحة حالياً لهذه المدينة.</p>
                <button onClick={() => navigate("/all-cities")} className="text-blue-900 hover:text-blue-700">
                    العودة للمدن
                </button>
            </div>
        );
    }

    const handleBooking = (clinicId) => {
        navigate(`/clinic/booking/${clinicId}`);
    };

    return (
        <div className="mb-12 px-4 lg:px-16" dir="rtl">
            <div className="flex items-center gap-2 mb-8">
                <button
                    onClick={() => navigate("/all-cities")}
                    className="flex items-center gap-2 text-blue-900 hover:text-blue-600 transition-colors duration-200"
                >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.25 19.25L8.75 12.75M8.75 12.75L15.25 6.25"
                            />
                        </svg>
                    </span>
                    العودة للمدن
                </button>
                <span className="text-gray-500">›</span>
                <h2 className="text-2xl font-bold text-blue-900">عيادات {specificClinics.length}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specificClinics.map((clinic) => (
                    <ClinicCard
                        key={clinic.id}
                        clinic={clinic}
                        onBooking={handleBooking} // تمرير وظيفة الحجز إلى بطاقة العيادة
                    />
                ))}
            </div>
        </div>
    );
};

export default ClinicList;
