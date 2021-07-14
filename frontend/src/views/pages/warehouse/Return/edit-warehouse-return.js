import React, { useCallback, useEffect, useState } from 'react';
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
import { getDetailWarehouseImport, updateWarehouseImport, updateWarehouseReturn } from '../Import/warehouse-import.api';
import { currencyMask } from '../../../components/currency-input/currency-input';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedWarehouseImportSelectors } from '../Import/warehouse-import.reducer';
import Select from 'react-select';
import _ from 'lodash';
import { FormFeedback, Table } from 'reactstrap';
import { globalizedWarehouseSelectors } from '../Warehouse/warehouse.reducer';
import { getWarehouse } from '../Warehouse/warehouse.api';
import { globalizedProductSelectors } from '../../product/ProductList/product.reducer';
import { filterProduct, getProduct } from '../../product/ProductList/product.api';
import { WarehouseImportType } from './contants';
import { globalizedCustomerSelectors } from '../../customer/customer.reducer';
import { filterCustomer, getCustomer } from '../../customer/customer.api';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import cities from '../../../../shared/utils/city';
import district from '../../../../shared/utils/district.json';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import MaskedInput from 'react-text-mask';

const validationSchema = function() {
  return Yup.object().shape({
    store: Yup.object().required('Kho không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { blockInvalidChar } from '../../../../shared/utils/helper';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
const { selectAll: selectAllProduct } = globalizedProductSelectors;
const { selectById } = globalizedWarehouseImportSelectors;
const { selectAll: selectAllCustomer } = globalizedCustomerSelectors;

const EditWarehouseReturn = props => {
  const { initialState } = useSelector(state => state.warehouseImport);
  const { account } = useSelector(userSafeSelector);

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
    dispatch(getDetailWarehouseImport({ id: props.match.params.id, dependency: true }));
    dispatch(getWarehouse({ department: JSON.stringify([account.department?.id || '']), dependency: true }));
    dispatch(filterProduct({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getCustomer({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  useEffect(() => {
    if (warehouseImport) {
      setInitValuesState(warehouseImport);
      setSelectedWarehouse(warehouseImport.store);
      setSelectedCustomer(warehouseImport.customer);
      setProductList(Array.isArray(warehouseImport.storeInputDetails) ? warehouseImport.storeInputDetails : []);
    }
  }, [warehouseImport]);

  const onSubmit = (values, {}) => () => {
    values = JSON.parse(JSON.stringify(values));
    values.storeInputDetails = productList;
    values.totalMoney = productList.reduce((sum, current) => sum + current.price * current.quantity, 0);
    values.realMoney = productList.reduce(
      (sum, current) => sum + (current.price * current.quantity - (current.price * current.quantity * current.reducePercent) / 100),
      0
    );
    values.reduceMoney = productList.reduce((sum, current) => sum + (current.price * current.quantity * current.reducePercent) / 100, 0);
    values.type = WarehouseImportType.RETURN;
    dispatch(fetching());
    dispatch(updateWarehouseReturn(values));
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].quantity = Number(target.value).toString();
    setProductList(copyArr);
  };

  const onChangePrice = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].price = Number(target.value.replace(/\D/g, ''));
    setProductList(copyArr);
  };

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  const onSelectedProduct = ({ value }, index) => {
    const copyArr = [...productList];
    copyArr[index].product = value;
    copyArr[index].quantity = 1;
    setProductList(copyArr);
  };

  const onSelectCustomer = ({ value }) => {
    setSelectedCustomer(value);
  };

  const onAddProduct = () => {
    const data = { product: {}, quantity: 1, reducePercent: 0 };
    setProductList([...productList, data]);
  };

  const debouncedSearchProduct =  _.debounce(value => {
      dispatch(filterProduct({ page: 0, size: 20, sort: 'createdDate,DESC', code: value, name: value, dependency: true }));
    }, 300)

  const onSearchProduct = value => {
    debouncedSearchProduct(value);
  };

  const debouncedSearchCustomer =  _.debounce(value => {
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
        })
      );
    }, 300)

  const onSearchCustomer = value => {
    debouncedSearchCustomer(value);
  };

  const onChangeReducePercent = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].reducePercent = Number(target.value).toString();
    copyArr[index].priceTotal =
      copyArr[index].price * copyArr[index].quantity -
      (copyArr[index].price * copyArr[index].quantity * copyArr[index].reducePercent) / 100;
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
      ]
    });
  };

  return (
    <CCard>
      <Formik
        initialValues={initValuesState || initialValues}
        enableReinitialize
        validate={validate(validationSchema)}
        onSubmit={editAlert}
      >
        {({
          values,
          errors,

          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,

          handleReset
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
            <CCard className="card-accent-primary">
              <CCardHeader>
                <CCardTitle>Thông tin khách hàng</CCardTitle>
              </CCardHeader>

              <CCardBody>
                <CFormGroup>
                  <CRow className="mb-3">
                    <CCol sm={8}>
                      <CLabel htmlFor="lastName">Chọn khách hàng</CLabel>
                      <Select
                        name="customer"
                        onChange={item => {
                          setFieldValue('customer', item.value);
                          onSelectCustomer(item);
                        }}
                        onInputChange={onSearchCustomer}
                        value={{
                          value: values.customer,
                          label: `${values.customer?.name}`
                        }}
                        options={customers.map(item => ({
                          value: item,
                          label: `[${item.code}] ${item.name} ${item.address}`
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
                      <dd className="col-sm-9">{cities.filter(city => city.value === selectedCustomer?.city)[0]?.label || ''}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Quận huyện:</dt>
                      <dd className="col-sm-9">{district.filter(dist => dist.value === selectedCustomer?.district)[0]?.label || ''}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Nhân viên phụ trách: </dt>
                      <dd className="col-sm-9">{selectedCustomer?.sale?.login}</dd>
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
                      <th>Giá</th>
                      <th>Chiết khấu</th>
                      <th>Thành tiền</th>
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
                              onInputChange={onSearchProduct}
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
                          </td>
                          <td style={{ minWidth: 200 }}>
                            {
                              <MaskedInput
                                mask={currencyMask}
                                onChange={event => onChangePrice(event, index)}
                                value={productList[index].price}
                                render={(ref, props) => <CInput innerRef={ref} {...props} />}
                              />
                            }
                          </td>
                          <td style={{ minWidth: 100 }}>
                            <CInput
                              type="number"
                              min={0}
                              max={100}
                              onKeyDown={blockInvalidChar}
                              onChange={event => onChangeReducePercent(event, index)}
                              value={item.reducePercent}
                            />
                          </td>
                          <td style={{ minWidth: 100 }}>
                            {(item.price * item.quantity - (item.price * item.quantity * item.reducePercent) / 100).toLocaleString(
                              'it-IT',
                              {
                                style: 'currency',
                                currency: 'VND'
                              }
                            ) || ''}
                          </td>
                          <td style={{ minWidth: 100 }}>
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
    </CCard>
  );
};

export default EditWarehouseReturn;
