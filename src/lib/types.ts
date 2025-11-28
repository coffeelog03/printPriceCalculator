// Generic Product Item
export interface ProductItem {
  id: string;
  type: 'document' | 'invoice' | 'decal';
  name: string;
  price: number;
  quantity: number; // General quantity for all product types
}

// Document Printing
export type DocumentPart = {
  id: string;
  printType: 'bw' | 'color';
  paper: '70gsm' | '180gsm_plain' | 'photo_180gsm' | 'photo_230gsm';
  hasBackground: boolean;
  pages: number;
  size: 'A4' | 'A5' | 'A3';
  isTwoSided: boolean;
};

export type DocumentBinding = 'none' | 'staple' | 'thermal_fort' | 'thermal_photo';
export type StapleType = 'staple_top_left' | 'two_staple_left' | 'three_staple_left';
export type CoverColor = 'none' | 'blue' | 'pink' | 'yellow' | 'white';

export interface DocumentProduct extends ProductItem {
  type: 'document';
  parts: DocumentPart[];
  binding: DocumentBinding;
  stapleType: StapleType;
  coverColor: CoverColor;
  hasGlassCover: boolean;
}

// Invoice Printing
export type InvoicePaper = 'carbon_2ply' | 'carbon_3ply' | 'plain';
export type InvoiceSize = 'A4' | 'A5' | 'custom_a4' | 'custom_f4';
export type InvoiceColor = 'blue' | 'red' | 'black' | 'green';

export interface InvoiceProduct extends ProductItem {
  type: 'invoice';
  paper: InvoicePaper;
  size: InvoiceSize;
  color: InvoiceColor;
  customPiecesPerSheet?: number;
}

// Decal Printing
export type DecalType = 'paper' | 'plastic';
export type DecalCutting = 'none' | 'regular' | 'small';
export type DecalLamination = 'none' | 'matte' | 'glossy';
export type DecalFoam = 'none' | '3mm' | '5mm';

export interface DecalProduct extends ProductItem {
  type: 'decal';
  decalType: DecalType;
  width: number; // in mm
  height: number; // in mm
  cutting: DecalCutting;
  lamination: DecalLamination;
  foam: DecalFoam;
  foamCutting: boolean; // "bế" for foam
}

export type Product = DocumentProduct | InvoiceProduct | DecalProduct;
