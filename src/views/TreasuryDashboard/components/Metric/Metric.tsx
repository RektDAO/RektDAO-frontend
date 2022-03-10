import { t } from "@lingui/macro";
import { Metric } from "@olympusdao/component-library";
import { TokenSymbol } from "src/constants";
import { STAKING_CONTRACT_DECIMALS } from "src/constants/decimals";
import { formatCurrency, formatNumber, parseBigNumber } from "src/helpers";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import {
  useMarketCap,
  useOhmCirculatingSupply,
  useTotalSupply,
  useTotalValueDeposited,
  useTreasuryMarketValue,
  useTreasuryTotalBacking,
} from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";

type MetricProps = PropsOf<typeof Metric>;
type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps> = props => {
  const { data: marketCap } = useMarketCap();

  const _props: MetricProps = {
    ...props,
    label: t`Market Cap`,
  };

  if (marketCap) _props.metric = formatCurrency(marketCap, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const OHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: `${TokenSymbol.OHM} Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CircSupply: React.FC<AbstractedMetricProps> = props => {
  const { data: circSupply } = useOhmCirculatingSupply();
  const { data: totalSupply } = useTotalSupply();

  const _props: MetricProps = {
    ...props,
    label: t`Circulating Supply (total)`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerOHM: React.FC<AbstractedMetricProps> = props => {
  const { data: circSupply } = useOhmCirculatingSupply();
  const { data: treasuryValue } = useTreasuryMarketValue();
  const { data: treasuryBacking } = useTreasuryTotalBacking();

  const _props: MetricProps = {
    ...props,
    label: `Backing per ${TokenSymbol.OHM}` + "\n\n" + t`(total / liquid)`,
    tooltip:
      `Total Treasury MV backing is the total USD budget the Treasury has per ${TokenSymbol.OHM} to spend on all market operations (LP, swaps, revenue generation, bonds and inverse bonds, etc).` +
      "\n\n" +
      `Liquid Treasury Backing does not include LP ${TokenSymbol.OHM}, locked assets, or reserves used for RFV backing. It represents the budget the Treasury has for specific market operations which cannot use ${TokenSymbol.OHM} (inverse bonds, some liquidity provision, ${TokenSymbol.OHM} incentives, etc)
    `,
  };

  if (treasuryValue && circSupply && treasuryBacking)
    _props.metric = `${formatCurrency(treasuryValue / circSupply, 2)} / ${formatCurrency(
      treasuryBacking / circSupply,
      2,
    )}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CurrentIndex: React.FC<AbstractedMetricProps> = props => {
  const { data: currentIndex } = useCurrentIndex();

  const _props: MetricProps = {
    ...props,
    label: t`Current Index`,
    tooltip: `The current index tracks the amount of ${TokenSymbol.SOHM} accumulated since the beginning of staking. Basically, how much ${TokenSymbol.SOHM} one would have if they staked and held 1 ${TokenSymbol.OHM} from launch.`,
  };

  if (currentIndex)
    _props.metric = `${parseBigNumber(currentIndex, STAKING_CONTRACT_DECIMALS).toFixed(2)} ${TokenSymbol.SOHM}`;
  else _props.isLoading = true;

  if (currentIndex) {
    _props.tooltip += ` (${parseBigNumber(currentIndex, STAKING_CONTRACT_DECIMALS).toFixed(9)})`;
  }

  return <Metric {..._props} />;
};

export const GOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: gOhmPrice } = useGohmPrice();

  const _props: MetricProps = {
    ...props,
    label: `${TokenSymbol.GOHM} Price`,
    tooltip:
      `${TokenSymbol.GOHM} = ${TokenSymbol.SOHM} * index` +
      "\n\n" +
      `The price of ${TokenSymbol.GOHM} is equal to the price of ${TokenSymbol.OHM} multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps> = props => {
  const { data: totalValueDeposited } = useTotalValueDeposited();

  const _props: MetricProps = {
    ...props,
    label: t`Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else if (totalValueDeposited !== undefined) _props.metric = t`Coming Soon`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const StakingAPY: React.FC<AbstractedMetricProps> = props => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const _props: MetricProps = {
    ...props,
    label: t`APY`,
  };

  if (rebaseRate) {
    const apy = (Math.pow(1 + rebaseRate, 365 * 3) - 1) * 100;
    const formatted = formatNumber(apy, 1);

    _props.metric = `${formatted}%`;
  } else if (rebaseRate !== undefined) _props.metric = t`Coming Soon`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};
