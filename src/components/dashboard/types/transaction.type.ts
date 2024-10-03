export type Transaction = {
  id: string;
  txHash: string;
  senderAddress: string;
  receiverAddress: string;
  transactionTypeId: string;
  amount: number;
  sender: {
    id: string;
    walletAddress: string;
    emailOrWebsite: string;
  };
  receiver: {
    id: string;
    walletAddress: string;
    emailOrWebsite: string;
  };
  createdAt: string;
};
