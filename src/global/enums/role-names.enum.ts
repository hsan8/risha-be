export const EcomAdminUserRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
};

export type EcomAdminUserRoles = keyof typeof EcomAdminUserRoles;

export const MerchantUserRoles = {
  MERCHANT_SUPER_ADMIN: 'MERCHANT_SUPER_ADMIN',
  MERCHANT_ADMIN: 'MERCHANT_ADMIN',
  MERCHANT_VIEWER: 'MERCHANT_VIEWER',
  MERCHANT_AGENT: 'MERCHANT_AGENT',
};

export type MerchantUserRoles = keyof typeof MerchantUserRoles;
