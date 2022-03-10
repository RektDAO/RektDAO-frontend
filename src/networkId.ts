import { EnvHelper } from "./helpers/Environment";

export const LOCAL_CHAIN_ID: number = EnvHelper.localNetworkId;
export const DEFAULT_CHAIN_ID: number = EnvHelper.defaultNetworkId;

export enum NetworkId {
  LOCAL = LOCAL_CHAIN_ID,

  MAINNET = 1,
  TESTNET_RINKEBY = 4,

  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 421611,

  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,

  POLYGON = 137,
  POLYGON_TESTNET = 80001,

  FANTOM = 250,
  FANTOM_TESTNET = 4002,

  Localhost = 1337,
}

export type NetworkIdVal = typeof NetworkId[keyof typeof NetworkId];
export type NetworkIdIndexed = { NetworkIdVal?: any };
