export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export interface Sale {
  productId: string;
  quantity: number;
  payment: string;
  date: string;
}