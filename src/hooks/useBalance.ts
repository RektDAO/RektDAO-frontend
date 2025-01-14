import { BigNumber, ethers } from "ethers";
import { useQueries, useQuery, UseQueryResult } from "react-query";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import { NetworkId, ZERO_BALANCE } from "src/constants";
import {
  AddressMap,
  FUSE_POOL_6_ADDRESSES,
  FUSE_POOL_18_ADDRESSES,
  FUSE_POOL_36_ADDRESSES,
  GOHM_ADDRESSES,
  // GOHM_TOKEMAK_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  // V1_OHM_ADDRESSES,
  // V1_SOHM_ADDRESSES,
  // WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { nonNullable, queryAssertion } from "src/helpers";
import { IERC20 } from "src/typechain";

import { useWeb3Context } from ".";
import { useMultipleContracts, useStaticFuseContract } from "./useContract";

export async function balanceQueryFn(address: string, contract: IERC20 | null) {
  let res = ethers.constants.Zero;
  if (!address || !contract) return res;
  try {
    res = await contract.balanceOf(address);
  } catch (e) {
    // console.log("balanceQueryFn:e", e);
  }
  return res;
}

export const balanceQueryKey = (address?: string, tokenAddressMap?: AddressMap, networkId?: NetworkId) =>
  ["useBalance", address, tokenAddressMap, networkId].filter(nonNullable);

/**
 * Returns a balance.
 * @param addressMap Address map of the token you want the balance of.
 */
export const useBalance = <TAddressMap extends AddressMap = AddressMap>(tokenAddressMap: TAddressMap) => {
  const { address } = useWeb3Context();
  const contracts = useMultipleContracts<IERC20>(tokenAddressMap, IERC20_ABI);

  const networkIds = Object.keys(tokenAddressMap).map(Number);

  const results = useQueries(
    networkIds.map((networkId, index) => ({
      enabled: !!address && !!contracts[index],
      queryFn: () => balanceQueryFn(address, contracts[index]),
      queryKey: balanceQueryKey(address, tokenAddressMap, networkId),
    })),
  );

  return networkIds.reduce(
    (prev, networkId, index) => Object.assign(prev, { [networkId]: results[index] }),
    {} as Record<keyof typeof tokenAddressMap, UseQueryResult<BigNumber>>,
  );
};

/**
 * Returns gOHM balance in Fuse
 */
export const fuseBalanceQueryKey = (address: string) => ["useFuseBalance", address].filter(nonNullable);
export const useFuseBalance = () => {
  return ZERO_BALANCE;
  const { address } = useWeb3Context();
  const pool6Contract = useStaticFuseContract(FUSE_POOL_6_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const pool18Contract = useStaticFuseContract(FUSE_POOL_18_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const pool36Contract = useStaticFuseContract(FUSE_POOL_36_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return {
    [NetworkId.MAINNET]: useQuery<BigNumber, Error>(
      fuseBalanceQueryKey(address),
      async () => {
        queryAssertion(address, fuseBalanceQueryKey(address));

        try {
          const promises = [pool6Contract, pool18Contract, pool36Contract].map(async contract => {
            return contract.callStatic.balanceOfUnderlying(address);
          });

          const results = await Promise.all(promises);

          return results.reduce((prev, bal) => prev.add(bal), BigNumber.from(0));
        } catch (e) {
          return ethers.constants.Zero;
        }
      },
      { enabled: !!address },
    ),
  };
};

export const useOhmBalance = () => useBalance(OHM_ADDRESSES);
export const useSohmBalance = () => useBalance(SOHM_ADDRESSES);
export const useGohmBalance = () => useBalance(GOHM_ADDRESSES);
export const useWsohmBalance = () => ZERO_BALANCE; // useBalance(WSOHM_ADDRESSES);
export const useV1OhmBalance = () => ZERO_BALANCE; // useBalance(V1_OHM_ADDRESSES);
export const useV1SohmBalance = () => ZERO_BALANCE; // useBalance(V1_SOHM_ADDRESSES);
export const useGohmTokemakBalance = () => ZERO_BALANCE; // useBalance(GOHM_TOKEMAK_ADDRESSES);
