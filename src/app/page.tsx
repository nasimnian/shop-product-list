'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/application/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState('');
  const [minRating, setMinRating] = useState(0);
  
  const { data: products, isLoading, error } = useProducts(searchQuery);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort products
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating_desc':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'title_asc':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title_desc':
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }

    return result;
  }, [products, selectedCategory, priceRange, sortBy, minRating]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #f6f5f1 0%, #efede7 100%)' }}>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">خطا در دریافت اطلاعات</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(145deg, #f6f5f1 0%, #efede7 100%)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gold-500 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gold-400 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex justify-center mb-3">
         
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
           فروشگاه آنلاین
          </h1>
          <p className="text-center text-primary-100 text-lg">
               با بهترین قیمت‌ها | <span className="text-gold-400 font-semibold">تضمین کیفیت و اصالت</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Filters 
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onPriceChange={(min, max) => setPriceRange({ min, max })}
          onSortChange={setSortBy}
          onRatingChange={setMinRating}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-right">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} محصول یافت شد
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">محصولی یافت نشد</h3>
                <p className="text-gray-400">لطفاً فیلترهای دیگری را امتحان کنید</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}