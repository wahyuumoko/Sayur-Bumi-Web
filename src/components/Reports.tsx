import { Card, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dummyData = [
  { productName: "Tomat", price: 30000 },
  { productName: "Wortel", price: 20000 },
];

const Reports = () => (
  <Card>
    <CardContent>
      <h2 className="text-xl font-semibold mb-2">Laporan Penjualan</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dummyData}>
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default Reports;