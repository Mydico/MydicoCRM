import React, { useCallback, useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CCollapse,
  CCardTitle,
  CLabel,
  CInput,
  CRow,
  CFormGroup,
  CTextarea
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { editSelfOrder, getDetailOrder, updateOrder } from './order.api';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { globalizedOrdersSelectors, reset } from './order.reducer';
import Select from 'react-select';
import { currencyMask } from '../../../components/currency-input/currency-input';
import MaskedInput from 'react-text-mask';
import { globalizedPromotionSelectors } from '../Promotion/promotion.reducer';
import { getDetailProductPromotion, getPromotion } from '../Promotion/promotion.api';
import { globalizedWarehouseSelectors } from '../../warehouse/Warehouse/warehouse.reducer';
import { getWarehouse } from '../../warehouse/Warehouse/warehouse.api';
import { globalizedProductWarehouseSelectors } from '../../warehouse/Product/product-warehouse.reducer';
import { filterProductInStore, getProductInstore, getProductWarehouseByField } from '../../warehouse/Product/product-warehouse.api';
import { FormFeedback } from 'reactstrap';
import { OrderStatus } from './order-status';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { userSafeSelector, removePermission } from '../../login/authenticate.reducer.js';
import { Td, Table, Thead, Th, Tr, Tbody } from 'react-super-responsive-table';
import '../../../components/table/ResponsiveTable.css';
import { useMediaQuery } from 'react-responsive';
import { socket } from '../../../../App';

const validationSchema = function() {
  return Yup.object().shape({
    customer: Yup.object()
      .required('Khách hàng  không để trống')
      .nullable(),
    promotion: Yup.object()
      .required('Chương trình bán hàng không để trống')
      .nullable()
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { blockInvalidChar, memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper';
import { checkProductIsNotEnough } from './CreateOrder';

const mappingType = {
  SHORTTERM: 'Ngắn hạn',
  LONGTERM: 'Dài hạn'
};
const { selectAll: selectAllPromotion } = globalizedPromotionSelectors;
const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
const { selectAll: selectAllProductInWarehouse } = globalizedProductWarehouseSelectors;
const { selectById } = globalizedOrdersSelectors;
const EditOrder = props => {
  const { initialState } = useSelector(state => state.order);
  const { initialState: promotionState } = useSelector(state => state.promotion);
  const { account } = useSelector(userSafeSelector);
  const isEmployee = account.roles.filter(item => item.authority.includes('EMPLOYEE')).length > 0;

  const initialValues = {
    customer: null,
    promotion: null,
    orderDetails: [],
    code: '',
    note: '',
    address: '',
    status: OrderStatus.WAITING
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useMediaQuery({ maxWidth: '40em' });

  const promotions = useSelector(selectAllPromotion);
  const productInWarehouses = useSelector(selectAllProductInWarehouse);
  const order = useSelector(state => selectById(state, props.match.params.id));
  const warehouses = useSelector(selectAllWarehouse);

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [productList, setProductList] = useState([]);
  const [initValuesState, setInitValuesState] = useState(null);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [showProductPromotion, setShowProductPromotion] = useState(false);

  useEffect(() => {
    dispatch(getPromotion({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true, isLock: 0 }));
    dispatch(getWarehouse({ department: JSON.stringify([account.department?.id || '']), dependency: true }));
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (order) {
      setInitValuesState(order);
      setSelectedPromotion(order.promotion);
      setSelectedWarehouse(order.store);
      dispatch(getDetailProductPromotion({ promotion: order.promotion.id }));
      if (Array.isArray(order.orderDetails)) {
        const productArr = JSON.parse(JSON.stringify(order.orderDetails));
        // setProductList(productArr);
        const copyArr = [...productArr];
        if (order.orderDetails.length > 0) {
          updateProductQuantity(copyArr);
          // dispatch(
          //   getProductWarehouseByField({
          //     store: order.store?.id,
          //     product: JSON.stringify(order.orderDetails.map(item => item.product.id)),
          //     dependency: true
          //   })
          // ).then(numberOfQuantityInStore => {
          //   if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
          //     numberOfQuantityInStore.payload.forEach(element => {
          //       const foundedIndex = copyArr.findIndex(item => item.product.id === element.product.id);
          //       if (foundedIndex !== -1) {
          //         copyArr[foundedIndex].quantityInStore = element.quantity;
          //       }
          //     });
          //   }
          //   setProductList(copyArr);
          // });
        }
      }
    }
  }, [order]);

  const updateProductQuantity = copyArr => {
    dispatch(
      getProductWarehouseByField({
        store: order.store?.id,
        product: JSON.stringify(order.orderDetails.map(item => item.product.id)),
        dependency: true
      })
    ).then(numberOfQuantityInStore => {
      if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
        numberOfQuantityInStore.payload.forEach(element => {
          const foundedIndex = copyArr.findIndex(item => item.product.id === element.product.id);
          if (foundedIndex !== -1) {
            copyArr[foundedIndex].quantityInStore = element.quantity;
          }
        });
      }
      setProductList(copyArr);
    });
  };

  const onSubmit = (values, {}) => () => {
    values = JSON.parse(JSON.stringify(values));
    if (productList.filter(item => item.quantity > item.quantityInStore).length > 0) {
      alert('Vui lòng chọn lại số lương sản phẩm');
      return;
    }
    if (!values.address) values.address = selectedCustomer.address;
    if (selectedPromotion) {
      values.promotion = selectedPromotion;
    }

    values.orderDetails = productList;
    values.totalMoney = values?.orderDetails.reduce((sum, current) => sum + current.priceReal * current.quantity, 0);
    values.realMoney = values?.orderDetails.reduce(
      (sum, current) => sum + (current.priceReal * current.quantity - (current.priceReal * current.quantity * current.reducePercent) / 100),
      0
    );
    values.reduceMoney = values?.orderDetails.reduce(
      (sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100,
      0
    );
    if (values.status === OrderStatus.CANCEL) {
      values.status = OrderStatus.WAITING;
    }
    if (values.createdBy !== account.login && (!account.branch || !account.branch.allow)) {
      dispatch(updateOrder(values));
    } else {
      dispatch(editSelfOrder(values));
    }
  };

  const onSelectPromotion = ({ value }) => {
    const arr = promotions.filter(customer => customer.id === value);
    if (arr.length === 1) {
      setSelectedPromotion(arr[0]);
    }
  };

  const onSelectedProduct = ({ value }, index) => {
    const arr = productInWarehouses.filter(product => product.product.id === value);
    if (arr.length === 1) {
      const copyArr = [...productList];
      copyArr[index].priceReal = Number(arr[0].product.price);
      copyArr[index].product = arr[0].product;
      setProductList(copyArr);
      onChangeQuantity({ target: { value: 1 } }, index);
      updateProductQuantity(copyArr);
    }
  };

  useEffect(() => {
    if (selectedPromotion?.id) {
      dispatch(getDetailProductPromotion({ promotion: selectedPromotion.id, dependency: true }));
    }
  }, [selectedPromotion]);

  useEffect(() => {
    if (selectedWarehouse?.id) {
      dispatch(
        filterProductInStore({
          store: selectedWarehouse?.id,
          page: 0,
          size: 20,
          sort: 'name,ASC',
          dependency: true
        })
      );
    }
  }, [selectedWarehouse]);

  const onAddProduct = useCallback(() => {
    if (selectedWarehouse?.id) {
      const data = { product: {}, quantity: 1, quantityAndGift: 0, reducePercent: 0, store: { id: selectedWarehouse.id } };
      setProductList([...productList, data]);
    } else {
      setIsSelectedWarehouse(false);
    }
  });

  const debouncedSearchProduct = _.debounce(value => {
    dispatch(
      filterProductInStore({
        store: selectedWarehouse?.id,
        page: 0,
        size: 20,
        sort: 'name,ASC',
        name: value,
        code: value,
        dependency: true
      })
    );
  }, 300);

  const onSearchProduct = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchProduct(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchProduct('');
    }
  };

  const debouncedSearchProductInStore = _.debounce((copyArr, index) => {
    dispatch(
      getProductInstore({
        storeId: selectedWarehouse.id,
        productId: copyArr[index].product.id
      })
    ).then(numberOfQuantityInStore => {
      if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
        copyArr[index].quantityInStore = numberOfQuantityInStore?.payload[0]?.quantity || 0;
        if (
          numberOfQuantityInStore?.payload[0] &&
          numberOfQuantityInStore?.payload[0]?.quantity < 100 &&
          copyArr[index].quantity > numberOfQuantityInStore?.payload[0]?.quantity
        ) {
          copyArr[index].quantity = numberOfQuantityInStore?.payload[0]?.quantity;
        }
        setProductList(copyArr);
      }
    });
  }, 1000);

  const onSearchProductInstore = (copyArr, index) => {
    if (!copyArr[index].quantityInStore) {
      debouncedSearchProductInStore(copyArr, index);
    }
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].quantity = Number(target.value).toString();
    copyArr[index].reduce = (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    copyArr[index].priceTotal = (copyArr[index].priceReal * copyArr[index].quantity * (100 - copyArr[index].reducePercent || 0)) / 100;
    if (Array.isArray(promotionState.promotionProducts) && copyArr[index].attachTo === null) {
      const founded = promotionState.promotionProducts.filter(item => item.product.id === copyArr[index].product.id);
      if (founded.length > 0) {
        if (target.value >= founded[0].buy) {
          const ratio = founded[0].gift / founded[0].buy;
          const gift = Math.floor(target.value * ratio);
          const existExtraProductIndex = copyArr.findIndex(item => item.attachTo === index);
          if (existExtraProductIndex !== -1) {
            copyArr[existExtraProductIndex].quantity = gift;
          } else {
            const extraProduct = {
              product: copyArr[index].product,
              quantity: gift,
              reducePercent: 100,
              priceReal: Number(copyArr[index].product.price),
              store: { id: selectedWarehouse.id },
              followIndex: index
            };
            copyArr.splice(index + 1, 0, extraProduct);
          }
          copyArr[index].quantityAndGift = Number(gift);
        }
      }
    }
    if (selectedWarehouse && copyArr[index].product) {
      setProductList(copyArr);
      onSearchProductInstore(copyArr, index);
    }
    setProductList(copyArr);
  };

  const onChangePrice = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].priceReal = Number(target.value.replace(/\D/g, ''));
    copyArr[index].reduce = (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    copyArr[index].priceTotal = (copyArr[index].priceReal * copyArr[index].quantity * (100 - copyArr[index].reducePercent || 0)) / 100;
    setProductList(copyArr);
  };

  const onChangeReducePercent = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].reducePercent = target.value > 100 ? 100 : target.value === '' ? 0 : Number(target.value).toString();
    copyArr[index].reduce = (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    copyArr[index].priceTotal = (copyArr[index].priceReal * copyArr[index].quantity * (100 - copyArr[index].reducePercent || 0)) / 100;

    setProductList(copyArr);
  };

  const onSelectWarehouse = ({ value }) => {
    setSelectedWarehouse(value);
    setIsSelectedWarehouse(true);
  };

  const editAlert = (values, { setSubmitting, setErrors }) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn lưu đơn hàng này?',
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

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  useEffect(() => {
    if (initialState.updatingSuccess || initialState.updateStatusSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess, initialState.updateStatusSuccess]);

  const debouncedSearchPromotion = _.debounce(value => {
    if (initValuesState.customer) {
      dispatch(
        getPromotion({
          isLock: 0,
          page: 0,
          size: 50,
          name: value,
          sort: 'createdDate,DESC',
          dependency: true,
          customerType: initValuesState.customer?.type?.id
        })
      );
    }
  }, 300);

  const onSearchPromition = value => {
    if (value) {
      debouncedSearchPromotion(value);
    }
  };

  return (
    <Formik initialValues={initValuesState || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={editAlert}>
      {({
        values,
        errors,
        touched,

        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue
      }) => {
        return (
          <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
            <CCard className="card-accent-primary">
              <CCardHeader>
                <CCardTitle>Thông tin khách hàng</CCardTitle>
              </CCardHeader>

              <CCardBody>
                <CRow>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Mã khách hàng:</dt>
                      <dd className="col-sm-9">{values.customer?.code}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Họ tên:</dt>
                      <dd className="col-sm-9">{values.customer?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Số điện thoại:</dt>
                      <dd className="col-sm-9">{values.customer?.tel}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Chi nhánh:</dt>
                      <dd className="col-sm-9">{values.customer?.department?.name}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Địa chỉ:</dt>
                      <dd className="col-sm-9">{values.customer?.address}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Thành phố:</dt>
                      <dd className="col-sm-9">{memoizedGetCityName(values.customer?.city)}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Quận huyện:</dt>
                      <dd className="col-sm-9">{memoizedGetDistrictName(values.customer?.district)}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Loại khách hàng: </dt>
                      <dd className="col-sm-9">{values.customer?.type?.name}</dd>
                    </dl>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <CCard className="card-accent-info">
              <CCardHeader>
                <CCardTitle>Chương trình khuyến mại</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CRow className="mb-3">
                    <CCol sm={4}>
                      <CLabel htmlFor="lastName">Chọn chương trình bán hàng</CLabel>
                      <Select
                        onInputChange={onSearchPromition}
                        onChange={item => {
                          setFieldValue('promotion', { id: item.value, name: item.label });
                          onSelectPromotion(item);
                        }}
                        value={{
                          value: values.promotion?.id,
                          label: values.promotion?.name
                        }}
                        name="promotion"
                        options={promotions.map(item => ({
                          value: item.id,
                          label: `${item.name}`
                        }))}
                      />
                    </CCol>
                  </CRow>
                  <FormFeedback className="d-block">{errors.promotion}</FormFeedback>
                </CFormGroup>
                <CRow>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Tên chương trình:</dt>
                      <dd className="col-sm-9">{selectedPromotion?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Ngày bắt đầu:</dt>
                      <dd className="col-sm-9">{selectedPromotion?.startTime}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Ngày kết thúc:</dt>
                      <dd className="col-sm-9">{selectedPromotion?.endTime}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Loại chương trình:</dt>
                      <dd className="col-sm-9">{mappingType[selectedPromotion?.type]}</dd>
                    </dl>
                  </CCol>
                </CRow>
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    setShowProductPromotion(!showProductPromotion);
                  }}
                >
                  <CIcon name="cilZoom" /> Xem sản phẩm áp dụng
                </CButton>
                <CCollapse show={showProductPromotion}>
                  <CCardBody>
                    <h5>Thông tin sản phẩm khuyến mại</h5>
                    <CRow>
                      <CCol lg="6">
                        {Array.isArray(promotionState.promotionProducts) &&
                          promotionState.promotionProducts.map((item, index) => (
                            <dl className="row" key={index}>
                              <dt className="col-sm-6">{`${item.product.name} ${item.product.volume}ml`}</dt>
                              <dd className="col-sm-8">{`Mua ${item.buy} Tặng ${item.gift}`}</dd>
                            </dl>
                          ))}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
              </CCardBody>
            </CCard>
            {productList.length === 0 && (
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
                          onSelectWarehouse(item);
                        }}
                        value={{
                          value: values.store,
                          label: values.store?.name
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
                      <dl className="row">
                        <dt className="col-sm-3">Địa chỉ:</dt>
                        <dd className="col-sm-9">{selectedWarehouse?.address}</dd>
                      </dl>
                    </CCol>
                    <CCol lg="6">
                      <dl className="row">
                        <dt className="col-sm-3">Thành phố:</dt>
                        <dd className="col-sm-9">{selectedWarehouse?.city?.name}</dd>
                      </dl>
                      <dl className="row">
                        <dt className="col-sm-3">Quận huyện:</dt>
                        <dd className="col-sm-9">{selectedWarehouse?.district?.name}</dd>
                      </dl>
                      <dl className="row">
                        <dt className="col-sm-3">Xã phường:</dt>
                        <dd className="col-sm-9">{selectedWarehouse?.ward?.name}</dd>
                      </dl>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}
            <CCard>
              <CCardBody className="table-responsive">
                <Table responsive striped className="table table-striped">
                  <Thead>
                    <Tr>
                      <Th>Sản phẩm</Th>
                      <Th>Đơn vị</Th>
                      <Th>Số lượng</Th>
                      <Th>Đơn giá</Th>
                      <Th>Thành tiền</Th>
                      <Th>Chiết khấu</Th>
                      <Th>Thanh toán</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {productList.map((item, index) => {
                      return (
                        <Tr key={index} style={checkProductIsNotEnough(item, productList)}>
                          <Td style={{ minWidth: 500 }}>
                            <Select
                              value={{
                                value: item.product?.id,
                                label: item.product?.name
                              }}
                              onInputChange={onSearchProduct}
                              onChange={event => onSelectedProduct(event, index)}
                              menuPortalTarget={document.body}
                              options={productInWarehouses.map(item => ({
                                value: item.product.id,
                                label: `[${item.product?.code}]-${item.product.name}-${item.product.volume}`
                              }))}
                            />
                          </Td>
                          <Td>{item.product?.unit}</Td>
                          <Td style={{ minWidth: 100 }}>
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
                            {item.quantityInStore !== undefined &&
                              Number(item.quantity) + (Number(item.quantityAndGift) || 0) > item.quantityInStore && (
                                <FormFeedback className="d-block">Số lượng sản phẩm và quà tặng lớn hơn số lượng trong kho</FormFeedback>
                              )}
                          </Td>
                          <Td style={{ minWidth: 250 }}>
                            {
                              <MaskedInput
                                mask={currencyMask}
                                onChange={event => onChangePrice(event, index)}
                                value={
                                  typeof productList[index].priceReal !== 'number'
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        productList[index].priceReal
                                      )
                                    : productList[index].priceReal
                                }
                                render={(ref, props) => <CInput disabled={isEmployee} innerRef={ref} {...props} />}
                              />
                            }
                          </Td>
                          <Td>
                            {(item.priceReal * item.quantity).toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND'
                            }) || ''}
                          </Td>

                          <Td style={{ minWidth: 100 }}>
                            <CInput
                              type="number"
                              min={0}
                              max={100}
                              onKeyDown={blockInvalidChar}
                              onChange={event => onChangeReducePercent(event, index)}
                              onBlur={handleBlur}
                              value={item.reducePercent}
                            />
                          </Td>
                          <Td>
                            {(item.priceReal * item.quantity - (item.priceReal * item.quantity * item.reducePercent) / 100).toLocaleString(
                              'it-IT',
                              {
                                style: 'currency',
                                currency: 'VND'
                              }
                            ) || ''}
                          </Td>
                          <Td style={{ minWidth: 100 }}>
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
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <CButton color="primary" variant="outline" shape="square" size="sm" className="mb-3 mt-3" onClick={onAddProduct}>
                  <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                  Thêm sản phẩm
                </CButton>
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
                      <CLabel htmlFor="userName">Địa chỉ</CLabel>
                      <CTextarea
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Địa chỉ"
                        autoComplete="address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="userName">Ghi chú</CLabel>
                      <CTextarea
                        type="text"
                        name="note"
                        id="note"
                        placeholder="ghi chú"
                        autoComplete="note"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.note}
                      />
                    </CFormGroup>
                    {values.status === 'CANCEL' && (
                      <CFormGroup>
                        <CLabel htmlFor="userName">Lý do hủy</CLabel>
                        <CTextarea
                          type="text"
                          name="reject"
                          id="reject"
                          disabled
                          autoComplete="note"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.reject}
                        />
                      </CFormGroup>
                    )}
                  </CCol>
                  <CCol lg="4" sm="5" className="ml-auto">
                    {!isMobile ? (
                      <Table className="table table-striped">
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
                                .reduce((sum, current) => sum + current.priceReal * current.quantity, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="left">
                              <strong>Chiết khấu</strong>
                            </td>
                            <td className="right">
                              {productList
                                .reduce((sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="left">
                              <strong>Tiền thanh toán</strong>
                            </td>
                            <td className="right">
                              <strong>
                                {productList
                                  .reduce(
                                    (sum, current) =>
                                      sum +
                                      (current.priceReal * current.quantity -
                                        (current.priceReal * current.quantity * current.reducePercent) / 100),
                                    0
                                  )
                                  .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    ) : (
                      <Table className="table-clear">
                        <Thead>
                          <Tr>
                            <Th>Tổng số lượng</Th>
                            <Th>Tổng tiền</Th>
                            <Th>Chiết khấu</Th>
                            <Th>Tiền Thanh toán</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td className="right">{productList.reduce((sum, current) => sum + Number(current.quantity), 0) || ''}</Td>
                          </Tr>
                          <Tr>
                            <Td className="right">
                              {productList
                                .reduce((sum, current) => sum + current.priceReal * current.quantity, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className="right">
                              {productList
                                .reduce((sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td className="right">
                              <strong>
                                {productList
                                  .reduce(
                                    (sum, current) =>
                                      sum +
                                      (current.priceReal * current.quantity -
                                        (current.priceReal * current.quantity * current.reducePercent) / 100),
                                    0
                                  )
                                  .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </strong>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    )}
                    <CFormGroup className="d-flex justify-content-center">
                      <CButton type="submit" size="lg" className="btn btn-success">
                        {'Lưu lại'} <CIcon name="cil-save" />
                      </CButton>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CForm>
        );
      }}
    </Formik>
  );
};

export default EditOrder;
