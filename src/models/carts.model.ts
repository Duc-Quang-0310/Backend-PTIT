import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'carts' } })
class Cart {
  @prop({ type: String, required: true, unique: true })
  public profileID: string;

  @prop({ type: Array<string>, required: true })
  public itemsID: string[];

  @prop({ type: Date, default: new Date() })
  public lastModify?: Date;
}

const CartModel = getModelForClass(Cart);

export default CartModel;
