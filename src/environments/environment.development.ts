import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "https://0b8dfc7aa341.ngrok.app",
  appUrl: 'https://625f6278511d.ngrok.app',
  botUrl: "https://t.me/toon_miner_local_bot",
};

export const endpoints = getEndpoints(environment.apiUrl);
