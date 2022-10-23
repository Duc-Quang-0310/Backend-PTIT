import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ReceiptController from '@/controllers/receipt.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { ReceiptDto } from '@/dtos/receipt.dto';

class ReceiptRoute implements Routes {
  public path = '/api/receipt';
  public router = Router();
  public receiptController = new ReceiptController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validationMiddleware(ReceiptDto, 'body'),
      this.receiptController.createNewReceipt,
    );
    this.router.get(`${this.path}/:userId`, this.receiptController.getReceipt);
    this.router.delete(`${this.path}`, this.receiptController.deleteReceipt);
  }
}

export default ReceiptRoute;
