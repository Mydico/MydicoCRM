import React, { useCallback, useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CCardTitle,
  CLabel,
  CInput,
  CCollapse,
  CRow,
  CFormGroup,
  CTextarea
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { currencyMask } from '../../../components/currency-input/currency-input';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import { globalizedCustomerSelectors } from '../../customer/customer.reducer';
import { filterCustomer, getCustomer } from '../../customer/customer.api';
import { globalizedPromotionSelectors } from '../Promotion/promotion.reducer';
import { getPromotion } from '../Promotion/promotion.api';
import { globalizedWarehouseSelectors } from '../../warehouse/Warehouse/warehouse.reducer';
import { getWarehouse } from '../../warehouse/Warehouse/warehouse.api';
import { getDetailProductPromotion } from '../Promotion/promotion.api';
import { globalizedProductWarehouseSelectors } from '../../warehouse/Product/product-warehouse.reducer';
import { filterProductInStore, getProductInstore, getProductWarehouse } from '../../warehouse/Product/product-warehouse.api';
import { FormFeedback, Table } from 'reactstrap';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import { Td, Table as TableResponsive, Thead, Th, Tr, Tbody } from 'react-super-responsive-table';
import '../../../components/table/ResponsiveTable.css';
import { validate } from '../../../../shared/utils/normalize';
import { useMediaQuery } from 'react-responsive';
import { blockInvalidChar, memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper';
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

const mappingType = {
  SHORTTERM: 'Ngắn hạn',
  LONGTERM: 'Dài hạn'
};
const { selectAll: selectAllCustomer } = globalizedCustomerSelectors;
const { selectAll: selectAllPromotion } = globalizedPromotionSelectors;
const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
const { selectAll: selectAllProductInWarehouse } = globalizedProductWarehouseSelectors;
const CreateOrder = props => {
  const { initialState: promotionState } = useSelector(state => state.promotion);
  const { account } = useSelector(userSafeSelector);

  const initialValues = {
    customer: null,
    promotion: null,
    orderDetails: [],
    code: '',
    note: '',
    address: ''
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const customers = useSelector(selectAllCustomer);
  const promotions = useSelector(selectAllPromotion);
  const warehouses = useSelector(selectAllWarehouse);
  const productInWarehouses = useSelector(selectAllProductInWarehouse);
  const isMobile = useMediaQuery({ maxWidth: '40em' });

  const [initFormState, setInitFormState] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedPromotionItem, setSelectedPromotionItem] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [productList, setProductList] = useState([]);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);
  const [isSelectProItem, setIsSelectProItem] = useState(false);
  const [showProductPromotion, setShowProductPromotion] = useState(false);
  useEffect(() => {
    dispatch(getCustomer({ page: 0, size: 50, sort: 'createdDate,DESC', dependency: true, saleId: account.id  }));
    dispatch(getWarehouse({ dependency: true }));
    const existOrder = localStorage.getItem('order');
    try {
      const data = JSON.parse(existOrder);
      if (Object.keys(data).length > 0) {
        setInitFormState(data);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(
        getPromotion({ isLock: 0, page: 0, size: 50, sort: 'createdDate,DESC', dependency: true, customerType: selectedCustomer?.type?.id })
      );
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (initFormState) {
      setSelectedCustomer(initFormState.customer);
      setSelectedPromotion(initFormState.promotion);
      setSelectedWarehouse(initFormState.store);
      setProductList(initFormState.orderDetails);
    }
  }, [initFormState]);

  const toOrderInvoice = data => {
    history.push({ pathname: `${props.match.url}/invoice`, state: data });
  };

  const debouncedSearchCustomer = _.debounce(value => {
    dispatch(
      filterCustomer({
        page: 0,
        size: 50,
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

  const onSearchCustomer = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchCustomer(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchCustomer('');
    }
  };

  const debouncedSearchPromotion = _.debounce(value => {
    if (selectedCustomer) {
      dispatch(
        getPromotion({
          isLock: 0,
          page: 0,
          size: 50,
          name: value,
          sort: 'createdDate,DESC',
          dependency: true,
          customerType: selectedCustomer?.type?.id
        })
      );
    }
  }, 300);

  const onSearchPromition = value => {
    if(value){
      debouncedSearchPromotion(value);
    }
  };

  const onSubmit = (values, {}) => {
    let isValidProduct = true;
    productList.forEach(element => {
      if (element.quantity > element.quantityInStore) {
        isValidProduct = false;
        return;
      }
    });
    if (selectedPromotion && selectedPromotion.type === 'LONGTERM' && !selectedPromotionItem) {
      alert('Bạn phải chọn doanh số');
      return;
    }
    if (productList.reduce((sum, current) => sum + current.quantity, 0) === 0) {
      alert('Không để tổng số lượng bằng 0');
      return;
    }
    if (productList.filter(item => item.quantity === 0).length > 0) {
      alert('Không để sản phẩm có số lượng bằng 0 khi tạo đơn hàng');
      return;
    }
    if (!isValidProduct) return;
    if (!values.address) values.address = selectedCustomer.address;
    values.customer = selectedCustomer;
    values.store = selectedWarehouse;
    values.promotion = selectedPromotion;
    values.orderDetails = productList;
    localStorage.setItem('order', JSON.stringify(values));
    toOrderInvoice(values);
    // dispatch(creatingOrder(values));
  };

  const onSelectCustomer = ({ value }) => {
    const arr = customers.filter(customer => customer.id === value);
    if (arr.length === 1) {
      setSelectedCustomer(arr[0]);
    }
  };

  const onSelectPromotion = ({ value }) => {
    const arr = promotions.filter(customer => customer.id === value);
    if (arr.length === 1) {
      setSelectedPromotion(arr[0]);
    }
  };

  const onSelectedProduct = ({ value }) => {
    const copyArr = [...productList];
    const data = {
      product: value,
      quantity: 0,
      quantityAndGift: 0,
      reducePercent: 0,
      priceReal: Number(value.price),
      store: { id: selectedWarehouse.id }
    };
    // copyArr[index].priceReal = Number(value.price);
    // copyArr[index].product = value;
    if (selectedPromotionItem && selectedPromotion.type === 'LONGTERM') {
      const founded = selectedPromotionItem.productGroup.filter(item => item.id === value.productGroup.id)
      if(founded.length > 0){
        data.reducePercent = selectedPromotionItem.reducePercent || 0;
      }
    }
    setProductList([...copyArr, data]);
    // onChangeQuantity({ target: { value: 1 } }, index);
  };

  const onSelectWarehouse = value => {
    setSelectedWarehouse(value);
    setIsSelectedWarehouse(true);
  };

  useEffect(() => {
    if (selectedPromotion?.id) {
      dispatch(getDetailProductPromotion({ promotion: selectedPromotion.id }));
    }
  }, [selectedPromotion]);

  useEffect(() => {
    if (selectedWarehouse?.id) {
      dispatch(
        filterProductInStore({
          store: selectedWarehouse?.id,
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          dependency: true
        })
      );
    }
  }, [selectedWarehouse]);

  const onAddProduct = () => {
    if (selectedPromotion?.type === 'LONGTERM') {
      if (!selectedPromotionItem) {
        setIsSelectProItem(false);
        return;
      }
    }

    if (selectedWarehouse?.id) {
      const data = { product: {}, quantity: 1, quantityAndGift: 0, reducePercent: 0, priceReal: 0, store: { id: selectedWarehouse.id } };
      setProductList([...productList, data]);
    } else {
      setIsSelectedWarehouse(false);
    }
  };

  const debouncedSearchProduct = _.debounce(value => {
    dispatch(
      filterProductInStore({
        store: selectedWarehouse?.id,
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        name: value,
        code: value,
        dependency: true
      })
    );
  }, 300);

  const onSearchProduct = (value, action) => {
    if (value) {
      debouncedSearchProduct(value);
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
  }, 300);

  const onSearchProductInstore = (copyArr, index) => {
    debouncedSearchProductInStore(copyArr, index);
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].quantity = Number(target.value).toString();
    copyArr[index].reduce = (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    copyArr[index].priceTotal =
      copyArr[index].priceReal * copyArr[index].quantity -
      (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    if (Array.isArray(promotionState.promotionProducts) && promotionState.promotionProducts.length > 0) {
      const founded = promotionState.promotionProducts.filter(item => item.product.id === copyArr[index].product.id);
      if (founded.length > 0) {
        if (target.value >= founded[0].buy) {
          const ratio = founded[0].gift / founded[0].buy;
          const gift = Math.floor(target.value * ratio);
          const existExtraProductIndex = copyArr.findIndex(item => item.followIndex === index);
          if (existExtraProductIndex != -1) {
            copyArr[existExtraProductIndex].quantity = gift;
          } else {
            const extraProduct = {
              product: copyArr[index].product,
              quantity: gift,
              priceReal: Number(copyArr[index].product.price),
              reducePercent: 100,
              store: { id: selectedWarehouse.id },
              attachTo: index,
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
  };

  const onChangePrice = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].priceReal = Number(target.value.replace(/\D/g, ''));
    copyArr[index].reduce = (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    copyArr[index].priceTotal =
      copyArr[index].priceReal * copyArr[index].quantity -
      (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    setProductList(copyArr);
  };

  const onChangeReducePercent = ({ target }, index) => {
    const copyArr = [...productList];
    copyArr[index].reducePercent = target.value === '' ? 0 : target.value > 100 ? 100 :  Number(target.value).toString();
    copyArr[index].reduce = (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    copyArr[index].priceTotal =
      copyArr[index].priceReal * copyArr[index].quantity -
      (copyArr[index].priceReal * copyArr[index].quantity * copyArr[index].reducePercent || 0) / 100;
    setProductList(copyArr);
  };

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  return (
    <Formik initialValues={initFormState || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
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
                <CCardTitle className="text-primary">Thông tin khách hàng</CCardTitle>
              </CCardHeader>

              <CCardBody>
                <CFormGroup>
                  <CRow className="mb-3">
                    <CCol sm={8}>
                      <CLabel htmlFor="lastName">Chọn khách hàng</CLabel>
                      <Select
                        name="customer"
                        onInputChange={onSearchCustomer}
                        onChange={item => {
                          setFieldValue('customer', { id: item.value, name: item.label });
                          onSelectCustomer(item);
                        }}
                        value={{
                          value: values.customer?.id,
                          label: values.customer?.name
                        }}
                        options={customers.map(item => ({
                          value: item.id,
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
              </CCardBody>
            </CCard>
            <CCard className="card-accent-info">
              <CCardHeader>
                <CCardTitle className="text-primary">Chương trình khuyến mại</CCardTitle>
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
                          setFieldValue('promotionItem', null);
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
                {selectedPromotion?.type === 'LONGTERM' && (
                  <CFormGroup>
                    <CRow className="mb-3">
                      <CCol sm={4}>
                        <CLabel htmlFor="lastName">Chọn doanh số</CLabel>
                        <Select
                          onChange={item => {
                            setSelectedPromotionItem(item.value);
                            setFieldValue('promotionItem', item.value);
                          }}
                          name="promotion"
                          options={selectedPromotion.promotionItems?.map(item => ({
                            value: item,
                            label: `${item.name}`
                          }))}
                        />
                      </CCol>
                    </CRow>
                    {!selectedPromotionItem && <FormFeedback className="d-block">Bạn phải chọn doanh số</FormFeedback>}
                  </CFormGroup>
                )}
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
                              <dd className="col-sm-6">{`Mua ${item.buy} Tặng ${item.gift}`}</dd>
                            </dl>
                          ))}
                        {Array.isArray(selectedPromotion?.promotionItems) &&
                          selectedPromotion?.promotionItems.map((item, index) => (
                            <dl className="row" key={index}>
                              <dt className="col-sm-6">{`${item.name}`}</dt>
                              <dt className="col-sm-6">{`Chiết khấu ${item.reducePercent}%`}</dt>
                              <dd className="col-sm-12">
                                {item.productGroup.map((pGroup, index) => (
                                  <dd className="col-sm-12" key={index}>
                                    {pGroup.name}
                                  </dd>
                                ))}
                              </dd>
                            </dl>
                          ))}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
              </CCardBody>
            </CCard>
            <CCard className="card-accent-info">
              <CCardHeader>
                <CCardTitle className="text-primary">Kho hàng</CCardTitle>
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
                      <th>Dung tích</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Chiết khấu</th>
                      <th>Thanh toán</th>
                    </tr>
                  </thead>
                  <Tbody>
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
                          <td className="text-info" style={{ maxWidth: 200 }}>
                            {`${item.product.productBrand?.code || ''}-${item.product.name || ''}-${item.product.volume || ''}`}
                            {/* <Select
                              value={{
                                value: item.product,
                                label: `${item.product.productBrand?.code || ''}-${item.product.name || ''}-${item.product.volume || ''}`
                              }}
                              onInputChange={onSearchProduct}
                              onChange={event => onSelectedProduct(event, index)}
                              menuPortalTarget={document.body}
                              options={productInWarehouses.map(item => ({
                                value: item.product,
                                label: `${item.product.productBrand?.code}-[${item.product?.code}]-${item.product.name}-${item.product.volume}`
                              }))}
                            /> */}
                          </td>
                          <td>{item.product?.volume}</td>
                          <td style={{ minWidth: 130, maxWidth: 200 }}>
                            <CInput
                              type="number"
                              min={0}
                              onKeyDown={blockInvalidChar}
                              onChange={event => onChangeQuantity(event, index)}
                              onBlur={handleBlur}
                              value={item.quantity}
                            />

                            {item.quantityInStore !== undefined &&
                              Number(item.quantity) + (Number(item.quantityAndGift) || 0) > item.quantityInStore && (
                                <FormFeedback className="d-block">Số lượng sản phẩm và quà tặng lớn hơn số lượng trong kho</FormFeedback>
                              )}
                          </td>
                          <td style={{ minWidth: 100, maxWidth: 300 }}>
                            {
                              <MaskedInput
                                mask={currencyMask}
                                onChange={event => onChangePrice(event, index)}
                                value={
                                  typeof item.priceReal !== 'number'
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceReal)
                                    : item.priceReal
                                }
                                render={(ref, props) => <CInput innerRef={ref} {...props} />}
                              />
                            }
                          </td>
                          <td style={{ maxWidth: 100 }}>
                            {(item.priceReal * item.quantity).toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND'
                            }) || ''}
                          </td>

                          <td style={{ minWidth: 130, maxWidth: 200 }}>
                            <CInput
                              type="number"
                              min={0}
                              max={100}
                              onKeyDown={blockInvalidChar}
                              onChange={event => onChangeReducePercent(event, index)}
                              onBlur={handleBlur}
                              value={item.reducePercent}
                            />
                          </td>
                          <td style={{ maxWidth: 100 }}>
                            {(item.priceReal * item.quantity - (item.priceReal * item.quantity * item.reducePercent) / 100).toLocaleString(
                              'it-IT',
                              {
                                style: 'currency',
                                currency: 'VND'
                              }
                            ) || ''}
                          </td>
                          <td>
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
                  </Tbody>
                </Table>
                {selectedWarehouse && (
                  <Select
                    onInputChange={onSearchProduct}
                    onChange={event => onSelectedProduct(event)}
                    menuPortalTarget={document.body}
                    className="mt-3"
                    placeholder="Chọn sản phẩm"
                    options={productInWarehouses.map(item => ({
                      value: item.product,
                      label: `[${item.product?.code}]-${item.product.name}-${item.product.volume}`
                    }))}
                  />
                )}
                {/* <CButton color="primary" variant="outline" shape="square" size="sm" className="mb-3" onClick={onAddProduct}>
                  <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                  Thêm sản phẩm
                </CButton> */}
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>
                <CCardTitle className="text-primary">Thông tin khác</CCardTitle>
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.note}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol lg="4" sm="5" className="ml-auto">
                    {!isMobile ? (
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
                    ) : (
                      <TableResponsive className="table-clear">
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
                            <Td className="right">{productList.reduce((sum, current) => sum + Number(current.quantity), 0) || '0'}</Td>
                            <Td className="right">
                              {productList
                                .reduce((sum, current) => sum + current.priceReal * current.quantity, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </Td>
                            <Td className="right">
                              {productList
                                .reduce((sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </Td>
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
                      </TableResponsive>
                    )}
                    <CFormGroup className="d-flex justify-content-center mt-5">
                      <CButton type="submit" size="lg" className="btn btn-success">
                        {'Tiếp tục'} <CIcon name="cilArrowRight" />
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

export default CreateOrder;
