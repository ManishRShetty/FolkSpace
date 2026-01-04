// components/dashboard/AddItemForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api, getUserId } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { Package, MapPin, DollarSign, Calendar, Loader2, Check, ChevronDown } from 'lucide-react';
import Flag from 'react-world-flags';

interface Props {
  userId?: string;
  onItemAdded?: () => void;
}

export function AddItemForm({ userId: propUserId, onItemAdded }: Props) {
  const t = useTranslations('AddItemForm');

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [country, setCountry] = useState('');
  const [month, setMonth] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [sales, setSales] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Nordic countries with ISO codes for flag images
  const nordicCountries = [
    { value: "", label: t('countryPlaceholder'), code: "" },
    { value: "denmark", label: t('countries.denmark'), code: "DK" },
    { value: "finland", label: t('countries.finland'), code: "FI" },
    { value: "iceland", label: t('countries.iceland'), code: "IS" },
    { value: "norway", label: t('countries.norway'), code: "NO" },
    { value: "sweden", label: t('countries.sweden'), code: "SE" },
  ];

  // Custom dropdown state for country
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const selectedCountry = nordicCountries.find(c => c.value === country);

  // Month options
  const monthKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const months = monthKeys.map(key => ({
    value: key,
    label: t(`months.${key}`)
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const userId = propUserId || getUserId();
      if (!userId) {
        throw new Error(t('errorNoUserId'));
      }

      const itemData = {
        product_name: productName,
        quantity: parseInt(quantity),
        country: country,
        month: parseInt(month),
        cost_price: costPrice ? parseFloat(costPrice) : undefined,
        selling_price: sellingPrice ? parseFloat(sellingPrice) : undefined,
        current_price: currentPrice ? parseFloat(currentPrice) : undefined,
        sales: sales ? parseInt(sales) : undefined,
        expiryDate: expiryDate || undefined,
      };

      console.log('📦 Adding item:', itemData);
      const response = await api.addItem(userId, itemData);
      await response.json();

      console.log('✅ Item added successfully');
      setMessage(t('successMessage'));
      setIsSuccess(true);

      // Reset form
      setProductName('');
      setQuantity('');
      setCountry('');
      setMonth('');
      setCostPrice('');
      setSellingPrice('');
      setCurrentPrice('');
      setSales('');
      setExpiryDate('');

      if (onItemAdded) {
        onItemAdded();
      }

      setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('❌ Error adding item:', error);
      setMessage(error instanceof Error ? error.message : t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  // Input styling
  const inputClass = "block w-full rounded-xl border-none bg-gray-50/80 hover:bg-gray-100/80 px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all outline-none";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";
  const selectClass = "block w-full rounded-xl border-none bg-gray-50/80 hover:bg-gray-100/80 px-4 py-3 text-sm text-[#1D1D1F] focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100/50">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10">
          <Package className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#1D1D1F]">{t('title')}</h3>
          <p className="text-xs text-gray-400">Fill in product details</p>
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="productName" className={labelClass}>
          {t('productNameLabel')}
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className={inputClass}
          placeholder={t('productNamePlaceholder')}
          required
        />
      </div>

      {/* Location Section */}
      <div className="p-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
          <MapPin className="w-3.5 h-3.5" />
          Location & Time
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              {t('countryLabel')}
            </label>
            <div className="relative">
              {/* Custom country dropdown with flag images */}
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={`${selectClass} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  {selectedCountry?.code ? (
                    <span className="w-5 h-4 overflow-hidden rounded-sm shadow-sm inline-block">
                      <Flag code={selectedCountry.code} className="w-full h-full object-cover" />
                    </span>
                  ) : null}
                  <span>{selectedCountry?.label || t('countryPlaceholder')}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCountryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  {nordicCountries.filter(c => c.value).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setCountry(option.value);
                        setIsCountryOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${country === option.value
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                      <span className="w-5 h-4 overflow-hidden rounded-sm shadow-sm">
                        <Flag code={option.code} className="w-full h-full object-cover" />
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Hidden input for form validation */}
              <input type="hidden" name="country" value={country} required />
            </div>
          </div>
          <div>
            <label htmlFor="month" className={labelClass}>
              {t('monthLabel')}
            </label>
            <div className="relative">
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">{t('monthPlaceholder')}</option>
                {months.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quantity and Sales */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="quantity" className={labelClass}>
            {t('quantityLabel')}
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="sales" className={labelClass}>
            {t('salesLabel')}
          </label>
          <input
            type="number"
            id="sales"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            className={inputClass}
            min="0"
            placeholder={t('salesPlaceholder')}
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="p-4 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wide">
          <DollarSign className="w-3.5 h-3.5" />
          Pricing (€)
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="costPrice" className={labelClass}>
              {t('costPriceLabel')}
            </label>
            <input
              type="number"
              id="costPrice"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className={inputClass}
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="sellingPrice" className={labelClass}>
              {t('sellingPriceLabel')}
            </label>
            <input
              type="number"
              id="sellingPrice"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className={inputClass}
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="currentPrice" className={labelClass}>
              {t('currentPriceLabel')}
            </label>
            <input
              type="number"
              id="currentPrice"
              step="0.01"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className={inputClass}
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expiryDate" className={labelClass}>
          <Calendar className="w-3 h-3 inline mr-1" />
          {t('expiryDateLabel')}
        </label>
        <input
          type="date"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-semibold text-sm hover:from-teal-700 hover:to-emerald-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('buttonLoadingText')}</span>
          </>
        ) : (
          <>
            <Package className="w-4 h-4" />
            <span>{t('buttonText')}</span>
          </>
        )}
      </button>

      {/* Success/Error Message */}
      {message && (
        <div className={`flex items-center justify-center gap-2 text-sm font-medium p-3 rounded-xl animate-in fade-in slide-in-from-bottom-2 ${isSuccess
          ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
          : 'text-red-700 bg-red-50 border border-red-100'
          }`}>
          {isSuccess && <Check className="w-4 h-4" />}
          {message}
        </div>
      )}
    </form>
  );
}
