import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { SvgIcon } from "@material-ui/core";
import axios from "axios";
import { ethers } from "ethers";
import { QueryKey, useQuery } from "react-query";
import { IBondV2 } from "src/slices/BondSliceV2";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { BondDepository__factory } from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";

import { abi as PairContractABI } from "../abi/PairContract.json";
import { abi as RedeemHelperABI } from "../abi/RedeemHelper.json";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";
import {
  addresses,
  BLOCK_RATE_MAP,
  BLOCKS_PER_EPOCH_MAP,
  DEFAULT_CHAIN_ID,
  NetworkId,
  NetworkIdVal,
  NETWORKS,
  TOKEN_DECIMALS_TENS,
  TokenStubCoingecko,
  TokenSymbol,
} from "../constants";
import { PairContract, RedeemHelper } from "../typechain";
import { ohm_dai, ohm_daiOld, ohm_weth } from "./AllBonds";
import { EnvHelper } from "./Environment";
import { NodeHelper } from "./NodeHelper";

/**
 * gets marketPrice from Ohm-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPrice(networkId: NetworkIdVal = DEFAULT_CHAIN_ID) {
  // v2 price
  if (ohm_dai.getIsV2()) {
    return getMarketPriceOf(networkId, String(addresses[networkId].DAI_ADDRESS));
  }

  const provider = NodeHelper.getAnynetStaticProvider(networkId);
  const ohm_dai_address = ohm_dai.getAddressForReserve(networkId);
  const pairContract = new ethers.Contract(ohm_dai_address || "", PairContractABI, provider) as PairContract;
  const reserves = await pairContract.getReserves();

  const marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / TOKEN_DECIMALS_TENS;

  return marketPrice;
}

/**
 * gets marketPrice from Ohm-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPriceOf(networkId: NetworkIdVal, contractAddress: string) {
  const provider = NodeHelper.getAnynetStaticProvider(networkId);
  const depositoryContract = BondDepository__factory.connect(addresses[networkId].BOND_DEPOSITORY, provider);
  const markets = await depositoryContract.liveMarketsFor(contractAddress);
  const marketPriceWei = await depositoryContract.marketPrice(markets[0]);
  const marketPrice = Number(marketPriceWei.toString()) / TOKEN_DECIMALS_TENS;

  return marketPrice;
}

export async function getMarketPriceFromWeth(networkId: NetworkIdVal = DEFAULT_CHAIN_ID) {
  const provider = NodeHelper.getAnynetStaticProvider(networkId);
  // v2 price
  const ohm_weth_address = ohm_weth.getAddressForReserve(networkId);
  const wethBondContract = ohm_weth.getContractForBond(networkId, provider);
  if (!wethBondContract) return 0;
  const pairContract = new ethers.Contract(ohm_weth_address || "", PairContractABI, provider) as PairContract;
  const reserves = await pairContract.getReserves();

  // since we're using OHM/WETH... also need to multiply by weth price;
  const wethPriceBN: BigNumber = await wethBondContract.assetPrice();
  const wethPrice = Number(wethPriceBN.toString()) / Math.pow(10, 8);
  const marketPrice =
    (Number(reserves[1].toString()) / Number(reserves[0].toString()) / TOKEN_DECIMALS_TENS) * wethPrice;
  return marketPrice;
}

export async function getV1MarketPrice(networkId: NetworkIdVal = DEFAULT_CHAIN_ID) {
  const provider = NodeHelper.getAnynetStaticProvider(networkId);
  // v1 price
  const ohm_dai_address = ohm_daiOld.getAddressForReserve(networkId);
  const pairContract = new ethers.Contract(ohm_dai_address || "", PairContractABI, provider) as PairContract;
  const reserves = await pairContract.getReserves();
  const marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / TOKEN_DECIMALS_TENS;
  return marketPrice;
}

/**
 * gets price of token from coingecko
 * @param tokenId STRING taken from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @returns INTEGER usd value
 */
export async function getTokenPrice(
  tokenId: string = TokenStubCoingecko.OHM,
  networkId: NetworkIdVal = DEFAULT_CHAIN_ID,
): Promise<number> {
  if (tokenId == TokenStubCoingecko.OHM) {
    const marketPrice: number = await getMarketPrice(networkId); // note: until CG listing
    console.info(`Token price from getMarketPrice: ${tokenId} = ${marketPrice}`);
    return marketPrice;
  }

  let tokenPrice = 0;
  const priceApiURL = "https://api.olympusdao.finance/api/rest/coingecko_name";
  try {
    throw new Error("OHM API still blocks CORS - skip for now");
    const ohmResp = (await axios.get(`${priceApiURL}/${tokenId}`)) as {
      data: { coingeckoTicker: { value: number } };
    };
    tokenPrice = ohmResp.data.coingeckoTicker.value;
  } catch (e) {
    // console.warn(`Error accessing OHM API ${priceApiURL} . Falling back to coingecko API`, e);
    // fallback to coingecko
    const cgRespRaw = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    const cgResp = cgRespRaw as {
      data: { [id: string]: { usd: number } };
    };
    tokenPrice = cgResp.data[tokenId].usd;
  } finally {
    console.info(`Token price from coingecko: ${tokenId} = ${tokenPrice}`);
    return tokenPrice;
  }
}

/**
 * gets price of token from coingecko
 * @param contractAddress STRING representing address
 * @returns INTEGER usd value
 */
export async function getTokenByContract(contractAddress: string): Promise<number> {
  const downcasedAddress = contractAddress.toLowerCase();
  const chainName = "ethereum";
  try {
    const resp = (await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/${chainName}?contract_addresses=${downcasedAddress}&vs_currencies=usd`,
    )) as {
      data: { [address: string]: { usd: number } };
    };
    const tokenPrice: number = resp.data[downcasedAddress].usd;
    return tokenPrice;
  } catch (e) {
    // console.log("coingecko api error: ", e);
    return 0;
  }
}

export async function getTokenIdByContract(contractAddress: string): Promise<string> {
  try {
    const resp = (await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}'`)) as {
      data: { id: string };
    };
    return resp.data.id;
  } catch (e) {
    // console.log("coingecko api error: ", e);
    return "";
  }
}

export const getEtherscanUrl = ({ bond, networkId }: { bond: IBondV2; networkId: NetworkId }) => {
  return NETWORKS[networkId].blockExplorerUrls[0].replace("#/", "") + `address/${bond.quoteToken}`;
  // switch (networkId) {
  //   case NetworkId.TESTNET_RINKEBY:
  // }
  // return `https://etherscan.io/address/${bond.quoteToken}`;
};

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shortenString(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function formatCurrency(c: number, precision = 0, currency = "USD") {
  if (currency === TokenSymbol.OHM) return `${trim(c, precision)} Ω`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export function trim(number = 0, precision = 0) {
  // why would number ever be undefined??? what are we trimming?
  const array = Number(number).toFixed(8).split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  const poppedNumber = array.pop() || "0";
  array.push(poppedNumber.substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock: number, networkId: NetworkIdVal = DEFAULT_CHAIN_ID) {
  return currentBlock + BLOCKS_PER_EPOCH_MAP[networkId] - (currentBlock % BLOCKS_PER_EPOCH_MAP[networkId]);
}

export function secondsUntilBlock(
  startBlock: number,
  endBlock: number,
  networkId: NetworkIdVal = DEFAULT_CHAIN_ID,
): number {
  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_MAP[networkId];

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock: number, vestingBlock: number) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifyRebaseTimer(seconds: number) {
  return prettifySeconds(seconds) || "any moment";
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

function getSohmTokenImage() {
  return <SvgIcon component={SOhmImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getOhmTokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <SvgIcon component={OhmImg} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "ohm") return getOhmTokenImage();
  if (name === "sohm") return getSohmTokenImage();
}

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts
export function setAll(state: any, properties: any) {
  if (properties) {
    const props = Object.keys(properties);
    props.forEach(key => {
      state[key] = properties[key];
    });
  }
}

export function contractForRedeemHelper({
  networkID,
  provider,
}: {
  networkID: NetworkId;
  provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(
    addresses[networkID].REDEEM_HELPER_ADDRESS as string,
    RedeemHelperABI,
    provider,
  ) as RedeemHelper;
}

/**
 * returns false if SafetyCheck has fired in this Session. True otherwise
 * @returns boolean
 */
export const shouldTriggerSafetyCheck = () => {
  const _storage = window.sessionStorage;
  const _safetyCheckKey = "-oly-safety";
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true");
    return true;
  }
  return false;
};

export const toBN = (num: number) => {
  return BigNumber.from(num);
};

export const bnToNum = (bigNum: BigNumber) => {
  return Number(bigNum.toString());
};

export const handleContractError = (e: any, extra = "?") => {
  if (Error(e).message?.includes("Error: network does not support ENS")) return;
  if (EnvHelper.env.NODE_ENV !== "production") {
    console.warn("caught error in slices; usually network related. extra: ", extra, e);
  }
};

/**
 * Determines if app is viewed within an <iframe></iframe>
 */
export const isIFrame = () => window.location !== window.parent.location;

/**
 * Assertion function helpful for asserting `enabled`
 * values from within a `react-query` function.
 * @param value The value(s) to assert
 * @param queryKey Key of current query
 */
export function queryAssertion(value: unknown, queryKey: any = "not specified"): asserts value {
  if (!value) throw new Error(`Failed react-query assertion for key: ${queryKey}`);
}

/**
 * Assertion function
 */
export function assert(value: unknown, message: string | Error): asserts value {
  if (!value) throw message instanceof Error ? message : new Error(message);
}

/**
 * Converts gOHM to OHM. Mimics `balanceFrom()` gOHM contract function.
 */
export const convertGohmToOhm = (amount: BigNumber, index: BigNumber) => {
  return amount.div(10 ** 9).mul(index);
};

/**
 * Converts OHM to gOHM. Mimics `balanceTo()` gOHM contract function.
 */
export const convertOhmToGohm = (amount: BigNumber, index: BigNumber) => {
  return amount.mul(10 ** 9).div(index);
};

/**
 * Converts a BigNumber to a number
 */
export const parseBigNumber = (value: BigNumber, units: BigNumberish = 9) => {
  return parseFloat(formatUnits(value, units));
};

/**
 * Formats a number to a specified amount of decimals
 */
export const formatNumber = (number: number, precision = 0) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(number);
};

/**
 * Used to build a `useQuery` function for fetching necessary data in parallel for a query,
 * using that queries `queryKey`
 *
 * Please refer to the `useStakePoolTVL` function for an example on why this function is handy.
 */
export const createDependentQuery = (baseQueryKey: QueryKey) => {
  return <TData,>(key: string, fn: () => Promise<TData>, enabled?: boolean) => {
    return useQuery([baseQueryKey, key].filter(Boolean), fn, { enabled }).data;
  };
};

/**
 * Type safe check for non defined values
 */
export function nonNullable<Type>(value: Type): value is NonNullable<Type> {
  return value !== null && value !== undefined;
}

interface ICheckBalance extends IBaseAsyncThunk {
  readonly sOHMbalance: string;
}

export const getGohmBalFromSohm = async ({ provider, networkID, sOHMbalance }: ICheckBalance) => {
  const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
  const formattedGohmBal = await gOhmContract.balanceTo(ethers.utils.parseUnits(sOHMbalance, "gwei").toString());
  return ethers.utils.formatEther(formattedGohmBal);
};
