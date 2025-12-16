import React from 'react'

const CTA = () => {
    return (
        <section className="py-20 bg-linear-to-r from-red-600 to-red-800 text-white text-center">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to make a difference?</h2>
                <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90">
                    Join thousands of donors and blood banks saving lives today. Your contribution matters.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <button className="px-10 py-4 bg-white text-red-700 text-lg font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                        Sign Up Now
                    </button>
                    <a href="#" className="text-white text-lg font-medium hover:underline underline-offset-4">
                        Already have an account? Login
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CTA
