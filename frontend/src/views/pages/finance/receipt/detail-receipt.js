import React, { useEffect, useRef, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCol, CForm, CTextarea, CFormGroup, CLabel, CRow, CCardTitle, CBadge } from '@coreui/react/lib';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import CurrencyInput from '../../../components/currency-input/currency-input';
import { getDetailReceipt } from './receipt.api';
import { globalizedReceiptsSelectors } from './receipt.reducer';

const validationSchema = function() {
  return Yup.object().shape({
    customer: Yup.object().required('Khách hàng không để trống'),
    money: Yup.string().required('Tiền không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper';

const getBadge = status => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    case 'WAITING':
      return 'warning';
    default:
      return 'primary';
  }
};
const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  REJECTED: 'ĐÃ HỦY'
};
const { selectById } = globalizedReceiptsSelectors;
const DetailReceipt = props => {
  const formikRef = useRef();
  const dispatch = useDispatch();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [initValuesState, setInitValuesState] = useState(null);

  const receipt = useSelector(state => selectById(state, props.match.params.receiptId));

  const initialValues = {
    customer: {},
    money: '',
    note: ''
  };

  useEffect(() => {
    if (receipt) {
      const customReceipt = JSON.parse(JSON.stringify(receipt));
      customReceipt.money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(receipt.money);
      setInitValuesState(customReceipt);
      setSelectedCustomer(customReceipt.customer);
    }
  }, [receipt]);

  useEffect(() => {
    dispatch(getDetailReceipt({ id: props.match.params.receiptId, dependency: true }));
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Xem phiếu thu</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValuesState || initialValues}
          enableReinitialize
          validate={validate(validationSchema)}
          innerRef={formikRef}
        >
          {({
            values,

            handleChange
          }) => (
            <CForm noValidate name="simpleForm">
              <CCol lg="12">
                <CRow>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Mã khách hàng:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.code}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Họ tên:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Số điện thoại:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.tel}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Chi nhánh:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.department?.name}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Địa chỉ:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.address}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Thành phố:</dt>
                      <dd className="col-sm-9">{memoizedGetCityName(selectedCustomer?.city)}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Quận huyện:</dt>
                      <dd className="col-sm-9">{memoizedGetDistrictName(selectedCustomer?.district)}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Loại khách hàng: </dt>
                      <dd className="col-sm-9">{selectedCustomer?.type?.name}</dd>
                    </dl>
                  </CCol>
                </CRow>
                <CFormGroup>
                  <CLabel htmlFor="userName">Số tiền</CLabel>
                  <CurrencyInput name="money" disabled handleChange={handleChange} value={values.money}  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="userName">Ghi chú</CLabel>
                  <CTextarea type="text" name="note" id="note" disabled placeholder="" autoComplete="address" value={values.note} />
                </CFormGroup>
                <dl className="row">
                  <dt className="col-sm-3">Trạng thái:</dt>
                  <dd className="col-sm-9">
                    {
                      <CBadge size="lg" color={getBadge(values.status)}>
                        {mappingStatus[values.status]}
                      </CBadge>
                    }
                  </dd>
                </dl>
              </CCol>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default DetailReceipt;
