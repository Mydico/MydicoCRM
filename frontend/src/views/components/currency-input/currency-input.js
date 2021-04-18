import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Field } from 'formik';
import { CInput } from '@coreui/react';

export const defaultMaskOptions = {
  prefix: '',
  suffix: 'đ',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 0, // how many digits allowed after the decimal
  integerLimit: 100, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false
};
export const currencyMask = createNumberMask({
  ...defaultMaskOptions,
});
const CurrencyInput = ({ maskOptions, name, handleChange , ...inputProps }) => {

  return (
    <Field
      name={name}
      render={({ field }) => {
        return(
        <MaskedInput {...field} mask={currencyMask} onChange={handleChange} {...inputProps} render={(ref, props) => <CInput name={name} innerRef={ref} {...props} />} />
      )}}
    />
  );
};


export default CurrencyInput;
