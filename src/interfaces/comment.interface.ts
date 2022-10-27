export interface AddComment {
  laptopId: any;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment: string;
  userId: any;
  updatedAt: Date;
}

export type Comment = AddComment & { _id: string };
export type UpdateComment = AddComment;
