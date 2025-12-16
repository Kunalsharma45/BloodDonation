import React from 'react'

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-red-950 text-white py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight drop-shadow-lg">
                    LiForce <span className="text-red-600">-</span> Blood Donors & <br className="hidden md:block" /> Blood Banks Connect Instantly
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
                    Save lives by connecting blood donors, blood banks, and hospitals in real-time.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <button className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)]">
                        Get Started
                    </button>
                    <button className="px-10 py-4 border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black text-white text-lg font-bold rounded-full transition-all transform hover:scale-105">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-red-800/20 rounded-full blur-[100px]"></div>
            </div>
        </section>
    )
}

export default Hero
