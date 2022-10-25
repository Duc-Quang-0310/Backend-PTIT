import { NextFunction, Request, Response } from 'express';
import { Receipt } from '@interfaces/receipts.interface';
import receiptService from '@/services/receipt.service';

class ReceiptController {
  public receiptService = new receiptService();

  public createNewReceipt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const receiptInfo: Receipt = req.body;
      const createdReceipt = await this.receiptService.addNewBill(receiptInfo);
      res
        .status(201)
        .json({ data: createdReceipt, message: 'Tạo mới thành công' });
    } catch (error) {
      next(error);
    }
  };
  public getReceipt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params as { userId: string };
      const userReceipts = await this.receiptService.getReceipts(userId);
      res.status(201).json({ data: userReceipts });
    } catch (error) {
      next(error);
    }
  };
  public deleteReceipt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId, receiptId } = req.query as {
        userId: string;
        receiptId: string;
      };
      const deletedReceipt = await this.receiptService.deleteReceipt(
        userId,
        receiptId,
      );
      res.status(201).json({ data: deletedReceipt, message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ReceiptController;
