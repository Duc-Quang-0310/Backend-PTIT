import { Router } from 'express';
import LaptopsController from '@controllers/laptops.controller';
import CommentController from '@/controllers/comment.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import {
  AddCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from '@dtos/comment.dto';

class LaptopsRoute implements Routes {
  public path = '/api/laptop';
  public router = Router();
  public laptopsController = new LaptopsController();
  public commentController = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ------------------>  laptop crud  <---------------------
    // ------------------>  laptop crud  <---------------------
    this.router.post(`${this.path}`, this.laptopsController.createLaptop);
    this.router.get(`${this.path}`, this.laptopsController.getLaptops);
    this.router.get(
      `${this.path}/pagination`,
      this.laptopsController.paginatingLaptops,
    );
    this.router.get(`${this.path}/:id`, this.laptopsController.getLaptopDetail);
    this.router.delete(`${this.path}/:id`, this.laptopsController.deleteOne);
    this.router.put(`${this.path}/:id`, this.laptopsController.updateOne);

    // ------------------>  laptop rating crud  <---------------------
    // ------------------>  laptop rating crud  <---------------------
    this.router.post(
      `${this.path}/comment`,
      validationMiddleware(AddCommentDto, 'body'),
      this.commentController.addNewComment,
    );
    this.router.put(
      `${this.path}/comment/:id`,
      validationMiddleware(UpdateCommentDto, 'body'),
      this.commentController.updateComment,
    );
    this.router.delete(
      `${this.path}/comment/:id`,
      validationMiddleware(DeleteCommentDto, 'body'),
      this.commentController.deleteComment,
    );
  }
}

export default LaptopsRoute;
