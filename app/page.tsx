"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  TrendingUp,
  Palette,
  Check,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { ServiceId } from "@/lib/config";

function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(serviceId: ServiceId) {
    setLoading(true);
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

      window.location.href = data.url;
    } catch (err) {
      console.error("[handleCheckout]", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { handleCheckout, loading, error };
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { handleCheckout, loading, error } = useCheckout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services: {
    serviceId: ServiceId;
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    price: number;
    highlight: boolean;
  }[] = [
    {
      serviceId: "web_dev_1",
      icon: Globe,
      title: "Executive Web Suite",
      description: "Premium web solutions for discerning businesses",
      features: [
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
      features: [
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
      features: [
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dra Soft
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#services"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200">
                Get Started
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 absolute w-full"
          >
            <div className="px-6 py-6 space-y-4">
              <a
                href="#services"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#about"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <button className="w-full px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Elevate Your Digital
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Presence with Dra Soft
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed"
            >
              Premium digital services crafted for businesses that demand
              excellence. Transform your vision into reality with our expert
              team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#services"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                Browse Services
              </a>
              <button className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all duration-300">
                How It Works
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Services
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Meticulously crafted solutions designed to exceed your expectations
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;

              return (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative group ${
                    service.highlight ? "lg:-mt-4" : ""
                  }`}
                >
                  <div
                    className={`h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      service.highlight
                        ? "border-indigo-500/50 shadow-xl shadow-indigo-500/20"
                        : "border-slate-700/50 hover:border-slate-600/50"
                    }`}
                  >
                    {service.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    )}

                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                        service.highlight
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600"
                          : "bg-gradient-to-br from-slate-700 to-slate-600"
                      }`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-slate-400 mb-6">{service.description}</p>

                    <ul className="space-y-3 mb-8">
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
                        onClick={() => handleCheckout(service.serviceId)}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                          service.highlight
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      >
                        {loading ? "Processing..." : "Book Now"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">© 2026 Dra Soft. Crafted with excellence.</p>
        </div>
      </footer>
    </div>
  );
}