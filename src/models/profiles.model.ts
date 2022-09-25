import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'profiles' } })
class Profile {
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
}

const ProfileModel = getModelForClass(Profile);

export default ProfileModel;
