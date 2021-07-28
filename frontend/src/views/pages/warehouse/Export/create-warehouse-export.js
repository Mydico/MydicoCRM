import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { creatingWarehouseExport, creatingWarehouseImport } from '../Import/warehouse-import.api';
import { currencyMask } from '../../../components/currency-input/currency-input';
import MaskedInput from 'react-text-mask';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { fetching } from '../Import/warehouse-import.reducer';
import Select from 'react-select';
import { FormFeedback, Table } from 'reactstrap';
import { globalizedWarehouseSelectors } from '../Warehouse/warehouse.reducer';
import { getAllWarehouse, getWarehouse } from '../Warehouse/warehouse.api';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import { filterProduct, getProduct } from '../../product/ProductList/product.api';
import { WarehouseImportType } from './contants';
import { filterProductInStore, getProductInstore, getProductWarehouse } from '../Product/product-warehouse.api';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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

const CreateReceipt = () => {
  const formikRef = useRef();
  const { initialState } = useSelector(state => state.warehouseImport);
  const { initialState: initialStateWarehouse } = useSelector(state => state.warehouse);

  const { account } = useSelector(userSafeSelector);


  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [importWarehouses, setImportWarehouses] = useState([]);
  const [selectedImportWarehouse, setSelectedImportWarehouse] = useState(null);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [products, setProducts] = useState([]);
  const warehouses = useSelector(selectAllWarehouse);

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
    dispatch(getWarehouse({ department: JSON.stringify([account.department?.id || '']), dependency: true }));
    dispatch(getAllWarehouse({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  const onSubmit = (values, { resetForm }) => () => {
    let isValidProduct = true;
    productList.forEach(element => {
      if (element.quantity > element.quantityInStore) {
        isValidProduct = false;
        return;
      }
    });
    if (!isValidProduct) return;
    values.storeInputDetails = productList;
    values.type = WarehouseImportType.EXPORT;
    values.department = { id: account.department?.id || null};
    dispatch(fetching());
    dispatch(creatingWarehouseExport(values));
  };



  useEffect(() => {
    if (selectedWarehouse) {
      const founedIndex = initialStateWarehouse.warehouses.findIndex(item => item.id === selectedWarehouse.id);
      const copyArr = [...initialStateWarehouse.warehouses];
      copyArr.splice(founedIndex, 1);
      setImportWarehouses(copyArr);
      dispatch(
        filterProductInStore({
          store: selectedWarehouse.id,
          dependency: true
        })
      ).then(resp => {
        if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
          setProducts(resp.payload.data);
        }
      });
    }
  }, [selectedWarehouse]);

  // dispatch(
  //   getProductInstore({
  //     storeId: selectedWarehouse.id,
  //     productId: copyArr[index].product.id
  //   })
  // ).then(numberOfQuantityInStore => {
  //   if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
  //     copyArr[index].quantity = Number(quantity);
  //     copyArr[index].quantityInStore = numberOfQuantityInStore.payload[0].quantity;
  //     setProductList(copyArr);
  //   }
  // });

  const debouncedSearchProductInStore = _.debounce((copyArr, index) => {
    dispatch(
      getProductInstore({
        storeId: selectedWarehouse.id,
        productId: copyArr[index].product.id
      })
    ).then(numberOfQuantityInStore => {
      if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
        copyArr[index].quantityInStore = numberOfQuantityInStore?.payload[0]?.quantity || 0;
        setProductList(copyArr);
      }
    });
  }, 300);

  const onSearchProductInstore = (copyArr, index) => {
    debouncedSearchProductInStore(copyArr, index);
  };

  const onChangeQuantity = ({ target }, index) => {
    const quantity = target.value;
    const copyArr = [...productList];
    copyArr[index].quantity = Number(quantity).toString();
    if (selectedWarehouse && copyArr[index].product) {
      setProductList(copyArr);
      onSearchProductInstore(copyArr, index);
    }
  };
  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setFieldValue(
        'totalMoney',
        productList.reduce((sum, current) => sum + current.price * current.quantity, 0)
      );
    }
  }, [productList]);
  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  const onSelectedProduct = ({ value }, index) => {
    const copyArr = [...productList];
    copyArr[index].product = value;
    copyArr[index].price = Number(value.price);
    copyArr[index].quantity = 1;
    setProductList(copyArr);
  };

  const onAddProduct = () => {
    const data = { product: {}, quantity: 1 };
    setProductList([...productList, data]);
  };

  const debouncedSearchProduct =  _.debounce(value => {
      dispatch(filterProduct
        ({ page: 0, size: 20, sort: 'createdDate,DESC', code: value, name: value, status: 'ACTIVE', dependency: true }));
    }, 300)

  const onSearchProduct = value => {
    debouncedSearchProduct(value);
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
      message: 'Bạn có chắc chắn muốn tạo phiếu này?',
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
      <Formik initialValues={initialValues} validate={validate(validationSchema)} onSubmit={editAlert} innerRef={formikRef}>
        {({
          values,

          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,

          handleReset
        }) => (
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
                <CCardTitle>Chọn kho nhập</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CRow className="mb-3">
                  <CCol sm={4}>
                    <CLabel htmlFor="lastName">Chọn Kho</CLabel>
                    <Select
                      onChange={item => {
                        setFieldValue('storeTransfer', item.value);
                        setSelectedImportWarehouse(item.value);
                      }}
                      placeholder=""
                      options={importWarehouses.map(item => ({
                        value: item,
                        label: `${item.name}`
                      }))}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Tên kho:</dt>
                      <dd className="col-sm-9">{selectedImportWarehouse?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Số điện thoại:</dt>
                      <dd className="col-sm-9">{selectedImportWarehouse?.tel}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Chi nhánh:</dt>
                      <dd className="col-sm-9">{selectedImportWarehouse?.department?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Địa chỉ:</dt>
                      <dd className="col-sm-9">{selectedImportWarehouse?.address}</dd>
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
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          style={
                            item.quantityInStore !== undefined &&
                            Number(item.quantity) > item.quantityInStore
                              ? {
                                  boxShadow: '0px 0px 6px 5px red'
                                }
                              : {}
                          }
                        >
                          <td style={{ minWidth: 300 }}>
                            <Select
                              value={{
                                value: item.product,
                                label: item?.product?.name
                              }}
                              onInputChange={onSearchProduct}
                              onChange={event => onSelectedProduct(event, index)}
                              menuPortalTarget={document.body}
                              options={products.map(item => ({
                                value: item.product,
                                label: `${item?.product?.code}-${item?.product?.name}-${item?.product?.volume}`
                              }))}
                            />
                          </td>
                          <td>{item?.product?.unit}</td>
                          <td>{item?.product?.volume}</td>
                          <td style={{ minWidth: 300 }}>
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
                            {item.quantity > item.quantityInStore && (
                              <FormFeedback className="d-block">Số lượng cần lấy lớn hơn số lượng trong kho</FormFeedback>
                            )}
                          </td>
                          <td style={{ minWidth: 300 }}>
                            {
                              <MaskedInput
                                mask={currencyMask}
                                onChange={event => onChangePrice(event, index)}
                                value={
                                  typeof productList[index].price !== 'number'
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        productList[index].price
                                      )
                                    : productList[index].price
                                }
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
                            {productList
                              .reduce((sum, current) => sum + current.price * current.quantity, 0)
                              .toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND'
                              })}
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
                <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
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

export default CreateReceipt;
