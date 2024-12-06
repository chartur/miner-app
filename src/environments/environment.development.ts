import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  appUrl: 'https://2de1f742ad83.ngrok.app',
  botUrl: "https://t.me/toon_miner_local_bot",
};

export const endpoints = getEndpoints(`${environment.appUrl}/api`);
