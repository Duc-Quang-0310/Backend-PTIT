import { IsNotEmpty, IsIn } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  public userId: string;

  @IsNotEmpty()
  public comment: string;

  @IsNotEmpty()
  public laptopId: string;

  @IsNotEmpty()
  @IsIn([0, 1, 2, 3, 4, 5])
  public rating: number;
}
