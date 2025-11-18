export interface Merchant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  points: number;
  location: string;
  website: string;
  voucherIds: string[];
  createdAt: string;
  updatedAt: string;
  tel: string;
  walletId: string;
}

export interface VoucherBackendResponse {
  id: string;
  name: string;
  description: string;
  status: string;
  merchantName: string;
  merchantId: string;
  valueType: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  totalIssued: number;
  totalRedeemed: number;
  availableCount?: number;
  imageUrl: string;
  limitPerMember: number;
  pointsCost?: number;
  createdAt: string;
  updatedAt: string;
  merchant?: Merchant;
}

export interface Voucher {
  id: string;
  name: string;
  description: string;
  status: string;
  merchantId: string;
  merchantName: string;
  valueType: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  totalIssued: number;
  totalRedeemed: number;
  availableCount: number;
  imageUrl: string;
  limitPerMember: number;
  pointsCost: number;
  createdAt: string;
  updatedAt: string;
}
