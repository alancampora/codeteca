export interface IMagicLink {
  _id?: any;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
