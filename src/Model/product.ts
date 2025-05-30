export interface Product {
  id?: string; // Add optional id for existing products
  productName: string;
  description: string;
  category: string;
  images: string[];
}
