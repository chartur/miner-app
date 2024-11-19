import {Currencies} from "../enum/currencies.";

export interface GetCurrencyRateDtoResponse {
  rates: {
    [key in Currencies]: {
      prices: {
        [key in Currencies]: number;
      };
      diff_24h: {
        [key in Currencies]: string;
      };
      diff_7d: {
        [key in Currencies]: string;
      };
      diff_30d: {
        [key in Currencies]: string;
      };
    };
  };
}
