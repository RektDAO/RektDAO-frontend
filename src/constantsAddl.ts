import { EnvHelper } from "./helpers/Environment";
import { NetworkId } from "./networkId";

export * from "./networkId";

export const TOKEN_DECIMALS = 9;

export const TOKEN_DECIMALS_TENS = 10 ** TOKEN_DECIMALS;
export const SECONDS_PER_DAY = 86400; // 60 * 60 * 24
export const EPOCH_HOURS = 4; // TODO: make sure to deploy contract with this
export const EPOCH_SECONDS = EPOCH_HOURS * 60 * 60; // 4 = 14400
export const EPOCHS_PER_DAY = 24 / EPOCH_HOURS;
export const BLANK_ADDRESS = "";

// blocks per day:
export const BLOCKS_PER_DAY_MAP: { [key: number]: number } = {
  [NetworkId.LOCAL]: SECONDS_PER_DAY, // every second

  [NetworkId.MAINNET]: 6500, // https://etherscan.io/chart/blocks
  [NetworkId.TESTNET_RINKEBY]: 6500, // https://rinkeby.etherscan.io/chart/blocks (DISABLED)

  [NetworkId.ARBITRUM]: 50000, // https://arbiscan.io/chart/blocks
  [NetworkId.ARBITRUM_TESTNET]: 50000, // https://testnet.arbiscan.io/chart/blocks

  [NetworkId.AVALANCHE]: 44000, // https://snowtrace.io/chart/blocks
  [NetworkId.AVALANCHE_TESTNET]: 40000, // https://testnet.snowtrace.io/chart/blocks

  [NetworkId.POLYGON]: 40000, // https://polygonscan.com/chart/blocks
  [NetworkId.POLYGON_TESTNET]: 40000, // https://mumbai.polygonscan.com/chart/blocks (DISABLED)

  [NetworkId.FANTOM]: 100000, // https://ftmscan.com/chart/blocks
  [NetworkId.FANTOM_TESTNET]: 100000, // https://testnet.ftmscan.com/chart/blocks (OLD)
};

// seconds per block:
export const BLOCK_RATE_MAP: { [key: number]: number } = Object.fromEntries(
  Object.entries(BLOCKS_PER_DAY_MAP).map(([k, v]) => [k, SECONDS_PER_DAY / v]),
);

// blocks per epoch:
export const BLOCKS_PER_EPOCH_MAP: { [key: number]: number } = Object.fromEntries(
  Object.entries(BLOCKS_PER_DAY_MAP).map(([k, v]) => [k, v / EPOCHS_PER_DAY]),
);

interface IAddressesVal {
  [key: string]: string;
}

export const addressesLocal: IAddressesVal = {
  DAI_ADDRESS: EnvHelper.localContract_DAI_ADDRESS,
  FRAX_ADDRESS: EnvHelper.localContract_FRAX_ADDRESS,
  OHM_DAI_LP_ADDRESS: BLANK_ADDRESS,
  OHM_WETH_LP_ADDRESS: BLANK_ADDRESS,
  OHM_ADDRESS: BLANK_ADDRESS,
  STAKING_ADDRESS: BLANK_ADDRESS, // Staking (V1)
  STAKING_HELPER_ADDRESS: BLANK_ADDRESS, // Helper contract used for Staking (V1) only
  OLD_STAKING_ADDRESS: BLANK_ADDRESS,
  SOHM_ADDRESS: BLANK_ADDRESS,
  WSOHM_ADDRESS: BLANK_ADDRESS,
  OLD_SOHM_ADDRESS: BLANK_ADDRESS,
  PRESALE_ADDRESS: BLANK_ADDRESS,
  AOHM_ADDRESS: BLANK_ADDRESS,
  MIGRATE_ADDRESS: BLANK_ADDRESS,
  DISTRIBUTOR_ADDRESS: EnvHelper.localContract_DISTRIBUTOR_ADDRESS,
  BONDINGCALC_ADDRESS: BLANK_ADDRESS,
  CIRCULATING_SUPPLY_ADDRESS: BLANK_ADDRESS,
  TREASURY_ADDRESS: BLANK_ADDRESS,
  REDEEM_HELPER_ADDRESS: BLANK_ADDRESS,
  BONDINGCALC_V2: EnvHelper.localContract_BONDINGCALC_V2,
  MIGRATOR_ADDRESS: EnvHelper.localContract_MIGRATOR_ADDRESS,
  GOHM_ADDRESS: EnvHelper.localContract_GOHM_ADDRESS,
  OHM_V2: EnvHelper.localContract_OHM_V2,
  TREASURY_V2: EnvHelper.localContract_TREASURY_V2,
  SOHM_V2: EnvHelper.localContract_SOHM_V2,
  STAKING_V2: EnvHelper.localContract_STAKING_V2,
  FIATDAO_WSOHM_ADDRESS: BLANK_ADDRESS,
  GIVING_ADDRESS: BLANK_ADDRESS,
  BOND_DEPOSITORY: EnvHelper.localContract_BOND_DEPOSITORY,
  DAO_TREASURY: EnvHelper.localContract_DAO_TREASURY,
  TOKEMAK_GOHM: BLANK_ADDRESS,
};
