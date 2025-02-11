import { Calendar, Clock, Users } from "lucide-react";

const features = [
    {
        icon: Calendar,
        title: "حجز فوري",
        description: "احجز موعدك مباشرة وبدون انتظار"
    },
    {
        icon: Users,
        title: "أطباء متميزون",
        description: "نخبة من أفضل الأطباء في فلسطين"
    },
    {
        icon: Clock,
        title: "متابعة مستمرة",
        description: "تذكير بمواعيدك ومتابعة حالتك"
    }
];

export function Features() {
    return (
        <div className="container mx-auto px-6 py-20">
            {/* Section Title */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-mainColor">مميزات خدمتنا</h2>
                <p className="text-lg text-gray-600 mt-4">
                    اكتشف المزايا الفريدة التي نقدمها لعملائنا في مجال الرعاية الطبية
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-mainColor rounded-lg p-8 bg-white shadow-lg hover:bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"
                    >
                        {/* Icon Circle with Gradient */}
                        <div className="relative bg-gradient-to-r from-blue-500 to-mainColor  rounded-full p-6 mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            <feature.icon className="h-16 w-16 text-white group-hover:text-yellow-200 transition-all duration-300" />
                        </div>

                        {/* Title and Description */}
                        <h3 className="text-2xl font-semibold mb-4 text-mainColor group-hover:text-white transition-colors duration-300">
                            {feature.title}
                        </h3>
                        <p className="text-lg text-mainColor group-hover:text-white transition-colors duration-300">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
