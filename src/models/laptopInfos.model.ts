import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'laptopInfos' } })
class LaptopInfo {
  @prop({ type: String })
  public cpu?: string;

  @prop({ type: String })
  public keyboard?: string;

  @prop({ type: String })
  public productName?: string;

  @prop({ type: String })
  public sku?: string;

  @prop({ type: Array<string> })
  public productImg?: string[];

  @prop({ type: String })
  public laptopID: string;

  @prop({ type: String })
  public brand?: string;

  @prop({ type: String })
  public type?: string;

  @prop({ type: String })
  public partNumber?: string;

  @prop({ type: String })
  public color?: string;

  @prop({ type: String })
  public chip?: string;

  @prop({ type: String })
  public chipSet?: string;

  @prop({ type: String })
  public rom?: string;

  @prop({ type: String })
  public connector?: string;

  @prop({ type: String })
  public ram?: string;

  @prop({ type: String })
  public vga?: string;

  @prop({ type: String })
  public disk?: string;

  @prop({ type: String })
  public lightDisk?: string;

  @prop({ type: String })
  public cardReader?: string;

  @prop({ type: String })
  public technology?: string;

  @prop({ type: String })
  public screen?: string;

  @prop({ type: String })
  public webcam?: string;

  @prop({ type: String })
  public audio?: string;

  @prop({ type: String })
  public internet?: string;

  @prop({ type: String })
  public noWires?: string;

  @prop({ type: String })
  public connectionPort?: string;

  @prop({ type: String })
  public battery?: string;

  @prop({ type: String })
  public size?: string;

  @prop({ type: String })
  public weight?: string;

  @prop({ type: String })
  public window?: string;

  @prop({ type: String })
  public accessory?: string;

  @prop({ type: Date, default: new Date() })
  public updatedAt?: Date;

  @prop({ type: String, required: true })
  public review: string;
}

const LaptopInfoModel = getModelForClass(LaptopInfo);

export default LaptopInfoModel;
