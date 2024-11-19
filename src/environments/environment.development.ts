import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "https://0a104f64c842.ngrok.app",
  appUrl: 'https://69c3b7aad272.ngrok.app',
  botUrl: "https://t.me/lav_ches_ara_bot",
};

export const endpoints = getEndpoints(environment.apiUrl);
