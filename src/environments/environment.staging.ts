import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  appUrl: 'https://miner-app.galad.am',
  botUrl: "https://t.me/lav_ches_ara_bot",
};

export const endpoints = getEndpoints(`${environment.appUrl}/api`);
