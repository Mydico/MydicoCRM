import React, { useEffect, useRef, useState } from 'react';
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
  CInput,
  CRow,
  CSelect,
  CCardTitle
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingWarehouseImport, getDetailWarehouseImport, updateWarehouseImport } from './warehouse-import.api';

import Toaster from '../../../components/notifications/toaster/Toaster';
import { current } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedWarehouseImportSelectors } from './warehouse-import.reducer';
import Select from 'react-select';
import { getDepartment } from '../../user/UserDepartment/department.api';
import { globalizedDepartmentSelectors } from '../../user/UserDepartment/department.reducer';
import { FormFeedback, Table } from 'reactstrap';
import { globalizedWarehouseSelectors } from '../Warehouse/warehouse.reducer';
import { getWarehouse } from '../Warehouse/warehouse.api';
import { globalizedProductSelectors } from '../../product/ProductList/product.reducer';
import { getProduct } from '../../product/ProductList/product.api';
import { WarehouseImportType } from './contants';
import { globalizedCustomerSelectors } from '../../customer/customer.reducer';
import { getCustomer } from '../../customer/customer.api';
const validationSchema = function(values) {
  return Yup.object().shape({
    store: Yup.object().required('Kho không để trống')
  });
};

const validate = getValidationSchema => {
  return values => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  INACTIVE: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR]
    };
  }, {});
};

const findFirstError = (formName, hasError) => {
  const form = document.forms[formName];
  for (let i = 0; i < form.length; i++) {
    if (hasError(form[i].name)) {
      form[i].focus();
      break;
    }
  }
};

const validateForm = errors => {
  findFirstError('simpleForm', fieldName => {
    return Boolean(errors[fieldName]);
  });
};

const DetailWarehouseReturn = props => {
  const { initialState } = useSelector(state => state.warehouseImport);
  const { account } = useSelector(state => state.authentication);

  const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
  const { selectAll: selectAllProduct } = globalizedProductSelectors;
  const { selectById } = globalizedWarehouseImportSelectors;
  const { selectAll: selectAllCustomer } = globalizedCustomerSelectors;

  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [initValuesState, setInitValuesState] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const warehouses = useSelector(selectAllWarehouse);
  const products = useSelector(selectAllProduct);
  const customers = useSelector(selectAllCustomer);
  const warehouseImport = useSelector(state => selectById(state, props.match.params.id));

  const [productList, setProductList] = useState([]);

  const initialValues = {
    store: '',
    note: ''
  };
  const onSelectWarehouse = value => {
    setSelectedWarehouse(value);
    setIsSelectedWarehouse(true);
  };

  useEffect(() => {
    dispatch(getWarehouse({ department: JSON.stringify([account.department?.id || '']) }));
    dispatch(getProduct());
    dispatch(getDetailWarehouseImport(props.match.params.id));
    dispatch(getCustomer());
  }, []);

  useEffect(() => {
    if (warehouseImport) {
      setInitValuesState(warehouseImport);
      setSelectedWarehouse(warehouseImport.store);
      setSelectedCustomer(warehouseImport.customer);
      setProductList(warehouseImport.storeInputDetails);
    }
  }, [warehouseImport]);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    values = JSON.parse(JSON.stringify(values));
    values.storeInputDetails = productList;
    values.type = WarehouseImportType.RETURN;
    dispatch(fetching());
    dispatch(updateWarehouseImport(values));
    resetForm();
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].quantity = target.value;
    setProductList(copyArr);
  };

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  const onSelectedProduct = ({ value }, index) => {
    const arr = productList.filter(item => item.product.id === value.id);
    if (arr.length === 0) {
      const copyArr = [...productList];
      copyArr[index].product = value;
      copyArr[index].quantity = 1;
      setProductList(copyArr);
    }
  };

  const onSelectCustomer = ({ value }) => {
    setSelectedCustomer(value);
  };

  const onAddProduct = () => {
    const data = { product: {}, quantity: 1 };
    setProductList([...productList, data]);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Formik initialValues={initValuesState || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
        {({
          values,
          errors,
          touched,
          status,
          dirty,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          isValid,
          handleReset,
          setTouched
        }) => (
          <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
            <CCard className="card-accent-info">
              <CCardHeader>
                <CCardTitle>Kho hàng</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Tên kho:</dt>
                      <dd className="col-sm-9">{selectedWarehouse?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Số điện thoại:</dt>
                      <dd className="col-sm-9">{selectedWarehouse?.tel}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Chi nhánh:</dt>
                      <dd className="col-sm-9">{selectedWarehouse?.department?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Địa chỉ:</dt>
                      <dd className="col-sm-9">{selectedWarehouse?.address}</dd>
                    </dl>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <CCard className="card-accent-primary">
              <CCardHeader>
                <CCardTitle>Thông tin khách hàng</CCardTitle>
              </CCardHeader>

              <CCardBody>
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
              </CCardBody>
            </CCard>
            <CCard>
              <CCardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn vị</th>
                      <th>Dung tích</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: 500 }}>{`${item?.product?.productBrand?.name || ''}-${item?.product?.name || ''}-${item
                            ?.product?.volume || ''}`}</td>
                          <td>{item?.product?.unit}</td>
                          <td>{item?.product?.volume}</td>
                          <td style={{ width: 100 }}>{item.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardBody>
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
              </CCardBody>
            </CCard>
          </CForm>
        )}
      </Formik>
    </CCard>
  );
};

export default DetailWarehouseReturn;