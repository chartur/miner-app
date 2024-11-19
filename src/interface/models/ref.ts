import {User} from "./user";

export interface Ref {
  id: string;
  referral: User;
  revenueWithTon: number;
  createdAt: Date;
  updatedAt: Date;
}
