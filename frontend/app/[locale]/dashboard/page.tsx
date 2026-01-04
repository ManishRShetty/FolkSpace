// app/dashboard/page.tsx

'use client';
import { useState, useEffect, useCallback } from 'react';
import { getUserId, getUserInfo } from '@/lib/api';
import { useTranslations } from 'next-intl';
import Aurora from "@/components/Aurora";

import WeatherWidget, { WeatherGradient, weatherGradients } from '@/components/widgets/WeatherWidget';
import { InventoryAlerts } from '@/components/widgets/InventoryAlerts';
import CardNav from '@/components/CardNav';

import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { AddAgentForm } from '@/components/dashboard/AddAgentForm';
import { DynamicPricingForm } from '@/components/dashboard/DynamicPricingForm';
import { ForecastForm } from '@/components/dashboard/ForecastForm';
import { AnalyticsTable } from '@/components/dashboard/AnalyticsTable';
import { TopSoldLastYear } from '@/components/dashboard/TopSoldLastYear';
import { RegionalTopTable } from '@/components/dashboard/RegionalTopTable';

// --- REUSABLE GLASS CARD COMPONENT ---
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative w-full rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/90 transition-all duration-500 ease-out ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-2">
    {children}
  </h3>
);

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  // --- User Data ---
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userCountry, setUserCountry] = useState<string>('Norway');

  // --- Dynamic Weather Gradient ---
  const [gradientColors, setGradientColors] = useState<[string, string, string]>(
    weatherGradients.Default.colorStops
  );

  const handleWeatherChange = useCallback((gradient: WeatherGradient) => {
    setGradientColors(gradient.colorStops);
  }, []);

  useEffect(() => {
    const id = getUserId();
    const info = getUserInfo();
    setUserId(id);
    setUserInfo(info);

    // Load location from localStorage (set by navbar)
    const savedLocation = localStorage.getItem('folkspace-location');
    if (savedLocation) {
      try {
        const loc = JSON.parse(savedLocation);
        if (loc?.name) setUserCountry(loc.name);
      } catch (e) {
        // ignore parse errors
      }
    } else if (info?.region) {
      setUserCountry(info.region);
    }

    // Listen for location changes from navbar
    const handleLocationChange = (event: CustomEvent) => {
      if (event.detail?.name) {
        setUserCountry(event.detail.name);
      }
    };

    window.addEventListener('folkspace-location-change', handleLocationChange as EventListener);

    return () => {
      window.removeEventListener('folkspace-location-change', handleLocationChange as EventListener);
    };
  }, []);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleItemAdded = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] font-sans antialiased text-[#1D1D1F] selection:bg-[#007AFF] selection:text-white">

      {/* --- Ambient Background (Dynamic based on weather) --- */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none transition-colors duration-1000">
        <Aurora colorStops={gradientColors} blend={0.6} amplitude={0.5} speed={0.3} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <CardNav />

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-12">

          {/* --- Header Section --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-4 px-2">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                Dashboard
              </h1>
              <p className="text-lg text-gray-500 font-normal">
                {userInfo?.name ? `Good morning, ${userInfo.name}` : "Retail Intelligence Overview"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/60 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50">
              <span className="w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_8px_#34C759]" />
              Systems Operational
            </div>
          </div>

          {/* --- Demo Notice Banner --- */}
          <div className="mb-8 px-2">
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#00F2A9]/20 via-[#3A29FF]/20 to-[#FF94B4]/20 backdrop-blur-xl border border-white/50 px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg">ℹ️</span>
                <p className="text-sm text-gray-700 font-medium">
                  <span className="font-semibold text-[#3A29FF]">Demo Mode:</span> This is a frontend-only demonstration. All data shown is mock/simulated — no backend is connected.
                </p>
              </div>
            </div>
          </div>

          {/* --- Main Grid Layout --- */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN (Main Content) */}
            <div className="xl:col-span-8 space-y-10">

              {/* Analytics Section */}
              <section>
                <SectionTitle>Performance Overview</SectionTitle>
                <GlassCard className="p-2">
                  {userId ? (
                    <AnalyticsTable userId={userId} />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400 font-light">{t('loadingUserData')}</div>
                  )}
                </GlassCard>
              </section>

              {/* Quick Actions Grid - Bento Style */}
              <section>
                <SectionTitle>Quick Actions</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Add Inventory - Primary/Larger */}
                  <GlassCard className="p-6 relative overflow-hidden group hover:shadow-lg transition-all md:row-span-2">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00F2A9] to-[#00C7BE]" />
                    <h4 className="text-lg font-semibold text-[#1D1D1F] mb-4">Add Inventory</h4>
                    <AddItemForm userId={userId || undefined} onItemAdded={handleItemAdded} />
                  </GlassCard>

                  {/* AI Forecasting */}
                  <GlassCard className="p-5 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3A29FF] to-[#6366F1] opacity-80" />
                    <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">AI Forecasting</h4>
                    <ForecastForm />
                  </GlassCard>

                  {/* Dynamic Pricing */}
                  <GlassCard className="p-5 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF94B4] to-[#F472B6] opacity-80" />
                    <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Dynamic Pricing</h4>
                    {userId ? <DynamicPricingForm userId={userId} /> : <div className="text-sm text-gray-400">Loading...</div>}
                  </GlassCard>

                  {/* Agent Management */}
                  <GlassCard className="p-5 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] opacity-80" />
                    <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Agent Management</h4>
                    {userId ? <AddAgentForm userId={userId} /> : <div className="text-sm text-gray-400">Loading...</div>}
                  </GlassCard>

                </div>
              </section>

              {/* Inventory Section */}
              <section>
                <div className="flex items-center justify-between mb-4 px-2">
                  <SectionTitle>Live Inventory</SectionTitle>
                  <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="text-xs font-semibold text-[#0066CC] hover:text-[#004499] transition-colors">
                    Refresh
                  </button>
                </div>
                <GlassCard className="p-2">
                  <InventoryTable userId={userId || undefined} key={refreshTrigger} />
                </GlassCard>
              </section>

              {/* Insights Split Section */}
              <section>
                <SectionTitle>Market Insights</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="p-2">
                    <TopSoldLastYear userId={userId || undefined} />
                  </GlassCard>
                  <GlassCard className="p-2">
                    <RegionalTopTable country={userCountry} />
                  </GlassCard>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN (Sidebar - Now Compact) */}
            <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-8">

              {/* Weather Widget */}
              <section>
                <SectionTitle>Weather Status</SectionTitle>
                <GlassCard className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/50 to-white/50">
                  <WeatherWidget locationName={userCountry} onWeatherChange={handleWeatherChange} />
                </GlassCard>
              </section>

              {/* Inventory Alerts */}
              <section>
                <SectionTitle>Alerts</SectionTitle>
                <GlassCard className="p-6 bg-gradient-to-br from-purple-50/50 to-white/50">
                  <InventoryAlerts />
                </GlassCard>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}