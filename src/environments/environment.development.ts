import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "https://c0cac7af2c0a.ngrok.app",
  appUrl: 'https://ff46fccb512c.ngrok.app',
  botUrl: "https://t.me/toon_miner_local_bot",
};

export const endpoints = getEndpoints(environment.apiUrl);
