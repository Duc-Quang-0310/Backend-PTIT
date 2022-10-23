import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { User } from './users.model';
import { LaptopInfo } from './laptopInfos.model';

@modelOptions({ schemaOptions: { collection: 'receipts' } })
class Receipt {
  @prop({ autopopulate: true, required: true, ref: User })
  public userId: Ref<User>;

  @prop({ autopopulate: true, required: true, ref: LaptopInfo })
  public items: Ref<LaptopInfo>[];

  @prop({ type: String, required: true })
  public cash: string;

  @prop({ type: Date, default: new Date() })
  public lastModify?: Date;
}

const ReceiptModel = getModelForClass(Receipt);

export default ReceiptModel;
