import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const SaleForm = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Tomat", stock: 50, price: 3000 },
    { id: 2, name: "Wortel", stock: 30, price: 4000 },
  ]);

  const [sale, setSale] = useState<{
    productId: number | "",
    quantity: number,
    payment: string,
    date: string
  }>({
    productId: "",
    quantity: 1,
    payment: "Cash",
    date: ""
  });

  const handleSale = () => {
    const productIndex = products.findIndex(p => p.id === sale.productId);
    if (productIndex >= 0 && sale.quantity > 0) {
      const updatedProducts = [...products];
      updatedProducts[productIndex].stock -= sale.quantity;
      setProducts(updatedProducts);
      // Simpan transaksi ke localStorage/db
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-2">Input Transaksi Penjualan</h2>
        <div className="grid gap-2">
          <Label>Nama Produk</Label>
          <select
            value={sale.productId}
            onChange={e => setSale({ ...sale, productId: Number(e.target.value) })}
          >
            <option value="">Pilih Produk</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <Label>Jumlah Terjual</Label>
          <Input
            type="number"
            value={sale.quantity}
            onChange={e => setSale({ ...sale, quantity: Number(e.target.value) || 0 })}
          />

          <Label>Metode Pembayaran</Label>
          <Input
            value={sale.payment}
            onChange={e => setSale({ ...sale, payment: e.target.value })}
          />

          <Label>Tanggal Transaksi</Label>
          <Input
            type="date"
            value={sale.date}
            onChange={e => setSale({ ...sale, date: e.target.value })}
          />

          <Button onClick={handleSale}>Simpan Transaksi</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleForm;