'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface RelatedProduct {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product information
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        
        // After fetching the product, fetch related products
        fetchRelatedProducts(data.category, data.id);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch related products from the same category
  const fetchRelatedProducts = async (category: string, currentProductId: number) => {
    try {
      const res = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await res.json();
      
      // Remove current product and get up to 4 products
      const others = data.products
        .filter((p: ProductDetail) => p.id !== currentProductId)
        .slice(0, 4)
        .map((p: ProductDetail) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          thumbnail: p.thumbnail,
          rating: p.rating
        }));
      
      setRelatedProducts(others);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #f6f5f1 0%, #efede7 100%)' }}>
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #f6f5f1 0%, #efede7 100%)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">محصول یافت نشد</h2>
          <Link href="/" className="text-primary-600 hover:underline">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  const discountPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(145deg, #f6f5f1 0%, #efede7 100%)' }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition mb-6">
          <span>→</span>
          <span>بازگشت به فروشگاه</span>
        </Link>

        {/* Product details */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#d4c9b6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image gallery */}
            <div>
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-gray-100">
                <Image
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {hasDiscount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discountPercentage}% تخفیف
                  </div>
                )}
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === idx ? 'border-primary-500 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${product.title} - ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product information */}
            <div>
              {/* Category and brand */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500">{product.brand}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {product.title}
              </h1>

              {/* Rating and stock */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-gold-50 px-3 py-1 rounded-full">
                  <span className="text-gold-500">⭐</span>
                  <span className="font-bold text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">(از 5)</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span>📦</span>
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    موجودی: {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                {hasDiscount ? (
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary-600">
                      {discountPrice.toFixed(2)} دلار
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price} دلار
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      ذخیره {product.discountPercentage}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    {product.price} دلار
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">📝 توضیحات محصول</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Shipping and warranty information */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="text-sm text-gray-500">🚚 ارسال</div>
                  <p className="font-medium text-gray-800 text-sm">ارسال رایگان تا 3 روز کاری</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="text-sm text-gray-500">🛡️ گارانتی</div>
                  <p className="font-medium text-gray-800 text-sm">گارانتی اصالت و سلامت فیزیک</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="text-sm text-gray-500">🔄 بازگشت کالا</div>
                  <p className="font-medium text-gray-800 text-sm">7 روز ضمانت بازگشت</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="text-sm text-gray-500">⭐ ضمانت قیمت</div>
                  <p className="font-medium text-gray-800 text-sm">بهترین قیمت تضمینی</p>
                </div>
              </div>

              {/* Quantity selector and add to cart button */}
              <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">تعداد:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="flex-1 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <span>🛍️</span>
                  <span>افزودن به سبد خرید</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related products - real data from API */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 محصولات مرتبط</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.id}`}
                  className="bg-white rounded-xl p-3 text-center hover:shadow-lg transition-all duration-300 border border-[#d4c9b6] hover:-translate-y-1 group"
                >
                  <div className="relative w-full h-28 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <Image 
                      src={related.thumbnail} 
                      alt={related.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 line-clamp-1 group-hover:text-primary-600 transition">
                    {related.title}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs text-gold-500">⭐ {related.rating}</span>
                    <span className="text-xs font-bold text-primary-600">{related.price} دلار</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* If no related products found */}
        {relatedProducts.length === 0 && !loading && (
          <div className="mt-12 text-center py-8 bg-white/50 rounded-2xl border border-[#d4c9b6]">
            <p className="text-gray-400">محصول مرتبط دیگری وجود ندارد</p>
          </div>
        )}
      </div>
    </main>
  );
}