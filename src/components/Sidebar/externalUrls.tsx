import { Trans } from "@lingui/macro";
import { ReactElement } from "react";
import { APP_URL_ROOT } from "src/constantsAddl";

export interface ExternalUrl {
  title: ReactElement;
  url: string;
  icon: string;
}

const externalUrls: ExternalUrl[] = [
  // {
  //   title: <Trans>Forum</Trans>,
  //   url: `https://forum.${APP_URL_ROOT}/`,
  //   icon: "forum",
  // },
  // {
  //   title: <Trans>Governance</Trans>,
  //   url: `https://vote.${APP_URL_ROOT}/`,
  //   icon: "governance",
  // },
  {
    title: <Trans>Governance (AVAX)</Trans>,
    url: `http://vote-avax.${APP_URL_ROOT}/`,
    icon: "governance",
  },
  // {
  //   title: <Trans>Docs</Trans>,
  //   url: `https://docs.${APP_URL_ROOT}/`,
  //   icon: "docs",
  // },
  // {
  //   title: <Trans>Bug Bounty</Trans>,
  //   url: `https://immunefi.com/bounty/olympus/`,
  //   icon: "bug-report",
  // },
  // {
  //   title: <Trans>Grants</Trans>,
  //   url: `https://grants.${APP_URL_ROOT}/`,
  //   icon: "grants",
  // },
  {
    title: <Trans>Deployer/Contracts</Trans>,
    url: `https://blockscan.com/address/0xF0011285c82518EDf8c63BEF41e7E2123FfC60BA`,
    icon: "info",
  },
  {
    title: <Trans>Links</Trans>,
    url: `https://linktr.ee/rektdao`,
    icon: "more",
  },
];

export default externalUrls;
