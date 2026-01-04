'use client';
import { useState, useEffect } from 'react';
import { KpiMetric } from '@/types/index';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { api } from '@/lib/api'; // Adjust path if needed
import GradientText from '../GradientText';
import { useTranslations } from 'next-intl'; // +++ IMPORT

interface Props {
  userId: string;
}

// +++ MODIFIED DUMMY DATA (Using i18n keys) +++
const dummyMetrics: KpiMetric[] = [
  {
    _id: '1',
    metric: 'totalRevenue', // Changed from 'Total Revenue'
    value: '€45,231.89',
    change: '+12.5%',
  },
  {
    _id: '2',
    metric: 'newCustomers', // Changed from 'New Customers'
    value: '1,204',
    change: '+8.2%',
  },
  {
    _id: '3',
    metric: 'conversionRate', // Changed from 'Conversion Rate'
    value: '3.12%',
    change: '-1.5%',
  },
  {
    _id: '4',
    metric: 'avgOrderValue', // Changed from 'Avg. Order Value'
    value: '€120.50',
    change: '+0.5%',
  },
];
// +++ END DUMMY DATA +++

// +++ HELPER MAP (Converts API strings to i18n keys) +++
const metricKeyMap: { [key: string]: string } = {
  'Total Revenue': 'totalRevenue',
  'New Customers': 'newCustomers',
  'Conversion Rate': 'conversionRate',
  'Avg. Order Value': 'avgOrderValue',
};

// Helper to convert API strings to i18n keys
const getMetricKey = (metricString: string): string => {
  return metricKeyMap[metricString] || metricString; // Fallback to the string itself
};
// +++ END HELPER MAP +++

export function AnalyticsTable({ userId }: Props) {
  const t = useTranslations('AnalyticsTable'); // +++ INITIALIZE HOOK

  const [metrics, setMetrics] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📊 Fetching analytics for user:', userId);
        const response = await api.getAnalytics(userId);
        const data = await response.json();

        // Handle both formats: { metrics: [...] } or direct array
        const metricsList = data.metrics || dummyMetrics;
        console.log('📊 Analytics received:', metricsList);
        setMetrics(metricsList);

      } catch (err) {
        console.error('❌ Error fetching analytics:', err);
        // Fallback to dummy data on error
        setMetrics(dummyMetrics);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAnalytics();
    } else {
      setError(t('errorNoUserId'));
      setLoading(false);
    }
  }, [userId, t]);

  // --- Revised Theme Styles (Clean/Apple) ---
  // We rely on the parent GlassCard for the main background/shadow
  // This component just renders the grid cleanly.

  // --- Helper Functions ---
  const getChangeIcon = (change?: string) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-500" />;
    if (change.startsWith('+'))
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change.startsWith('-'))
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mb-2"></div>
        <p className="text-sm font-medium">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="text-sm font-medium">{t('errorPrefix')} {error}</p>
      </div>
    );
  }

  // Gradient colors for each metric card
  const gradientColors: { [key: string]: { from: string; to: string; bg: string } } = {
    totalRevenue: { from: '#00F2A9', to: '#00C4A3', bg: 'rgba(0, 242, 169, 0.08)' },
    newCustomers: { from: '#3A29FF', to: '#6366F1', bg: 'rgba(58, 41, 255, 0.08)' },
    conversionRate: { from: '#FF94B4', to: '#F472B6', bg: 'rgba(255, 148, 180, 0.08)' },
    avgOrderValue: { from: '#F59E0B', to: '#FBBF24', bg: 'rgba(245, 158, 11, 0.08)' },
  };

  return (
    <div className="p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1D1D1F]">{t('title')}</h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-100/80 px-3 py-1.5 rounded-full">
          Live Data
        </span>
      </div>

      {/* Metrics Grid - Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, index) => {
          const colors = gradientColors[metric.metric] || gradientColors.totalRevenue;
          const isPositive = metric.change?.startsWith('+');
          const isNegative = metric.change?.startsWith('-');

          return (
            <div
              key={metric._id}
              className="group relative p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Accent gradient bar */}
              <div
                className="absolute top-0 left-0 w-full h-1 opacity-80"
                style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
              />

              {/* Floating gradient orb (subtle background effect) */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Metric Label */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                  />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(metric.metric)}
                  </p>
                </div>

                {/* Value */}
                <p className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2">
                  {metric.value}
                </p>

                {/* Change Indicator */}
                {metric.change && (
                  <div className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isPositive
                        ? 'bg-green-100/80 text-green-600'
                        : isNegative
                          ? 'bg-red-100/80 text-red-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                      {getChangeIcon(metric.change)}
                      <span>{metric.change}</span>
                    </div>
                    <span className="text-xs text-gray-400">{t('changeSuffix')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}