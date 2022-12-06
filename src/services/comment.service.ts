import { Profiles } from './../interfaces/profiles.interface';
import { HttpException } from '@exceptions/HttpException';
import { Comment } from '@/interfaces/comment.interface';
import commentModel from '@/models/comment.model';
import { AddCommentDto, UpdateCommentDto } from '@/dtos/comment.dto';
import ProfileModel from '@/models/profiles.model';

type CommentReturnExtend = Comment & { profile: Profiles };
class CommentService {
  public async addNewComment(userComment: AddCommentDto): Promise<Comment> {
    try {
      const createdComment: Comment = await commentModel.create(userComment);
      return createdComment;
    } catch (error) {
      throw new HttpException(400, 'invalid userId or laptopId');
    }
  }

  public async updateComment(
    commentId: string,
    updateComment: UpdateCommentDto,
  ): Promise<Comment> {
    const comment: Comment = await commentModel.findById(commentId);
    if (!comment) {
      throw new HttpException(400, 'Invalid commentId');
    }
    if (!comment.userId.equals(updateComment.userId)) {
      throw new HttpException(401, 'Unauthorized');
    }
    const updatedComment: Comment = await commentModel.findByIdAndUpdate(
      commentId,
      updateComment,
      { new: true },
    );
    return updatedComment;
  }

  public async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<Comment> {
    const comment: Comment = await commentModel.findById(commentId);
    if (!comment) {
      throw new HttpException(400, 'Invalid commentId');
    }
    if (!comment.userId.equals(userId)) {
      throw new HttpException(401, 'Unauthorized');
    }
    const deletedComment = await commentModel.findByIdAndRemove(commentId);
    return deletedComment;
  }

  public async findCommentRatingMoreThan4(): Promise<CommentReturnExtend[]> {
    const allComment: Comment[] = await commentModel.find({
      rating: { $gt: 3 },
    });

    if (allComment.length === 0) {
      return [];
    }

    const listUserIds = allComment.map((comment) => comment.userId);
    const allMatchsProfile: Profiles[] = await Promise.all(
      listUserIds.map((eachId) => ProfileModel.findOne({ userId: eachId })),
    );
    const result = [];

    allComment.forEach((item, index) => {
      const data = {
        _id: item._id,
        userId: item.userId,
        comment: item.comment,
        laptopId: item.laptopId,
        rating: item.rating,
        updatedAt: item.updatedAt,
        profile: allMatchsProfile[index],
      };
      result.push(data);
    });

    return result;
  }
}

export default CommentService;
