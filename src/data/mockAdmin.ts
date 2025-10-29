import { vouchers, type Voucher } from "./vouchers";

export const mockMerchants = [
  {
    id: "central-retail",
    name: "เซ็นทรัล รีเทล",
    website: "https://www.centralretail.com",
    description: "ห้างสรรพสินค้า เซ็นทรัล, โรบินสัน และท็อปส์",
    imageUrl:
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1600&auto=format&fit=crop",
    location: "สาขาทั่วประเทศ",
    categories: ["ห้างสรรพสินค้า", "ซูเปอร์มาร์เก็ต"],
  },
  {
    id: "the-mall-group",
    name: "เดอะมอลล์ กรุ๊ป",
    website: "https://www.themallgroup.com",
    description: "เดอะมอลล์, เอ็มโพเรียม และเอ็มควอเทียร์",
    imageUrl:
      "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=1600&auto=format&fit=crop",
    location: "กรุงเทพฯ และปริมณฑล",
    categories: ["ห้างสรรพสินค้า", "ไลฟ์สไตล์"],
  },
  {
    id: "cp-all",
    name: "ซีพี ออลล์",
    website: "https://www.cpall.co.th",
    description: "7-Eleven และ CP Freshmart",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1600&auto=format&fit=crop",
    location: "ร้านสะดวกซื้อทั่วประเทศ",
    categories: ["ร้านสะดวกซื้อ", "อาหารและเครื่องดื่ม"],
  },
];

export const mockPoints = [
  {
    id: "point-demo-1",
    name: "Central Reward Points",
    contractAddress: "0xC3n7Ral0000000000000000000000000000001",
    merchantId: "central-retail",
    frameSize: 1000,
    slotSize: 100,
  },
  {
    id: "point-demo-2",
    name: "The Mall Privilege",
    contractAddress: "0xMall000000000000000000000000000000002",
    merchantId: "the-mall-group",
    frameSize: 800,
    slotSize: 80,
  },
];

export const mockApiKeys = [
  {
    id: "apikey-demo-1",
    name: "Public API",
    description: "ใช้ผูกระบบสมาชิก",
    apiKey: "pk_demo_public_123456",
    merchantId: "central-retail",
  },
  {
    id: "apikey-demo-2",
    name: "Internal API",
    description: "เชื่อมต่อระบบ CRM",
    apiKey: "pk_demo_internal_654321",
    merchantId: "the-mall-group",
  },
];

export const mockCustomers = [
  {
    id: "customer-demo-1",
    email: "alice@central.co.th",
    walletAddress: "0x1111222233334444555566667777888899990000",
    firstName: "Alice",
    lastName: "Wong",
    merchantId: "central-retail",
    customerPoints: [
      {
        id: "point-demo-1",
        contractAddress: "0xC3n7Ral0000000000000000000000000000001",
        balances: 1250,
        decimal: 18,
        symbol: "CRP",
        name: "Central Reward Points",
      },
    ],
    transactions: [
      {
        id: "cust-tx-1",
        sender: "alice@central.co.th",
        receiver: "เซ็นทรัล รีเทล",
        txHash: "0xtxhash123456",
        amount: 500,
        transactionTypeId: "redeem",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "customer-demo-2",
    email: "bob@themall.co.th",
    walletAddress: "0xAAAABBBBCCCCDDDDEEEEFFFF0000111122223333",
    firstName: "Bob",
    lastName: "Supasith",
    merchantId: "the-mall-group",
    customerPoints: [
      {
        id: "point-demo-2",
        contractAddress: "0xMall000000000000000000000000000000002",
        balances: 320,
        decimal: 18,
        symbol: "TMP",
        name: "The Mall Privilege",
      },
    ],
    transactions: [
      {
        id: "cust-tx-2",
        sender: "เดอะมอลล์",
        receiver: "bob@themall.co.th",
        txHash: "0xtxhash654321",
        amount: 200,
        transactionTypeId: "earn",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
];

export const mockDashboard = {
  customerWallet: 23500,
  transactionsToday: 18,
  totalRedeem: 1280,
  totalTransfer: 845,
  transactionsMonthly: [
    { label: "Jan", value: 420 },
    { label: "Feb", value: 560 },
    { label: "Mar", value: 610 },
    { label: "Apr", value: 720 },
  ],
  transactionsRedeemMonthly: [
    { label: "Jan", value: 210 },
    { label: "Feb", value: 280 },
    { label: "Mar", value: 320 },
    { label: "Apr", value: 360 },
  ],
  transactionsTransferMonthly: [
    { label: "Jan", value: 180 },
    { label: "Feb", value: 190 },
    { label: "Mar", value: 210 },
    { label: "Apr", value: 260 },
  ],
  transactions: [
    {
      id: "tx-demo-1",
      txHash: "0xcentral1234567890",
      senderAddress: "0xCENTRAL001",
      receiverAddress: "0xCUSTOMER001",
      transactionTypeId: "redeem",
      amount: 450,
      sender: {
        id: "sender-1",
        walletAddress: "0xCENTRAL001",
        emailOrWebsite: "เซ็นทรัล รีเทล",
      },
      receiver: {
        id: "receiver-1",
        walletAddress: "0xCUSTOMER001",
        emailOrWebsite: "alice@central.co.th",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "tx-demo-2",
      txHash: "0xthemall987654321",
      senderAddress: "0xCUSTOMER002",
      receiverAddress: "0xMALL002",
      transactionTypeId: "earn",
      amount: 200,
      sender: {
        id: "sender-2",
        walletAddress: "0xCUSTOMER002",
        emailOrWebsite: "bob@themall.co.th",
      },
      receiver: {
        id: "receiver-2",
        walletAddress: "0xMALL002",
        emailOrWebsite: "เดอะมอลล์ กรุ๊ป",
      },
      createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
  ],
};

export const mockTransactions = [
  {
    id: "tx-demo-1",
    txHash: "0xcentral1234567890",
    senderAddress: "0xCENTRAL001",
    receiverAddress: "0xCUSTOMER001",
    transactionTypeId: "redeem",
    amount: 450,
    sender: {
      id: "sender-1",
      walletAddress: "0xCENTRAL001",
      emailOrWebsite: "เซ็นทรัล รีเทล",
    },
    receiver: {
      id: "receiver-1",
      walletAddress: "0xCUSTOMER001",
      emailOrWebsite: "alice@central.co.th",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-demo-2",
    txHash: "0xthemall987654321",
    senderAddress: "0xCUSTOMER002",
    receiverAddress: "0xMALL002",
    transactionTypeId: "earn",
    amount: 200,
    sender: {
      id: "sender-2",
      walletAddress: "0xCUSTOMER002",
      emailOrWebsite: "bob@themall.co.th",
    },
    receiver: {
      id: "receiver-2",
      walletAddress: "0xMALL002",
      emailOrWebsite: "เดอะมอลล์ กรุ๊ป",
    },
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
];
export const mockVouchers: Voucher[] = vouchers;
