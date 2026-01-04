// components/dashboard/DynamicPricingForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';
import { DollarSign, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  userId: string;
}

// Mock pricing result for demo
const mockPricingResult = {
  currentPrice: 24.99,
  optimizedPrice: 29.99,
  improvement: '+20%',
};

export function DynamicPricingForm({ userId }: Props) {
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState<typeof mockPricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult(mockPricingResult);
      setProductId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-500/10">
          <DollarSign className="w-3.5 h-3.5 text-pink-600" />
        </div>
        <h3 className="text-sm font-semibold text-[#1D1D1F]">Price Optimization</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Product ID Input */}
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Product ID..."
          className="w-full px-3 py-2 bg-gray-50/80 hover:bg-gray-100/80 rounded-lg border border-gray-200/50 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all outline-none"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold text-sm hover:from-pink-700 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize</span>
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Compact Results */}
      {result && (
        <div className="p-3 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-xl border border-pink-100/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-500 line-through text-sm">€{result.currentPrice}</span>
            <ArrowRight className="w-4 h-4 text-pink-400" />
            <span className="text-lg font-bold text-pink-600">€{result.optimizedPrice}</span>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
              {result.improvement}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}