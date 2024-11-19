import {TelegramService} from "../services/telegram.service";

export const telegramInitializer = (telegramService: TelegramService) => {
  return () => telegramService.init()
};
