export interface Wallet {
  id: string;
  tons: number;
  nonotons: number;
  tibCoins: string
  claimCount: number;
  lastClaimDateTime?: Date;
  lastRefsClaimDateTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
