import { t } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber, BigNumberish } from "ethers";
import { NetworkId, TokenSymbol } from "src/constants";
import { convertGohmToOhm, formatNumber, nonNullable, parseBigNumber } from "src/helpers";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

const DECIMAL_PLACES_SHOWN = 4;

const hasVisibleBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && parseBigNumber(balance, units) > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);

const formatBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && formatNumber(parseBigNumber(balance, units), DECIMAL_PLACES_SHOWN);

export const StakeBalances = () => {
  const ohmBalances = useOhmBalance();
  const sohmBalances = useSohmBalance();
  const gohmBalances = useGohmBalance();
  const wsohmBalances = useWsohmBalance();
  const v1sohmBalances = useV1SohmBalance();
  const gohmFuseBalances = useFuseBalance();
  const gohmTokemakBalances = useGohmTokemakBalance();

  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const ohmTokens = [
    ohmBalances[networks.LOCAL]?.data,
    ohmBalances[networks.MAINNET]?.data,
    ohmBalances[networks.ARBITRUM]?.data,
    ohmBalances[networks.AVALANCHE]?.data,
    ohmBalances[networks.FANTOM]?.data,
    ohmBalances[networks.POLYGON]?.data,
  ];
  const totalOhmBalance = ohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));
  const ohmBalancesLoaded = ohmTokens.some(Boolean);

  const sohmTokens = [
    sohmBalances[networks.LOCAL]?.data,
    sohmBalances[networks.MAINNET]?.data,
    sohmBalances[networks.ARBITRUM]?.data,
    sohmBalances[networks.AVALANCHE]?.data,
    sohmBalances[networks.FANTOM]?.data,
    sohmBalances[networks.POLYGON]?.data,
    // v1sohmBalances[networks.MAINNET]?.data,
  ];
  const totalSohmBalance = sohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const gohmTokens = [
    gohmBalances[networks.LOCAL]?.data,
    gohmBalances[networks.MAINNET]?.data,
    gohmBalances[networks.ARBITRUM]?.data,
    gohmBalances[networks.AVALANCHE]?.data,
    gohmBalances[networks.FANTOM]?.data,
    gohmBalances[networks.POLYGON]?.data,
    // wsohmBalances[NetworkId.MAINNET]?.data,
    // wsohmBalances[NetworkId.ARBITRUM]?.data,
    // wsohmBalances[NetworkId.AVALANCHE]?.data,
    // gohmFuseBalances[NetworkId.MAINNET]?.data,
    // gohmTokemakBalances[NetworkId.MAINNET]?.data,
  ];
  const totalGohmBalance = gohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const totalStakedBalance = currentIndex
    ? formatBalance(totalSohmBalance.mul(10 ** 9).add(convertGohmToOhm(totalGohmBalance, currentIndex)), 18)
    : BigNumber.from(0);

  const allBalancesLoaded = sohmTokens.some(Boolean) && gohmTokens.some(Boolean);

  return (
    <>
      <DataRow
        id="user-balance"
        title={t`Unstaked Balance`}
        isLoading={!ohmBalancesLoaded}
        balance={`${formatBalance(totalOhmBalance)} ${TokenSymbol.OHM}`}
      />

      <Accordion className="stake-accordion" square defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
          <DataRow
            id="user-staked-balance"
            isLoading={!allBalancesLoaded}
            title={t`Total Staked Balance`}
            balance={`${totalStakedBalance} ${TokenSymbol.SOHM}`}
          />
        </AccordionSummary>

        <AccordionDetails>
          {hasVisibleBalance(v1sohmBalances[networks.MAINNET]?.data) && (
            <DataRow
              indented
              title={`${TokenSymbol.SOHM} (Mainnet)`}
              id="user-staked-balance"
              isLoading={!sohmBalances[networks.MAINNET]?.data}
              balance={`${formatBalance(sohmBalances[networks.MAINNET]?.data)} ${TokenSymbol.SOHM}`}
            />
          )}

          {hasVisibleBalance(gohmBalances[networks.ARBITRUM]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Mainnet)`}
              isLoading={!gohmBalances[networks.MAINNET]?.data}
              balance={`${formatBalance(gohmBalances[networks.MAINNET]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(gohmBalances[networks.ARBITRUM]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Arbitrum)`}
              isLoading={!gohmBalances[networks.ARBITRUM]?.data}
              balance={`${formatBalance(gohmBalances[networks.ARBITRUM]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(gohmBalances[networks.AVALANCHE]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Avalanche)`}
              isLoading={!gohmBalances[networks.AVALANCHE]?.data}
              balance={`${formatBalance(gohmBalances[networks.AVALANCHE]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(gohmBalances[networks.POLYGON]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Polygon)`}
              isLoading={!gohmBalances[networks.POLYGON]?.data}
              balance={`${formatBalance(gohmBalances[networks.POLYGON]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(gohmBalances[networks.FANTOM]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Fantom)`}
              isLoading={!gohmBalances[networks.FANTOM]?.data}
              balance={`${formatBalance(gohmBalances[networks.FANTOM]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(gohmTokemakBalances[NetworkId.MAINNET]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Tokemak)`}
              isLoading={!gohmTokemakBalances[NetworkId.MAINNET]?.data}
              balance={`${formatBalance(gohmTokemakBalances[NetworkId.MAINNET]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(gohmFuseBalances[NetworkId.MAINNET]?.data, 18) && (
            <DataRow
              indented
              title={`${TokenSymbol.GOHM} (Fuse)`}
              isLoading={!gohmFuseBalances[NetworkId.MAINNET]?.data}
              balance={`${formatBalance(gohmFuseBalances[NetworkId.MAINNET]?.data, 18)} ${TokenSymbol.GOHM}`}
            />
          )}

          {hasVisibleBalance(v1sohmBalances[networks.MAINNET]?.data) && (
            <DataRow
              indented
              title={t`sOHM (v1)`}
              isLoading={!v1sohmBalances[networks.MAINNET]?.data}
              balance={`${formatBalance(v1sohmBalances[networks.MAINNET]?.data)} sOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[networks.MAINNET]?.data, 18) && (
            <DataRow
              indented
              title={t`wsOHM`}
              isLoading={!wsohmBalances[networks.MAINNET]?.data}
              balance={`${formatBalance(wsohmBalances[networks.MAINNET]?.data, 18)} wsOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[NetworkId.ARBITRUM]?.data, 18) && (
            <DataRow
              indented
              title={t`wsOHM (Arbitrum)`}
              isLoading={!wsohmBalances[NetworkId.ARBITRUM]?.data}
              balance={`${formatBalance(wsohmBalances[NetworkId.ARBITRUM]?.data, 18)} wsOHM`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[NetworkId.AVALANCHE]?.data, 18) && (
            <DataRow
              indented
              title={t`wsOHM (Avalanche)`}
              isLoading={!wsohmBalances[NetworkId.AVALANCHE]?.data}
              balance={`${formatBalance(wsohmBalances[NetworkId.AVALANCHE]?.data, 18)} wsOHM`}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
