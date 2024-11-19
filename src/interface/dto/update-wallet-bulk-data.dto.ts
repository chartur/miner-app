import {Wallet} from "../models/wallet";
import {Boost} from "../models/boost";

export interface UpdateWalletBulkDataDto {
  wallet: Wallet | null,
  boost: Boost | null,
}
