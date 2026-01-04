// components/dashboard/ForecastForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';
import { TrendingUp, Sparkles, ChevronDown, Loader2 } from 'lucide-react';

// Mock forecast results for demo
const mockForecastData = {
  prediction: '+12.5%',
  confidence: '87%',
  trend: 'upward',
};

export function ForecastForm() {
  const [period, setPeriod] = useState('30');
  const [forecastResult, setForecastResult] = useState<typeof mockForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const periodOptions = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setForecastResult(null);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setForecastResult(mockForecastData);
    } catch (error) {
      console.error('Forecast error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = periodOptions.find(opt => opt.value === period);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
          <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
        </div>
        <h3 className="text-sm font-semibold text-[#1D1D1F]">Demand Forecast</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Period Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50/80 hover:bg-gray-100/80 rounded-lg border border-gray-200/50 transition-all text-left text-sm"
          >
            <span className="font-medium text-gray-800">{selectedOption?.label}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10">
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPeriod(opt.value);
                    setIsSelectOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${period === opt.value
                      ? 'bg-purple-50 text-purple-700'
                      : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Forecast</span>
            </>
          )}
        </button>
      </form>

      {/* Compact Results */}
      {forecastResult && (
        <div className="p-3 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-xl border border-purple-100/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Growth</p>
              <p className="text-lg font-bold text-green-600">{forecastResult.prediction}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="text-lg font-semibold text-purple-600">{forecastResult.confidence}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}