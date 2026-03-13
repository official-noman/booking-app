"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  TrendingUp,
  Palette,
  Check,
  Menu,
  X,
  Sparkles,
  Mail,
  Linkedin,
  Briefcase,
} from "lucide-react";

// --- Custom Checkout Hook ---
export function useCheckout() {
  
  const[loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(serviceId: string) {
    setLoadingId(serviceId);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      // Redirect to Stripe Hosted Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("[handleCheckout]", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoadingId(null); 
    }
  }

  return { handleCheckout, loadingId, error };
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Popups/Modals State
  const[showHowItWorks, setShowHowItWorks] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { handleCheckout, loadingId } = useCheckout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services =[
    {
      serviceId: "web_dev_1",
      icon: Globe,
      title: "Executive Web Suite",
      description: "Premium web solutions for discerning businesses",
      features:[
        "Custom Next.js Architecture",
        "Advanced SEO Implementation",
        "Performance Optimization",
        "Dedicated Support Channel",
        "90-Day Priority Maintenance",
      ],
      price: 499,
      highlight: true,
    },
    {
      serviceId: "seo_1",
      icon: TrendingUp,
      title: "Growth SEO Pro",
      description: "Strategic optimization for measurable results",
      features:[
        "Comprehensive SEO Audit",
        "Keyword Strategy & Research",
        "Technical SEO Optimization",
        "Monthly Performance Reports",
        "Link Building Campaign",
      ],
      price: 299,
      highlight: false,
    },
    {
      serviceId: "design_1",
      icon: Palette,
      title: "Brand Identity Design",
      description: "Distinctive visual identity that resonates",
      features:[
        "Logo Design & Variations",
        "Brand Style Guide",
        "Color Palette Development",
        "Typography System",
        "Marketing Collateral Templates",
      ],
      price: 199,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Clicks back to top */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dra Soft
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-300 hover:text-white transition-colors duration-200">
                Services
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-300 hover:text-white transition-colors duration-200 cursor-default opacity-60">
                About
              </a>
              <button onClick={() => setShowContact(true)} className="text-slate-300 hover:text-white transition-colors duration-200">
                Contact
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 absolute w-full overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                <a
                  href="#services"
                  className="block text-slate-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </a>
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowContact(true); }}
                  className="block text-slate-300 hover:text-white transition-colors text-left w-full"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto pt-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Elevate Your Digital
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Presence with Dra Soft
                </span>
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
              Premium digital services crafted for businesses that demand excellence. Transform your vision into reality with our expert team.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                Browse Services
              </button>
              <button 
                onClick={() => setShowHowItWorks(true)}
                className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all duration-300"
              >
                How It Works
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Premium Services</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Meticulously crafted solutions designed to exceed your expectations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const isProcessing = loadingId === service.serviceId; 

              return (
                <motion.div key={service.serviceId} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} className={`relative group ${service.highlight ? "lg:-mt-4" : ""}`}>
                  <div className={`h-full flex flex-col bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${service.highlight ? "border-indigo-500/50 shadow-xl shadow-indigo-500/20" : "border-slate-700/50 hover:border-slate-600/50"}`}>
                    
                    {service.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    )}

                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${service.highlight ? "bg-gradient-to-br from-indigo-600 to-purple-600" : "bg-gradient-to-br from-slate-700 to-slate-600"}`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-slate-400 mb-6">{service.description}</p>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-slate-700/50 mt-auto">
                      <div className="flex items-baseline justify-between mb-6">
                        <span className="text-4xl font-bold">${service.price}</span>
                        <span className="text-slate-400">per project</span>
                      </div>

                      <button
                        disabled={loadingId !== null} 
                        onClick={() => handleCheckout(service.serviceId)}
                        className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold transition-all duration-300 ${
                          service.highlight
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50"
                            : "bg-slate-700 hover:bg-slate-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Book Now"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center gap-4">
          <p className="text-slate-400">© 2026 Dra Soft. Crafted with excellence.</p>
        </div>
      </footer>

      {/* ----------------- MODALS (POPUPS) ----------------- */}
      <AnimatePresence>
        
        {/* HOW IT WORKS MODAL */}
        {showHowItWorks && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowHowItWorks(false)} // ক্লিক করলে বাইরে বন্ধ হবে
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // ভেতরের ক্লিকে বন্ধ হবে না
              className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full relative"
            >
              <button onClick={() => setShowHowItWorks(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-400" /> How It Works
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-white">Select a Service</h4>
                    <p className="text-sm text-slate-400 mt-1">Choose the digital service that fits your business needs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-white">Secure Checkout</h4>
                    <p className="text-sm text-slate-400 mt-1">Complete your payment safely via our Stripe integration.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-white">Instant Confirmation</h4>
                    <p className="text-sm text-slate-400 mt-1">Get an automated email receipt and our team will contact you shortly!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CONTACT MODAL */}
        {showContact && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowContact(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative text-center"
            >
              <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">NM</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Noman Mahmud</h3>
              <p className="text-indigo-400 font-medium mb-6">Full-Stack Developer</p>

              <div className="space-y-4">
                <a href="mailto:official.aanoman@gmail.com" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-200">
                  <Mail className="w-5 h-5" /> official.aanoman@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/abdullah-al-noman-772999376/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 rounded-xl transition-colors font-medium">
                  <Linkedin className="w-5 h-5" /> LinkedIn Profile
                </a>
                <a href="https://official-noman.github.io/portfolio/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-xl transition-colors font-medium">
                  <Briefcase className="w-5 h-5" /> View Portfolio
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}