import {StorageService} from "../services/storage.service";
import {TranslateService} from "@ngx-translate/core";
import {defaultLanguage, Language} from "../interface/enum/language";
import {User} from "../interface/models/user";

export const languageInitializer = (storageService: StorageService, translateService: TranslateService) => {
  return () => {
    const languages = Object.values(Language);
    translateService.addLangs(languages)
    const user = storageService.get<User>('user')
    if (user) {
      const language = languages.includes(user.languageCode)
        ? user.languageCode
        : defaultLanguage;
      translateService.use(language)
    } else {
      translateService.use(defaultLanguage)
    }
  }
};
