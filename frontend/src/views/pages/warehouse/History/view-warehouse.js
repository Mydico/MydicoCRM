import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCol, CForm, CTextarea, CFormGroup, CLabel, CRow, CCardTitle } from '@coreui/react/lib';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailWarehouseImport, updateWarehouseImport } from '../Import/warehouse-import.api';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedWarehouseImportSelectors } from '../Import/warehouse-import.reducer';

import { Table } from 'reactstrap';
import cities from '../../../../shared/utils/city';
import district from '../../../../shared/utils/district.json';
import { WarehouseImportType } from './contants';

const validationSchema = function() {
  return Yup.object().shape({
    store: Yup.object().required('Kho không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper';

export const mappingStatus = {
  RETURN: 'Trả hàng',
  IMPORT_FROM_STORE: 'Nhập kho',
  EXPORT: 'Xuất kho'
};
const { selectById } = globalizedWarehouseImportSelectors;

const DetailWarehouse = props => {
  const { initialState } = useSelector(state => state.warehouseImport);

  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [initValuesState, setInitValuesState] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const warehouseImport = useSelector(state => selectById(state, props.match.params.storeId));

  const [productList, setProductList] = useState([]);

  const initialValues = {
    store: '',
    note: ''
  };

  useEffect(() => {
    dispatch(getDetailWarehouseImport({ id: props.match.params.storeId, dependency: true }));
  }, []);

  useEffect(() => {
    if (warehouseImport) {
      setInitValuesState(warehouseImport);
      setSelectedWarehouse(warehouseImport.store);
      setSelectedCustomer(warehouseImport.customer);
      setProductList(warehouseImport.storeInputDetails);
    }
  }, [warehouseImport]);

  const onSubmit = (values, { resetForm }) => {
    values = JSON.parse(JSON.stringify(values));
    values.storeInputDetails = productList;
    values.type = WarehouseImportType.RETURN;
    dispatch(fetching());
    dispatch(updateWarehouseImport(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Formik initialValues={initValuesState || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
        {({ values, handleSubmit }) => (
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
                      <dt className="col-sm-3">Mã phiếu:</dt>
                      <dd className="col-sm-9">{warehouseImport?.code}</dd>
                    </dl>
                  </CCol>
                  <CCol lg="6">
                    <dl className="row">
                      <dt className="col-sm-3">Chi nhánh:</dt>
                      <dd className="col-sm-9">{selectedWarehouse?.department?.name}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-3">Loại phiếu</dt>
                      <dd className="col-sm-9">{mappingStatus[warehouseImport?.type]}</dd>
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
            <CCard>
              <CCardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Dung tích</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng tiền</th>
                      <th>Chiết khấu</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: 500 }}>{`${item?.product?.productBrand?.name || ''}-${item?.product?.name || ''}-${item
                            ?.product?.volume || ''}`}</td>
                          <td>{item?.product?.volume}</td>
                          <td>
                            {Number(item?.price || item?.product?.price).toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND'
                            }) || ''}
                          </td>
                          <td style={{ minWidth: 100 }}>{item.quantity}</td>
                          <td style={{ minWidth: 100 }}>
                            {(Number(item?.price || item?.product?.price) *
                              Number(item.quantity)).toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND'
                              }) || ''}
                          </td>
                          <td style={{ minWidth: 100 }}>{item.reducePercent}</td>
                          <td style={{ minWidth: 100 }}>
                            {(Number(item?.price || item?.product?.price) *
                              Number(item.quantity) *
                              ((100 - Number(item.reducePercent)) / 100)).toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND'
                              }) || ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <CRow>
                  <CCol lg="4" sm="5">
                    Ghi chú: <strong>{values.note}</strong>
                  </CCol>
                  <CCol lg="4" sm="5" className="ml-auto">
                    <Table className="table-clear">
                      <tbody>
                        <tr>
                          <td className="left">
                            <strong>Tổng tiền</strong>
                          </td>
                          <td className="right">
                            <strong>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(warehouseImport?.totalMoney)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="left">
                            <strong>Chiết khấu</strong>
                          </td>
                          <td className="right">
                            <strong>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(warehouseImport?.reduceMoney)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="left">
                            <strong>Tiền thanh toán</strong>
                          </td>
                          <td className="right">
                            <strong>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(warehouseImport?.realMoney)}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            {/* <CCard>
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
            </CCard> */}
          </CForm>
        )}
      </Formik>
    </CCard>
  );
};

export default DetailWarehouse;
