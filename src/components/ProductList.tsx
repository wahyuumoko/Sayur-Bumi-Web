import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";

const ProductList = () => {
  const [products] = useState([
    { id: 1, name: "Tomat", stock: 50, price: 3000 },
    { id: 2, name: "Wortel", stock: 30, price: 4000 },
  ]);

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-2">Daftar Produk</h2>
        <ul>
          {products.map(p => (
            <li key={p.id}>{p.name} - Stok: {p.stock} - Harga: Rp{p.price}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProductList;