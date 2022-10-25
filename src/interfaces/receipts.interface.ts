export interface Receipt {
  _id: string;
  userId: any;
  items: any;
  cash: string;
  lastModify?: Date;
  telephone: string;
  address: string;
  quantity: number[];
}
