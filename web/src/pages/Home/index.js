import React from 'react';
import Typography from '@material-ui/core/Typography';

import styles from './styles';

function Home() {
  const classes = styles();

  return (
    <div className={classes.container}>
      <Typography
        component="h1"
        variant="h3"
        color="primary"
        className={classes.logo}
      >
        GoBrewery
      </Typography>
    </div>
  );
}

export default Home;
