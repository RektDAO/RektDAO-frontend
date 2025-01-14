import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";
import polygon from "./assets/tokens/matic.svg";
import ethereum from "./assets/tokens/wETH.svg";
import { addressesLocal, DEFAULT_CHAIN_ID, NetworkId } from "./constantsAddl";
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
    OHM_V2: "0xB30811b2ABb6B86e253Cf38Dc91E6Efa5705185b",
    SOHM_V2: "0x4967104a02a2E8eC6b02D95263f26DDa18F9AB41",
    GOHM_ADDRESS: "0x3Df307e8E9a897Da488211682430776CDF0f17cC",
    GOVERNOR_ADDRESS: "0x5ced075727BE7E9b6E2D1daF787D4336334dBA4d",
    TREASURY_V2: "0x0842dD8c71ebC846605ae896121f619ACD345835",
    MIGRATOR_ADDRESS: "",
    BONDINGCALC_V2: "0x45F67F54967E35CcB4B67d84E2C759F3B899C273",
    STAKING_V2: "0x869C31f878D142a6234426A6A38E9939412b95Bd",
    DISTRIBUTOR_ADDRESS: "0x83Ca667EB76EB047961b770D44EA60887F6078c6",
    BOND_DEPOSITORY: "0xdFc42318C7A63ad024Da35F3Fc5d2FCF46C1199f",
    DAO_TREASURY: "0xF999a8d83DA600bE3c0b7F595EDD1ab82B7AE4e0",
    DAI_ADDRESS: "0xe9a459dF38538b678Bb5E2F00db67388B4365bc7",
    FRAX_ADDRESS: "0x069829A910137B78b42609cf1B742F59b53bD0b1",
    WAVAX_ADDRESS: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    LINK_ADDRESS: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    REKT_WAVAX_LP_ADDRESS: "0x6fdACb6E760489e37d387A8e4F550D27d5F823b7",
    SREKT_WAVAX_LP_ADDRESS: "0x149b4d46057638d588e06f52b6bd738d1741010a",
    GREKT_WAVAX_LP_ADDRESS: "0x41C587c4cb467De9c1BF970BB19f82397F55c2ab",
  },
  [NetworkId.AVALANCHE]: {
    OHM_V2: "0xB30811b2ABb6B86e253Cf38Dc91E6Efa5705185b",
    SOHM_V2: "0x4967104a02a2E8eC6b02D95263f26DDa18F9AB41",
    GOHM_ADDRESS: "0x3Df307e8E9a897Da488211682430776CDF0f17cC",
    GOVERNOR_ADDRESS: "0x5ced075727BE7E9b6E2D1daF787D4336334dBA4d",
    TREASURY_V2: "0x0842dD8c71ebC846605ae896121f619ACD345835",
    MIGRATOR_ADDRESS: "",
    BONDINGCALC_V2: "0x45F67F54967E35CcB4B67d84E2C759F3B899C273",
    STAKING_V2: "0x869C31f878D142a6234426A6A38E9939412b95Bd",
    DISTRIBUTOR_ADDRESS: "0x83Ca667EB76EB047961b770D44EA60887F6078c6",
    BOND_DEPOSITORY: "0xdFc42318C7A63ad024Da35F3Fc5d2FCF46C1199f",
    DAO_TREASURY: "0xF999a8d83DA600bE3c0b7F595EDD1ab82B7AE4e0",
    DAI_ADDRESS: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    FRAX_ADDRESS: "0xd24c2ad096400b6fbcd2ad8b24e7acbc21a1da64",
    WAVAX_ADDRESS: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    SAVAX_ADDRESS: "0x2b2c81e08f1af8835a78bb2a90ae924ace0ea4be",
    XJOE_ADDRESS: "0x57319d41F71E81F3c65F2a47CA4e001EbAFd4F33",
    GRT_ADDRESS: "0x8a0cac13c7da965a312f08ea4229c37869e85cb9",
    REKT_WAVAX_LP_ADDRESS: "0x3512aD610aF7De095B6c9cac8e193a53ca4D8C8c",
    SREKT_WAVAX_LP_ADDRESS: "0x4c08b4a62cd8b1ca47b1beb1a6af80636328ff97",
    GREKT_WAVAX_LP_ADDRESS: "0x7a6e324a84306b7799d1882a5142310700964eaa",
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
export const NEWEST_NETWORK_ID = DEFAULT_CHAIN_ID; // NetworkId.AVALANCHE_TESTNET;

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
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
  [NetworkId.MAINNET]: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
  [NetworkId.TESTNET_RINKEBY]: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
  [NetworkId.ARBITRUM]: {
    dashboard: true,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    dashboard: true,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE]: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: true,
  },
};
