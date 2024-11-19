export const getEndpoints = (apiUrl: string) => {
  return {
    auth: {
      saveUser: `${apiUrl}/users/sync`,
      me: `${apiUrl}/users/me`,
      saveUserDebug: `${apiUrl}/users/sync/test`,
      photo: `${apiUrl}/users/photo`,
    },
    refs: {
      getMyRefs: `${apiUrl}/refs/my`,
      getProfit: `${apiUrl}/refs/profit`,
      collect: `${apiUrl}/refs/collect`,
    },
    wallet: {
      claim: `${apiUrl}/wallet/claim`,
      getRate: `${apiUrl}/wallet/rates`
    },
    boost: {
      invoice: `${apiUrl}/boosts/invoice`,
    },
    config: {
      get: `${apiUrl}/config`
    }
  }
}
