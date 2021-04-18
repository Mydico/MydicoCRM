import React, { useEffect, useRef, useState } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingOrder, getDetailOrder, getOrderDetail, updateOrder } from './order.api';
import Toaster from '../../../components/notifications/toaster/Toaster';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedOrdersSelectors } from './order.reducer';
import Select from 'react-select';
import { currencyMask } from '../../../components/currency-input/currency-input';
import MaskedInput from 'react-text-mask';
import { globalizedPromotionSelectors } from '../Promotion/promotion.reducer';
import { getDetailProductPromotion, getPromotion, getPromotionProduct } from '../Promotion/promotion.api';
import { globalizedWarehouseSelectors } from '../../warehouse/Warehouse/warehouse.reducer';
import { getWarehouse } from '../../warehouse/Warehouse/warehouse.api';
import { globalizedProductWarehouseSelectors } from '../../warehouse/Product/product-warehouse.reducer';
import { getProductWarehouse } from '../../warehouse/Product/product-warehouse.api';
import { FormFeedback, Table } from 'reactstrap';
import { OrderStatus } from './order-status';

const validationSchema = function(values) {
  return Yup.object().shape({
    customer: Yup.object()
      .required('Khách hàng  không để trống')
      .nullable(),
    promotion: Yup.object()
      .required('Chương trình bán hàng không để trống')
      .nullable()
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
const mappingType = {
  SHORTTERM: 'Ngắn hạn',
  LONGTERM: 'Dài hạn'
};

const ViewOrder = props => {
  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const { selectById } = globalizedOrdersSelectors;

  const order = useSelector(state => selectById(state, props.match.params.id));

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    dispatch(getDetailOrder(props.match.params.id));
  }, []);

  useEffect(() => {
    if (order) {
      setInvoice(order);
    }
  }, [order]);

  return (
    <div className="animated fadeIn">
      <CCard>
        <CCardHeader>
          Đơn hàng <strong>#{invoice?.code}</strong>
          <a href="#" className="btn btn-sm btn-secondary mr-1 float-right">
            <i className="fa fa-print"></i> In
          </a>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            <CCol sm="4">
              <h6 className="mb-3">Từ:</h6>
              <div>
                <strong>Công ty cổ phẩn Mydico</strong>
              </div>
              <div>Linh Đàm</div>
              <div>hà nội</div>
              <div>Email: info@mydico.com</div>
              <div>Phone: +48 123 456 789</div>
            </CCol>
            <CCol sm="4">
              <h6 className="mb-3">Tới:</h6>
              <div>
                <strong>{invoice?.customer.contactName}</strong>
              </div>
              <div>{invoice?.address}</div>
              <div>{`${invoice?.customer?.district?.name}, ${invoice?.customer?.city?.name}`}</div>
              <div>Email: {invoice?.customer.email}</div>
              <div>Phone: {invoice?.customer.tel}</div>
            </CCol>
            <CCol sm="4">
              <h6 className="mb-3">Chương trình bán hàng:</h6>
              <div>
                <strong> {invoice?.promotion?.name}</strong>
              </div>
              <div>
                {invoice?.promotion?.description.length > 200
                  ? `${invoice?.promotion?.description.substring(0, 200)}`
                  : invoice?.promotion?.description}
              </div>
              <div>Loại khách hàng: {invoice?.promotion?.customerType?.name}</div>
            </CCol>
          </CRow>
          <Table striped responsive>
            <thead>
              <tr>
                <th className="center">#</th>
                <th>Tên sản phẩm</th>
                <th>Dung tích</th>
                <th className="center">Số lượng</th>
                <th className="right">Đơn giá</th>
                <th className="right">Chiết khấu(%)</th>
                <th className="right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.orderDetails.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.product?.name}</td>
                    <td>{item.product?.volume}</td>
                    <td>{item.quantity}</td>

                    <td>{Number(item.priceReal).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                    <td>{item.reducePercent}%</td>
                    <td>{(item.priceReal * item.quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                    <td>
                      {(item.priceReal * item.quantity - (item.priceReal * item.quantity * item.reducePercent) / 100).toLocaleString(
                        'it-IT',
                        {
                          style: 'currency',
                          currency: 'VND'
                        }
                      ) || ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <CRow>
            <CCol lg="4" sm="5">
              Ghi chú: <strong>{invoice?.note}</strong>
            </CCol>
            <CCol lg="4" sm="5" className="ml-auto">
              <Table className="table-clear">
                <tbody>
                  <tr>
                    <td className="left">
                      <strong>Tổng tiền</strong>
                    </td>
                    <td className="right">
                      {invoice?.orderDetails
                        .reduce((sum, current) => sum + current.priceReal * current.quantity, 0)
                        .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="left">
                      <strong>Chiết khấu</strong>
                    </td>
                    <td className="right">
                      {invoice?.orderDetails
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
                        {invoice?.orderDetails
                          .reduce(
                            (sum, current) =>
                              sum +
                              (current.priceReal * current.quantity - (current.priceReal * current.quantity * current.reducePercent) / 100),
                            0
                          )
                          .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ViewOrder;
