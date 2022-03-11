import "../Stake/Stake.scss";

import { t } from "@lingui/macro";
import { Box, Button, Divider, FormControl, Grid, Link, MenuItem, Select, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DataRow, Icon, InputWrapper, Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { FC, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";

import { APP_URL_ROOT, NetworkId, NETWORKS, TokenSymbol } from "../../constants";
import { formatCurrency, trim } from "../../helpers";
import { switchNetwork } from "../../helpers/NetworkHelper";
import { changeApproval, changeWrapV2 } from "../../slices/WrapThunk";
import WrapCrossChain from "./WrapCrossChain";

const Wrap: FC = () => {
  const dispatch = useDispatch();
  const { provider, address, connect, networkId } = useWeb3Context();

  const [, setZoomed] = useState<boolean>(false);
  const [assetFrom, setAssetFrom] = useState<string>(TokenSymbol.SOHM);
  const [assetTo, setAssetTo] = useState<string>(TokenSymbol.GOHM);
  const [quantity, setQuantity] = useState<string>("");

  const chooseCurrentAction = () => {
    if (assetFrom === TokenSymbol.SOHM) return "Wrap from";
    if (assetTo === TokenSymbol.SOHM) return "Unwrap from";
    return "Transform";
  };
  const currentAction = chooseCurrentAction();

  const isAppLoading = useAppSelector(state => state.app.loading);
  const currentIndex = useAppSelector(state => Number(state.app.currentIndex));
  const sOhmPrice = useAppSelector(state => Number(state.app.marketPrice));

  const gOhmPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex));
  const sohmBalance = useAppSelector(state => state.account.balances && state.account.balances.sohm);
  const gohmBalance = useAppSelector(state => state.account.balances && state.account.balances.gohm);
  const unwrapGohmAllowance = useAppSelector(state => state.account.wrapping && state.account.wrapping.gOhmUnwrap);
  const wrapSohmAllowance = useAppSelector(state => state.account.wrapping && state.account.wrapping.sohmWrap);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const avax = NETWORKS[NetworkId.AVALANCHE];
  const arbitrum = NETWORKS[NetworkId.ARBITRUM];

  const isAvax = useMemo(() => {
    return networkId != NetworkId.MAINNET && networkId != NetworkId.TESTNET_RINKEBY && networkId != -1;
  }, [networkId]);

  const wrapButtonText =
    assetTo === TokenSymbol.GOHM
      ? (assetFrom === "wsOHM" ? "Migrate" : "Wrap") + ` to ${TokenSymbol.GOHM}`
      : `${currentAction} ${assetFrom}`;

  const setMax = () => {
    if (assetFrom === TokenSymbol.SOHM) setQuantity(sohmBalance);
    if (assetFrom === TokenSymbol.GOHM) setQuantity(gohmBalance);
  };

  const handleSwitchChain = (id: number) => {
    return () => {
      switchNetwork({ provider: provider, networkId: id });
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    if (assetFrom === TokenSymbol.SOHM && assetTo === TokenSymbol.GOHM) return wrapSohmAllowance > Number(sohmBalance);
    if (assetFrom === TokenSymbol.GOHM && assetTo === TokenSymbol.SOHM)
      return unwrapGohmAllowance > Number(gohmBalance);

    return 0;
  }, [unwrapGohmAllowance, wrapSohmAllowance, assetTo, assetFrom, sohmBalance, gohmBalance]);

  // @ts-ignore
  const isAllowanceDataLoading = currentAction === "Unwrap";

  const temporaryStore = assetTo;

  const changeAsset = () => {
    setQuantity("");
    setAssetTo(assetFrom);
    setAssetFrom(temporaryStore);
  };

  const approveWrap = (token: string) => {
    dispatch(changeApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
  };

  const unwrapGohm = () => {
    dispatch(changeWrapV2({ action: "unwrap", value: quantity, provider, address, networkID: networkId }));
  };

  const wrapSohm = () => {
    dispatch(changeWrapV2({ action: "wrap", value: quantity, provider, address, networkID: networkId }));
  };

  const approveCorrectToken = () => {
    if (assetFrom === TokenSymbol.SOHM && assetTo === TokenSymbol.GOHM) approveWrap(TokenSymbol.SOHM);
    if (assetFrom === TokenSymbol.GOHM && assetTo === TokenSymbol.SOHM) approveWrap(TokenSymbol.GOHM);
  };

  const chooseCorrectWrappingFunction = () => {
    if (assetFrom === TokenSymbol.SOHM && assetTo === TokenSymbol.GOHM) wrapSohm();
    if (assetFrom === TokenSymbol.GOHM && assetTo === TokenSymbol.SOHM) unwrapGohm();
  };

  const chooseInputArea = () => {
    if (!address || isAllowanceDataLoading) return <Skeleton width="150px" />;
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance() && assetTo === TokenSymbol.GOHM)
      return (
        <div className="no-input-visible">
          First time wrapping to <b>{TokenSymbol.GOHM}</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for this transaction.
        </div>
      );
    else if (!hasCorrectAllowance() && assetTo === TokenSymbol.SOHM)
      return (
        <div className="no-input-visible">
          First time unwrapping <b>{assetFrom}</b>?
          <br />
          Please approve Olympus to use your <b>{assetFrom}</b> for unwrapping.
        </div>
      );

    return (
      <InputWrapper
        id="amount-input"
        type="number"
        placeholder={t`Enter an amount`}
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        label=""
        labelWidth={0}
        endString={t`Max`}
        endStringOnClick={setMax}
        disabled={isPendingTxn(pendingTransactions, "wrapping") || isPendingTxn(pendingTransactions, "migrate")}
        buttonOnClick={chooseCorrectWrappingFunction}
        buttonText={txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
      />
    );
  };

  const chooseButtonArea = () => {
    if (!address) return "";
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance())
      return (
        <Button
          className="stake-button wrap-page"
          variant="contained"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "approve_wrapping") ||
            isPendingTxn(pendingTransactions, "approve_migration")
          }
          onClick={approveCorrectToken}
        >
          {txnButtonTextMultiType(pendingTransactions, ["approve_wrapping", "approve_migration"], "Approve")}
        </Button>
      );
  };

  if (!isAvax) {
    return (
      <div id="stake-view" className="wrapper">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper
            headerText={t`Wrap / Unwrap`}
            topRight={
              <Link
                className="migrate-sohm-button"
                style={{ textDecoration: "none" }}
                href={
                  assetTo === "wsOHM"
                    ? `https://docs.${APP_URL_ROOT}/main/contracts/tokens#wsohm`
                    : `https://docs.${APP_URL_ROOT}/main/contracts/tokens#gohm`
                }
                aria-label="wsohm-wut"
                target="_blank"
              >
                <Typography>{TokenSymbol.GOHM}</Typography> <Icon style={{ marginLeft: "5px" }} name="arrow-up" />
              </Link>
            }
          >
            <Grid item style={{ padding: "0 0 2rem 0" }}>
              <MetricCollection>
                <Metric
                  label={`${TokenSymbol.SOHM} ${t`Price`}`}
                  metric={formatCurrency(sOhmPrice, 2)}
                  isLoading={sOhmPrice ? false : true}
                />
                <Metric
                  label={t`Current Index`}
                  metric={`${trim(currentIndex, 2)} ${TokenSymbol.OHM}`}
                  isLoading={currentIndex ? false : true}
                  tooltip={String(currentIndex)}
                />
                <Metric
                  label={`${TokenSymbol.GOHM} ${t`Price`}`}
                  metric={formatCurrency(gOhmPrice, 2)}
                  isLoading={gOhmPrice ? false : true}
                  tooltip={`${TokenSymbol.GOHM} = ${TokenSymbol.SOHM} * index\n\nThe price of ${TokenSymbol.GOHM} is equal to the price of ${TokenSymbol.SOHM} multiplied by the current index`}
                />
              </MetricCollection>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <ConnectButton />
                  </div>
                  <Typography variant="h6">Connect your wallet</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <>
                        <Typography>
                          <span className="asset-select-label" style={{ whiteSpace: "nowrap" }}>
                            {currentAction}
                          </span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={assetFrom}
                            label="Asset"
                            onChange={changeAsset}
                            disableUnderline
                          >
                            <MenuItem value={TokenSymbol.SOHM}>{TokenSymbol.SOHM}</MenuItem>
                            <MenuItem value={TokenSymbol.GOHM}>{TokenSymbol.GOHM}</MenuItem>
                          </Select>
                        </FormControl>

                        <Typography>
                          <span className="asset-select-label"> to </span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={assetTo}
                            label="Asset"
                            onChange={changeAsset}
                            disableUnderline
                          >
                            <MenuItem value={TokenSymbol.GOHM}>{TokenSymbol.GOHM}</MenuItem>
                            <MenuItem value={TokenSymbol.SOHM}>{TokenSymbol.SOHM}</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      <div className="stake-tab-panel wrap-page">
                        {chooseInputArea()}
                        {chooseButtonArea()}
                      </div>
                    </Box>
                  </Box>
                  <div className={`stake-user-data`}>
                    <>
                      <DataRow
                        title={`${TokenSymbol.SOHM} Balance`}
                        balance={`${trim(+sohmBalance, 4)} ${TokenSymbol.SOHM}`}
                        isLoading={isAppLoading}
                      />
                      <DataRow
                        title={`${TokenSymbol.GOHM} Balance`}
                        balance={`${trim(+gohmBalance, 4)} ${TokenSymbol.GOHM}`}
                        isLoading={isAppLoading}
                      />
                      <Divider />
                      <Box width="100%" p={1} sx={{ textAlign: "center" }}>
                        <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
                          Got wsOHM on Avalanche or Arbitrum? Click below to switch networks and migrate to{" "}
                          {TokenSymbol.GOHM} (no bridge required!)
                        </Typography>
                        <Button
                          onClick={handleSwitchChain(NetworkId.AVALANCHE)}
                          variant="outlined"
                          style={{ margin: "0.3rem" }}
                        >
                          <img height="28px" width="28px" src={String(avax.image)} alt={avax.imageAltText} />
                          <Typography variant="h6" style={{ marginLeft: "8px" }}>
                            {avax.chainName}
                          </Typography>
                        </Button>
                        <Button
                          onClick={handleSwitchChain(NetworkId.ARBITRUM)}
                          variant="outlined"
                          style={{ margin: "0.3rem" }}
                        >
                          <img height="28px" width="28px" src={String(arbitrum.image)} alt={arbitrum.imageAltText} />
                          <Typography variant="h6" style={{ marginLeft: "8px" }}>
                            {arbitrum.chainName}
                          </Typography>
                        </Button>
                      </Box>
                    </>
                  </div>
                </>
              )}
            </div>
          </Paper>
        </Zoom>
      </div>
    );
  } else {
    return <WrapCrossChain />;
  }
};

export default Wrap;
