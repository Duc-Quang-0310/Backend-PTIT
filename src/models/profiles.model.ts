import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_IMG_LINK = `https://avatars.dicebear.com/api/adventurer-neutral/${uuidv4()}.svg`;
@modelOptions({ schemaOptions: { collection: 'profiles' } })
class Profile {
  @prop({ type: String, required: true, unique: true })
  public userId: string;

  @prop({ type: String })
  public firstName?: string;

  @prop({ type: String })
  public lastName?: string;

  @prop({ type: String })
  public dob?: string;

  @prop({ type: String })
  public address?: string;

  @prop({ type: String })
  public province?: string;

  @prop({ type: String })
  public district?: string;

  @prop({ type: String })
  public ward?: string;

  @prop({ type: Date, default: new Date() })
  public updatedAt?: Date;

  @prop({ type: String, default: DEFAULT_IMG_LINK })
  public avatar?: string;
}

const ProfileModel = getModelForClass(Profile);

export default ProfileModel;
