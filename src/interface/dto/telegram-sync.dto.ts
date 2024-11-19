import {TelegramUserDto} from "./telegram-user.dto";

export interface TelegramSyncDto {
  auth_date: number,
  hash: string,
  query_id: string
  user: TelegramUserDto,
  initData: string,
}
