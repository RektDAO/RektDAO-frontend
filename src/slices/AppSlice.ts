import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { NodeHelper } from "src/helpers/NodeHelper";
import { RootState } from "src/store";

import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { addresses, EPOCHS_PER_DAY, NetworkId, NetworkIdVal, TOKEN_DECIMALS_TENS } from "../constants";
import { getMarketPrice, getTokenPrice, setAll } from "../helpers";
import { IERC20, OlympusStaking__factory, OlympusStakingv2__factory, SOhmv2 } from "../typechain";
import { IBaseAsyncThunk } from "./interfaces";

class ProtocolMetricsClass {
  readonly timestamp: string = "";
  readonly ohmCirculatingSupply: string = "";
  readonly sOhmCirculatingSupply: string = "";
  readonly totalSupply: string = "";
  readonly ohmPrice: string = "";
  readonly marketCap: string = "";
  readonly totalValueLocked: string = "";
  readonly treasuryMarketValue: string = "";
  readonly nextEpochRebase: string = "";
  readonly nextDistributedOhm: string = "";
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProtocolMetrics extends ProtocolMetricsClass {}

type IProtocolMetricsNumbers = Record<keyof IProtocolMetrics, number>;

type ProtocolMetricsKeys = Array<keyof IProtocolMetrics>;
const protocolMetricsKeys: ProtocolMetricsKeys = Object.keys(new ProtocolMetricsClass()) as ProtocolMetricsKeys;

// inspired by: https://github.com/OlympusDAO/olympus-protocol-metrics-subgraph/blob/master/src/utils/ProtocolMetrics.ts
export async function getTokenMetrics(
  networkID: NetworkIdVal,
  provider: ethers.providers.StaticJsonRpcProvider | ethers.providers.JsonRpcProvider,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
) {
  // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
  let marketPrice = 0;
  try {
    const originalPromiseResult = await dispatch(
      loadMarketPrice({ networkID: networkID, provider: provider }),
    ).unwrap();
    marketPrice = Number(originalPromiseResult?.marketPrice);
  } catch (rejectedValueOrSerializedError) {
    // handle error here
    console.error("Returned a null response from dispatch(loadMarketPrice)");
    return;
  }

  const ohmMainContract = new ethers.Contract(addresses[networkID].OHM_V2 as string, ierc20Abi, provider) as IERC20;
  const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_V2 as string, sOHMv2, provider) as SOhmv2;

  const contractDai = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider) as IERC20;

  const balanceDaoWalletOhm =
    Number(await ohmMainContract.balanceOf(addresses[networkID].DAO_TREASURY)) / TOKEN_DECIMALS_TENS;
  const balanceDaoWalletDai =
    Number(await contractDai.balanceOf(addresses[networkID].DAO_TREASURY)) / TOKEN_DECIMALS_TENS;

  const totalSupplyOhm = Number(await ohmMainContract.totalSupply()) / TOKEN_DECIMALS_TENS;
  const totalSupplySOhm = Number(await sohmMainContract.totalSupply()) / TOKEN_DECIMALS_TENS;
  const totalSupply = totalSupplyOhm; // + totalSupplySOhm;
  const circSupplyOhm = totalSupplyOhm - balanceDaoWalletOhm;
  const circSupplySOhm = Number(await sohmMainContract.circulatingSupply()) / TOKEN_DECIMALS_TENS;
  const circSupply = circSupplyOhm; // + circSupplySOhm;
  const marketCap = Number(marketPrice * circSupply);
  const treasuryBalance = balanceDaoWalletDai; // TODO: add to this
  const treasuryMarketValue = treasuryBalance; // TODO
  const circPct = Number(circSupply / totalSupply);

  const stakingTVL = Number(marketPrice * circSupplySOhm);

  const currentBlock = await provider.getBlockNumber();

  const stakingContract = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_V2, provider);
  const stakingContractV1 = addresses[networkID].STAKING_ADDRESS
    ? OlympusStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, provider)
    : null;

  // Calculating staking
  const epoch = await stakingContract.epoch();
  const secondsToEpoch = Number(await stakingContract.secondsToNextEpoch());
  const stakingReward = Number(epoch.distribute.toString()) / TOKEN_DECIMALS_TENS;
  const stakingRebase = stakingReward / circSupplySOhm;
  const fiveDayRate = Math.pow(1 + stakingRebase, 5 * EPOCHS_PER_DAY) - 1;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * EPOCHS_PER_DAY) - 1;

  // Current index
  const currentIndex = await stakingContract.index();
  const currentIndexV1 = stakingContractV1 ? await stakingContractV1.index() : -1;
  const appDetails = {
    currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
    currentIndexV1: ethers.utils.formatUnits(currentIndexV1, "gwei"),
    currentBlock,
    fiveDayRate,
    stakingAPY,
    stakingTVL,
    stakingRebase,
    marketCap,
    marketPrice,
    circSupply,
    totalSupply,
    circSupplyOhm,
    circSupplySOhm,
    totalSupplyOhm,
    totalSupplySOhm,
    treasuryBalance,
    treasuryMarketValue,
    secondsToEpoch,
    // epoch,
  } as IAppData;
  return appDetails;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const protocolMetricsQuery = `
      query {
        _meta {
          block {
            number
          }
        }
        protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
          timestamp
          ohmCirculatingSupply
          sOhmCirculatingSupply
          totalSupply
          ohmPrice
          marketCap
          totalValueLocked
          treasuryMarketValue
          nextEpochRebase
          nextDistributedOhm
        }
      }
    `;

    if (!addresses[networkID].STAKING_V2) {
      provider = NodeHelper.getMainnetStaticProvider();
      networkID = NetworkId.MAINNET;
    }

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL: 0,
        marketPrice: 0,
        marketCap: 0,
        circSupply: 0,
        totalSupply: 0,
        treasuryMarketValue: 0,
        circPct: 0,
      } as IAppData;
    }

    const protocolMetricsMock = Object.fromEntries(protocolMetricsKeys.map(v => [v, 42069])) as IProtocolMetricsNumbers;
    // const graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);
    const graphData = protocolMetricsMock;

    if (!graphData || graphData == null) {
      console.error("Returned a null response when querying TheGraph");
      return;
    }
    const metrics: IProtocolMetricsNumbers = protocolMetricsMock;

    // const marketPrice = parseFloat(metrics.ohmPrice);
    // const circSupply = parseFloat(metrics.ohmCirculatingSupply);
    // const totalSupply = parseFloat(metrics.totalSupply);
    // const marketCap = parseFloat(metrics.marketCap);
    // const treasuryMarketValue = parseFloat(metrics.treasuryMarketValue);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);

    const tokenMetrics = await getTokenMetrics(networkID, provider, dispatch);

    return tokenMetrics as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice from eth mainnet
    marketPrice = await getMarketPrice(networkID);
    // v1MarketPrice = await getV1MarketPrice();
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

export interface IAppData {
  readonly circPct?: number;
  readonly circSupply?: number;
  readonly circSupplyOhm?: number;
  readonly circSupplySOhm?: number;
  readonly currentIndex?: string;
  readonly currentIndexV1?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly totalSupplyOhm?: number;
  readonly totalSupplySOhm?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly secondsToEpoch?: number;
  readonly epoch?: Record<string, number>;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
