import React, { useState } from "react";
import { MapPin, Search } from "lucide-react";

export function SearchSection({ setSearchTerm }) {
    const [searchValue, setSearchValue] = useState("");

    // تحديث البحث عند إدخال النص
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setSearchTerm(value); // تمرير قيمة البحث إلى المكون الرئيسي
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 skew-y-3 transform -z-10 h-[120%] -mt-10"></div>
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl font-bold text-mainColor mb-6 leading-tight">
                    احجز موعدك الطبي بسهولة وأمان
                </h1>
                <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                    نوفر لك أفضل الأطباء في جميع التخصصات في فلسطين
                </p>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
                    <div className="flex flex-wrap gap-4">
                        {/* حقل البحث */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                className="pl-10 h-12 text-lg w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="ابحث عن اسم الطبيب أو التخصص..."
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
