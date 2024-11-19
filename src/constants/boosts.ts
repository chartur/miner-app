import {BoostLevels} from "../interface/enum/boost-levels";

export const boosts = {
  [BoostLevels.MINI]: {
    imgSrc: "assets/icon-spaceship.png",
    description: "mini_boost_description",
  },
  [BoostLevels.MAJOR]: {
    imgSrc: "assets/icon-missile.png",
    description: "major_boost_description",
  },
  [BoostLevels.MEGA]: {
    imgSrc: "assets/launch.png",
    description: "mega_boost_description",
  }
}
