import React, { useState } from "react";
import { Building2, Search, MapPin, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ClinicBanner({
  title,
  subtitle,
  description,
  placholderSearch,
  backgroundImage,
  filteredClinics = [],
  cities = [],
  searchType = "clinics", // نوع البحث الافتراضي
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // البحث
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // البحث بناءً على نوع البحث
    if (searchType === "clinics") {
      const clinicResults = filteredClinics.filter(
        (item) =>
          // البحث في اسم العيادة
          (item.ar_name && item.ar_name.toLowerCase().includes(query.toLowerCase())) ||
          // البحث في اسم المدينة
          (item.city?.ar_name && item.city.ar_name.toLowerCase().includes(query.toLowerCase())) ||
          // البحث في التخصص
          (item.specialty && item.specialty.toLowerCase().includes(query.toLowerCase())) ||
          // البحث في اسم الطبيب
          (item.doctor?.ar_full_name &&
            item.doctor.ar_full_name.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(clinicResults);
    } else if (searchType === "cities") {
      const cityResults = Object.entries(cities).filter(([_, city]) =>
        city.ar_name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(
        cityResults.map(([key, city]) => ({
          id: key,
          name: city.ar_name,
          countClinics: city.count_clinic || 0,
        }))
      );
    }

    setShowResults(true);
  };

  return (
    <div
      className="relative h-[400px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/75"></div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="text-center md:text-right w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
            <Building2 className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4" style={{ direction: "rtl" }}>
            {subtitle}
          </h2>

          <p className="text-lg text-gray-200 mb-8" style={{ direction: "rtl" }}>
            {description}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto md:mr-0 relative" style={{ direction: "rtl" }}>
            <div className="relative">
              <input
                type="text"
                placeholder={placholderSearch}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-lg pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchResults.map((result) =>
                  searchType === "clinics" ? (
                    <button
                      key={result.id}
                      onClick={() => navigate(`/clinic/booking/${result.id}`)}
                      className="w-full text-right px-6 py-4 hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{result.ar_name}</div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {result.city?.ar_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-4 w-4" />
                            {result.specialty}
                          </span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      key={result.id}
                      onClick={() => navigate(`/cities/${result.id}/clinics`)}
                      className="w-full text-right px-6 py-4 hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.countClinics} عيادات متاحة</div>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}

            {showResults && searchResults.length === 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl z-50 p-4 text-center text-gray-500">
                لا توجد نتائج للبحث
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-gray-50 fill-current"
          viewBox="0 0 1440 60"
        >
          <path d="M0,0 C480,40 960,40 1440,0 L1440,60 L0,60 Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default ClinicBanner;
