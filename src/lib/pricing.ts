
import type { Product, DocumentProduct, InvoiceProduct, DecalProduct, DocumentPart } from './types';

const PRICES = {
  // B&W Printing per page/sheet
  BW: {
    '70gsm_lt5000': 300,
    '70gsm_ge5000': 270,
    '180gsm_plain': 1500,
  },
  // Color Printing per page face
  COLOR: {
    '70gsm_no_bg': 1000,
    '70gsm_with_bg': 2000,
    '180gsm_plain_no_bg': 2000,
    '180gsm_plain_with_bg': 3000,
    'photo_180gsm': 3000,
    'photo_230gsm': 5000,
  },
  // Binding per book
  BINDING: {
    'cover_fort_180gsm_x2': 3000, // Price for front and back cover
    'glass': 3000, // This is an add-on for staples
    'staple': 0, // Stapling itself is free
    'thermal_photo': 15000,
    'thermal_fort': 10000,
  },
  // Decal per m2
  DECAL: {
    'plastic': 80000, // per m2
    'paper': 70000, // per m2 for custom size paper decal
  },
  // Decal Cutting per m2
  DECAL_CUTTING: {
    'plastic_regular': 20000, // per m2
    'plastic_small': 30000, // per m2
    'paper_regular': 20000, // per m2
    'paper_small': 30000, // per m2
  },
  // Lamination per m2
  LAMINATION: 10000,
  // Foam mounting per m2
  FOAM: {
    '3mm': 100000,
    '5mm': 150000,
  },
  // Foam cutting per m2
  FOAM_CUTTING: {
    '3mm': 180000 - 100000, // price difference
    '5mm': 220000 - 150000, // price difference
  },
  // Invoice per book
  INVOICE: {
    'carbon_2ply_A5': 20000,
    'carbon_2ply_A4': 40000,
    'carbon_3ply_A5': 32000,
    'carbon_3ply_A4': 60000,
    'plain_A5': 13000,
    'plain_A4': 25000,
    'custom_fee': 2000,
  },
};

function calculateDocumentPartPrice(part: DocumentPart): number {
  let pagePrice = 0;
  let pageCount = part.pages;

  if (part.printType === 'bw') {
    // For B&W, price is per sheet. If two-sided, number of sheets is pages/2 (rounded up).
    if (part.isTwoSided) {
        pageCount = Math.ceil(part.pages / 2);
    }
    if (part.paper === '70gsm') {
      // The prompt implies total pages of the job, not per part. This logic is likely simplified.
      // Assuming pages here means total pages for this part of the print run.
      pagePrice = PRICES.BW['70gsm_lt5000']; 
    } else if (part.paper === '180gsm_plain') {
      pagePrice = PRICES.BW['180gsm_plain'];
    }
  } else { // color
    // For color, price is per printed page face.
    if (part.paper === '70gsm') {
      pagePrice = part.hasBackground ? PRICES.COLOR['70gsm_with_bg'] : PRICES.COLOR['70gsm_no_bg'];
    } else if (part.paper === '180gsm_plain') {
      pagePrice = part.hasBackground ? PRICES.COLOR['180gsm_plain_with_bg'] : PRICES.COLOR['180gsm_plain_no_bg'];
    } else if (part.paper === 'photo_180gsm') {
      pagePrice = PRICES.COLOR['photo_180gsm'];
    } else if (part.paper === 'photo_230gsm') {
      pagePrice = PRICES.COLOR['photo_230gsm'];
    }
    // For color, if two-sided, the number of printed faces is still the total number of pages.
  }

  let sizeMultiplier = 1;
  if (part.size === 'A5') sizeMultiplier = 0.5;
  if (part.size === 'A3') sizeMultiplier = 2;
  
  return pagePrice * pageCount * sizeMultiplier;
}

function calculateDocumentPrice(product: DocumentProduct): number {
  const partsTotal = product.parts.reduce((total, part) => total + calculateDocumentPartPrice(part), 0);
  
  let bindingPrice = 0;
  if (product.binding !== 'none') {
      if (product.binding === 'staple') {
          bindingPrice = PRICES.BINDING.staple; // which is 0
          if(product.coverColor !== 'none') {
            bindingPrice += PRICES.BINDING.cover_fort_180gsm_x2;
          }
          if (product.hasGlassCover) {
              bindingPrice += PRICES.BINDING.glass;
          }
      } else {
          bindingPrice = PRICES.BINDING[product.binding];
      }
  }
  
  const singleBookPrice = partsTotal + bindingPrice;
  return singleBookPrice * product.quantity;
}

function calculateInvoicePrice(product: InvoiceProduct): number {
  let singleBookPrice = 0;
  const paperKey = product.paper;
  
  if (product.size === 'A5' || product.size === 'A4') {
    singleBookPrice = PRICES.INVOICE[`${paperKey}_${product.size}`] || 0;
  } else if (product.size === 'custom_a4' && product.customPiecesPerSheet && product.customPiecesPerSheet > 1) {
    const baseA4 = PRICES.INVOICE[`${paperKey}_A4`];
    singleBookPrice = (baseA4 + PRICES.INVOICE.custom_fee) / product.customPiecesPerSheet;
  } else if (product.size === 'custom_f4' && product.customPiecesPerSheet && product.customPiecesPerSheet > 1) {
      const baseF4 = paperKey.includes('carbon') ? PRICES.INVOICE[`${paperKey}_A4`] : 0; // F4 same as A4
      if (baseF4 > 0) {
        singleBookPrice = (baseF4 + PRICES.INVOICE.custom_fee) / product.customPiecesPerSheet;
      }
  }

  return singleBookPrice * product.quantity;
}


function calculateDecalPrice(product: DecalProduct): number {
  let singleItemPrice = 0;
  // convert mm to m
  const widthM = product.width / 1000;
  const heightM = product.height / 1000;
  const area = widthM * heightM;

  let basePricePerM2 = 0;
  let cuttingPricePerM2 = 0;

  if (product.decalType === 'paper') {
    basePricePerM2 = PRICES.DECAL.paper;
    if (product.cutting === 'regular') cuttingPricePerM2 = PRICES.DECAL_CUTTING.paper_regular;
    if (product.cutting === 'small') cuttingPricePerM2 = PRICES.DECAL_CUTTING.paper_small;
  } else if (product.decalType === 'plastic') {
    basePricePerM2 = PRICES.DECAL.plastic;
    if (product.cutting === 'regular') cuttingPricePerM2 = PRICES.DECAL_CUTTING.plastic_regular;
    if (product.cutting === 'small') cuttingPricePerM2 = PRICES.DECAL_CUTTING.plastic_small;
  }
  
  singleItemPrice = basePricePerM2 * area;
  singleItemPrice += cuttingPricePerM2 * area;


  if (product.lamination !== 'none') {
    singleItemPrice += PRICES.LAMINATION * area;
  }
  
  if (product.foam !== 'none') {
    singleItemPrice += PRICES.FOAM[product.foam] * area;
    if (product.foamCutting) {
      singleItemPrice += PRICES.FOAM_CUTTING[product.foam] * area;
    }
  }

  return singleItemPrice * product.quantity;
}

export function calculatePrice(product: Product): number {
  if (product.quantity <= 0) return 0;
  
  switch (product.type) {
    case 'document':
      return calculateDocumentPrice(product as DocumentProduct);
    case 'invoice':
      return calculateInvoicePrice(product as InvoiceProduct);
    case 'decal':
      return calculateDecalPrice(product as DecalProduct);
    default:
      return 0;
  }
}
