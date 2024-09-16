import { number } from "react-admin";

export type Transaction = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  txHash: string;
  receiverAddress: string;
  amount: number;
  type: string;
};
