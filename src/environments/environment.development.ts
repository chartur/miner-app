import {getEndpoints} from "./endpoints";

export const environment = {
  production: false,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/+rmvNDW3MDwI4NjJi",
  apiUrl: "https://dd0d75064e1d.ngrok.app",
  appUrl: 'https://f90ef3ca56e1.ngrok.app',
  botUrl: "https://t.me/lav_ches_ara_bot",
};

export const endpoints = getEndpoints(environment.apiUrl);
