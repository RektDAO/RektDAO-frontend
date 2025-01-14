import { t } from "@lingui/macro";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenSymbol } from "src/constantsAddl";

import { ACTION_GIVE, ACTION_GIVE_EDIT } from "./GiveThunk";

export interface IPendingTxn {
  readonly txnHash: string;
  readonly text: string;
  readonly type: string;
}

const initialState: Array<IPendingTxn> = [];

const pendingTxnsSlice = createSlice({
  name: "pendingTransactions",
  initialState,
  reducers: {
    fetchPendingTxns(state, action: PayloadAction<IPendingTxn>) {
      state.push(action.payload);
    },
    clearPendingTxn(state, action: PayloadAction<string>) {
      const target = state.find(x => x.txnHash === action.payload);
      if (target) {
        state.splice(state.indexOf(target), 1);
      }
    },
  },
});
export const getStakingTypeText = (action: string) => {
  return action.toLowerCase() === "stake" ? `Staking ${TokenSymbol.OHM}` : `Unstaking ${TokenSymbol.SOHM}`;
};

export const getGivingTypeText = (action: string) => {
  return action.toLowerCase() === ACTION_GIVE
    ? `Giving ${TokenSymbol.SOHM}`
    : ACTION_GIVE_EDIT
    ? `Editing ${TokenSymbol.SOHM} donation amount`
    : `Withdrawing ${TokenSymbol.SOHM} donation`;
};

export const getWrappingTypeText = (action: string) => {
  return action.toLowerCase() === "wrap" ? `Wrapping ${TokenSymbol.OHM}` : `Unwrapping ${TokenSymbol.SOHM}`;
};
export const isPendingTxn = (pendingTransactions: IPendingTxn[], type: string) => {
  return pendingTransactions.map(x => x.type).includes(type);
};
export const txnButtonText = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
  return isPendingTxn(pendingTransactions, type) ? t`Pending...` : defaultText;
};

export const txnButtonTextMultiType = (pendingTransactions: IPendingTxn[], types: string[], defaultText: string) => {
  return types.map(type => isPendingTxn(pendingTransactions, type)).indexOf(true) != -1 ? t`Pending...` : defaultText;
};

export const txnButtonTextGeneralPending = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
  return pendingTransactions.length >= 1 ? t`Pending...` : defaultText;
};

export const { fetchPendingTxns, clearPendingTxn } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;
