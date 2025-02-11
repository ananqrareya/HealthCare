import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function Sidebar({
    selectedSpecialty,
    setSelectedSpecialty,
    selectedCity,
    setSelectedCity,
    specialties = [],
    cities = [],
}) {
    const [activeFilter, setActiveFilter] = useState(null); // للتحكم في القائمة المفتوحة

    const toggleFilter = (filterName) => {
        setActiveFilter((prev) => (prev === filterName ? null : filterName));
    };

    return (
        <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">تصفية النتائج</h2>

                {/* أزرار التبديل */}
                <div className="flex flex-col gap-4">
                    {/* التخصصات */}
                    <div>
                        <button
                            onClick={() => toggleFilter("specialty")}
                            className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 
                            ${activeFilter === "specialty" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"} 
                            hover:bg-indigo-400 hover:text-white`}
                        >
                            <span>التخصصات</span>
                            {activeFilter === "specialty" ? (
                                <ChevronUp className="h-5 w-5" />
                            ) : (
                                <ChevronDown className="h-5 w-5" />
                            )}
                        </button>

                        {activeFilter === "specialty" && (
                            <div className="mt-4 space-y-2 transition-all duration-500">
                                {specialties.map((specialty, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 hover:bg-indigo-100 cursor-pointer transition-all duration-300"
                                    >
                                        <input
                                            type="radio"
                                            name="specialty"
                                            value={specialty}
                                            checked={selectedSpecialty === specialty}
                                            onChange={() => setSelectedSpecialty(specialty)}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-gray-800">{specialty}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* المدن */}
                    <div>
                        <button
                            onClick={() => toggleFilter("city")}
                            className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 
                            ${activeFilter === "city" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"} 
                            hover:bg-indigo-400 hover:text-white`}
                        >
                            <span>المدن</span>
                            {activeFilter === "city" ? (
                                <ChevronUp className="h-5 w-5" />
                            ) : (
                                <ChevronDown className="h-5 w-5" />
                            )}
                        </button>

                        {activeFilter === "city" && (
                            <div className="mt-4 space-y-2 transition-all duration-500">
                                {cities.map((city, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 hover:bg-indigo-100 cursor-pointer transition-all duration-300"
                                    >
                                        <input
                                            type="radio"
                                            name="city"
                                            value={city}
                                            checked={selectedCity === city}
                                            onChange={() => setSelectedCity(city)}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-gray-800">{city}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
