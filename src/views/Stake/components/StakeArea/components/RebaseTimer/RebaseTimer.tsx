import "./RebaseTimer.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { prettifyRebaseTimer } from "src/helpers";
import { useNextRebaseDate } from "src/views/Stake/components/StakeArea/components/RebaseTimer/hooks/useNextRebaseDate";

const RebaseTimer: React.FC = () => {
  const { data: nextRebaseDate } = useNextRebaseDate();

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {nextRebaseDate ? (
          <>
            <strong>{prettifyRebaseTimer((nextRebaseDate.getTime() - new Date().getTime()) / 1000)}&nbsp;</strong>
            <Trans>to next rebase</Trans>
          </>
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
};

export default RebaseTimer;
