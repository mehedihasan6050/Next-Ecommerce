import { Suspense } from 'react';
import ProductDetailsSkeleton from './productSkeleton';
import ProductDetailsContent from './productDetails';



function ProductDetailsPage({ params }: {
  params: any;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={params.id} />
    </Suspense>
  );
}

export default ProductDetailsPage;
