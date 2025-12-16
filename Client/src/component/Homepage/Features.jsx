import React from 'react'

const Features = () => {
    const features = [
        {
            icon: "⚡",
            title: "Fast Matching",
            description: "Find compatible blood donors and banks near you instantly with our advanced algorithm."
        },
        {
            icon: "🔒",
            title: "Safe & Secure",
            description: "All data is encrypted. We ensure verified users and transparent consent for every donation."
        },
        {
            icon: "🌍",
            title: "Wide Network",
            description: "Connect with a vast network of hospitals, blood banks, and donors across your region."
        },
        {
            icon: "📊",
            title: "Real-time Updates",
            description: "Track blood requests and donation status with live notifications and real-time tracking."
        }
    ]

    return (
        <section className="py-20 bg-[#f5f5f5]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose LiForce?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">We provide the fastest and most secure way to connect donors with those in need.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-transparent hover:border-red-600 group">
                            <div className="text-4xl mb-6 bg-red-50 w-16 h-16 flex items-center justify-center rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3 group-hover:text-red-600 transition-colors">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
