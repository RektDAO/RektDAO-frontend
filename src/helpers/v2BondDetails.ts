import { OHMTokenStackProps } from "@olympusdao/component-library";
import { ethers } from "ethers";

import { addresses, DEFAULT_CHAIN_ID, NetworkId, TokenStubCoingecko } from "../networkDetails";
import { IERC20__factory, TJGRektWavax__factory, UniswapV2Lp__factory } from "../typechain";
import { getTokenByContract, getTokenPrice } from "./";

const pricingFunctionHelper = async (
  provider: ethers.providers.JsonRpcProvider,
  quoteToken: string,
  firstToken: string,
  secondToken: string,
) => {
  const networkId = provider?.network?.chainId || DEFAULT_CHAIN_ID;
  let lpFactory;
  switch (networkId) {
    case NetworkId.AVALANCHE_TESTNET:
    case NetworkId.AVALANCHE:
      lpFactory = TJGRektWavax__factory;
      break;
    default:
      lpFactory = UniswapV2Lp__factory;
      break;
  }
  const baseContract = lpFactory.connect(quoteToken, provider);
  const reserves = await baseContract.getReserves();
  const totalSupply = +(await baseContract.totalSupply()) / Math.pow(10, await baseContract.decimals());

  const token0Contract = IERC20__factory.connect(await baseContract.token0(), provider);
  const token0Decimals = await token0Contract.decimals();
  const token0Amount = +reserves._reserve0 / Math.pow(10, token0Decimals);
  const token0TotalValue = (await getTokenPrice(firstToken, networkId)) * token0Amount;

  const token1Contract = IERC20__factory.connect(await baseContract.token1(), provider);
  const token1Decimals = await token1Contract.decimals();
  const token1Amount = +reserves._reserve1 / Math.pow(10, token1Decimals);
  const token1TotalValue = (await getTokenPrice(secondToken, networkId)) * token1Amount;

  const totalValue = token0TotalValue + token1TotalValue;
  const valuePerLpToken = totalValue / totalSupply;

  return valuePerLpToken;
};

export interface V2BondDetails {
  name: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  pricingFunction(provider: ethers.providers.JsonRpcProvider, quoteToken: string): Promise<number>;
  isLP: boolean;
  lpUrl: { [key: number]: string };
}

const DaiDetails: V2BondDetails = {
  name: "DAI",
  bondIconSvg: ["DAI"],
  pricingFunction: async () => {
    return getTokenPrice("dai");
  },
  isLP: false,
  lpUrl: {},
};

const FraxDetails: V2BondDetails = {
  name: "FRAX",
  bondIconSvg: ["FRAX"],
  pricingFunction: async () => {
    return 1.0;
  },
  isLP: false,
  lpUrl: {},
};

const EthDetails: V2BondDetails = {
  name: "ETH",
  bondIconSvg: ["wETH"],
  pricingFunction: async () => {
    return getTokenPrice("ethereum");
  },
  isLP: false,
  lpUrl: {},
};

const AvaxDetails: V2BondDetails = {
  name: "WAVAX",
  bondIconSvg: ["AVAX"],
  pricingFunction: async () => {
    return getTokenPrice("avalanche-2");
  },
  isLP: false,
  lpUrl: {},
};

const SavaxDetails: V2BondDetails = {
  name: "SAVAX",
  bondIconSvg: ["AVAX"],
  pricingFunction: async () => {
    return getTokenPrice("benqi-liquid-staked-avax");
  },
  isLP: false,
  lpUrl: {},
};

const XjoeDetails: V2BondDetails = {
  name: "xJOE",
  bondIconSvg: ["placeholder"],
  pricingFunction: async () => {
    return getTokenPrice("joe");
  },
  isLP: false,
  lpUrl: {},
};

const GrtDetails: V2BondDetails = {
  name: "GRT",
  bondIconSvg: ["placeholder"],
  pricingFunction: async () => {
    return getTokenPrice("the-graph");
  },
  isLP: false,
  lpUrl: {},
};

const LinkDetails: V2BondDetails = {
  name: "LINK",
  bondIconSvg: ["placeholder"],
  pricingFunction: async () => {
    return getTokenPrice("chainlink");
  },
  isLP: false,
  lpUrl: {},
};

const CvxDetails: V2BondDetails = {
  name: "CVX",
  bondIconSvg: ["CVX"],
  pricingFunction: async () => {
    return getTokenPrice("convex-finance");
  },
  isLP: false,
  lpUrl: {},
};

const UstDetails: V2BondDetails = {
  name: "UST",
  bondIconSvg: ["UST"],
  pricingFunction: async () => {
    return getTokenByContract("0xa693b19d2931d498c5b318df961919bb4aee87a5");
  },
  isLP: false,
  lpUrl: {},
};

const WbtcDetails: V2BondDetails = {
  name: "wBTC",
  bondIconSvg: ["wBTC"],
  pricingFunction: async () => {
    return getTokenByContract("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599");
  },
  isLP: false,
  lpUrl: {},
};

const RektWavaxDetails: V2BondDetails = {
  name: "REKT-WAVAX LP",
  bondIconSvg: ["OHM", "AVAX"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, TokenStubCoingecko.OHM, "avalanche-2");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.AVALANCHE_TESTNET]:
      "https://traderjoexyz.com/pool/0xB30811b2ABb6B86e253Cf38Dc91E6Efa5705185b/0xd00ae08403b9bbb9124bb305c09058e32c39a48c#/",
    [NetworkId.AVALANCHE]:
      "https://traderjoexyz.com/pool/0xB30811b2ABb6B86e253Cf38Dc91E6Efa5705185b/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7#/",
  },
};

const SRektWavaxDetails: V2BondDetails = {
  name: "sREKT-WAVAX LP",
  bondIconSvg: ["sOHM", "AVAX"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, TokenStubCoingecko.SOHM, "avalanche-2");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.AVALANCHE_TESTNET]:
      "https://traderjoexyz.com/pool/0x4967104a02a2E8eC6b02D95263f26DDa18F9AB41/0xd00ae08403b9bbb9124bb305c09058e32c39a48c#/",
    [NetworkId.AVALANCHE]:
      "https://traderjoexyz.com/pool/0x4967104a02a2E8eC6b02D95263f26DDa18F9AB41/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7#/",
  },
};

const GRektWavaxDetails: V2BondDetails = {
  name: "gREKT-WAVAX LP",
  bondIconSvg: ["wsOHM", "AVAX"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, TokenStubCoingecko.GOHM, "avalanche-2");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.AVALANCHE_TESTNET]:
      "https://traderjoexyz.com/pool/0x3Df307e8E9a897Da488211682430776CDF0f17cC/0xd00ae08403b9bbb9124bb305c09058e32c39a48c#/",
    [NetworkId.AVALANCHE]:
      "https://traderjoexyz.com/pool/0x3Df307e8E9a897Da488211682430776CDF0f17cC/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7#/",
  },
};

const OhmDaiDetails: V2BondDetails = {
  name: "OHM-DAI LP",
  bondIconSvg: ["OHM", "DAI"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, "olympus", "dai");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.TESTNET_RINKEBY]:
      "https://app.sushi.com/add/0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C/0x1e630a578967968eb02EF182a50931307efDa7CF",
    [NetworkId.MAINNET]:
      "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
  },
};

const OhmEthDetails: V2BondDetails = {
  name: "OHM-ETH LP",
  bondIconSvg: ["OHM", "wETH"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, "olympus", "ethereum");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.MAINNET]:
      "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
};

export const UnknownDetails: V2BondDetails = {
  name: "unknown",
  bondIconSvg: ["OHM"],
  pricingFunction: async () => {
    return 1;
  },
  isLP: false,
  lpUrl: "",
};

/**
 * DOWNCASE ALL THE ADDRESSES!!! for comparison purposes
 */
export const v2BondDetails: { [key: number]: { [key: string]: V2BondDetails } } = {
  [NetworkId.LOCAL]: {
    [String(addresses[NetworkId.LOCAL].DAI_ADDRESS).toLowerCase()]: DaiDetails,
    [String(addresses[NetworkId.LOCAL].FRAX_ADDRESS).toLowerCase()]: FraxDetails,
    // ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]: EthDetails,
    [String(addresses[NetworkId.LOCAL].OHM_WETH_LP_ADDRESS).toLowerCase()]: OhmEthDetails,
    [String(addresses[NetworkId.LOCAL].OHM_DAI_LP_ADDRESS).toLowerCase()]: OhmDaiDetails,
  },
  [NetworkId.TESTNET_RINKEBY]: {
    ["0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c"]: DaiDetails,
    ["0x5ed8bd53b0c3fa3deabd345430b1a3a6a4e8bd7c"]: DaiDetails,
    ["0x2f7249cb599139e560f0c81c269ab9b04799e453"]: FraxDetails,
    ["0xc778417e063141139fce010982780140aa0cd5ab"]: EthDetails,
    // ["0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c"]: CvxDetails, // we do not have CVX rinkeby in previous bonds
    ["0x80edbf2f58c7b130df962bb485c28188f6b5ed29"]: OhmDaiDetails,
  },
  [NetworkId.MAINNET]: {
    ["0x6b175474e89094c44da98b954eedeac495271d0f"]: DaiDetails,
    ["0x853d955acef822db058eb8505911ed77f175b99e"]: FraxDetails,
    ["0xa693b19d2931d498c5b318df961919bb4aee87a5"]: UstDetails,
    ["0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"]: WbtcDetails,
    ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]: EthDetails,
    ["0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b"]: CvxDetails,
    ["0x69b81152c5a8d35a67b32a4d3772795d96cae4da"]: OhmEthDetails,
    ["0x055475920a8c93cffb64d039a8205f7acc7722d3"]: OhmDaiDetails,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    [String(addresses[NetworkId.AVALANCHE_TESTNET].DAI_ADDRESS).toLowerCase()]: DaiDetails,
    [String(addresses[NetworkId.AVALANCHE_TESTNET].FRAX_ADDRESS).toLowerCase()]: FraxDetails,
    [String(addresses[NetworkId.AVALANCHE_TESTNET].WAVAX_ADDRESS).toLowerCase()]: AvaxDetails,
    [String(addresses[NetworkId.AVALANCHE_TESTNET].LINK_ADDRESS).toLowerCase()]: LinkDetails,
    [String(addresses[NetworkId.AVALANCHE_TESTNET].REKT_WAVAX_LP_ADDRESS).toLowerCase()]: RektWavaxDetails,
    [String(addresses[NetworkId.AVALANCHE_TESTNET].SREKT_WAVAX_LP_ADDRESS).toLowerCase()]: SRektWavaxDetails,
    [String(addresses[NetworkId.AVALANCHE_TESTNET].GREKT_WAVAX_LP_ADDRESS).toLowerCase()]: GRektWavaxDetails,
  },
  [NetworkId.AVALANCHE]: {
    [String(addresses[NetworkId.AVALANCHE].DAI_ADDRESS).toLowerCase()]: DaiDetails,
    [String(addresses[NetworkId.AVALANCHE].FRAX_ADDRESS).toLowerCase()]: FraxDetails,
    [String(addresses[NetworkId.AVALANCHE].WAVAX_ADDRESS).toLowerCase()]: AvaxDetails,
    [String(addresses[NetworkId.AVALANCHE].SAVAX_ADDRESS).toLowerCase()]: SavaxDetails,
    [String(addresses[NetworkId.AVALANCHE].XJOE_ADDRESS).toLowerCase()]: XjoeDetails,
    [String(addresses[NetworkId.AVALANCHE].GRT_ADDRESS).toLowerCase()]: GrtDetails,
    [String(addresses[NetworkId.AVALANCHE].REKT_WAVAX_LP_ADDRESS).toLowerCase()]: RektWavaxDetails,
    [String(addresses[NetworkId.AVALANCHE].SREKT_WAVAX_LP_ADDRESS).toLowerCase()]: SRektWavaxDetails,
    [String(addresses[NetworkId.AVALANCHE].GREKT_WAVAX_LP_ADDRESS).toLowerCase()]: GRektWavaxDetails,
  },
};
