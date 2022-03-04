import { useQuery } from "react-query";
// import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useStaticStakingContract } from "src/hooks/useContract";

export const nextRebaseDateQueryKey = () => ["useNextRebaseDate"];

export const useNextRebaseDate = () => {
  const { networkId } = useWeb3Context();
  const contract = useStaticStakingContract(STAKING_ADDRESSES[networkId], networkId);

  return useQuery<Date, Error>(nextRebaseDateQueryKey(), async () => {
    const secondsToRebase = await contract.secondsToNextEpoch();

    const parsedSeconds = parseBigNumber(secondsToRebase, 0);

    return new Date(Date.now() + parsedSeconds * 1000);
  });
};
