import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Users, ChevronDown, Linkedin } from 'lucide-react';
import './premium-home.css';

const LearnMore = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        // Intersection Observer for reveal animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const principles = [
        {
            icon: "🛡️",
            title: "Radical Transparency",
            desc: "We provide real-time tracking for every unit. From the donor's arm to the patient's bedside, every step is logged and verifiable."
        },
        {
            icon: "⚡",
            title: "Hyper-Efficiency",
            desc: "By utilizing AI-driven logistics, we reduce the time blood spends in transit by 40%, ensuring clinical freshness and viability."
        },
        {
            icon: "🤝",
            title: "Community First",
            desc: "LIFORCE isn't just a platform; it's a movement. We empower local communities to take charge of their own healthcare safety net."
        }
    ];

    const developers = [
        {
            initial: "A",
            name: "Ashika",
            role: "Systems Architect",
            desc: "Focused on real-time data synchronization and high-performance system architecture.",
            color: "from-red-500 to-red-600",
            shadow: "shadow-red-200"
        },
        {
            initial: "K",
            name: "Kunal Sharma",
            role: "Frontend Specialist",
            desc: "Expert in crafting intuitive user interfaces and modern glassmorphism aesthetics.",
            color: "from-slate-700 to-slate-900",
            shadow: "shadow-slate-200"
        },
        {
            initial: "A",
            name: "Abhinav Thakur",
            role: "Backend Engineer",
            desc: "Specializing in secure Pulse-Link protocols and backend medical compliance.",
            color: "from-red-400 to-red-500",
            shadow: "shadow-red-200"
        }
    ];

    const faqs = [
        {
            q: "How does the AI-routing work?",
            a: "Our algorithm analyzes traffic, hospital demand forecasts, and current blood unit expiry dates to calculate the most efficient path for every unit."
        },
        {
            q: "Is my medical data safe?",
            a: "Yes. We use end-to-end encryption for all records, exceeding international healthcare data standards and HIPAA requirements."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased selection:bg-red-100 selection:text-red-600 overflow-x-hidden">

            {/* Nav */}
            <nav className="glass-nav fixed top-0 w-full z-50 transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-lg rotate-12">
                            <span className="text-white text-sm">🩸</span>
                        </div>
                        <span className="text-slate-900">LIFORCE</span>
                    </Link>

                    <div className="hidden md:flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
                        <Link to="/#how-it-works" className="hover:text-red-500 transition">Process</Link>
                        <Link to="/#serve" className="hover:text-red-500 transition">Impact</Link>
                        <Link to="/#stories" className="hover:text-red-500 transition">Stories</Link>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition"
                    >
                        Return Home
                    </button>
                </div>
            </nav>

            {/* Header */}
            <header className="pt-40 pb-20 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50 to-transparent -z-10"></div>
                <div className="max-w-5xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-red-200">Our Mission</span>
                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tighter">
                        Driven by <span className="text-gradient font-black">Impact.</span><br />
                        Powered by <span className="text-slate-800 font-black">Technology.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        We are building the world's most efficient blood donation ecosystem, ensuring that help is always just a heartbeat away.
                    </p>
                </div>
            </header>

            {/* Vision Section */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="reveal glass p-10 relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-50"></div>
                        <h2 className="text-3xl font-black mb-6 relative z-10">Our Vision</h2>
                        <p className="text-slate-600 leading-relaxed mb-6 relative z-10 text-lg">
                            At LIFORCE, we believe that no life should be lost due to a shortage of blood. Our platform democratizes access to life-saving resources by connecting donors, hospitals, and blood banks in a seamless, real-time network.
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-xl">🚀</div>
                            <div>
                                <h4 className="font-bold text-slate-800">Zero Wastage</h4>
                                <p className="text-xs text-slate-500 uppercase font-bold">Global Target by 2030</p>
                            </div>
                        </div>
                    </div>
                    <div className="reveal">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition duration-500"></div>
                            {/* In a real app, you'd use the proper asset path for developer's image or a high-quality illustration */}
                            <div className="relative glass p-4 rounded-[2rem] border-white/40">
                                <div className="aspect-video bg-red-50 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <div className="text-9xl animate-pulse">🩸</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-24 px-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-4xl font-black mb-4">The <span className="text-red-500 font-black">Principles</span> We Bleed For</h2>
                        <p className="text-slate-500 font-medium">Built on trust, transparency, and clinical excellence.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {principles.map((p, i) => (
                            <div key={i} className="reveal glass p-8 hover:bg-white transition-all group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">{p.icon}</div>
                                <h4 className="text-xl font-bold mb-3">{p.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Developers */}
            <section className="py-24 bg-white/50 relative">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter">Meet the <span className="text-red-500">Developers</span></h2>
                        <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px]">The Engineering Minds Behind LIFORCE</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {developers.map((dev, i) => (
                            <div key={i} className="group reveal">
                                <div className="glass p-10 hover:scale-[1.02] transition-all h-full flex flex-col items-center">
                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${dev.color} mb-8 flex items-center justify-center shadow-xl ${dev.shadow} group-hover:rotate-12 transition-transform`}>
                                        <span className="text-white text-4xl font-black">{dev.initial}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{dev.name}</h3>
                                    <p className="text-red-500 font-black text-[10px] uppercase tracking-widest mb-4">{dev.role}</p>
                                    <p className="text-slate-500 text-sm text-center mb-8 leading-relaxed font-medium">{dev.desc}</p>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mt-auto w-full flex items-center justify-center gap-2 py-4 bg-[#0077b5] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#005a87] transition-all shadow-lg shadow-blue-100">
                                        <Linkedin size={16} /> LinkedIn
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey */}
            <section className="py-24 px-8 max-w-5xl mx-auto">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-4xl font-black mb-4">Our <span className="text-red-500 font-black">Journey</span></h2>
                </div>
                <div className="space-y-12">
                    {[
                        { year: "21", title: "The Spark", desc: "LIFORCE was founded after witnessing the tragic impact of logistics delays in critical trauma units." },
                        { year: "23", title: "Network Expansion", desc: "Partnered with 50+ major hospitals and launched our first AI-routing algorithm." },
                        { year: "25", title: "Global Impact", desc: "Scaling our infrastructure to support cross-border emergency blood logistics worldwide." }
                    ].map((step, i, arr) => (
                        <div key={i} className="flex gap-8 items-start relative reveal">
                            {i !== arr.length - 1 && <div className="hidden md:block w-1 h-full bg-red-100 absolute left-[23px] top-10 -z-10"></div>}
                            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex-shrink-0 flex items-center justify-center font-bold shadow-lg shadow-red-200">
                                {step.year}
                            </div>
                            <div>
                                <h4 className="text-xl font-black">{step.title}</h4>
                                <p className="text-slate-500 mt-2">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-8 bg-white/80">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black mb-12 text-center reveal">Common <span className="text-red-500 font-black">Questions</span></h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="glass p-6 group cursor-pointer reveal">
                                <summary className="font-bold text-lg list-none flex justify-between items-center outline-none">
                                    {faq.q}
                                    <ChevronDown className="transition-transform duration-300 group-open:rotate-180" size={20} />
                                </summary>
                                <p className="text-slate-500 mt-4 leading-relaxed">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-8 mb-20">
                <div className="max-w-5xl mx-auto reveal glass p-12 text-center bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-20"></div>
                    <h2 className="text-4xl font-black mb-6 relative z-10">Ready to join the <span className="text-red-500 font-black">Network?</span></h2>
                    <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10 font-medium">Join thousands of donors and hundreds of hospitals bridging the gap in blood donation.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
                        <button onClick={() => navigate('/signup')} className="btn-gradient px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs">Become a Donor</button>
                        <button onClick={() => navigate('/signup')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition">Partner Hospitals</button>
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-200">
                <p className="font-bold uppercase tracking-widest text-[10px] mb-4">Engineered for Humanity</p>
                <p>&copy; 2025 LIFORCE Network. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LearnMore;
