import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DoctorCard } from "./DoctorCard";
import { DoctorContext } from "../../../context/DoctorContext";
import Loading from "../../Loading";

export function FeaturedDoctors() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { doctors, loading } = useContext(DoctorContext);
    const navigate = useNavigate();

    if (loading) {
        return <Loading />;
    }

    // ترتيب الأطباء بناءً على التقييم بشكل تنازلي
    const sortedDoctors = [...doctors]
        .sort((a, b) => b.rating - a.rating)
        .map((doctor) => ({
            ...doctor,
            rating: parseFloat(doctor.rating.toFixed(1)), // أخذ أول خانة عشرية
        }));

    // التنقل بين الأطباء
    const prevDoctor = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sortedDoctors.length - 1 : prevIndex - 1
        );
    };

    const nextDoctor = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === sortedDoctors.length - 1 ? 0 : prevIndex + 1
        );
    };

    // تحديد الأطباء الثلاثة المرئيين في حالة وجود أكثر من 3
    const visibleDoctors = () => {
        if (sortedDoctors.length >= 3) {
            const startIndex = currentIndex;
            const endIndex = (currentIndex + 2) % sortedDoctors.length; // عرض 3 أطباء
            if (startIndex <= endIndex) {
                return sortedDoctors.slice(startIndex, endIndex + 1);
            } else {
                return [
                    ...sortedDoctors.slice(startIndex),
                    ...sortedDoctors.slice(0, endIndex + 1),
                ];
            }
        } else {
            return sortedDoctors; // عرض الأطباء بشكل عادي إذا كان العدد أقل من 3
        }
    };

    const handleShowMore = () => {
        navigate("/doctor");
        window.scrollTo(0, 0); // يعيد التمرير إلى أعلى الصفحة
    };

    return (
        <div className="container mx-auto px-4 py-20" dir="rtl">
            <h2 className="text-4xl font-bold text-center mb-12 text-mainColor">
                أطباء مميزون
            </h2>

            {/* إذا كان عدد الأطباء أقل من 3، اعرضهم بشكل عادي */}
            {sortedDoctors.length < 3 ? (
            <div className="flex gap-4 items-center justify-center overflow-hidden">
                    {visibleDoctors().map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor}    isActive={1} />
                    ))}
                </div>
            ) : (
                // عرض الكاروسيل إذا كان عدد الأطباء 3 أو أكثر
                <div className="relative flex items-center justify-center gap-8 max-w-5xl mx-auto">
                    {/* زر السابق (يمين - التحرك لليمين) */}
                    <button
                        onClick={prevDoctor}
                        className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors absolute left-0 z-10"
                        aria-label="Previous doctor"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* عرض الأطباء */}
                    <div className="flex gap-4 items-center justify-center overflow-hidden">
                        {visibleDoctors().map((doctor, index) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                isActive={index === 1} // الطبيب الأوسط نشط
                            />
                        ))}
                    </div>

                    {/* زر التالي (يسار - التحرك لليسار) */}
                    <button
                        onClick={nextDoctor}
                        className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors absolute right-0 z-10"
                        aria-label="Next doctor"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            )}

            {/* زر عرض المزيد */}
            <button
                className="relative mx-auto mt-8 py-2 px-6 group bg-transparent border-2 border-mainColor text-mainColor hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleShowMore}
            >
                <span className="text-lg font-bold">عرض المزيد</span>
                <svg
                    width="15px"
                    height="10px"
                    viewBox="0 0 13 10"
                    className="transform group-hover:-translate-x-1 transition-all duration-300"
                >
                    <path d="M1,5 L11,5" />
                    <polyline points="4 1 0 5 4 9" />
                </svg>
            </button>
        </div>
    );
}
