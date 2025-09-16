import {
  Shirt,
  Handbag,
  Cable,
  Footprints,
  Wallet,
  Glasses,
  GraduationCap,
  Tally3,
} from 'lucide-react';

export const categories = [
  { name: 'All', Icon: Tally3 },
  { name: 'Fashion', Icon: Shirt },
  { name: 'Electronics', Icon: Cable },
  { name: 'Hand Bag', Icon: Handbag },
  { name: 'Shoes', Icon: Footprints },
  { name: 'Wallet', Icon: Wallet },
  { name: 'Sunglass', Icon: Glasses },
  { name: 'Cap', Icon: GraduationCap },
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
export const colors = [
  { name: 'Navy', class: 'bg-[#0F172A]' },
  { name: 'Yellow', class: 'bg-[#FCD34D]' },
  { name: 'White', class: 'bg-white border' },
  { name: 'Orange', class: 'bg-[#FB923C]' },
  { name: 'Green', class: 'bg-[#22C55E]' },
  { name: 'Pink', class: 'bg-[#EC4899]' },
  { name: 'Cyan', class: 'bg-[#06B6D4]' },
  { name: 'Blue', class: 'bg-[#3B82F6]' },
];
export const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'];
