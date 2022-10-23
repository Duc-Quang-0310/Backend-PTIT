import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { LaptopInfo } from './laptopInfos.model';
import { User } from './users.model';

@modelOptions({ schemaOptions: { collection: 'comment' } })
class CommentScheme {
  @prop({ autopopulate: true, required: true, ref: User })
  public userId: Ref<User>;

  @prop({ type: String, required: true })
  public comment: string;

  @prop({ autopopulate: true, required: true, ref: LaptopInfo })
  public laptopId: Ref<LaptopInfo>;

  @prop({ type: Number, required: true })
  public rating: 0 | 1 | 2 | 3 | 4 | 5;
}

const CommentModel = getModelForClass(CommentScheme);

export default CommentModel;
