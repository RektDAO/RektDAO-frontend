import { NetworkId } from "src/networkDetails";

import { useWeb3Context } from ".";

const getTestnet = <TTargetNetwork extends NetworkId, TTestNetwork extends NetworkId>(
  targetNetwork: TTargetNetwork,
  testNetwork: TTestNetwork,
  currentNetwork: NetworkId,
): TTargetNetwork | TTestNetwork => {
  return currentNetwork === testNetwork ? testNetwork : targetNetwork;
};

export const useTestableNetworks = () => {
  const { networkId } = useWeb3Context();

  return {
    LOCAL: NetworkId.LOCAL,
    MAINNET: getTestnet(NetworkId.MAINNET, NetworkId.TESTNET_RINKEBY, networkId),
    ARBITRUM: getTestnet(NetworkId.ARBITRUM, NetworkId.ARBITRUM_TESTNET, networkId),
    AVALANCHE: getTestnet(NetworkId.AVALANCHE, NetworkId.AVALANCHE_TESTNET, networkId),
    FANTOM: getTestnet(NetworkId.FANTOM, NetworkId.FANTOM_TESTNET, networkId),
    POLYGON: getTestnet(NetworkId.POLYGON, NetworkId.POLYGON_TESTNET, networkId),
    // TODO: ADD MORE
  };
};
