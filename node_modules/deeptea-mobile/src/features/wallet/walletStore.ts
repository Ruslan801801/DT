import create from 'zustand';

export type WalletTxStatus = 'pending' | 'completed' | 'failed' | 'reverted';

export type WalletTx = {
  id: string;
  amount: number;
  direction: 'in' | 'out';
  status: WalletTxStatus;
  createdAt: number;
  memo?: string;
};

type WalletState = {
  balance: number;
  txs: WalletTx[];
  addTx: (tx: WalletTx) => void;
  setBalance: (balance: number) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  txs: [],
  addTx: (tx) =>
    set((state) => ({
      txs: [tx, ...state.txs],
    })),
  setBalance: (balance) => set({ balance }),
}));