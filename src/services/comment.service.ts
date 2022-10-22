import { HttpException } from '@exceptions/HttpException';
import { AddComment } from '@/interfaces/comment.interface';
import commentModel from '@/models/comment.model';
import { AddCommentDto } from '@/dtos/comment.dto';

class CommentService {
  public async addNewComment(userComment: AddCommentDto): Promise<AddComment> {
    try {
      const createdComment: AddComment = await commentModel.create(userComment);
      return createdComment;
    } catch (error) {
      throw new HttpException(500, 'invalid userId or laptopId');
    }
  }
}

export default CommentService;
