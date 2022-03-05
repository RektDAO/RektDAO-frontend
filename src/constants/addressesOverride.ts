import { addresses, BLANK_ADDRESS, NetworkId } from "src/constants";

export const STAKING_ADDRESSES = {
  [NetworkId.LOCAL]: addresses[NetworkId.LOCAL].STAKING_V2,
  [NetworkId.AVALANCHE_TESTNET]: addresses[NetworkId.AVALANCHE_TESTNET].STAKING_V2,
  [NetworkId.AVALANCHE]: BLANK_ADDRESS,
  [NetworkId.TESTNET_RINKEBY]: BLANK_ADDRESS,
  [NetworkId.MAINNET]: BLANK_ADDRESS,
  // [NetworkId.POLYGON]: BLANK_ADDRESS,
  // [NetworkId.FANTOM]: BLANK_ADDRESS,
};

export const GOHM_ADDRESSES = {
  [NetworkId.LOCAL]: addresses[NetworkId.LOCAL].GOHM_ADDRESS,
  [NetworkId.AVALANCHE_TESTNET]: addresses[NetworkId.AVALANCHE_TESTNET].GOHM_ADDRESS,
  [NetworkId.AVALANCHE]: BLANK_ADDRESS,
  [NetworkId.TESTNET_RINKEBY]: BLANK_ADDRESS,
  [NetworkId.MAINNET]: BLANK_ADDRESS,
  // [NetworkId.POLYGON]: BLANK_ADDRESS,
  // [NetworkId.FANTOM]: BLANK_ADDRESS,
};

export const WSOHM_ADDRESSES = {
  [NetworkId.LOCAL]: BLANK_ADDRESS,
};

export const OHM_ADDRESSES = {
  [NetworkId.LOCAL]: addresses[NetworkId.LOCAL].OHM_V2,
  [NetworkId.AVALANCHE_TESTNET]: addresses[NetworkId.AVALANCHE_TESTNET].OHM_V2,
  [NetworkId.AVALANCHE]: BLANK_ADDRESS,
  [NetworkId.TESTNET_RINKEBY]: BLANK_ADDRESS,
  [NetworkId.MAINNET]: BLANK_ADDRESS,
  // [NetworkId.POLYGON]: BLANK_ADDRESS,
  // [NetworkId.FANTOM]: BLANK_ADDRESS,
};

export const V1_OHM_ADDRESSES = {
  [NetworkId.LOCAL]: BLANK_ADDRESS,
};

export const SOHM_ADDRESSES = {
  [NetworkId.LOCAL]: addresses[NetworkId.LOCAL].SOHM_V2,
  [NetworkId.AVALANCHE_TESTNET]: addresses[NetworkId.AVALANCHE_TESTNET].SOHM_V2,
  [NetworkId.AVALANCHE]: BLANK_ADDRESS,
  [NetworkId.TESTNET_RINKEBY]: BLANK_ADDRESS,
  [NetworkId.MAINNET]: BLANK_ADDRESS,
  // [NetworkId.POLYGON]: BLANK_ADDRESS,
  // [NetworkId.FANTOM]: BLANK_ADDRESS,
};

export const V1_SOHM_ADDRESSES = {
  [NetworkId.LOCAL]: BLANK_ADDRESS,
};

export const MIGRATOR_ADDRESSES = {
  [NetworkId.LOCAL]: addresses[NetworkId.LOCAL].MIGRATOR_ADDRESS,
};

export const GOHM_TOKEMAK_ADDRESSES = {
  [NetworkId.MAINNET]: BLANK_ADDRESS,
};

export const FUSE_POOL_6_ADDRESSES = {
  [NetworkId.MAINNET]: BLANK_ADDRESS,
};

export const FUSE_POOL_18_ADDRESSES = {
  [NetworkId.MAINNET]: BLANK_ADDRESS,
};

export const FUSE_POOL_36_ADDRESSES = {
  [NetworkId.MAINNET]: BLANK_ADDRESS,
};
