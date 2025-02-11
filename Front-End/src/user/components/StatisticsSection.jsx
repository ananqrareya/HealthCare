import React from 'react';

function StatisticsSection() {
    const statistics = [
        { number: "1000+", label: "طبيب معتمد" },
        { number: "50,000+", label: "مريض سعيد" },
        { number: "20+", label: "تخصص طبي" },
        { number: "10+", label: "مدن فلسطينية" },
    ];

    return (
        <section className="py-20 bg-blue-600 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {statistics.map((stat, index) => (
                        <div key={index} className="p-6 rounded-lg bg-blue-500/20 backdrop-blur">
                            <div className="text-4xl font-bold mb-2">{stat.number}</div>
                            <div className="text-blue-100">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default StatisticsSection;
