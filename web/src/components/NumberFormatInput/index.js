import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function NumberFormatInput(props) {
  const { inputRef, decimalScale, onChange, ...other } = props;

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
      decimalScale={decimalScale}
      decimalSeparator=","
      fixedDecimalScale
      thousandSeparator="."
      isNumericString
    />
  );
}

NumberFormatInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  decimalScale: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

NumberFormatInput.defaultProps = {
  decimalScale: 2,
};

export default NumberFormatInput;
