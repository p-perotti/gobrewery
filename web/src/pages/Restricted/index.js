import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Divider, Button } from '@material-ui/core';

import styles from './styles';

function Restricted() {
  const classes = styles();

  return (
    <Paper className={classes.container}>
      <Typography variant="h4" color="primary" className={classes.item}>
        Oops...
      </Typography>
      <Typography variant="subtitle1" className={classes.item}>
        Este usuário em sessão não possui permissão de acesso à esta página.
      </Typography>
      <Divider className={classes.item} />
      <div>
        <Button color="primary" component={Link} to="/">
          Voltar ao início
        </Button>
      </div>
    </Paper>
  );
}

export default Restricted;
