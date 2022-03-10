import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
import { addresses } from "src/constants";
import { OHM_DAI_RESERVE_CONTRACT_DECIMALS, STAKING_CONTRACT_DECIMALS } from "src/constants/decimals";
import { assert, getMarketPrice, nonNullable, parseBigNumber, queryAssertion /*, toBN*/ } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { useWeb3Context } from "src/hooks";

import { useStaticPairContract } from "./useContract";
import { useCurrentIndex } from "./useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const { networkId, networkIdExists } = useWeb3Context();
  const address = ohm_dai.getAddressForReserve(networkId) || addresses[networkId]?.DAI_ADDRESS;
  if (networkIdExists) assert(address, "OHM-DAI contract should exist for networkId: " + networkId);

  const reserveContract = useStaticPairContract(address, networkId);

  return useQuery<number, Error>(ohmPriceQueryKey(), async () => {
    if (!networkIdExists) return 0;
    try {
      const [ohm, dai] = await reserveContract.getReserves();
      // const [ohm, dai] = reserveContract ? await reserveContract.getReserves() : [toBN(69), toBN(420)];
      // const [ohm, dai] = [toBN(69), toBN(420 * 10 ** OHM_DAI_RESERVE_CONTRACT_DECIMALS)];

      return parseBigNumber(dai.div(ohm), OHM_DAI_RESERVE_CONTRACT_DECIMALS);
    } catch (e) {
      const marketPrice: number = await getMarketPrice(networkId);
      return marketPrice;
    }
  });
};

export const gohmPriceQueryKey = (marketPrice?: number, currentIndex?: BigNumber) =>
  ["useGOHMPrice", marketPrice, currentIndex].filter(nonNullable);

/**
 * Returns the calculated price of gOHM.
 */
export const useGohmPrice = () => {
  const { data: ohmPrice } = useOhmPrice();
  const { data: currentIndex } = useCurrentIndex();

  return useQuery<number, Error>(
    gohmPriceQueryKey(ohmPrice, currentIndex),
    async () => {
      queryAssertion(ohmPrice && currentIndex, gohmPriceQueryKey(ohmPrice, currentIndex));

      return parseBigNumber(currentIndex, STAKING_CONTRACT_DECIMALS) * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
