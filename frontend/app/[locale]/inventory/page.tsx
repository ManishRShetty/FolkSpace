// app/inventory/page.tsx

'use client';
import { useState, useEffect, useCallback } from 'react';
import { getUserId, getUserInfo } from '@/lib/api';
import { useTranslations } from 'next-intl';
import Aurora from "@/components/Aurora";

import WeatherWidget, { WeatherGradient, weatherGradients } from '@/components/widgets/WeatherWidget';
import CardNav from '@/components/CardNav';

import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { AddItemForm } from '@/components/dashboard/AddItemForm';

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

export default function InventoryPage() {
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
                                Inventory
                            </h1>
                            <p className="text-lg text-gray-500 font-normal">
                                Manage your product inventory across all regions
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setRefreshTrigger(prev => prev + 1)}
                                className="text-sm font-semibold text-white bg-[#1D1D1F] px-5 py-2.5 rounded-full hover:bg-black transition-colors"
                            >
                                Refresh Data
                            </button>
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

                            {/* Inventory Table */}
                            <section>
                                <SectionTitle>All Products</SectionTitle>
                                <GlassCard className="p-4">
                                    <InventoryTable userId={userId || undefined} key={refreshTrigger} />
                                </GlassCard>
                            </section>

                        </div>

                        {/* RIGHT COLUMN (Sidebar) */}
                        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-8">

                            {/* Add New Item */}
                            <section>
                                <SectionTitle>Add New Product</SectionTitle>
                                <GlassCard className="p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00F2A9] to-[#00C7BE]" />
                                    <AddItemForm userId={userId || undefined} onItemAdded={handleItemAdded} />
                                </GlassCard>
                            </section>

                            {/* Weather Widget */}
                            <section>
                                <SectionTitle>Weather Status</SectionTitle>
                                <GlassCard className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/50 to-white/50">
                                    <WeatherWidget locationName={userCountry} onWeatherChange={handleWeatherChange} />
                                </GlassCard>
                            </section>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
