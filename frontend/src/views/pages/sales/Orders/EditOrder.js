import React, { useEffect, useState } from 'react';
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
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailOrder, getOrderDetail, updateOrder } from './order.api';

import { useHistory } from 'react-router-dom';
import { globalizedOrdersSelectors } from './order.reducer';
import Select from 'react-select';
import { currencyMask } from '../../../components/currency-input/currency-input';
import MaskedInput from 'react-text-mask';
import { globalizedPromotionSelectors } from '../Promotion/promotion.reducer';
import { getDetailProductPromotion, getPromotion } from '../Promotion/promotion.api';
import { globalizedWarehouseSelectors } from '../../warehouse/Warehouse/warehouse.reducer';
import { getWarehouse } from '../../warehouse/Warehouse/warehouse.api';
import { globalizedProductWarehouseSelectors } from '../../warehouse/Product/product-warehouse.reducer';
import { getProductInstore, getProductWarehouse, getProductWarehouseByField } from '../../warehouse/Product/product-warehouse.api';
import { FormFeedback, Table } from 'reactstrap';
import { OrderStatus } from './order-status';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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

const mappingType = {
  SHORTTERM: 'Ngắn hạn',
  LONGTERM: 'Dài hạn'
};

const EditOrder = props => {
  const { initialState } = useSelector(state => state.order);
  const { initialState: promotionState } = useSelector(state => state.promotion);
  const { account } = useSelector(state => state.authentication);

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
  const { selectAll: selectAllPromotion } = globalizedPromotionSelectors;
  const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
  const { selectAll: selectAllProductInWarehouse } = globalizedProductWarehouseSelectors;
  const { selectById } = globalizedOrdersSelectors;

  const promotions = useSelector(selectAllPromotion);
  const productInWarehouses = useSelector(selectAllProductInWarehouse);
  const order = useSelector(state => selectById(state, props.match.params.id));
  const warehouses = useSelector(selectAllWarehouse);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [productList, setProductList] = useState([]);
  const [initValuesState, setInitValuesState] = useState(null);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [showProductPromotion, setShowProductPromotion] = useState(false);

  useEffect(() => {
    dispatch(getPromotion({ isLock: 0 }));
    dispatch(getDetailOrder(props.match.params.id));
    dispatch(getWarehouse({ department: JSON.stringify([account.department?.id || '']) }));
  }, []);

  useEffect(() => {
    if (order) {
      setInitValuesState(order);
      setSelectedCustomer(order.customer);
      setSelectedPromotion(order.promotion)
      dispatch(getDetailProductPromotion({ promotion: order.promotion.id }));
      dispatch(getOrderDetail(props.match.params.id));
    }
  }, [order]);

  useEffect(() => {
    if (Array.isArray(initialState.orderDetails)) {
      const productArr = JSON.parse(JSON.stringify(initialState.orderDetails));

      if (initialState.orderDetails.length > 0) {
        setSelectedWarehouse(initialState.orderDetails[0].store);
        dispatch(
          getProductWarehouseByField({
            store: initialState.orderDetails[0].store.id,
            product: JSON.stringify(initialState.orderDetails.map(item => item.product.id))
          })
        ).then(numberOfQuantityInStore => {
          if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
            numberOfQuantityInStore.payload.forEach(element => {
              const foundedIndex = productArr.findIndex(item => item.product.id === element.product.id);
              if (foundedIndex !== -1) {
                productArr[foundedIndex].quantityInStore = element.quantity;
              }
            });
          }
          setProductList(productArr);
        });
      }
    }
  }, [initialState.orderDetails]);

  const onSubmit = (values, {}) => () => {
    values = JSON.parse(JSON.stringify(values));
    if (!values.address) values.address = selectedCustomer.address;
    if (selectedPromotion) {
      values.promotion = selectedPromotion;
    }
    values.orderDetails = productList;
    if (values.status === OrderStatus.CANCEL) {
      values.status = OrderStatus.WAITING;
    }
    dispatch(updateOrder(values));
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
    }
  };

  useEffect(() => {
    if (selectedPromotion?.id) {
      dispatch(getDetailProductPromotion({ promotion: selectedPromotion.id }));
    }
  }, [selectedPromotion]);

  useEffect(() => {
    if (selectedWarehouse?.id) {
      dispatch(getProductWarehouse({ store: selectedWarehouse?.id }));
    }
  }, [selectedWarehouse]);

  const onAddProduct = () => {
    if (selectedWarehouse?.id) {
      const data = { product: {}, quantity: 1, quantityAndGift: 0, reducePercent: 0, store: { id: selectedWarehouse.id } };
      setProductList([...productList, data]);
    } else {
      setIsSelectedWarehouse(false);
    }
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].quantity = Number(target.value);
    copyArr[index].priceTotal = copyArr[index].quantity * copyArr[index].priceReal;
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
      dispatch(
        getProductInstore({
          storeId: selectedWarehouse.id,
          productId: copyArr[index].product.id
        })
      ).then(numberOfQuantityInStore => {
        if (numberOfQuantityInStore && Array.isArray(numberOfQuantityInStore.payload) && numberOfQuantityInStore.payload.length > 0) {
          copyArr[index].quantityInStore = numberOfQuantityInStore.payload[0].quantity;
        }
      });
    }
    setProductList(copyArr);
  };

  const onChangePrice = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].priceReal = Number(target.value.replace(/\D/g, ''));
    copyArr[index].priceTotal = copyArr[index].quantity * copyArr[index].priceReal;
    setProductList(copyArr);
  };

  const onChangeReducePercent = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].reducePercent = target.value > 100 ? 100 : target.value;
    copyArr[index].priceTotal =
      copyArr[index].priceReal * copyArr[index].quantity -
      (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent) / 100;

    setProductList(copyArr);
  };

  const onSelectWarehouse = ({ value }) => {
    const arr = warehouses.filter(customer => customer.id === value);
    if (arr.length === 1) {
      setSelectedWarehouse(arr[0]);
      setIsSelectedWarehouse(true);
    }
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
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

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
                      <dd className="col-sm-9">{values.customer?.city?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Quận huyện:</dt>
                      <dd className="col-sm-9">{values.customer?.district?.name}</dd>
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
                    <dl className="row">
                      <dt className="col-sm-3">Sản phẩm áp dụng</dt>
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
              <CCol xs="12" sm="6" md="12">
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
              </CCol>
            )}

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
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Chiết khấu</th>
                      <th>Thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          style={
                            item.quantityInStore !== undefined &&
                            Number(item.quantity) + (Number(item.quantityAndGift) || 0) > item.quantityInStore
                              ? {
                                  boxShadow: '0px 0px 6px 5px red'
                                }
                              : {}
                          }
                        >
                          <td style={{ width: 300 }}>
                            <Select
                              value={{
                                value: item.product?.id,
                                label: item.product?.name
                              }}
                              onChange={event => onSelectedProduct(event, index)}
                              menuPortalTarget={document.body}
                              options={productInWarehouses.map(item => ({
                                value: item.product.id,
                                label: `${item.product.productBrand?.name}-${item.product.name}-${item.product.volume}`
                              }))}
                            />
                          </td>
                          <td>{item.product?.unit}</td>
                          <td>{item.product?.volume}</td>
                          <td style={{ width: 100 }}>
                            <CInput
                              type="number"
                              min={1}
                              name="code"
                              id="code"
                              onChange={event => onChangeQuantity(event, index)}
                              onBlur={handleBlur}
                              value={item.quantity}
                            />
                            {item.quantityInStore !== undefined &&
                              Number(item.quantity) + (Number(item.quantityAndGift) || 0) > item.quantityInStore && (
                                <FormFeedback className="d-block">Số lượng sản phẩm và quà tặng lớn hơn số lượng trong kho</FormFeedback>
                              )}
                          </td>
                          <td style={{ width: 150 }}>
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
                                render={(ref, props) => <CInput innerRef={ref} {...props} />}
                              />
                            }
                          </td>
                          <td>
                            {(item.priceReal * item.quantity).toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND'
                            }) || ''}
                          </td>

                          <td style={{ width: 100 }}>
                            <CInput
                              type="number"
                              name="code"
                              id="code"
                              onChange={event => onChangeReducePercent(event, index)}
                              onBlur={handleBlur}
                              value={item.reducePercent}
                            />
                          </td>
                          <td>
                            {(item.priceReal * item.quantity - (item.priceReal * item.quantity * item.reducePercent) / 100).toLocaleString(
                              'it-IT',
                              {
                                style: 'currency',
                                currency: 'VND'
                              }
                            ) || ''}
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
                      <CLabel htmlFor="userName">Địa chỉ</CLabel>
                      <CTextarea
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Địa chỉ"
                        autoComplete="address"
                        valid={errors.address || null}
                        invalid={touched.address && !!errors.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address || selectedCustomer?.address}
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
                        valid={errors.note || null}
                        invalid={touched.note && !!errors.note}
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
