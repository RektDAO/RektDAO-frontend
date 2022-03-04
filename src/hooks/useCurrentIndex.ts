import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
// import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { useWeb3Context } from "src/hooks";

import { useStaticStakingContract } from "./useContract";

export const currentIndexQueryKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  const { networkId } = useWeb3Context();
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[networkId], networkId);

  return useQuery<BigNumber, Error>(currentIndexQueryKey(), () => stakingContract.index());
};
