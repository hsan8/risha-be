// Define the Products enum as a constant
export const Products = {
  E_API: 'E_API',
  E_LINKS: 'E_LINKS',
  E_POS: 'E_POS',
  E_STORE: 'E_STORE',
} as const;

export type Products = keyof typeof Products;
