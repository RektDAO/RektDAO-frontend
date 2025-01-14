import { parseUnits } from "@ethersproject/units";
import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { TokenSymbol } from "src/constants";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useDynamicStakingContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

export const useStakeToken = (toToken: TokenSymbol.SOHM | TokenSymbol.GOHM) => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const { address, networkId } = useWeb3Context();
  const balances = useBalance(OHM_ADDRESSES);
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  return useMutation<ContractReceipt, Error, string>(
    async amount => {
      if (!amount || isNaN(Number(amount))) throw new Error(t`Please enter a number`);

      const parsedAmount = parseUnits(amount, 9);

      if (!parsedAmount.gt(0)) throw new Error(t`Please enter a number greater than 0`);

      const balance = balances[networkId].data;

      if (!balance) throw new Error(t`Please refresh your page and try again`);

      if (parsedAmount.gt(balance)) throw new Error(`You cannot stake more than your ${TokenSymbol.OHM} balance`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to stake your ${TokenSymbol.OHM}`);

      if (!address) throw new Error(t`Please refresh your page and try again`);

      const shouldRebase = toToken === TokenSymbol.SOHM;

      const transaction = await contract.stake(address, parsedAmount, shouldRebase, true);
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        const keysToRefetch = [
          balanceQueryKey(address, OHM_ADDRESSES, networkId),
          balanceQueryKey(address, toToken === TokenSymbol.SOHM ? SOHM_ADDRESSES : GOHM_ADDRESSES, networkId),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));

        await Promise.all(promises);

        dispatch(createInfoToast(`Successfully staked ${TokenSymbol.OHM}`));
      },
    },
  );
};
