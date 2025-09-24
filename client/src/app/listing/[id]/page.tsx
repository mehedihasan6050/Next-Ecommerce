import { Suspense } from 'react';
import ProductDetailsSkeleton from './productSkeleton';
import ProductDetailsContent from './productDetails';

interface PageProps {
  params: {
    id: string;
  };
}

function ProductDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={params.id} />
    </Suspense>
  );
}

export default ProductDetailsPage;
