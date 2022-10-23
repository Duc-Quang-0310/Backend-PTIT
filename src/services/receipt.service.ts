import { HttpException } from '@exceptions/HttpException';
import receiptModel from '@models/receipts.model';
import { Receipt } from '@interfaces/receipts.interface';

class PaymentService {
  public async addNewBill(bill: Receipt): Promise<Receipt> {
    const createdBill = await receiptModel.create(bill);
    return createdBill;
  }

  public async getReceipts(userId: string): Promise<Array<Receipt>> {
    const userReceipts = await receiptModel
      .find({ userId })
      .populate('items')
      .populate('userId');
    return userReceipts;
  }

  public async deleteReceipt(
    userId: string,
    receiptId: string,
  ): Promise<Receipt> {
    const currReceipt: Receipt = await receiptModel.findById(receiptId);
    if (!currReceipt) {
      throw new HttpException(400, 'Receipt doesnt exist');
    }
    if (!currReceipt.userId.equals(userId)) {
      throw new HttpException(401, 'Unauthorized');
    }
    const deletedReceipt = await receiptModel.findByIdAndRemove(receiptId);
    return deletedReceipt;
  }
}

export default PaymentService;
