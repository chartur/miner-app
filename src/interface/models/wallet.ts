export interface Wallet {
  id: string;
  tons: number;
  nonotons: number;
  claimCount: number;
  lastClaimDateTime?: Date;
  lastRefsClaimDateTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
