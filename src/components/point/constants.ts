export const DEFAULT_POINT_IMAGE = "/images/image.png";

export const AssetType = {
  POINT: 'POINT',
  VOUCHER: 'VOUCHER',
  THB_TOKEN: 'THB_TOKEN'
} as const;

export type AssetTypeValue = typeof AssetType[keyof typeof AssetType];
