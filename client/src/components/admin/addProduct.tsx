'use client';

import type React from 'react';

import { ChangeEvent, FormEvent, useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { toast } from 'sonner';
import { brands, categories, colors, sizes } from '@/utils/config';
import { useProductStore } from '@/store/useProductStore';
import { protectProductFormAction } from '@/action/product';

interface AddProductModalProps {
  onClose: () => void;
}

interface FormState {
  name: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
  originalPrice: string;
}

function AddProductModal({ onClose }: AddProductModalProps) {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    brand: '',
    description: '',
    category: '',
    gender: '',
    price: '',
    stock: '',
    originalPrice: '',
  });


  const [selectedSizes, setSelectSizes] = useState<string[]>([]);
  const [selectedColors, setSelectColors] = useState<string[]>([]);
  const [selectedfiles, setSelectFiles] = useState<File[]>([]);

  const { createProduct ,isLoading, fetchAllProductsForAdmin} = useProductStore();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleSize = (size: string) => {
    setSelectSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectColors(prev =>
      prev.includes(color) ? prev.filter(s => s !== color) : [...prev, color]
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectFiles(Array.from(event.target.files));
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const checkFirstLevelFormSanitization = await protectProductFormAction();

    if (!checkFirstLevelFormSanitization.success) {
      toast(checkFirstLevelFormSanitization.error);
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([Key, value]) => {
      formData.append(Key, value);
    });

    formData.append('sizes', selectedSizes.join(','));
    formData.append('colors', selectedColors.join(','));
    selectedfiles.forEach(file => formData.append('images', file));

      
    const res = await createProduct(formData);
    if (res) {
      toast('Product Created successfully');
        fetchAllProductsForAdmin()
        onClose();
    }
        
     
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Product Images
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to browse or drag and drop images
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </label>
            </div>
            {selectedfiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {selectedfiles.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Name and Brand Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                className="bg-gray-50"
                onChange={handleInputChange}
                value={formState.name}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={value => handleSelectChange('brand', value)}
                name="brand"
              >
                <SelectTrigger className="bg-gray-50 w-full">
                  {' '}
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="samsung">Samsung</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="nike">Nike</SelectItem>
                  <SelectItem value="adidas">Adidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              rows={4}
              className="bg-gray-50 resize-none"
              onChange={handleInputChange}
              value={formState.description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formState.category}
                onValueChange={value => handleSelectChange('category', value)}
                name="category"
              >
                <SelectTrigger className="bg-gray-50 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Gender
              </Label>
              <Select
                value={formState.gender}
                onValueChange={value => handleSelectChange('gender', value)}
                name="gender"
              >
                <SelectTrigger className="bg-gray-50 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unisex">Unisex</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Size</Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {sizes.map(item => (
                <Button
                  onClick={() => handleToggleSize(item)}
                  variant={selectedSizes.includes(item) ? 'default' : 'outline'}
                  key={item}
                  type="button"
                  size={'sm'}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Colors</Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {colors.map(color => (
                <Button
                  key={color.name}
                  type="button"
                  className={`h-8 w-8 rounded-full ${color.class} ${
                    selectedColors.includes(color.name)
                      ? 'ring-2 ring-primary ring-offset-2'
                      : ''
                  }`}
                  onClick={() => handleToggleColor(color.name)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                placeholder="0.00"
                step="0.01"
                className="bg-gray-50"
                onChange={handleInputChange}
                value={formState.price}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="originalPrice"
                className="text-sm font-medium text-gray-700"
              >
                Original Price
              </Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                placeholder="0.00"
                step="0.01"
                className="bg-gray-50"
                onChange={handleInputChange}
                value={formState.originalPrice}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </Label>
              <Input
                id="stock"
                name="stock"
                placeholder="0"
                min="0"
                className="bg-gray-50"
                value={formState.stock}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="text-center">
            <Button
              type="submit"
              className="bg-black cursor-pointer hover:bg-gray-800 text-white px-6 w-full"
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
