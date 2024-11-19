import {BoostLevels} from "../enum/boost-levels";

export class BoostDetails {
  id: number;
  name: BoostLevels;
  price: number;
  perClaim: number;
  perPeriodClaim: number;
  perPeriodTonRevenue: number;
  perSecondNonotonRevenue: number;
  refCashback: number;
  processorCount: number
}
