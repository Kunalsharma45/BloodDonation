import React from 'react'

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Sign Up",
            description: "Create your free account as a Donor, Blood Bank, or Hospital in just a few minutes."
        },
        {
            number: "02",
            title: "Get Matched",
            description: "Our system automatically matches donors with nearby blood needs or blood banks."
        },
        {
            number: "03",
            title: "Save Lives",
            description: "Donate blood or fulfill requests to save lives and make a real difference in your community."
        }
    ]

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Saving lives is easier than you think. Follow these simple steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-4 border-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-red-600 mb-6 shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-300 z-10">
                                {step.number}
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                            <p className="text-gray-600 max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
