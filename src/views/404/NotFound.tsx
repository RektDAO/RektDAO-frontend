import "./NotFound.scss";

import { Trans } from "@lingui/macro";
import { APP_NAME } from "src/constants";

import OlympusLogo from "../../assets/icons/REKT-dice.svg";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="/" target="_blank">
          <img className="branding-header-icon" src={OlympusLogo} alt={APP_NAME} />
        </a>

        <h4>
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}
