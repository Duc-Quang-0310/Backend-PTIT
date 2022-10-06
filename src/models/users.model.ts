import { UserRole, UserStatus } from '@/interfaces/users.interface';
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
class User {
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @prop({ type: String, required: true })
  public password: string;

  @prop({ type: Date, default: new Date() })
  public createdAt?: Date;

  @prop({ type: Date, default: new Date() })
  public updatedAt?: Date;

  @prop({ type: String, required: true, default: UserRole.USER })
  public role: UserRole;

  @prop({ type: String, required: true, default: UserStatus.ACTIVE })
  public status: UserStatus;

  @prop({ type: String })
  public token?: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
