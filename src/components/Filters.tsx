'use client';

import { useCategories } from '@/application/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

interface FiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange?: (min: number, max: number) => void;
  onSortChange?: (sort: string) => void;
  onRatingChange?: (rating: number) => void;
}

export default function Filters({ 
  onSearch, 
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onRatingChange 
}: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // اعمال فیلتر قیمت
  const handlePriceApply = () => {
    const min = priceRange.min ? Number(priceRange.min) : 0;
    const max = priceRange.max ? Number(priceRange.max) : Infinity;
    onPriceChange?.(min, max);
  };

  // مرتب‌سازی
  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  // فیلتر امتیاز
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    onRatingChange?.(rating);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-primary-100">
      {/* ردیف اول: جستجو و دکمه فیلتر پیشرفته */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 جستجوی محصولات
          </label>
          <div className="relative">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="نام محصول را وارد کنید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📂 دسته‌بندی
          </label>
          <select
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white transition-all duration-200"
            defaultValue=""
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {!categoriesLoading && categories?.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-7 px-5 py-3 border border-primary-200 rounded-xl text-primary-600 font-medium hover:bg-primary-50 transition-all duration-200 flex items-center gap-2"
          >
            <span>⚙️</span>
            <span>فیلتر پیشرفته</span>
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* فیلترهای پیشرفته */}
      {showFilters && (
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* فیلتر قیمت */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 محدوده قیمت (دلار)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="از"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <input
                  type="number"
                  placeholder="تا"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handlePriceApply}
                  className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition"
                >
                  اعمال
                </button>
              </div>
            </div>

            {/* مرتب‌سازی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 مرتب‌سازی بر اساس
              </label>
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                defaultValue=""
              >
                <option value="">پیش‌فرض</option>
                <option value="price_asc">قیمت: کم به زیاد</option>
                <option value="price_desc">قیمت: زیاد به کم</option>
                <option value="rating_desc">بیشترین امتیاز</option>
                <option value="title_asc">نام: الف تا ی</option>
                <option value="title_desc">نام: ی تا الف</option>
              </select>
            </div>

            {/* فیلتر امتیاز */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⭐ حداقل امتیاز
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star === selectedRating ? 0 : star)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedRating === star
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="text-xs text-gray-400 mt-1 text-center">
                  محصولات با امتیاز {selectedRating} به بالا
                </p>
              )}
            </div>
          </div>

          {/* دکمه ریست فیلترها */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setPriceRange({ min: '', max: '' });
                setSortBy('');
                setSelectedRating(0);
                onPriceChange?.(0, Infinity);
                onSortChange?.('');
                onRatingChange?.(0);
              }}
              className="text-sm text-gray-500 hover:text-primary-600 transition px-3 py-1"
            >
              🔄 حذف همه فیلترها
            </button>
          </div>
        </div>
      )}
    </div>
  );
}