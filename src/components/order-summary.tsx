"use client";

import React from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface OrderSummaryProps {
  products: Product[];
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  onSave: () => void;
}

const OrderSummary = React.forwardRef<HTMLDivElement, OrderSummaryProps>(
  ({ products, customerName, setCustomerName, customerPhone, setCustomerPhone, onSave }, ref) => {
    const total = products.reduce((acc, product) => acc + product.price, 0);

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const getUnitPrice = (product: Product) => {
      if (product.quantity > 0) {
        return product.price / product.quantity;
      }
      return 0;
    };

    return (
      <Card className="shadow-lg" ref={ref}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ShoppingCart />
            Tóm tắt đơn hàng
          </CardTitle>
          <CardDescription>Kiểm tra lại các mục và tổng chi phí.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-name">Tên khách hàng</Label>
                <Input id="customer-name" placeholder="Nguyễn Văn A" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="customer-phone">Số điện thoại</Label>
                <Input id="customer-phone" placeholder="090..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>

            {products.length > 0 ? (
              <div className="space-y-4 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead className="text-center">SL</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium truncate max-w-28">{product.name}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(getUnitPrice(product))}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(product.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center font-bold text-lg pt-4 border-t">
                  <span>Tổng cộng</span>
                  <span className="font-mono text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-8">Báo giá của bạn đang trống.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={products.length === 0} onClick={onSave}>
            Lưu báo giá (ảnh)
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

OrderSummary.displayName = 'OrderSummary';

export default OrderSummary;
