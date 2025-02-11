import { useState, useContext } from "react";
import DoctorCard from "../components/Doctors/DoctorCard";
import { SearchSection } from "../components/Doctors/SearchSection";
import { DoctorContext } from "../context/DoctorContext";
import Loading from "../components/Loading";
import { Globe, Star, Users } from "lucide-react"; // أيقونات لاستخدامها

function Doctor() {
    const { doctors, loading } = useContext(DoctorContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [sortByRating, setSortByRating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
    const [doctorsPerPage, setDoctorsPerPage] = useState(6); // عدد الأطباء في كل صفحة

    // تحديث عدد الأطباء بناءً على حجم الشاشة
    useState(() => {
        const updateDoctorsPerPage = () => {
            if (window.innerWidth <= 768) {
                setDoctorsPerPage(4); // في الشاشات الصغيرة
            } else {
                setDoctorsPerPage(6); // في الشاشات الكبيرة
            }
        };

        updateDoctorsPerPage();
        window.addEventListener("resize", updateDoctorsPerPage);

        return () => window.removeEventListener("resize", updateDoctorsPerPage);
    }, []);

    // تصفية الأطباء بناءً على البحث
    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearchTerm = searchTerm
            ? doctor.ar_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doctor.specialityAr.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        const matchesOnline = showOnlineOnly ? doctor.online_active === 1 : true;
        return matchesSearchTerm && matchesOnline;
    });

    const sortedDoctors = sortByRating
        ? [...filteredDoctors].sort((a, b) => b.rating - a.rating)
        : filteredDoctors;

    const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage);
    const displayedDoctors = sortedDoctors.slice(
        (currentPage - 1) * doctorsPerPage,
        currentPage * doctorsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="relative min-h-screen bg-gray-100" dir="rtl">
            {/* خلفية متحركة */}
            <div className="absolute inset-0 bg-mainColor bg-opacity-50 skew-y-3 transform -z-10 h-[120%] -mt-10"></div>

            {/* قالب البحث */}
            <SearchSection setSearchTerm={setSearchTerm} />

            {/* أزرار التبديل */}
            <div className="container mx-auto px-4 py-4 text-center flex flex-wrap justify-center gap-4">
                <button
                    className={`flex items-center gap-2 px-6 py-3 text-sm md:text-lg font-bold rounded-full shadow-lg transition-all duration-300 ${
                        !showOnlineOnly && !sortByRating
                            ? "bg-gradient-to-r from-mainColor to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                        setShowOnlineOnly(false);
                        setSortByRating(false);
                        setCurrentPage(1);
                    }}
                >
                    <Users className="w-5 h-5" />
                    <span className="hidden md:block">جميع الأطباء</span>
                </button>
                <button
                    className={`flex items-center gap-2 px-6 py-3 text-sm md:text-lg font-bold rounded-full shadow-lg transition-all duration-300 ${
                        showOnlineOnly
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                        setShowOnlineOnly(true);
                        setSortByRating(false);
                        setCurrentPage(1);
                    }}
                >
                    <Globe className="w-5 h-5" />
                    <span className="hidden md:block">متاح للحجز الإلكتروني</span>
                </button>
                <button
                    className={`flex items-center gap-2 px-6 py-3 text-sm md:text-lg font-bold rounded-full shadow-lg transition-all duration-300 ${
                        sortByRating
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                        setSortByRating(true);
                        setShowOnlineOnly(false);
                        setCurrentPage(1);
                    }}
                >
                    <Star className="w-5 h-5" />
                    <span className="hidden md:block">الأعلى تقييمًا</span>
                </button>
            </div>

            {/* عرض الأطباء */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
                    {displayedDoctors.length > 0 ? (
                        displayedDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))
                    ) : (
                        <p className="text-center text-lg text-gray-600">لا توجد نتائج للبحث</p>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-full shadow-md text-lg font-bold transition-all ${
                                    currentPage === index + 1
                                        ? "bg-mainColor text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Doctor;
