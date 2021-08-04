import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CLabel,
  CInput,
  CRow,
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import MaskedInput from 'react-text-mask';

import Select from 'react-select';
import { useHistory } from 'react-router-dom';

import { userSafeSelector } from '../../login/authenticate.reducer';
import { globalizedCustomerSelectors } from '../../customer/customer.reducer';
import _ from 'lodash';
import { filterCustomer, getCustomer } from '../../customer/customer.api';
import { currencyMask } from '../../../components/currency-input/currency-input';
import { createCustomerDebts, mockTransfer } from './debt.api';
import { validate } from '../../../../shared/utils/normalize';
import { FormFeedback } from 'reactstrap';
import { fetching } from './debt.reducer';

const { selectAll: selectAllCustomer } = globalizedCustomerSelectors;
const validationSchema = function() {
  return Yup.object().shape({
    customer: Yup.object().required('Khách hàng  không để trống')
  });
};
const CreateDebt = () => {
  const ref = useRef(null);
  const { account } = useSelector(userSafeSelector);
  const { initialState } = useSelector(state => state.debt);

  const initialValues = {
    customer: {},
    debt: '0'
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const customers = useSelector(selectAllCustomer);

  useEffect(() => {
    dispatch(getCustomer({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  const debouncedSearchCustomer = _.debounce(value => {
    dispatch(
      filterCustomer({
        page: 0,
        size: 20,
        sort: 'createdDate,DESC',
        code: value,
        name: value,
        address: value,
        contactName: value,
        dependency: true,
        sale: account.id
      })
    );
  }, 300);

  const onSearchCustomer = value => {
    if (value) {
      debouncedSearchCustomer(value);
    }
  };

  const onSubmit = (values, { resetForm }) => {
    values.debt = typeof values.debt === 'number' ? values.debt : Number(values.debt.replace(/\D/g, ''));

    const data = {
      earlyDebt: values.debt,
      totalMoney: values.debt,
      type: 'DEBIT',
      customer: values.customer,
      customerName: values.customer.name,
      customerCode: values.customer.code,
      department: values.customer.department,
      lastModifiedDate: new Date(),
      branch: values.customer.sale.branch,
      previousDebt: 0,
      saleName: values.customer.sale.code,
      sale: values.customer.sale
    };
    // dispatch(fetching())
    // dispatch(createCustomerDebts(data));

    dispatch(mockTransfer([{ id: 1 }, { id: 4 }]));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Công nợ</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} innerRef={ref} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({ values, handleSubmit, setFieldValue, errors }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Chọn khách hàng</CLabel>
                    <Select
                      name="customer"
                      onInputChange={onSearchCustomer}
                      onChange={item => {
                        setFieldValue('customer', item.value);
                        setFieldValue('debt', '0');
                      }}
                      options={customers.map(item => ({
                        value: item,
                        label: `[${item.code}] ${item.name} ${item.address}`
                      }))}
                    />
                    <FormFeedback className="d-block">{errors.customer}</FormFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Công nợ ban đầu</CLabel>
                    <MaskedInput
                      mask={currencyMask}
                      onChange={event => {
                        setFieldValue('debt', event.target.value);
                      }}
                      value={values?.debt}
                      render={(ref, props) => <CInput innerRef={ref} {...props} />}
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateDebt;
