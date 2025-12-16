import React from 'react'

const SuccessStories = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Success Stories</h2>
                <p className="text-gray-600">Real stories from real people who saved lives.</p>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Placeholders for stories */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="italic text-gray-600">"Donating blood was a simple process and I feel great knowing I helped someone."</p>
                        <h4 className="mt-4 font-bold text-red-600">- John Doe</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="italic text-gray-600">"LiForce helped us find a rare blood type donor in minutes. Truly a lifesaver!"</p>
                        <h4 className="mt-4 font-bold text-red-600">- City Hospital</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="italic text-gray-600">"I'm proud to be a regular donor. The app makes it so easy to schedule appointments."</p>
                        <h4 className="mt-4 font-bold text-red-600">- Jane Smith</h4>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SuccessStories
