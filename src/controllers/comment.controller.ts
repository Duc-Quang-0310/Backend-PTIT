import { NextFunction, Request, Response } from 'express';
import { AddComment } from '@/interfaces/comment.interface';
import commentService from '@/services/comment.service';

class LaptopRatingController {
  public commentService = new commentService();

  // ------------------>  laptop crud  <---------------------
  // ------------------>  laptop crud  <---------------------
  public addNewComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userComment: AddComment = req.body;
      const createdComment = await this.commentService.addNewComment(
        userComment,
      );
      res.status(201).json({ data: createdComment, message: 'Created' });
    } catch (error) {
      next(error);
    }
  };
}

export default LaptopRatingController;
