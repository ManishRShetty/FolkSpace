import React from 'react';
import Aurora from "@/components/Aurora";

// If you don't have lucide-react, you can remove these and use the emojis as before,
// but these icons add to the premium feel.
import { BarChart3, Tag, Recycle, LineChart, ArrowRight, Layers } from "lucide-react";

const App: React.FC = () => {
  return (
    <>
      {/* Background: Apple-style off-white (#F5F5F7).
        Font: Sans-serif with antialiasing for crisp text.
      */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] p-6 md:p-12 overflow-hidden font-sans antialiased text-[#1D1D1F]">

        {/* Ambient Background - Colors adjusted for Light Mode */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
          <Aurora
            colorStops={["#00F2A9", "#3A29FF", "#FF94B4"]}
            blend={0.5}
            amplitude={0.8}
            speed={0.4}
          />
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-6xl space-y-16">

          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Demo</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#1D1D1F]">
                Folkspace
              </h1>
              <p className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#00C988] to-[#3A29FF]">
                Retail intelligence, reimagined.
              </p>
            </div>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              An intelligent dashboard built to help Nordic retailers forecast demand,
              optimize inventory, and reduce waste using climate-responsive AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#1D1D1F] px-8 py-4 text-white font-medium text-lg shadow-xl hover:bg-black hover:scale-105 transition-all duration-300"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#learn-more"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[#1D1D1F] font-medium text-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-300"
              >
                View Case Study
              </a>
            </div>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1 */}
            <div className="group bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Climate Aware</h3>
              <p className="text-gray-500 leading-relaxed">Predicts demand using historical sales and live weather patterns.</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 text-rose-600 group-hover:scale-110 transition-transform duration-300">
                <Tag size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Dynamic Pricing</h3>
              <p className="text-gray-500 leading-relaxed">AI price suggestions based on shelf-life and real-time demand.</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <Recycle size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Waste Reduction</h3>
              <p className="text-gray-500 leading-relaxed">Smart alerts for items nearing expiry to automate markdowns.</p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Real Analytics</h3>
              <p className="text-gray-500 leading-relaxed">Comprehensive inventory tracking and regional sales insights.</p>
            </div>
          </div>

          {/* Footer / Tech Stack */}
          <div className="border-t border-gray-200 pt-10 flex flex-col items-center space-y-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Powered By</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Minimalist Pills */}
              {['Next.js', 'React', 'TypeScript', 'Firebase', 'Vertex AI'].map((tech) => (
                <span key={tech} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 text-sm font-medium shadow-sm hover:border-gray-300 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-8">
              Built in 28 hours for the Nordic Sustainability Hackathon.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default App;