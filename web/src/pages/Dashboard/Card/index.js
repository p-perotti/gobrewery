import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { formatCurrency } from '~/util/format';

import style from './styles';

function Card({ title, value, currency, positive, link }) {
  const classes = style();

  return (
    <>
      <Typography variant="h6" color="primary">
        {title}
      </Typography>
      <Typography
        variant="h4"
        className={
          '' && value > 0 && (positive ? classes.positive : classes.negative)
        }
      >
        {value > 0 && (positive ? <ArrowDropUp /> : <ArrowDropDown />)}
        {currency ? formatCurrency(value) : value}
      </Typography>
      <Typography color="textSecondary" className={classes.date}>
        {format(new Date(), `'em' dd 'de' MMMM',' yyyy`, {
          locale: ptBR,
        })}
      </Typography>
      <div>
        <Button type="button" color="primary" component={Link} to={link}>
          Ver mais
        </Button>
      </div>
    </>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  currency: PropTypes.bool,
  positive: PropTypes.bool,
  link: PropTypes.string.isRequired,
};

Card.defaultProps = {
  currency: false,
  positive: false,
};

export default Card;
