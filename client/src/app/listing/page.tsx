'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useProductStore } from '@/store/useProductStore';
import { brands, categories, sizes, colors } from '@/utils/config';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProductListingPage() {
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  const {
    products,
    currentPage,
    totalProducts,
    totalPages,
    setCurrentPage,
    fetchProductsForClient,
    isLoading,
    error,
  } = useProductStore();

  const fetchAllProducts = () => {
    fetchProductsForClient({
      page: currentPage,
      limit: 5,
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      sortOrder,
    });
  };

  useEffect(() => {
    fetchAllProducts();
  }, [
    currentPage,
    selectedCategories,
    selectedSizes,
    selectedBrands,
    selectedColors,
    priceRange,
    sortBy,
    sortOrder,
  ]);

  const handleSortChange = (value: string) => {
    console.log(value);
    const [newSortBy, newSortOrder] = value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'asc' | 'desc');
  };

  const handleToggleFilter = (
    filterType: 'categories' | 'sizes' | 'brands' | 'colors',
    value: string
  ) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };

     if (filterType === 'categories' && value === 'All') {
    // শুধু category reset হবে
    setSelectedCategories([]);
    return;
  }

    setterMap[filterType](prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const FilterSection = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 font-semibold">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.name} className="flex items-center">
                <Checkbox
                  checked={category.name === 'All'
          ? selectedCategories.length === 0
          : selectedCategories.includes(category.name)}
                  onCheckedChange={() =>
                    handleToggleFilter('categories', category.name)
                  }
                  id={category.name}
                />
                <Label htmlFor={category.name} className="ml-2 text-sm">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Brands</h3>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleToggleFilter('brands', brand)}
                  id={brand}
                />
                <Label htmlFor={brand} className="ml-2 text-sm">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map(sizeItem => (
              <Button
                key={sizeItem}
                variant={
                  selectedSizes.includes(sizeItem) ? 'default' : 'outline'
                }
                onClick={() => handleToggleFilter('sizes', sizeItem)}
                className="h-8 w-8"
                size="sm"
              >
                {sizeItem}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color.name}
                className={`w-6 h-6 rounded-full ${color.class} ${
                  selectedColors.includes(color.name)
                    ? 'ring-offset-2 ring-black ring-2'
                    : ''
                }`}
                title={color.name}
                onClick={() => handleToggleFilter('colors', color.name)}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Price range</h3>
          <Slider
            defaultValue={[0, 1500]}
            max={1500}
            step={1}
            className="w-full"
            value={priceRange}
            onValueChange={value => setPriceRange(value)}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    );
  };

  console.log(totalPages, totalProducts, products);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-semibold">All Products</h2>
          <div className="flex items-center gap-4">
            {/* Mobile filter render */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'outline'} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-h-[80vh] overflow-auto max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <FilterSection />
              </DialogContent>
            </Dialog>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={value => handleSortChange(value)}
            >
              <SelectTrigger className="w-full sm:w-auto mt-1.5">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-asc">Sort by: Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="createdAt-desc">
                  Sort by: Newest First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSection />
          </div>
          {/* product grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {products.map(productItem => (
                  <div
                    onClick={() => router.push(`/listing/${productItem.id}`)}
                    key={productItem.id}
                    className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-60 sm:h-72 bg-gray-100 overflow-hidden">
                      <img
                        src={productItem.images[0]}
                        alt={productItem.name}
                        className="w-full object-top h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button className="bg-white text-black hover:bg-gray-100 cursor-pointer">
                          Quick View
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2">{productItem.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">
                          ${productItem.price.toFixed(2)}
                        </span>
                        <div className="flex gap-1">
                          {productItem.colors.map((colorItem, index) => (
                            <div
                              key={index}
                              className={`w-4 h-4 rounded-full border `}
                              style={{ backgroundColor: colorItem }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* pagination */}
            <div className="mt-10 items-center flex flex-wrap justify-center gap-2">
              <Button
                disabled={currentPage === 1}
                variant={'outline'}
                size={'icon'}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  className="w-8 sm:w-10 h-8 sm:h-10 p-0"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                disabled={currentPage === totalPages}
                variant={'outline'}
                size={'icon'}
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
