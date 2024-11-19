import {BoostLevels} from "../enum/boost-levels";
import {BoostDetails} from "./boost-details";

export interface BoostDetailsMap extends Record<BoostLevels, BoostDetails> {}
