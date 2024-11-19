import {BoostLevels} from "../enum/boost-levels";

export interface Boost {
  id: string;
  boostLevel: BoostLevels;
  boostActivationDate: Date;
  boostExpirationDate: Date;
  refPercent: number;
  amountPerClaim: number;
  createdAt: Date;
  updatedAt: Date;
}
