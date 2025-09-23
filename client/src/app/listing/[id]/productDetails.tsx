'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductStore } from '@/store/useProductStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductDetailsSkeleton from './productSkeleton';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

function ProductDetailsContent({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const { getProductById, isLoading } = useProductStore();
  const { addToCart, fetchCart } = useCartStore();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const productDetails = await getProductById(id);
      if (productDetails) {
        setProduct(productDetails);
      } else {
        router.push('/404');
      }
    };

    fetchProduct();
  }, [id, getProductById, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: product.colors[selectedColor],
        size: selectedSize,
        quantity: quantity,
      });

      setSelectedSize('');
      setSelectedColor(0);
      setQuantity(1);

      toast.success('Product is added to cart');
      fetchCart();
    }
  };

  console.log(id, product);

  if (!product || isLoading) return <ProductDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-4">
            {/* Mobile image thumbnails - horizontal scroll */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-2 mb-2">
              {product?.images.map((image: string, index: number) => (
                <button
                  onClick={() => setSelectedImage(index)}
                  key={index}
                  className={`${
                    selectedImage === index
                      ? 'border-black'
                      : 'border-transparent'
                  } border-2 flex-shrink-0`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Desktop vertical thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-20 md:w-24">
              {product?.images.map((image: string, index: number) => (
                <button
                  onClick={() => setSelectedImage(index)}
                  key={index}
                  className={`${
                    selectedImage === index
                      ? 'border-black'
                      : 'border-transparent'
                  } border-2`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Main product image */}
            <div className="flex-1 relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full max-w-full h-auto sm:h-[400px] md:h-[450px] lg:h-[500px] object-contain sm:object-cover object-top mx-auto"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 space-y-4 sm:space-y-6 mt-4 lg:mt-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
              <div>
                <span className="text-xl sm:text-2xl font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
                      selectedColor === index
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string, index: string) => (
                  <Button
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base`}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                >
                  +
                </Button>
              </div>
            </div>
            <div className="pt-2">
              <Button
                onClick={handleAddToCart}
                className={
                  'w-full cursor-pointer bg-black text-white hover:bg-gray-800 h-12 sm:h-14 text-sm sm:text-base'
                }
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b overflow-x-auto">
              <TabsTrigger className="text-xs sm:text-sm whitespace-nowrap" value="details">PRODUCT DESCRIPTION</TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm whitespace-nowrap" value="reviews">REVIEWS</TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm whitespace-nowrap" value="shipping">
                SHIPPING & RETURNS INFO
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 sm:mt-5">
              <p className="text-sm sm:text-base text-gray-700 mb-4">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 sm:mt-5">
              <p className="text-sm sm:text-base">Reviews</p>
            </TabsContent>
            <TabsContent value="shipping">
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Shipping and return information goes here. Please read the info
                before proceeding.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsContent;
