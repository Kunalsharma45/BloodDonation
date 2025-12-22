import React from 'react';
import {
    Facebook,
    Twitter,
    Youtube,
    Instagram,
    Linkedin,
    HeartPulse,
    Info,
    Droplet,
    MapPin,
    Calendar,
    Heart,
    ShieldCheck,
    User,
    Hospital,
    Droplets,
    Send,
    BarChart,
    LayoutDashboard,
    UserCheck,
    Database,
    Settings,
    HelpCircle,
    FileText,
    Lock,
    Mail
} from 'lucide-react';

const Footer = ({ role = 'viewer' }) => {
    // Role-specific links
    const roleLinks = {
        viewer: [
            { icon: HeartPulse, text: 'Why Donate Blood' },
            { icon: Info, text: 'How It Works' },
            { icon: Droplet, text: 'Blood Compatibility' },
            { icon: MapPin, text: 'Find Donation Centers' }
        ],
        donor: [
            { icon: Calendar, text: 'Book Appointment' },
            { icon: Heart, text: 'Donation History' },
            { icon: ShieldCheck, text: 'Eligibility Rules' },
            { icon: User, text: 'My Profile' }
        ],
        organization: [
            { icon: Hospital, text: 'Hospital Dashboard' },
            { icon: Droplets, text: 'Blood Bank Inventory' },
            { icon: Send, text: 'Blood Requests' },
            { icon: BarChart, text: 'Reports' }
        ],
        admin: [
            { icon: LayoutDashboard, text: 'System Dashboard' },
            { icon: UserCheck, text: 'Screening & Verification' },
            { icon: Database, text: 'Audit Logs' },
            { icon: Settings, text: 'Platform Settings' }
        ]
    };

    const supportLinks = [
        { icon: HelpCircle, text: 'Help & Support' },
        { icon: FileText, text: 'Medical Guidelines' },
        { icon: Lock, text: 'Trust & Safety' },
        { icon: Mail, text: 'Contact Us' }
    ];

    const socialLinks = [
        { icon: Facebook, href: '#' },
        { icon: Twitter, href: '#' },
        { icon: Youtube, href: '#' },
        { icon: Instagram, href: '#' },
        { icon: Linkedin, href: '#' }
    ];

    const currentRoleLinks = roleLinks[role] || roleLinks.viewer;
    const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <section className="px-6 md:px-12 py-10 bg-white text-gray-800 border-t border-red-100 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* BRAND / MISSION */}
                <div className="md:col-span-2 space-y-4">
                    <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
                        LiForce connects blood donors, hospitals, and blood banks to ensure
                        timely, safe, and transparent blood availability during critical needs.
                    </p>

                    <div className="pt-4">
                        <h4 className="font-semibold mb-3 text-red-600 text-sm">Follow Us</h4>
                        <div className="flex gap-4 text-gray-500">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="hover:text-red-600 transition-colors"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ROLE-SPECIFIC LINKS */}
                <div>
                    <h3 className="font-bold mb-3 uppercase text-xs tracking-wide text-red-600">
                        {roleTitle === 'Viewer' ? 'Discover' : roleTitle}
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-600">
                        {currentRoleLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <li key={index} className="flex gap-2 items-center hover:text-red-600 transition-colors cursor-pointer">
                                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{link.text}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* SUPPORT (VISIBLE TO ALL) */}
                <div>
                    <h3 className="font-bold mb-3 uppercase text-xs tracking-wide text-red-600">Support</h3>
                    <ul className="space-y-2 text-xs text-gray-600">
                        {supportLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <li key={index} className="flex gap-2 items-center hover:text-red-600 transition-colors cursor-pointer">
                                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{link.text}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* BRAND MARK */}
            <div className="mt-12 mb-6 text-center">
                <h1 className="font-extrabold text-4xl md:text-7xl tracking-tighter text-red-50/50 select-none">
                    LIFORCE
                </h1>
            </div>

            <hr className="border-red-50" />

            {/* LEGAL */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-[10px] text-gray-400">
                <span className="hover:text-red-600 cursor-pointer transition-colors">Terms of Use</span>
                <span className="hover:text-red-600 cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-red-600 cursor-pointer transition-colors">Cookie Policy</span>
                <span className="hover:text-red-600 cursor-pointer transition-colors">Medical Disclaimer</span>
                <span>© 2025 LiForce. All Rights Reserved.</span>
            </div>
        </section>
    );
};

export default Footer;
