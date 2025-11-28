"use client";

import { useState, useCallback, useRef } from 'react';
import { PlusCircle, FileText, FileJson, StickyNote, Upload, Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

import type { Product, DocumentProduct, InvoiceProduct, DecalProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import OrderSummary from '@/components/order-summary';
import DocumentForm from '@/components/product-forms/document-form';
import InvoiceForm from '@/components/product-forms/invoice-form';
import DecalForm from '@/components/product-forms/decal-form';
import { calculatePrice } from '@/lib/pricing';
import { useToast } from '@/hooks/use-toast';

export default function PrintCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const { toast } = useToast();
  const importFileRef = useRef<HTMLInputElement>(null);
  const orderSummaryRef = useRef<HTMLDivElement>(null);

  const addProduct = (type: 'document' | 'invoice' | 'decal') => {
    const newId = crypto.randomUUID();
    let newProduct: Product;

    const baseProps = { id: newId, price: 0, quantity: 1 };

    switch (type) {
      case 'document':
        newProduct = {
          ...baseProps,
          type: 'document',
          name: `Tài liệu #${products.length + 1}`,
          parts: [{
            id: crypto.randomUUID(),
            printType: 'bw',
            paper: '70gsm',
            pages: 1,
            size: 'A4',
            isTwoSided: false,
            hasBackground: false,
          }],
          binding: 'none',
          stapleType: 'staple_top_left',
          coverColor: 'none',
          hasGlassCover: false,
        } as DocumentProduct;
        break;
      case 'invoice':
        newProduct = {
          ...baseProps,
          type: 'invoice',
          name: `Hóa đơn #${products.length + 1}`,
          paper: 'carbon_2ply',
          size: 'A5',
          color: 'blue',
          customPiecesPerSheet: 2,
        } as InvoiceProduct;
        break;
      case 'decal':
        newProduct = {
          ...baseProps,
          type: 'decal',
          name: `Decal #${products.length + 1}`,
          decalType: 'paper',
          width: 100, // mm
          height: 100, // mm
          cutting: 'none',
          lamination: 'none',
          foam: 'none',
          foamCutting: false,
        } as DecalProduct;
        break;
    }
    
    // Calculate initial price
    const initialPrice = calculatePrice(newProduct);
    newProduct.price = initialPrice;

    setProducts(prev => [...prev, newProduct]);
    setActiveAccordionItem(newId);
  };

  const updateProduct = useCallback((id: string, updatedProductData: Partial<Product>) => {
    setProducts(prev => {
        const updatedProducts = prev.map(p => {
            if (p.id === id) {
                const newProduct = { ...p, ...updatedProductData };
                const newPrice = calculatePrice(newProduct);
                return { ...newProduct, price: newPrice };
            }
            return p;
        });
        return updatedProducts;
    });
  }, []);

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const duplicateProduct = (id: string) => {
    const productToDuplicate = products.find(p => p.id === id);
    if (productToDuplicate) {
      const newId = crypto.randomUUID();
      const newProduct = {
        ...productToDuplicate,
        id: newId,
        name: `${productToDuplicate.name} (Copy)`
      };
      setProducts(prev => [...prev, newProduct]);
      setActiveAccordionItem(newId);
    }
  };

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const exportQuote = () => {
    if (products.length === 0) {
      toast({ variant: 'destructive', title: 'Không có sản phẩm', description: 'Vui lòng thêm sản phẩm trước khi xuất báo giá.' });
      return;
    }
    const quoteData = {
      customerName,
      customerPhone,
      products,
    };
    const jsonString = JSON.stringify(quoteData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${customerName || 'Báo giá'}_${getFormattedDate()}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Đã xuất báo giá', description: `Báo giá đã được lưu vào tệp ${fileName}` });
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const importQuote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File could not be read');
        }
        const data = JSON.parse(text);
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setCustomerName(data.customerName || '');
          setCustomerPhone(data.customerPhone || '');
          toast({ title: 'Nhập thành công', description: 'Báo giá đã được tải.' });
        } else {
          throw new Error('Invalid JSON format');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Lỗi nhập file', description: 'Định dạng tệp JSON không hợp lệ hoặc tệp bị hỏng.' });
        console.error("Failed to import quote:", error);
      } finally {
        // Reset file input
        if(importFileRef.current) {
            importFileRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };
  
  const saveQuoteAsImage = useCallback(() => {
    if (!orderSummaryRef.current) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể chụp ảnh báo giá.' });
      return;
    }
    
    htmlToImage.toJpeg(orderSummaryRef.current, { 
        quality: 0.95, 
        backgroundColor: 'white',
        skipFonts: true,
     })
      .then(function (dataUrl) {
        const link = document.createElement('a');
        const fileName = `${customerName || 'Báo giá'}_${getFormattedDate()}.jpg`;
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        toast({ title: 'Đã lưu báo giá', description: `Báo giá đã được lưu dưới dạng ảnh ${fileName}` });
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
        toast({ variant: 'destructive', title: 'Lỗi lưu ảnh', description: 'Không thể tạo tệp ảnh. Vui lòng thử lại.' });
      });
  }, [customerName, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Tạo báo giá của bạn</CardTitle>
            <CardDescription>Thêm sản phẩm vào đơn hàng và cấu hình bên dưới.</CardDescription>
            <div className="flex flex-wrap gap-2 pt-4">
              <Button onClick={() => addProduct('document')}><PlusCircle /> Thêm tài liệu</Button>
              <Button onClick={() => addProduct('invoice')}><FileJson /> Thêm hóa đơn</Button>
              <Button onClick={() => addProduct('decal')}><StickyNote /> Thêm decal</Button>
            </div>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <Accordion 
                type="single" 
                collapsible 
                className="w-full space-y-4"
                value={activeAccordionItem}
                onValueChange={setActiveAccordionItem}
              >
                {products.map(product => {
                  switch (product.type) {
                    case 'document':
                      return <DocumentForm key={product.id} product={product as DocumentProduct} updateProduct={updateProduct} removeProduct={removeProduct} duplicateProduct={duplicateProduct} />;
                    case 'invoice':
                      return <InvoiceForm key={product.id} product={product as InvoiceProduct} updateProduct={updateProduct} removeProduct={removeProduct} duplicateProduct={duplicateProduct} />;
                    case 'decal':
                       return <DecalForm key={product.id} product={product as DecalProduct} updateProduct={updateProduct} removeProduct={removeProduct} duplicateProduct={duplicateProduct} />;
                    default:
                      return null;
                  }
                })}
              </Accordion>
            ) : (
              <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Chưa có sản phẩm</h3>
                <p className="mt-1 text-sm text-muted-foreground">Bắt đầu bằng cách thêm sản phẩm vào báo giá của bạn.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 border-t pt-6">
             <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={exportQuote}><Download /> Xuất báo giá (JSON)</Button>
                <Button variant="outline" onClick={handleImportClick}><Upload /> Nhập báo giá (JSON)</Button>
                <input type="file" ref={importFileRef} onChange={importQuote} accept=".json" className="hidden" />
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-1 mt-8 lg:mt-0">
        <div className="sticky top-8">
          <OrderSummary 
            ref={orderSummaryRef}
            products={products}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            onSave={saveQuoteAsImage}
          />
        </div>
      </div>
    </div>
  );
}
