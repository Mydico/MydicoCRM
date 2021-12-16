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
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailWarehouseImport, updateWarehouseImport } from '../Import/warehouse-import.api';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedWarehouseImportSelectors } from '../Import/warehouse-import.reducer';
import Select from 'react-select';
import { currencyMask } from '../../../components/currency-input/currency-input';
import MaskedInput from 'react-text-mask';
import { FormFeedback, Table } from 'reactstrap';
import { globalizedWarehouseSelectors } from '../Warehouse/warehouse.reducer';
import { getWarehouse } from '../Warehouse/warehouse.api';
import { globalizedProductSelectors, swap } from '../../product/ProductList/product.reducer';
import { filterProduct, getProduct } from '../../product/ProductList/product.api';
import { WarehouseImportType } from './contants';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import { blockInvalidChar } from '../../../../shared/utils/helper';

const validationSchema = function() {
  return Yup.object().shape({
    store: Yup.object().required('Kho không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { globalizedProviderSelectors } from '../Provider/provider.reducer';
import { getProvider } from '../Provider/provider.api';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
const { selectAll: selectAllProduct } = globalizedProductSelectors;
const { selectById } = globalizedWarehouseImportSelectors;
const { selectAll: selectAllProvider } = globalizedProviderSelectors;
const EditWarehouseExportProvider = props => {
  const { initialState } = useSelector(state => state.warehouseImport);
  const { account } = useSelector(userSafeSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const ref = useRef(null);

  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [initValuesState, setInitValuesState] = useState(null);

  const warehouses = useSelector(selectAllWarehouse);
  const products = useSelector(selectAllProduct);
  const warehouseImport = useSelector(state => selectById(state, props.match.params.id));
  const providers = useSelector(selectAllProvider);

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
    dispatch(getDetailWarehouseImport({ id: props.match.params.id, dependency: true }));
    dispatch(getWarehouse({ department: JSON.stringify([account.department?.id || '']), dependency: true }));
    dispatch(filterProduct({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getProvider({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  useEffect(() => {
    if (warehouseImport) {
      setInitValuesState(warehouseImport);
      setSelectedWarehouse(warehouseImport.store);
      setProductList(warehouseImport.storeInputDetails);
    }
  }, [warehouseImport]);

  const onSubmit = (values, { resetForm }) => () => {
    console.log(ref.current.values)
    values = JSON.parse(JSON.stringify(values));
    values.storeInputDetails = productList;
    values.type = WarehouseImportType.EXPORT_TO_PROVIDER;
    values.totalMoney = productList.reduce((sum, current) => sum + current.price * current.quantity, 0);
    dispatch(fetching());
    dispatch(updateWarehouseImport(values));
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].quantity = target.value;
    setProductList(copyArr);
    productList.reduce((sum, current) => sum + current.price * current.quantity, 0)
  };

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  const debouncedSearchProduct = _.debounce(value => {
    dispatch(filterProduct({ page: 0, size: 20, sort: 'createdDate,DESC', code: value, name: value, dependency: true }));
  }, 300);

  const onSearchProduct = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchProduct(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchProduct('');
    }
  };

  const onSelectedProduct = ({ value, index }, selectedProductIndex) => {
    const tempArr = [...products];
    const tempVar = tempArr[0];
    tempArr[0] = tempArr[index];
    tempArr[index] = tempVar;
    dispatch(swap(tempArr));
    const copyArr = [...productList];
    copyArr[selectedProductIndex].product = value;
    copyArr[selectedProductIndex].quantity = 1;
    copyArr[selectedProductIndex].price = Number(value.price);
    setProductList(copyArr);
  };

  // const onSelectedProduct = ({ value }, index) => {
  //   const arr = productList.filter(item => item.product.id === value.id);
  //   if (arr.length === 0) {
  //     const copyArr = [...productList];
  //     copyArr[index].product = value;
  //     copyArr[index].price = Number(value.price);
  //     copyArr[index].quantity = 1;
  //     setProductList(copyArr);
  //   }
  // };

  const onAddProduct = () => {
    const data = { product: {}, quantity: 1 };
    setProductList([...productList, data]);
  };

  const onChangePrice = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].price = Number(target.value.replace(/\D/g, ''));
    setProductList(copyArr);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const editAlert = (values, { setSubmitting, setErrors }) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn lưu phiếu này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: onSubmit(values, { setSubmitting, setErrors })
        },
        {
          label: 'Hủy'
        }
      ],
      closeOnEscape: true
    });
  };

  return (
    <CCard>
      <Formik
        initialValues={initValuesState || initialValues}
        enableReinitialize
        innerRef={ref}
        validate={validate(validationSchema)}
        onSubmit={editAlert}
      >
        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, handleReset }) => (
          <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
            <CCard className="card-accent-info">
              <CCardHeader>
                <CCardTitle>Chọn kho xuất</CCardTitle>
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
            <CCard className="card-accent-info">
              <CCardHeader>
                <CCardTitle>Chọn nhà cung cấp</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CRow className="mb-3">
                  <CCol sm={4}>
                    <CLabel htmlFor="lastName">Chọn nhà cung cấp</CLabel>
                    <Select
                      placeholder=""
                      value={{
                        value: values.provider,
                        label: `${values.provider?.name}`
                      }}
                      onChange={item => {
                        setFieldValue('provider', item.value);
                        setSelectedImportWarehouse(item.value);
                      }}
                      placeholder=""
                      options={providers.map(item => ({
                        value: item,
                        label: `${item.name}`
                      }))}
                    />
                    {!isSelectedWarehouse && <FormFeedback className="d-block">Bạn phải chọn nhà cung cấp</FormFeedback>}
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

            <CCard>
              <CCardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn vị</th>
                      <th>Dung tích</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ minWidth: 500 }}>
                            <Select
                              value={{
                                value: item,
                                label: item?.product?.name
                              }}
                              onInputChange={onSearchProduct}
                              onChange={event => onSelectedProduct(event, index)}
                              menuPortalTarget={document.body}
                              options={products.map((item, index) => ({
                                index,
                                value: item,
                                label: `${item?.code}-${item?.name}-${item?.volume}`
                              }))}
                            />
                          </td>
                          <td>{item?.product?.unit}</td>
                          <td>{item?.product?.volume}</td>
                          <td style={{ minWidth: 300 }}>
                            {item.followIndex >= 0 ? (
                              item.quantity
                            ) : (
                              <CInput
                                type="number"
                                min={1}
                                name="code"
                                id="code"
                                onKeyDown={blockInvalidChar}
                                onChange={event => onChangeQuantity(event, index)}
                                onBlur={handleBlur}
                                value={item.quantity}
                              />
                            )}
                          </td>
                          <td>
                            {
                              <MaskedInput
                                mask={currencyMask}
                                onChange={event => onChangePrice(event, index)}
                                value={Number(item.price || item?.product?.price || 0)}
                                render={(ref, props) => <CInput innerRef={ref} {...props} />}
                              />
                            }
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
              <CButton color="primary" variant="outline" shape="square" size="sm" className="ml-3 mb-3" onClick={onAddProduct}>
                <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                Thêm sản phẩm
              </CButton>
            </CCard>
            <CCard>
              <CCardHeader>
                <CCardTitle>Thông tin khác</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg="4" sm="5">
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
                  </CCol>
                  <CCol lg="4" sm="5" className="ml-auto">
                    <Table className="table-clear">
                      <tbody>
                        <tr>
                          <td className="left">
                            <strong>Tổng số lượng</strong>
                          </td>
                          <td className="right">{productList.reduce((sum, current) => sum + Number(current.quantity), 0) || ''}</td>
                        </tr>
                        <tr>
                          <td className="left">
                            <strong>Tổng tiền</strong>
                          </td>
                          <td className="right">
                            {
                              <MaskedInput
                                mask={currencyMask}
                                onChange={event => {
                                  setFieldValue('totalMoney', event.target.value);
                                }}
                                value={Number(productList.reduce((sum, current) => sum + current.price * current.quantity, 0) || 0)}
                                render={(ref, props) => <CInput innerRef={ref} {...props} />}
                              />
                            }
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </CCol>
                </CRow>
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
    </CCard>
  );
};

export default EditWarehouseExportProvider;
