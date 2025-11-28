"use client";

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Trash2, PlusCircle, Copy, X } from 'lucide-react';
import type { DocumentProduct, DocumentPart } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useDebounce } from '@/hooks/use-debounce';

interface DocumentFormProps {
  product: DocumentProduct;
  updateProduct: (id: string, data: Partial<DocumentProduct>) => void;
  removeProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function DocumentForm({ product, updateProduct, removeProduct, duplicateProduct }: DocumentFormProps) {
  const { register, control, watch, setValue } = useForm<DocumentProduct>({
    defaultValues: product,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });

  const watchAllFields = watch();
  const debouncedWatchAllFields = useDebounce(watchAllFields, 300);

  const watchBinding = watch('binding');

  useEffect(() => {
    if (debouncedWatchAllFields) {
      updateProduct(product.id, debouncedWatchAllFields);
    }
  }, [debouncedWatchAllFields, product.id, updateProduct]);
  
  const addPart = () => {
    append({
      id: crypto.randomUUID(),
      printType: 'bw',
      paper: '70gsm',
      pages: 1,
      size: 'A4',
      isTwoSided: false,
      hasBackground: false,
    });
  };

  return (
    <AccordionItem value={product.id} className="bg-card border rounded-lg shadow-sm">
      <div className="flex items-center w-full p-4">
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
        <div className="space-y-6">
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor={`name-${product.id}`}>Tên sản phẩm</Label>
              <Input id={`name-${product.id}`} {...register('name')} />
            </div>
            <div>
              <Label htmlFor={`quantity-${product.id}`}>Số lượng (cuốn)</Label>
              <Input id={`quantity-${product.id}`} type="number" {...register('quantity', { valueAsNumber: true, min: 1 })} min={1} />
            </div>
          </div>
          <Card>
            <CardHeader>
                <CardTitle className='text-md flex justify-between items-center'>
                    Các phần tài liệu
                    <Button variant="outline" size="sm" onClick={addPart}><PlusCircle className="mr-2 h-4 w-4" /> Thêm phần</Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => {
                const part = watch(`parts.${index}`);
                return (
                  <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                    {fields.length > 1 && (
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)}>
                        <X className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Kiểu in</Label>
                        <Select onValueChange={(v) => setValue(`parts.${index}.printType`, v as DocumentPart['printType'])} defaultValue={part.printType}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bw">Trắng đen</SelectItem>
                            <SelectItem value="color">In màu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Loại giấy</Label>
                        <Select onValueChange={(v) => setValue(`parts.${index}.paper`, v as DocumentPart['paper'])} defaultValue={part.paper}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {part.printType === 'bw' && <>
                              <SelectItem value="70gsm">Ford 70gsm</SelectItem>
                              <SelectItem value="180gsm_plain">Ford 180gsm</SelectItem>
                            </>}
                            {part.printType === 'color' && <>
                              <SelectItem value="70gsm">Ford 70gsm</SelectItem>
                              <SelectItem value="180gsm_plain">Ford 180gsm</SelectItem>
                              <SelectItem value="photo_180gsm">Couche 180gsm</SelectItem>
                              <SelectItem value="photo_230gsm">Couche 230gsm</SelectItem>
                            </>}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Số trang</Label>
                        <Input type="number" {...register(`parts.${index}.pages`, { valueAsNumber: true, min: 1 })} min={1} />
                      </div>
                      <div>
                        <Label>Khổ giấy</Label>
                        <Select onValueChange={(v) => setValue(`parts.${index}.size`, v as DocumentPart['size'])} defaultValue={part.size}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="A5">A5</SelectItem>
                            <SelectItem value="A3">A3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch id={`isTwoSided-${field.id}`} {...register(`parts.${index}.isTwoSided`)} onCheckedChange={(c) => setValue(`parts.${index}.isTwoSided`, c)} checked={part.isTwoSided} />
                        <Label htmlFor={`isTwoSided-${field.id}`}>In 2 mặt</Label>
                      </div>
                       {part.printType === 'color' && part.paper.includes('plain') &&
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch id={`hasBackground-${field.id}`} {...register(`parts.${index}.hasBackground`)} onCheckedChange={(c) => setValue(`parts.${index}.hasBackground`, c)} checked={part.hasBackground} />
                          <Label htmlFor={`hasBackground-${field.id}`}>Có nền màu</Label>
                        </div>
                       }
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <Label>Đóng cuốn</Label>
              <Select onValueChange={(v) => setValue('binding', v as DocumentProduct['binding'])} defaultValue={product.binding}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không</SelectItem>
                  <SelectItem value="staple">Bấm kim</SelectItem>
                  <SelectItem value="thermal_fort">Keo nhiệt (giấy Fort)</SelectItem>
                  <SelectItem value="thermal_photo">Keo nhiệt (giấy Couche)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {watchBinding === 'staple' && (
              <div className="space-y-4">
                <div>
                  <Label>Kiểu bấm kim</Label>
                  <Select onValueChange={(v) => setValue('stapleType', v as DocumentProduct['stapleType'])} defaultValue={product.stapleType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staple_top_left">Bấm góc trên trái</SelectItem>
                      <SelectItem value="two_staple_left">Bấm 2 kim lề trái</SelectItem>
                      <SelectItem value="three_staple_left">Bấm 3 kim lề trái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label>Bìa</Label>
                  <Select onValueChange={(v) => setValue('coverColor', v as DocumentProduct['coverColor'])} defaultValue={product.coverColor}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không bìa</SelectItem>
                      <SelectItem value="blue">Bìa xanh</SelectItem>
                      <SelectItem value="pink">Bìa hồng</SelectItem>
                      <SelectItem value="yellow">Bìa vàng</SelectItem>
                      <SelectItem value="white">Bìa trắng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Switch id={`hasGlassCover-${product.id}`} {...register('hasGlassCover')} onCheckedChange={(c) => setValue('hasGlassCover', c)} checked={watch('hasGlassCover')} />
                    <Label htmlFor={`hasGlassCover-${product.id}`}>Thêm bìa kiếng</Label>
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
