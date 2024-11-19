import {getEndpoints} from "./endpoints";

export const environment = {
  production: true,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "http://localhost:3000",
  appUrl: 'https://d49d9ed820bd.ngrok.app',
  botUrl: "https://t.me/lav_ches_ara_bot" // should be replaced
};

export const endpoints = getEndpoints(environment.apiUrl);
