import { NetworkId } from "src/constants";
import { ExternalPool } from "src/lib/ExternalPool";

export const tj_gohm_wavax_test = new ExternalPool({
  poolName: "gREKT-AVAX (TEST)",
  icons: ["wsOHM", "AVAX"],
  stakeOn: "Trader Joe (Avalanche Testnet)",
  pairGecko: "avalanche-2",
  href: "https://traderjoexyz.com/pool/0x3df307e8e9a897da488211682430776cdf0f17cc/0xd00ae08403b9bbb9124bb305c09058e32c39a48c#/",
  address: "0x41C587c4cb467De9c1BF970BB19f82397F55c2ab",
  masterchef: "0x42069FdaC2d69e0F58A7AB5dC0cA9D5220B8BDF7",
  networkID: NetworkId.AVALANCHE_TESTNET,
});

export const tj_gohm_wavax = new ExternalPool({
  poolName: "gREKT-AVAX",
  icons: ["wsOHM", "AVAX"],
  stakeOn: "Trader Joe (Avalanche)",
  pairGecko: "avalanche-2",
  href: "https://traderjoexyz.com/pool/0x3df307e8e9a897da488211682430776cdf0f17cc/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7#/",
  address: "0x7a6e324a84306b7799d1882a5142310700964eaa",
  masterchef: "0x42069FdaC2d69e0F58A7AB5dC0cA9D5220B8BDF7",
  networkID: NetworkId.AVALANCHE,
});

export const pango_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: ["wsOHM", "AVAX"],
  stakeOn: "Pangolin (Avalanche)",
  pairGecko: "avalanche-2",
  href: "https://app.pangolin.exchange/#/png/0x321E7092a180BB43555132ec53AaA65a5bF84251/AVAX/2",
  address: "0xb68f4e8261a4276336698f5b11dc46396cf07a22",
  masterchef: "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  networkID: NetworkId.AVALANCHE,
});

export const sushi_arb_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["wsOHM", "wETH"],
  stakeOn: "Sushi (Arbitrum)",
  pairGecko: "ethereum",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D",
  masterchef: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  networkID: NetworkId.ARBITRUM,
});

export const sushi_poly_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["wsOHM", "wETH"],
  stakeOn: "Sushi (Polygon)",
  pairGecko: "ethereum",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0x1549e0e8127d380080aab448b82d280433ce4030",
  masterchef: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  networkID: NetworkId.POLYGON,
});

export const spirit_gohm_ftm = new ExternalPool({
  poolName: "gOHM-FTM",
  icons: ["wsOHM", "FANTOM"],
  stakeOn: "Spirit (Fantom)",
  pairGecko: "fantom",
  href: "https://app.spiritswap.finance/#/farms/allfarms",
  address: "0xae9BBa22E87866e48ccAcFf0689AFaa41eB94995",
  masterchef: "0xb3AfA9CB6c53d061bC2263cE15357A691D0D60d4",
  networkID: NetworkId.FANTOM,
});

// export const allPools = [tj_gohm_wavax, pango_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth];
// export const allPools = [tj_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth, spirit_gohm_ftm];
export const allPools = [tj_gohm_wavax_test, tj_gohm_wavax];

export default allPools;
