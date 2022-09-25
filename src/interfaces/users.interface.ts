export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  SPECIALIST = 'Specialist',
}

export enum UserStatus {
  ACTIVE = 'Active',
  IN_ACTIVE = 'InActive',
  BAN = 'Ban',
}

export interface User {
  _id: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: UserRole;
  status: UserStatus;
}
