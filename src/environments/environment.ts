import {getEndpoints} from "./endpoints";

export const environment = {
  production: true,
  tUserId: '',
  communityChannelLink: "https://t.me/tibtonic",
  appUrl: 'https://app.tibtonic.org',
  botUrl: "https://t.me/tibtonic_bot"
};

export const endpoints = getEndpoints(`${environment.appUrl}/api`);
