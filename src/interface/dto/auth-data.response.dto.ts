import {User} from "../models/user";

export interface AuthDataResponseDto {
  token: string,
  user: User
}
