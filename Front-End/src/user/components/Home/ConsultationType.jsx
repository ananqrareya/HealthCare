import { Calendar, Clock, MessageCircle, Phone, Users, Video } from "lucide-react";
import React  from 'react';
const consultationTypes = [
    {
        icon: Video,
        title: "استشارة بالفيديو",
        description: "تحدث مع طبيبك وجهاً لوجه عبر مكالمة فيديو آمنة"
    },
    {
        icon: MessageCircle,
        title: "استشارة كتابية",
        description: "تواصل مع طبيبك عبر الرسائل النصية"
    },
    {
        icon: Phone,
        title: "استشارة صوتية",
        description: "تحدث مع طبيبك عبر مكالمة صوتية"
    }
];
function ConsultationType(){
    return(
        
        <div className="container relative mx-auto px-4 py-16">
            {/* الخلفية المائلة */}
             {/* النص الرئيسي */}
            <div className="text-center relative mb-20">
 
            <h1
                className="text-5xl font-bold text-mainColor mb-8 leading-tight"
                style={{ direction: 'rtl' }}
            >
                احجز موعدك الطبي
                <br />
                    <span className="text-mainColor text-3xl">واجري استشارتك عن بعد</span>
            </h1>
            <p
                className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
                style={{ direction: 'rtl' }}
            >
                لا داعي لزيارة العيادة. احجز موعدك مع أفضل الأطباء واجري استشارتك من راحة منزلك
            </p>

            {/* Consultation Types */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                {consultationTypes.map((type, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-right">
                        <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mr-auto ml-0">
                            <type.icon className="w-6 h-6 text-mainColor" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                        <p className="text-gray-600">{type.description}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-16">
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
                        <Calendar className="w-6 h-6 text-mainColor" />
                    <span className="text-gray-700 font-medium">حجز سهل وسريع</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
                        <Clock className="w-6 h-6 text-mainColor" />
                    <span className="text-gray-700 font-medium">متاح 24/7</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
                        <Users className="w-6 h-6 text-mainColor" />
                    <span className="text-gray-700 font-medium">أطباء متخصصون</span>
                </div>
            </div>
        </div>
        </div>
    );
}
export default ConsultationType