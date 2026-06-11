import { Product } from '@/domain/models/product';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/products/${product.id}`}>
      <div 
        className="group relative bg-white rounded-2xl transition-all duration-500 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          border: '1px solid #d4c9b6',
          boxShadow: isHovered 
            ? '0 20px 35px -12px rgba(26, 77, 62, 0.15)' 
            : '0 5px 20px -10px rgba(0, 0, 0, 0.08)',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        }}
      >
        {/* بخش تصویر */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary-50 to-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-all duration-500"
            style={{
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* نشان امتیاز */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
            <span>⭐</span>
            <span>{product.rating}</span>
          </div>
        </div>
        
        {/* محتوای کارت */}
        <div className="p-4 relative bg-white">
          {/* دسته‌بندی */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
              {product.stock > 0 ? 'موجود' : 'ناموجود'}
            </span>
          </div>
          
          {/* عنوان محصول */}
          <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* توضیحات */}
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
          
          {/* قیمت */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary-600">{product.price}</span>
              <span className="text-xs text-gray-400">دلار</span>
            </div>
            <div className="text-primary-500 text-sm group-hover:translate-x-1 transition-transform">
              مشاهده جزئیات →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}