import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <img className="h-12 w-auto mr-3" src="./src/img/hlogo.png" alt="LiForce Logo" />
                            <span className="text-2xl font-bold">LiForce</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Connecting blood donors and banks to save lives instantly.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-red-500">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-red-500">Legal</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-red-500">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors text-white">
                                {/* Placeholder for social icons */}
                                <span>FB</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors text-white">
                                <span>TW</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors text-white">
                                <span>IG</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} LiForce. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
