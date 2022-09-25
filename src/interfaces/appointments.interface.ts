export enum AppointmentStatus {
  PENDING = 'Pending',
  DONE = 'Done',
}

export interface Appointment {
  _id: string;
  date: string;
  profileID: string;
  status: AppointmentStatus;
  title: string;
  body?: string;
  receptionistId: string;
  createdAt?: Date;
  lastModify?: Date;
}
