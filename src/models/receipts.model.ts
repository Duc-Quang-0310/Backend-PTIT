import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'receipts' } })
class Receipt {
  @prop({ type: String, required: true, unique: true })
  public profileID: string;

  @prop({ type: Array<string> })
  public itemsID: string[];

  @prop({ type: Date, default: new Date() })
  public lastModify?: Date;
}

const ReceiptModel = getModelForClass(Receipt);

export default ReceiptModel;
