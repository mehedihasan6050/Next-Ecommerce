'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductStore } from '@/store/useProductStore';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import AddProductModal from '@/components/seller/addProduct';
import UpdateProductModal from '@/components/seller/updateProduct';
import Swal from 'sweetalert2';

function ProductPage() {
  const {
    products,
    fetchAllProductsForSeller,
    deleteProduct,
    setEditOpen,
    isEditOpen,
    setAddOpen,
    isAddOpen,
  } = useProductStore();

  useEffect(() => {
    fetchAllProductsForSeller();
  }, [fetchAllProductsForSeller]);

  async function handleDeleteProduct(getId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        deleteProduct(getId).then(res => {
          if (res)
            Swal.fire({
              title: 'Deleted!',
              text: 'Your Product has been deleted.',
              icon: 'success',
            });
          fetchAllProductsForSeller();
        });
      }
    });
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Products</h1>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-blue-500 cursor-pointer text-white"
          >
            Add New Product
          </Button>
          {isAddOpen && <AddProductModal onClose={() => setAddOpen(false)} />}
        </header>
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {products.length > 0 && (
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className=" rounded-l bg-gray-100 overflow-hidden">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt="product image"
                                width={60}
                                height={60}
                                className="object-cover w-full h=full"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Size: {product.sizes.join(',')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <p>{product.stock} Item left</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {product.category.toLocaleUpperCase()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => setEditOpen(product.id)}
                            variant={'ghost'}
                            size={'icon'}
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="cursor-pointer"
                            variant={'ghost'}
                            size={'icon'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {isEditOpen === product.id && (
                            <UpdateProductModal
                              id={product.id}
                              onClose={() => setEditOpen(null)}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            <div></div>
          </div>
        </div>
        {products.length <= 0 && (
          <h2 className="text-3xl text-center my-4">Product Not Found</h2>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
