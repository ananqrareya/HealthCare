import { Heart, Users, Target } from "lucide-react";
import logo from '../../assets/logo.svg';
import about from '../../assets/about.svg';
export function AboutUs() {
    return (
        <div className="bg-gray-50 py-20" dir="rtl">
            <div className="container mx-auto px-6">
                {/* Logo and Site Name */}
                <div className="text-center mb-12">
                    <img
                          src={logo} // ضع رابط الشعار هنا
                        alt="HealthCare Logo"
                        className="mx-auto mb-4 w-40 h-20" // يمكنك تعديل الحجم حسب الحاجة
                    />
                    <h1 className="text-4xl font-bold text-mainColor">هيلث كير</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        نسعى لتوفير الرعاية الصحية الأفضل في فلسطين من خلال خدمات مبتكرة
                    </p>
                </div>

                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-mainColor">عنّا</h2>
                    <p className="text-lg text-gray-600 mt-4">
                        تعرف على مهمتنا ورؤيتنا في تقديم أفضل الخدمات الطبية
                    </p>
                </div>

                {/* About Us Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="text-gray-800 space-y-6">
                        <h3 className="text-3xl font-semibold">من نحن؟</h3>
                        <p className="text-lg">
                            نحن فريق من المهنيين في قطاع الرعاية الصحية، نسعى لتحسين
                            تجارب المرضى من خلال تقديم خدمات طبية متكاملة وفعالة في فلسطين.
                            نعمل بجد على تقديم حلول مبتكرة وخدمات موثوقة تلبي احتياجات
                            عملائنا.
                        </p>

                        <h3 className="text-3xl font-semibold">مهمتنا</h3>
                        <p className="text-lg">
                            مهمتنا هي تقديم الرعاية الصحية بأسعار معقولة وبأعلى المعايير
                            الطبية. نحن نسعى لجعل الرعاية الصحية متاحة للجميع وتقديم حلول
                            تكنولوجية للمساعدة في حجز المواعيد الطبية والمتابعة المستمرة.
                        </p>

                        <h3 className="text-3xl font-semibold">رؤيتنا</h3>
                        <p className="text-lg">
                            رؤيتنا هي أن نصبح الخيار الأول للرعاية الصحية في فلسطين من خلال
                            تحسين الوصول إلى الأطباء والمستشفيات والمراكز الطبية باستخدام
                            التكنولوجيا الحديثة.
                        </p>
                    </div>

                    <div className="relative">
                        <img
                            src={about}
                            alt="About Us"
                            className="w-full h-full object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        />
                    </div>
                </div>

                {/* Icon Features Section */}
                <div className="mt-20">
                    <h3 className="text-3xl font-semibold text-center mb-8 text-mainColor">
                        لماذا نحن؟
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all">
                            <Heart className="h-16 w-16 mx-auto mb-4 text-mainColor" />
                            <h4 className="text-xl font-semibold">الرعاية المتميزة</h4>
                            <p className="text-gray-600 mt-2">نحن نقدم الرعاية الصحية التي تركز على المريض وتلبي احتياجاته بشكل فردي.</p>
                        </div>
                        <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all">
                            <Users className="h-16 w-16 mx-auto mb-4 text-mainColor" />
                            <h4 className="text-xl font-semibold">أطباء متميزون</h4>
                            <p className="text-gray-600 mt-2">نحن نعمل مع أفضل الأطباء في فلسطين لضمان تقديم الرعاية الطبية المتخصصة.</p>
                        </div>
                        <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all">
                            <Target className="h-16 w-16 mx-auto mb-4 text-mainColor" />
                            <h4 className="text-xl font-semibold">حلول مبتكرة</h4>
                            <p className="text-gray-600 mt-2">نقدم حلول تكنولوجية مبتكرة لراحة المرضى من خلال خدماتنا عبر الإنترنت.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
