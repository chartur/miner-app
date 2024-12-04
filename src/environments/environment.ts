import {getEndpoints} from "./endpoints";

export const environment = {
  production: true,
  tUserId: '5344748542',
  communityChannelLink: "https://t.me/tibtonic",
  appUrl: 'https://app.tibtonic.org',
  botUrl: "https://t.me/tibtonic_bot"
};

export const endpoints = getEndpoints(`${environment.appUrl}/api`);
