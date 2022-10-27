import { NextFunction, Request, Response } from 'express';
import { AddComment, UpdateComment } from '@/interfaces/comment.interface';
import CommentService from '@/services/comment.service';

class LaptopCommentController {
  public commentService = new CommentService();

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

  public updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id: commentId } = req.params as Record<string, string>;
      const updateComment: UpdateComment = req.body;
      const updatedComment = await this.commentService.updateComment(
        commentId,
        updateComment,
      );
      res.status(201).json({ data: updatedComment, message: 'Created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id: commentId } = req.params as Record<string, string>;
      const { userId } = req.body;
      const deletedComment = await this.commentService.deleteComment(
        commentId,
        userId,
      );
      res.status(201).json({ data: deletedComment, message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getCommentRatingMoreThan4 = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const allComment = await this.commentService.findCommentRatingMoreThan4();
      res.status(200).json({ data: allComment });
    } catch (error) {
      next(error);
    }
  };
}

export default LaptopCommentController;
