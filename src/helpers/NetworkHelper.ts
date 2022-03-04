import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import { NetworkId, NETWORKS } from "../constants";
import { EnvHelper } from "../helpers/Environment";
import { NodeHelper } from "../helpers/NodeHelper";

interface IGetCurrentNetwork {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const initNetworkFunc = async ({ provider }: IGetCurrentNetwork) => {
  try {
    let networkName: string;
    let uri: string;
    let supported = true;
    const id: number = await provider.getNetwork().then(network => network.chainId);
    switch (id) {
      case NetworkId.LOCAL:
        networkName = NETWORKS[id].chainName;
        uri = NodeHelper.getMainnetURI(id);
        break;
      case NetworkId.MAINNET:
        networkName = NETWORKS[id].chainName;
        uri = NodeHelper.getMainnetURI(id);
        break;
      case NetworkId.TESTNET_RINKEBY:
        networkName = NETWORKS[id].chainName;
        uri = NodeHelper.getMainnetURI(id);
        break;
      case NetworkId.ARBITRUM:
        networkName = NETWORKS[id].chainName;
        uri = NodeHelper.getMainnetURI(id);
        break;
      case NetworkId.ARBITRUM_TESTNET:
        networkName = NETWORKS[id].chainName;
        uri = EnvHelper.alchemyArbitrumTestnetURI;
        break;
      case NetworkId.AVALANCHE_TESTNET:
        networkName = NETWORKS[id].chainName;
        uri = EnvHelper.alchemyAvalancheTestnetURI;
        break;
      case NetworkId.AVALANCHE:
        networkName = NETWORKS[id].chainName;
        uri = NodeHelper.getMainnetURI(id);
        break;
      default:
        supported = false;
        networkName = "Unsupported Network";
        uri = "";
        break;
    }

    return {
      networkId: id,
      networkName: networkName,
      uri: uri,
      initialized: supported,
    };
  } catch (e) {
    console.log(e);
    return {
      networkId: -1,
      networkName: "",
      uri: "",
      initialized: false,
    };
  }
};

interface ISwitchNetwork {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkId: number;
}

export const switchNetwork = async ({ provider, networkId }: ISwitchNetwork) => {
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId: idToHexString(networkId) }]);
  } catch (e) {
    // If the chain has not been added to the user's wallet
    // @ts-ignore
    if (e.code === 4902) {
      const network = NETWORKS[networkId];
      const params = [
        {
          chainId: idToHexString(networkId),
          chainName: network["chainName"],
          nativeCurrency: network["nativeCurrency"],
          rpcUrls: network["rpcUrls"],
          blockExplorerUrls: network["blockExplorerUrls"],
        },
      ];

      try {
        await provider.send("wallet_addEthereumChain", params);
      } catch (e) {
        console.log(e);
        // dispatch(error("Error switching network!"));
      }
    }
    // }
  }
};

export const idToHexString = (id: number) => {
  return "0x" + id.toString(16);
};

export const idFromHexString = (hexString: string) => {
  return parseInt(hexString, 16);
};
