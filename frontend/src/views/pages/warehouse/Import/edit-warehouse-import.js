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

const EditWarehouseImport = (props) => {
  const { initialState } = useSelector(state => state.warehouseImport);
  const { account } = useSelector(state => state.authentication);

  const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
  const { selectAll: selectAllProduct } = globalizedProductSelectors;
  const { selectById } = globalizedWarehouseImportSelectors;

  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [initValuesState, setInitValuesState] = useState(null);

  const warehouses = useSelector(selectAllWarehouse);
  const products = useSelector(selectAllProduct);
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
    const departArr = account.departments.map(item => item.id);
    dispatch(getWarehouse({ department: JSON.stringify(departArr) }));
    dispatch(getProduct());
    dispatch(getDetailWarehouseImport(props.match.params.id));
  }, []);

  useEffect(() => {
    if (warehouseImport) {
      setInitValuesState(warehouseImport);
      setSelectedWarehouse(warehouseImport.store)
      setProductList(JSON.parse(JSON.stringify(warehouseImport.storeInputDetails)))
    }
  }, [warehouseImport]);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    values = JSON.parse(JSON.stringify(values))
    values.storeInputDetails = productList;
    values.type = WarehouseImportType.NEW;
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

  const onAddProduct = () => {
    const data = { product: {}, quantity: 1 };
    setProductList([...productList, data]);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
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
                <CRow className="mb-3">
                  <CCol sm={4}>
                    <CLabel htmlFor="lastName">Chọn Kho</CLabel>
                    <Select
                      onChange={item => {
                        setFieldValue('store', item.value);
                        onSelectWarehouse(item.value);
                      }}
                      placeholder=""
                      value={{
                        value: values.store,
                        label: `${values.store.name}`
                      }}
                      options={warehouses.map(item => ({
                        value: item,
                        label: `${item.name}`
                      }))}
                    />
                    {!isSelectedWarehouse && <FormFeedback className="d-block">Bạn phải chọn kho hàng</FormFeedback>}
                  </CCol>
                </CRow>
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

            <CButton color="primary" variant="outline" shape="square" size="sm" className="ml-3 mb-3" onClick={onAddProduct}>
              <CIcon name={'cilArrowCircleRight'} className="mr-2" />
              Thêm sản phẩm
            </CButton>
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
                          <td style={{ width: 500 }}>
                            <Select
                              value={{
                                value: item,
                                label: item?.product?.name
                              }}
                              onChange={event => onSelectedProduct(event, index)}
                              menuPortalTarget={document.body}
                              options={products.map(item => ({
                                value: item,
                                label: `${item?.productBrand?.name}-${item?.name}-${item?.volume}`
                              }))}
                            />
                          </td>
                          <td>{item?.product?.unit}</td>
                          <td>{item?.product?.volume}</td>
                          <td style={{ width: 100 }}>
                            {item.followIndex >= 0 ? (
                              item.quantity
                            ) : (
                              <CInput
                                type="number"
                                min={1}
                                name="code"
                                id="code"
                                onChange={event => onChangeQuantity(event, index)}
                                onBlur={handleBlur}
                                value={item.quantity}
                              />
                            )}
                          </td>

                          <td style={{ width: 100 }}>
                            <CButton
                              color="danger"
                              variant="outline"
                              shape="square"
                              size="sm"
                              className="mr-3"
                              onClick={() => onRemoveProduct(index)}
                            >
                              <CIcon name="cilXCircle" />
                            </CButton>
                          </td>
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
            <CFormGroup className="d-flex justify-content-center">
              <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu lại'}
              </CButton>
              <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                <CIcon name="cil-ban" /> Xóa nhập liệu
              </CButton>
            </CFormGroup>
          </CForm>
        )}
      </Formik>
      <Toaster ref={toastRef} message="Tạo mới kho thành công" />
    </CCard>
  );
};

export default EditWarehouseImport;