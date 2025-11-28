"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Copy } from 'lucide-react';
import type { DecalProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '../ui/switch';
import { useDebounce } from '@/hooks/use-debounce';

interface DecalFormProps {
  product: DecalProduct;
  updateProduct: (id: string, data: Partial<DecalProduct>) => void;
  removeProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function DecalForm({ product, updateProduct, removeProduct, duplicateProduct }: DecalFormProps) {
  const { register, control, watch, setValue } = useForm<DecalProduct>({
    defaultValues: product,
  });

  const watchAllFields = watch();
  const debouncedWatchAllFields = useDebounce(watchAllFields, 300);

  const watchFoam = watch('foam');

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
                    <Label htmlFor={`quantity-${product.id}`}>Số lượng</Label>
                    <Input id={`quantity-${product.id}`} type="number" {...register('quantity', { valueAsNumber: true, min: 1 })} min={1} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div>
                    <Label>Loại Decal</Label>
                    <Select onValueChange={(v) => setValue('decalType', v as DecalProduct['decalType'])} defaultValue={product.decalType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paper">Decal giấy</SelectItem>
                            <SelectItem value="plastic">Decal nhựa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Rộng (mm)</Label>
                    <Input type="number" {...register('width', { valueAsNumber: true, min: 1 })} min={1} />
                </div>
                <div>
                    <Label>Cao (mm)</Label>
                    <Input type="number" {...register('height', { valueAsNumber: true, min: 1 })} min={1} />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
                <div>
                    <Label>Cắt</Label>
                    <Select onValueChange={(v) => setValue('cutting', v as DecalProduct['cutting'])} defaultValue={product.cutting}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="none">Không</SelectItem>
                        <SelectItem value="regular">Cắt bế</SelectItem>
                        <SelectItem value="small">Cắt bế tem nhỏ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Cán màng</Label>
                    <Select onValueChange={(v) => setValue('lamination', v as DecalProduct['lamination'])} defaultValue={product.lamination}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="none">Không</SelectItem>
                        <SelectItem value="matte">Màng mờ</SelectItem>
                        <SelectItem value="glossy">Màng bóng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Cán Foam</Label>
                    <Select onValueChange={(v) => setValue('foam', v as DecalProduct['foam'])} defaultValue={product.foam}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="none">Không</SelectItem>
                        <SelectItem value="3mm">Foam 3mm</SelectItem>
                        <SelectItem value="5mm">Foam 5mm</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {watchFoam !== 'none' && (
                    <div className="flex items-center space-x-2 pt-6">
                        <Switch id={`foamCutting-${product.id}`} {...register('foamCutting')} onCheckedChange={(c) => setValue('foamCutting', c)} checked={watch('foamCutting')} />
                        <Label htmlFor={`foamCutting-${product.id}`}>Bế Foam theo hình</Label>
                    </div>
                )}
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
