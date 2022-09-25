import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'laptops' } })
class Laptop {
  @prop({ type: String, required: true })
  public cpu: string;

  @prop({ type: String, required: true })
  public ram: string;

  @prop({ type: String, required: true })
  public vga: string;

  @prop({ type: String, required: true })
  public screen: string;

  @prop({ type: String, required: true })
  public keyboard: string;

  @prop({ type: String, required: true })
  public window: string;

  @prop({ type: String, required: true })
  public color: string;

  @prop({ type: String, required: true })
  public productName: string;

  @prop({ type: String, required: true })
  public sku: string;

  @prop({ type: Array<string>, required: true })
  public productImg: string[];

  @prop({ type: Date, default: new Date() })
  public updatedAt?: Date;
}

const LaptopModel = getModelForClass(Laptop);

export default LaptopModel;
