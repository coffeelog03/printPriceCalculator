"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Copy } from 'lucide-react';
import type { InvoiceProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useDebounce } from '@/hooks/use-debounce';

interface InvoiceFormProps {
  product: InvoiceProduct;
  updateProduct: (id: string, data: Partial<InvoiceProduct>) => void;
  removeProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function InvoiceForm({ product, updateProduct, removeProduct, duplicateProduct }: InvoiceFormProps) {
  const { register, control, watch, setValue } = useForm<InvoiceProduct>({
    defaultValues: product,
  });

  const watchAllFields = watch();
  const debouncedWatchAllFields = useDebounce(watchAllFields, 300);
  const watchSize = watch('size');

  useEffect(() => {
    if (debouncedWatchAllFields) {
      updateProduct(product.id, debouncedWatchAllFields);
    }
  }, [debouncedWatchAllFields, product.id, updateProduct]);

  return (
    <AccordionItem value={product.id} className="bg-card border rounded-lg shadow-sm">
      <div className="flex items-center justify-between w-full p-4">
        <AccordionTrigger className="p-0 hover:no-underline flex-grow">
          <div className="flex items-center gap-2">
            <span className="font-headline text-lg">{product.name}</span>
          </div>
        </AccordionTrigger>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-lg font-mono font-semibold text-primary">{formatCurrency(product.price)}</span>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); duplicateProduct(product.id); }} className="hover:bg-accent/20"><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }} className="hover:bg-destructive/20 text-destructive"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <AccordionContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor={`name-${product.id}`}>Tên sản phẩm</Label>
              <Input id={`name-${product.id}`} {...register('name')} />
            </div>
            <div>
                <Label htmlFor={`quantity-${product.id}`}>Số lượng (cuốn)</Label>
                <Input id={`quantity-${product.id}`} type="number" {...register('quantity', { valueAsNumber: true, min: 1 })} min={1} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Loại giấy</Label>
              <Select onValueChange={(v) => setValue('paper', v as InvoiceProduct['paper'])} defaultValue={product.paper}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Giấy thường</SelectItem>
                  <SelectItem value="carbon_2ply">Giấy carbonless 2 liên</SelectItem>
                  <SelectItem value="carbon_3ply">Giấy carbonless 3 liên</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Màu mực</Label>
              <Select onValueChange={(v) => setValue('color', v as InvoiceProduct['color'])} defaultValue={product.color}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Xanh</SelectItem>
                  <SelectItem value="red">Đỏ</SelectItem>
                  <SelectItem value="black">Đen</SelectItem>
                  <SelectItem value="green">Xanh lá</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label>Kích thước</Label>
              <Select onValueChange={(v) => setValue('size', v as InvoiceProduct['size'])} defaultValue={product.size}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A5">A5 / F5</SelectItem>
                  <SelectItem value="A4">A4 / F4</SelectItem>
                  <SelectItem value="custom_a4">Tùy chỉnh (từ A4)</SelectItem>
                  {watch('paper').includes('carbon') && <SelectItem value="custom_f4">Tùy chỉnh (từ F4)</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            {(watchSize === 'custom_a4' || watchSize === 'custom_f4') && (
              <div>
                <Label>Số lượng tờ trên 1 trang</Label>
                <Input type="number" {...register('customPiecesPerSheet', { valueAsNumber: true, min: 2 })} min={2} placeholder='ví dụ: 2, 3, 4...' />
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
