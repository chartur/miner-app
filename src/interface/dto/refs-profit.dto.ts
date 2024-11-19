import {User} from "../models/user";

export interface RefsProfitDto {
  users: Partial<User>[];
  total: string;
  moreUsersCount: number;
}
