import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Divider, Button } from '@material-ui/core';

import styles from './styles';

function NotFound() {
  const classes = styles();

  return (
    <Paper className={classes.container}>
      <Typography variant="h4" color="primary" className={classes.item}>
        Não encontrado :(
      </Typography>
      <Typography variant="subtitle1" className={classes.item}>
        Talvez o que você esteja procurando tenha sido removido ou esta é uma
        URL inválida.
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

export default NotFound;
