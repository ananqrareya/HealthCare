import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClinicBanner from "../components/Clinics/ClinicBanner";
import { ClinicCard } from "../components/Clinics/ClinicCard";
import { Sidebar } from "../components/Clinics/Sidebar";
import Loading from "../components/Loading";
import { ClinicContext } from "../context/ClinicContext";
import useFetchClinicsByCity from "../hooks/useFetchClinicsByCity";
import useFetchSpecialties from "../hooks/useFetchClinicBySpecialties";
import useFetchAllClinics from "../hooks/useFetchAllClinics";
import { AlertTriangle } from "lucide-react";

function Clinics() {
    const { cities, specialties } = useContext(ClinicContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCity, setSelectedCity] = useState("الكل");
    const [selectedCityId, setSelectedCityId] = useState(null);

    const [selectedSpecialty, setSelectedSpecialty] = useState("الكل");
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
    const [itemsPerPage, setItemsPerPage] = useState(6); // عدد العيادات لكل صفحة

    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const cityFromURL = queryParams.get("city") || "الكل";
    const specialtyFromURL = queryParams.get("specialty") || "الكل";



    useEffect(() => {
        setSelectedCity(cityFromURL);
        setSelectedSpecialty(specialtyFromURL);
    }, [cityFromURL, specialtyFromURL]);

    useEffect(() => {
        if (cityFromURL !== "الكل") {
            const city = cities.find((c) => c.ar_name === cityFromURL);
            setSelectedCityId(city?.id || null);
        } else {
            setSelectedCityId(null);
        }

        if (specialtyFromURL !== "الكل") {
            const specialty = specialties.find((s) => s.ar_name === specialtyFromURL);
            setSelectedSpecialtyId(specialty?.id || null);
        } else {
            setSelectedSpecialtyId(null);
        }
    }, [cityFromURL, specialtyFromURL, cities, specialties]);

    useEffect(() => {
        // تحديد عدد العناصر لكل صفحة بناءً على حجم الشاشة
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setItemsPerPage(3); // 3 عيادات لشاشات الهواتف
            } else {
                setItemsPerPage(6); // 6 عيادات للشاشات الأكبر
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // جلب جميع العيادات
    const { allClinics, loading: allClinicsLoading, error: allClinicsError } = useFetchAllClinics();

    // جلب العيادات بناءً على المدينة
    const { specificClinics, loading: clinicsLoading, error: clinicsError } = useFetchClinicsByCity(
        selectedCityId || null
    );

    // جلب العيادات بناءً على التخصص
    const { specificClinicsByCateg, loading: specialtiesLoading, error: specialtiesError } = useFetchSpecialties(
        selectedSpecialtyId || null
    );

    const loading = clinicsLoading || specialtiesLoading || allClinicsLoading;
    const error = clinicsError || specialtiesError || allClinicsError;

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCity) params.set("city", selectedCity);
        if (selectedSpecialty) params.set("specialty", selectedSpecialty);
        navigate(`?${params.toString()}`, { replace: true });
    }, [selectedCity, selectedSpecialty, navigate]);

    // اختيار العيادات المناسبة بناءً على الفلترة والبحث
    const filteredClinics = useMemo(() => {
        let clinics = [];

        // اختيار البيانات بناءً على الفلاتر
        if (selectedCity === "الكل" && selectedSpecialty === "الكل") {
            clinics = allClinics || [];
        } else if (selectedCity === "الكل") {
            clinics = specificClinicsByCateg || [];
        } else if (selectedSpecialty === "الكل") {
            clinics = specificClinics || [];
        } else {
            clinics = (specificClinicsByCateg || []).filter((clinic) =>
                specificClinics?.some((cityClinic) => cityClinic.id === clinic.id)
            );
        }

        // تصفية البيانات بناءً على البحث
        return clinics.filter(
            (clinic) =>
                !searchQuery ||
                clinic.ar_name.toLowerCase().includes(searchQuery.toLowerCase()) || // البحث باسم العيادة
                clinic.doctor?.ar_full_name.toLowerCase().includes(searchQuery.toLowerCase()) // البحث باسم الطبيب
        );
    }, [allClinics, specificClinics, specificClinicsByCateg, selectedCity, selectedSpecialty, searchQuery]);

    // حساب العيادات المعروضة في الصفحة الحالية
    const paginatedClinics = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredClinics.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredClinics, currentPage, itemsPerPage]);

    // حساب عدد الصفحات
    const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <ClinicBanner
                    title="عيادات فلسطين"
                    subtitle="عيادات من كل فلسطين صارت بين ايديك"
                    description="يمكنك الحجز بكل سهولة في أي وقت ومن أي مكان"
                    placholderSearch="ابحث عن عيادة ..."
                    backgroundImage="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80"
                    filteredClinics={filteredClinics}
                    searchType="clinics"
                />

                <div className="flex flex-col md:flex-row gap-8">
                    <Sidebar
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                        cities={["الكل", ...cities.map((c) => c.ar_name)]}
                        specialties={["الكل", ...specialties.map((s) => s.ar_name)]}
                    />

                    <div className="flex-1">
                        {error ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <AlertTriangle className="mx-auto text-8xl mb-4  text-red-500 animate-bounce" />
                                <h1 className="text-8xl font-extrabold tracking-widest mb-4 text-red-500">404</h1>
                                <p className="text-2xl font-semibold mb-4 text-red-500">
                                    عذرًا، هناك مشكلة في البيانات.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {filteredClinics.length} عيادة متاحة
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {paginatedClinics.map((clinic) => (
                                        <ClinicCard key={clinic.id} clinic={clinic} />
                                    ))}
                                </div>

                                {filteredClinics.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                        <p className="text-gray-500 text-lg">لا توجد عيادات تطابق معايير البحث.</p>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-6 gap-2">
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${currentPage === index + 1
                                                    ? "bg-mainColor"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                                    }`}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Clinics;
