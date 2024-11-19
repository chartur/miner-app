import {Language} from "../enum/language";
import {Wallet} from "./wallet";
import {Boost} from "./boost";

export interface User {
  id: string,
  tUserId: string,
  firstName: string,
  languageCode: Language
  lastName?: string,
  photoUrl?: string,
  createdAt: Date,
  updatedAt: Date,
  wallet?: Wallet,
  boost?: Boost,
  boosts?: Boost[]
}
