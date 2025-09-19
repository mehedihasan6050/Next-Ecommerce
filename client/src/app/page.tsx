'use client';

import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { categories } from '@/utils/config';
import Link from 'next/link';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners, featuredProducts, fetchFeaturedProducts, fetchBanners } =
    useSettingsStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { fetchProductsForClient, products } = useProductStore();





  useEffect(() => {
    fetchBanners();
    fetchFeaturedProducts();
     fetchProductsForClient({
      categories: selectedCategories,
     
    });
  }, [fetchBanners, fetchFeaturedProducts, selectedCategories]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [banners.length]);


  
  const handleToggleFilter = (
    filterType: 'categories',
    value: string
  ) => {
  


if (filterType === 'categories' && value === 'All') {
    // শুধু category reset হবে
    setSelectedCategories([]);
    return;
  }

    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };


  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[600px] overflow-hidden">
        {banners.map((bannerItem, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
            key={bannerItem.id}
          >
            <div className="absolute inset-0">
              <img
                src={bannerItem.imageUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 bg-opacity-20" />
            </div>
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="text-white space-y-6">
                <span className="text-sm uppercase tracking-wider">
                  I AM JOHN
                </span>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  BEST SELLING
                  <br />
                  E-COMMERCE WEBSITE
                </h1>
                <p className="text-lg">
                  A Creative, Flexible , Clean, Easy to use and
                  <br />
                  High Performance E-Commerce Theme
                </p>
                <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* grid section */}
      <div className="px-6 pt-10">
        <div className="max-w-10/12 mx-auto space-y-12">
          {/* Categories Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Shop From{' '}
                <span className="border-b-2 border-black pb-1">
                  Top Categories
                </span>
              </h2>
              <Link href="/listing" className="flex items-center text-gray-600  transition-colors">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {categories.map(category => (
                <div
  key={category.name}
  className={`flex flex-col items-center cursor-pointer rounded-full justify-center mb-3 transition-all
    border p-4 ${
      category.name === 'All'
        ? selectedCategories.length === 0
          ? 'bg-black border-blue-200 text-white'
          : 'bg-white border-gray-200'
        : selectedCategories.includes(category.name)
        ? 'bg-black border-blue-200 text-white'
        : 'bg-white border-gray-200'
    }`}
  onClick={() => handleToggleFilter('categories', category.name)}
>
  {category.name}
</div>

              ))}
            </div>

            {products?.length > 0 ? <div className="grid my-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {products.slice(0, 5).map(product => (
                <div
                  key={product.id}
                  className="relative overflow-hidden border border-gray-200 rounded-md"
                >
                  <div className="h-40 mb-4 flex items-center justify-center rounded-lg">
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 px-4 pb-4">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-green-600">
                      Save - ${product.originalPrice - product.price}
                    </div>
                  </div>
                </div>
              ))} 
            </div>
              :
              <h2 className='text-3xl my-4 text-center'>Matched Product Not Found</h2>
              } 
          </section>

         
        </div>
      </div>

      {/* Feature products section */}
      <section className="py-20 max-w-10/12 mx-auto">
        <div className="px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            Featured Product
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Shop our new arrivals from established brands
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((productItem, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-4/4">
                  <img
                    src={productItem.images[0]}
                    alt={productItem.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-md"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {productItem.name}
                    </h3>
                    <p className="text-sm">{productItem.price}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      QUICK ViEW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-black text-white flex justify-center p-6 items-center">
        <h1>2025 All Right Reserved | NextEcom </h1>
      </div>
    </div>
  );
}

export default HomePage;
