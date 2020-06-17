import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function DecimalFormat(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalScale={2}
      decimalSeparator=","
      fixedDecimalScale
      thousandSeparator="."
      isNumericString
    />
  );
}

DecimalFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DecimalFormat;
