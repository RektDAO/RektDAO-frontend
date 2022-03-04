import { useQuery } from "react-query";
import { useAppDispatch, useWeb3Context } from "src/hooks";
import apollo from "src/lib/apolloClient";
import { getTokenMetrics, IAppData } from "src/slices/AppSlice";

const query = `
  query ProtcolMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      runway5k
      timestamp
      ohmPrice
      runway10k
      runway20k
      runway50k
      marketCap
      currentAPY
      totalSupply
      runway7dot5k
      runway2dot5k
      runwayCurrent
      nextEpochRebase
      totalValueLocked
      treasuryOhmDaiPOL
      treasuryOhmFraxPOL
      nextDistributedOhm
      treasuryMarketValue
      treasuryTotalBacking
      ohmCirculatingSupply
      sOhmCirculatingSupply
      treasuryRiskFreeValue
      treasuryDaiMarketValue
      treasuryUstMarketValue
      treasuryFraxMarketValue
      treasuryWETHMarketValue
      treasuryLusdMarketValue
      treasuryWBTCMarketValue
      treasuryDaiRiskFreeValue
      treasuryOtherMarketValue
      treasuryLusdRiskFreeValue
      treasuryXsushiMarketValue
      treasuryFraxRiskFreeValue
    }
  }
`;

class ProtocolMetricsClass {
  id = "";
  runway5k = "";
  timestamp = "";
  ohmPrice = "";
  runway10k = "";
  runway20k = "";
  runway50k = "";
  marketCap = "";
  currentAPY = "";
  totalSupply = "";
  runway7dot5k = "";
  runway2dot5k = "";
  runwayCurrent = "";
  nextEpochRebase = "";
  totalValueLocked = "";
  treasuryOhmDaiPOL = "";
  treasuryOhmFraxPOL = "";
  nextDistributedOhm = "";
  treasuryMarketValue = "";
  treasuryTotalBacking = "";
  circSupply = "";
  ohmCirculatingSupply = "";
  sOhmCirculatingSupply = "";
  stakingRebase = "";
  treasuryRiskFreeValue = "";
  treasuryDaiMarketValue = "";
  treasuryUstMarketValue = "";
  treasuryFraxMarketValue = "";
  treasuryWETHMarketValue = "";
  treasuryLusdMarketValue = "";
  treasuryWBTCMarketValue = "";
  treasuryDaiRiskFreeValue = "";
  treasuryOtherMarketValue = "";
  treasuryLusdRiskFreeValue = "";
  treasuryXsushiMarketValue = "";
  treasuryFraxRiskFreeValue = "";
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ProtocolMetrics extends ProtocolMetricsClass {}

type ProtocolMetricsNumbers = Record<keyof ProtocolMetrics, number>;

type ProtocolMetricsKeys = Array<keyof ProtocolMetrics>;
const protocolMetricsKeys: ProtocolMetricsKeys = Object.keys(new ProtocolMetricsClass()) as ProtocolMetricsKeys;

export const protocolMetricsQueryKey = () => ["useProtocolMetrics"];

export const useProtocolMetrics = <TSelectData = unknown>(select: (data: ProtocolMetricsNumbers[]) => TSelectData) => {
  const { networkId: networkID, provider } = useWeb3Context();
  const dispatch = useAppDispatch();
  return useQuery<ProtocolMetricsNumbers[], Error, TSelectData>(
    protocolMetricsQueryKey(),
    async () => {
      const tokenMetrics = (await getTokenMetrics(networkID, provider, dispatch)) as IAppData;
      const marketPrice = Number(tokenMetrics.marketPrice);
      const marketCap = Number(tokenMetrics.marketCap);
      const circSupply = Number(tokenMetrics.circSupply);
      const totalSupply = Number(tokenMetrics.totalSupply);
      const circSupplyOhm = Number(tokenMetrics.circSupplyOhm);
      const circSupplySOhm = Number(tokenMetrics.circSupplySOhm);
      const stakingRebase = Number(tokenMetrics.stakingRebase);
      const stakingTVL = Number(tokenMetrics.stakingTVL);
      const treasuryBalance = Number(tokenMetrics.treasuryBalance);
      const treasuryMarketValue = Number(tokenMetrics.treasuryMarketValue);
      const treasuryRiskFreeValue = treasuryMarketValue;
      const treasuryOhmDaiPOL = 100;
      const epoch = tokenMetrics.epoch;

      const treasuryRunway = Number.parseFloat(String(treasuryRiskFreeValue / totalSupply));
      const runwayCurrent = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

      const protocolMetricsMock = Object.fromEntries(
        protocolMetricsKeys.map(v => [v, 42069]),
      ) as ProtocolMetricsNumbers;
      protocolMetricsMock.ohmPrice = marketPrice;
      protocolMetricsMock.marketCap = marketCap;
      protocolMetricsMock.circSupply = circSupply; // circSupply == circSupplyOhm + circSupplySOhm
      protocolMetricsMock.totalSupply = totalSupply;
      protocolMetricsMock.stakingRebase = stakingRebase;
      protocolMetricsMock.totalValueLocked = stakingTVL;
      protocolMetricsMock.treasuryMarketValue = treasuryMarketValue;
      protocolMetricsMock.treasuryRiskFreeValue = treasuryRiskFreeValue;
      protocolMetricsMock.treasuryTotalBacking = treasuryMarketValue; // TODO: treasuryTotalBacking;
      protocolMetricsMock.treasuryOhmDaiPOL = treasuryOhmDaiPOL;
      protocolMetricsMock.runwayCurrent = runwayCurrent;
      protocolMetricsMock.ohmCirculatingSupply = circSupplyOhm;
      protocolMetricsMock.sOhmCirculatingSupply = circSupplySOhm;
      return [protocolMetricsMock];

      const response = await apollo<{ protocolMetrics: ProtocolMetrics[] }>(query);

      if (!response) throw new Error("No response from TheGraph");

      // Convert all strings to numbers
      // return response.data.protocolMetrics.map(metric =>
      //   Object.entries(metric).reduce(
      //     (obj, [key, value]) => Object.assign(obj, { [key]: parseFloat(value) }),
      //     {} as ProtocolMetricsNumbers,
      //   ),
      // );
    },
    { select },
  );
};

export const useMarketCap = () => useProtocolMetrics(metrics => metrics[0].marketCap);
export const useTotalSupply = () => useProtocolMetrics(metrics => metrics[0].totalSupply);
export const useTotalValueDeposited = () => useProtocolMetrics(metrics => metrics[0].totalValueLocked);
export const useTreasuryMarketValue = () => useProtocolMetrics(metrics => metrics[0].treasuryMarketValue);
export const useTreasuryTotalBacking = () => useProtocolMetrics(metrics => metrics[0].treasuryTotalBacking);
export const useOhmCirculatingSupply = () => useProtocolMetrics(metrics => metrics[0].ohmCirculatingSupply);
