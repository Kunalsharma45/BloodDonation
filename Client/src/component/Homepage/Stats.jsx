import React from 'react'

const Stats = () => {
    const stats = [
        { number: "5,000+", label: "Donors Registered" },
        { number: "120+", label: "Blood Banks Connected" },
        { number: "8,500+", label: "Lives Saved" },
    ]

    return (
        <section className="py-20 bg-black text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-red-900 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-red-800 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-6">
                            <div className="text-5xl md:text-6xl font-extrabold text-red-600 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-xl md:text-2xl font-medium text-gray-300">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Stats
