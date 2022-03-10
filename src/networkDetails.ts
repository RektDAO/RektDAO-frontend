import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";
import polygon from "./assets/tokens/matic.svg";
import ethereum from "./assets/tokens/wETH.svg";
import { addressesLocal, NetworkId } from "./constantsAddl";
import { EnvHelper } from "./helpers/Environment";
import { NodeHelper } from "./helpers/NodeHelper";

export * from "./constantsAddl";

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  [NetworkId.LOCAL]: addressesLocal,
  [NetworkId.TESTNET_RINKEBY]: {},
  [NetworkId.MAINNET]: {},
  [NetworkId.ARBITRUM_TESTNET]: {},
  [NetworkId.ARBITRUM]: {},
  [NetworkId.AVALANCHE_TESTNET]: {
    OHM_V2: "0xA389cD10d0c6339B74F8E233276EdEcC38cB7D54",
    SOHM_V2: "0xA046D7354e05CB472c063AAc0E4D283300BCf1dE",
    GOHM_ADDRESS: "0x58D2DaDAb3167Fb27B7e09454e7951615Fd8F4dA",
    GOVERNOR_ADDRESS: "0x5E016927Be86b86a67f0B95978bD99e9EB655B14",
    TREASURY_V2: "0x33684Dcc15FeAf3d12CF6266E6dFDb7c3ceB0913",
    MIGRATOR_ADDRESS: "",
    BONDINGCALC_V2: "0xfD7f578Eb90E130FF267AC24F59883f454f34f13",
    STAKING_V2: "0x69f6673A7f6f71c74B0d3B731dB493ae49030966",
    DISTRIBUTOR_ADDRESS: "0x719742D07BDCA1B31d4E9f260cFC544373d311d4",
    BOND_DEPOSITORY: "0xcd49822d799B4A10aBbE98E71c8b76ff335Ba89C",
    DAI_ADDRESS: "0x9B52F39D42bCDcb34D29Ec0e21960C139A5Da62A",
    FRAX_ADDRESS: "0x7464Ad5827a730014199b80345117022f533FA30",
    DAO_TREASURY: "0x36F52AE8fFEbf44bd4d10DcF39981Bb065892197",
    RESERVETOKEN1_ADDRESS: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    RESERVETOKEN2_ADDRESS: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  },
  [NetworkId.AVALANCHE]: {
    OHM_V2: "",
    SOHM_V2: "",
    GOHM_ADDRESS: "",
    GOVERNOR_ADDRESS: "",
    TREASURY_V2: "",
    MIGRATOR_ADDRESS: "",
    BONDINGCALC_V2: "",
    STAKING_V2: "",
    DISTRIBUTOR_ADDRESS: "",
    BOND_DEPOSITORY: "",
    DAI_ADDRESS: "",
    FRAX_ADDRESS: "",
    DAO_TREASURY: "",
    RESERVETOKEN1_ADDRESS: "",
    RESERVETOKEN2_ADDRESS: "",
  },
  [NetworkId.POLYGON_TESTNET]: {},
  [NetworkId.POLYGON]: {},
  [NetworkId.FANTOM_TESTNET]: {},
  [NetworkId.FANTOM]: {},
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: SVGImageElement | string;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
export const USER_SELECTABLE_NETWORKS = [NetworkId.LOCAL, NetworkId.AVALANCHE_TESTNET, NetworkId.AVALANCHE];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = NetworkId.AVALANCHE_TESTNET;

export const NETWORKS: { [key: number]: INetwork } = {
  [NetworkId.LOCAL]: {
    chainName: "Local",
    chainId: NetworkId.LOCAL,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.LOCAL),
  },
  [NetworkId.MAINNET]: {
    chainName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.MAINNET),
  },
  [NetworkId.TESTNET_RINKEBY]: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.TESTNET_RINKEBY),
  },
  [NetworkId.ARBITRUM]: {
    chainName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.ARBITRUM),
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    chainName: "Arbitrum Testnet",
    chainId: 421611,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    // uri: () => EnvHelper.alchemyAvalancheTestnetURI,
    uri: () => NodeHelper.getMainnetURI(NetworkId.AVALANCHE_TESTNET),
  },
  [NetworkId.AVALANCHE]: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    // blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
    blockExplorerUrls: ["https://snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.AVALANCHE),
  },
  [NetworkId.POLYGON]: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.POLYGON),
  },
  [NetworkId.POLYGON_TESTNET]: {
    chainName: "Polygon Mumbai Testnet",
    chainId: 80001,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => "", // NodeHelper.getMainnetURI(NetworkId.POLYGON_TESTNET),
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view

interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
  bondsV2: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  [NetworkId.LOCAL]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
  [NetworkId.MAINNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.TESTNET_RINKEBY]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.ARBITRUM]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
};
