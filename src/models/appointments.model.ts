import { AppointmentStatus } from '@/interfaces/appointments.interface';
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'appointments' } })
class Appointment {
  @prop({ type: Date, required: true })
  public date: string;

  @prop({ type: String, required: true })
  public profileID: string;

  @prop({ type: String, required: true })
  public status: AppointmentStatus;

  @prop({ type: String, required: true })
  public title: string;

  @prop({ type: String })
  public body?: string;

  @prop({ type: String, required: true })
  public receptionistId: string;

  @prop({ type: Date, default: new Date() })
  public createdAt?: Date;

  @prop({ type: Date })
  public lastModify?: Date;
}

const AppointmentModel = getModelForClass(Appointment);

export default AppointmentModel;
