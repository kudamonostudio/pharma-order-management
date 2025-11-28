export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  brand?: string | null;
  unit?: string | null;
  sku?: string | null;
  stock?: number | null;
  categoryId?: number | null;
  storeId: number;
}
