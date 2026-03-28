export interface ITransaction {
  id: number;
  name: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  time: Date;
}
