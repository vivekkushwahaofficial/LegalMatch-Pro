import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Briefcase, Building2, ArrowRight, Scale, Heart, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2">
                            <Shield className="text-indigo-600" size={32} />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                LegalMatch Pro
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">About Us</a>
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                Get Started
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-b from-indigo-50/50 to-transparent rounded-bl-[100px]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                    Empowering Access to Justice
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1]">
                                    Bridging the Gap Between <span className="text-indigo-600">Legal Expertise</span> and Those in Need.
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                    A seamless platform connecting pro-bono lawyers and NGOs with individuals seeking legal assistance. Efficiency meets empathy.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/register" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 group">
                                        Join the Platform <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link to="/login" className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                                        Member Login
                                    </Link>
                                </div>
                                <div className="flex items-center gap-8 pt-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-bold text-gray-900">500+ Verified Professionals</div>
                                        <div className="text-gray-500">Already helping daily</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] rounded-full"></div>
                                <div className="relative bg-white border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden p-4">
                                    <img 
                                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2070" 
                                        alt="Legal advice" 
                                        className="rounded-[32px] w-full aspect-[4/3] object-cover"
                                    />
                                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <CheckCircle size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Case Resolved Successfully</div>
                                                <div className="text-sm text-gray-500">Family Law • Mumbai, India</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roles Section */}
                <section id="features" className="py-24 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <h2 className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Our Ecosystem</h2>
                            <h3 className="text-4xl font-bold text-gray-900">Tailored Experience for Every Stakeholder</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Citizen Card */}
                            <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group border border-gray-100">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Users size={32} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">Citizens</h4>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Submit your legal challenges and get matched with specialized lawyers and NGOs ready to support your cause.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" /> Easy Case Submission
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" /> Real-time Updates
                                    </li>
                                </ul>
                            </div>

                            {/* Lawyer Card */}
                            <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group border border-gray-100 ring-4 ring-indigo-50 ring-offset-0">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
                                    <Scale size={32} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">Lawyers</h4>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Provide pro-bono expertise and manage your assigned cases through our intuitive professional dashboard.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" /> Verified Credentials
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" /> Effortless Case Intake
                                    </li>
                                </ul>
                            </div>

                            {/* NGO Card */}
                            <div className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group border border-gray-100">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Building2 size={32} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">NGOs</h4>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Collaborate on large-scale legal aid projects and connect multiple beneficiaries to our vast network of experts.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" /> Bulk Management
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle size={16} className="text-green-500" /> Strategic Partnerships
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <Shield className="text-indigo-600" size={28} />
                                <span className="text-xl font-bold text-gray-900">LegalMatch Pro</span>
                            </div>
                            <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
                                Dedicated to ensuring justice is accessible to all, irrespective of financial status or social standing.
                            </p>
                            <div className="flex gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all cursor-pointer">
                                        <Heart size={20} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Platform</h5>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Directory</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Trust & Safety</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Company</h5>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Partners</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-50 pt-8 flex flex-col md:row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">
                            © 2024 LegalMatch Pro. All rights reserved. Built with empathy for the legal community.
                        </p>
                        <div className="flex gap-8 text-xs text-gray-400 font-medium">
                            <a href="#" className="hover:text-gray-600">Privacy</a>
                            <a href="#" className="hover:text-gray-600">Terms</a>
                            <a href="#" className="hover:text-gray-600">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
