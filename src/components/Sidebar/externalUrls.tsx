import { Trans } from "@lingui/macro";
import { ReactElement } from "react";
import { APP_URL_ROOT } from "src/constants";

export interface ExternalUrl {
  title: ReactElement;
  url: string;
  icon: string;
}

const externalUrls: ExternalUrl[] = [
  {
    title: <Trans>Forum</Trans>,
    url: `https://forum.${APP_URL_ROOT}/`,
    icon: "forum",
  },
  {
    title: <Trans>Governance</Trans>,
    url: `https://vote.${APP_URL_ROOT}/`,
    icon: "governance",
  },
  {
    title: <Trans>Docs</Trans>,
    url: `https://docs.${APP_URL_ROOT}/`,
    icon: "docs",
  },
  {
    title: <Trans>Bug Bounty</Trans>,
    url: `https://immunefi.com/bounty/olympus/`,
    icon: "bug-report",
  },
  {
    title: <Trans>Grants</Trans>,
    url: `https://grants.${APP_URL_ROOT}/`,
    icon: "grants",
  },
];

export default externalUrls;
