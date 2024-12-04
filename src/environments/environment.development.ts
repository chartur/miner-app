import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "https://4758d2f7561c.ngrok.app",
  appUrl: 'https://f72017a83a6e.ngrok.app',
  botUrl: "https://t.me/toon_miner_local_bot",
};

export const endpoints = getEndpoints(environment.apiUrl);
