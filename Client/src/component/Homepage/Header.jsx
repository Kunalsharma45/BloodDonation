import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate=useNavigate();
    return (
        <header className="bg-linear-to-r from-[#f5f5f5] via-gray-200 to-gray-300 shadow-xl sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center">
                    <img
                        className="h-16 w-auto object-contain drop-shadow-md"
                        src="./src/img/hlogo.png"
                        alt="Blood Donation Logo"
                    />
                </div>

                {/* Navigation Links */}
                <ul className="hidden md:flex space-x-8 text-black font-bold text-lg">
                    {['Home', 'About', 'Donate', 'Contact'].map((item) => (
                        <li key={item} className="relative group cursor-pointer">
                            <span className="group-hover:text-red-600 transition-colors duration-300">{item}</span>
                            <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                        </li>
                    ))}
                </ul>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    <button onClick={()=>{navigate('/login')}}
                        className="border-2 border-black text-black font-bold px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                        type="button"
                    >
                        Login
                    </button>
                    <button onClick={()=>{navigate('/signup')}}
                        className="bg-linear-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Header
