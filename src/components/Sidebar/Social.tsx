import { Link } from "@material-ui/core";
import { Icon } from "@olympusdao/component-library";
import React from "react";

import { EnvHelper } from "../../helpers/Environment";

const Social: React.FC = () => (
  <div className="social-row">
    <Link href={`https://github.com/${EnvHelper.env.REACT_APP_SOCIAL_GITHUB}`} target="_blank">
      <Icon name="github" />
    </Link>
    <Link href={`https://medium.com/@${EnvHelper.env.REACT_APP_SOCIAL_MEDIUM}`} target="_blank">
      <Icon name="medium" />
    </Link>
    <Link href={`https://twitter.com/${EnvHelper.env.REACT_APP_SOCIAL_TWITTER}`} target="_blank">
      <Icon name="twitter" />
    </Link>
    <Link href={`https://discord.gg/${EnvHelper.env.REACT_APP_SOCIAL_DISCORD}`} target="_blank">
      <Icon name="discord" />
    </Link>
  </div>
);

export default Social;
