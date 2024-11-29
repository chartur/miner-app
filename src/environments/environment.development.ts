import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "https://1fb91a6bc6ea.ngrok.app",
  appUrl: 'https://e99f802cfcf2.ngrok.app',
  botUrl: "https://t.me/toon_miner_local_bot",
};

export const endpoints = getEndpoints(environment.apiUrl);
