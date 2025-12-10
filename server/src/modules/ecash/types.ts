export type EcashProof = {
  id: string;
  amount: number;
  secret: string;
  signature: string;
};

export type EcashToken = {
  mintUrl: string;
  proofs: EcashProof[];
  memo?: string;
};