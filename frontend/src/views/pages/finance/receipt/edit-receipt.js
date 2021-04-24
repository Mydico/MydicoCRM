import React, {useEffect, useRef, useState} from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CTextarea,
  CFormGroup,
  CLabel,

  CRow,

  CCardTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';


import {useHistory} from 'react-router-dom';
import Select from 'react-select';
import {globalizedCustomerSelectors} from '../../customer/customer.reducer';
import {FormFeedback} from 'reactstrap';
import {getCustomer} from '../../customer/customer.api';

import CurrencyInput from '../../../components/currency-input/currency-input';
import {getDetailReceipt, updateReceipt} from './receipt.api';
import {fetching, globalizedReceiptsSelectors} from './receipt.reducer';

const validationSchema = function() {
  return Yup.object().shape({
    customer: Yup.object().required('Khách hàng không để trống'),
    money: Yup.string().required('Tiền không để trống'),
  });
};

const validate = (getValidationSchema) => {
  return (values) => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, {abortEarly: false});
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};


const EditReceipt = (props) => {
  const formikRef = useRef();
  const {initialState} = useSelector((state) => state.receipt);
  const {selectAll: selectAllCustomer} = globalizedCustomerSelectors;
  const {selectById} = globalizedReceiptsSelectors;

  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [initValuesState, setInitValuesState] = useState(null);

  const customers = useSelector(selectAllCustomer);
  const receipt = useSelector((state) => selectById(state, props.match.params.id));

  const initialValues = {
    customer: {},
    money: '',
    note: '',
  };

  useEffect(() => {
    if (receipt) {
      const customCeceipt = JSON.parse(JSON.stringify(receipt));
      customCeceipt.money = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(receipt.money);
      setInitValuesState(customCeceipt);
      setSelectedCustomer(customCeceipt.customer);
    }
  }, [receipt]);

  useEffect(() => {
    dispatch(getCustomer());
    dispatch(getDetailReceipt(props.match.params.id));
  }, []);

  const onSubmit = (values, {resetForm}) => {
    dispatch(fetching());
    values.money = Number(values.money.replace(/\D/g, ''));
    dispatch(updateReceipt(values));
    resetForm();
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa phiếu thu</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValuesState || initialValues}
          enableReinitialize
          validate={validate(validationSchema)}
          onSubmit={onSubmit}
          innerRef={formikRef}
        >
          {({
            values,
            errors,


            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,


            handleReset
            ,
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CCol lg="12">
                <CFormGroup>
                  <CRow className="mb-3">
                    <CCol sm={8}>
                      <CLabel htmlFor="lastName">Chọn khách hàng</CLabel>
                      <Select
                        name="customer"
                        onChange={(item) => {
                          setSelectedCustomer(item.value);
                          setFieldValue('customer', item.value);
                        }}
                        value={{
                          value: values.customer,
                          label: `${values.customer.name}`,
                        }}
                        options={customers.map((item) => ({
                          value: item,
                          label: `[${item.code}] ${item.name} ${item.address}`,
                        }))}
                      />
                    </CCol>
                  </CRow>
                  <FormFeedback className="d-block">{errors.customer}</FormFeedback>
                </CFormGroup>

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
                      <dd className="col-sm-9">{selectedCustomer?.branch?.name}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Địa chỉ:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.address}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Thành phố:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.city?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Quận huyện:</dt>
                      <dd className="col-sm-9">{selectedCustomer?.district?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Loại khách hàng: </dt>
                      <dd className="col-sm-9">{selectedCustomer?.type?.name}</dd>
                    </dl>
                  </CCol>
                </CRow>
                <CFormGroup>
                  <CLabel htmlFor="userName">Số tiền</CLabel>
                  <CurrencyInput name="money" handleChange={handleChange} />
                  <FormFeedback className="d-block">{errors.money}</FormFeedback>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="userName">Ghi chú</CLabel>
                  <CTextarea
                    type="text"
                    name="note"
                    id="note"
                    placeholder=""
                    autoComplete="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                  />
                </CFormGroup>
                {/* </CCardBody>
                </CCard> */}
              </CCol>

              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
                </CButton>
                <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                  <CIcon name="cil-ban" /> Xóa nhập liệu
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default EditReceipt;
