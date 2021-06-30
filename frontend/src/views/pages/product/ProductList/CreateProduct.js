import React, { useEffect, useRef } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CLabel,
  CInput,
  CRow,
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingProduct } from './product.api';
import { getProductGroup } from '../ProductGroup/product-group.api';
import Select from 'react-select';

import { useHistory } from 'react-router-dom';
import { fetching } from './product.reducer';
import { globalizedproductGroupsSelectors } from '../ProductGroup/product-group.reducer';
import { ProductStatus, UnitType } from './contants';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import './styles.css';
import CurrencyInput from '../../../components/currency-input/currency-input';
import { getCodeByName } from '../../../../shared/utils/normalize';
const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống'),
    price: Yup.string().required('Giá tiền không để trống'),
    agentPrice: Yup.string().required('Giá tiền không để trống'),
    productGroup: Yup.object().required('Nhóm sản phẩm không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll } = globalizedproductGroupsSelectors;

const CreateProduct = () => {
  const { initialState } = useSelector(state => state.product);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const images = useRef([]);
  const productGroup = useSelector(selectAll);
  const initialValues = {
    code: '',
    name: '',
    desc: '',
    status: 'ACTIVE',
    volume: '',
    unit: 'Cái',
    image: []
  };
  useEffect(() => {
    dispatch(getProductGroup({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  const onSubmit = (values, { resetForm }) => {
    dispatch(fetching());
    if (!values.productGroup) {
      values.productBrand = productGroup[0].productBrand.id;
      values.productGroup = productGroup[0].id;
    } else {
      values.productBrand = values.productGroup.productBrand.id;
    }

    values.image = JSON.stringify(images.current);
    values.price = Number(values.price.replace(/\D/g, ''));
    values.agentPrice = Number(values.agentPrice.replace(/\D/g, ''));
    dispatch(creatingProduct(values));
  };

  const getUploadParams = () => {
    return { url: process.env.NODE_ENV === 'development' ? 'http://localhost:8082/' : 'http://localhost:8082/' };
  };

  const handleChangeStatus = ({ xhr }, status) => {
    if (status === 'done') {
      const response = JSON.parse(xhr.response);
      const arr = [...images.current];
      arr.push(response[0].url);
      images.current = arr;
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const renderProductCode = () => {
    const codeName = getCodeByName(ref.current.values.name);
    const code = `${ref.current.values.productGroup?.productBrand?.code || ''}_${ref.current.values.productGroup?.code || ''}_${codeName}_${
      ref.current.values.volume
    }`;
    ref.current.setFieldValue('code', `${code}`.toUpperCase());
  };

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới sản phẩm</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} innerRef={ref} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue, handleReset }) => {
            return (
              <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                <CRow>
                  <CCol lg="6">
                    <CFormGroup>
                      <CLabel htmlFor="code">Mã sản phẩm</CLabel>
                      <CInput
                        type="text"
                        name="code"
                        id="code"
                        placeholder="Mã sản phẩm"
                        disabled
                        onBlur={handleBlur}
                        value={values.code}
                      />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="lastName">Tên sản phẩm</CLabel>
                      <CInput
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Tên sản phẩm"
                        autoComplete="family-name"
                        invalid={errors.name}
                        required
                        onChange={async e => {
                          await handleChange(e);
                          renderProductCode();
                        }}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                      <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="userName">Mô tả</CLabel>
                      <CInput
                        type="text"
                        name="contactName"
                        id="contactName"
                        placeholder="Mô tả"
                        autoComplete="contactName"
                        invalid={errors.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      />
                      <CInvalidFeedback>{errors.description}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="productGroup">Nhóm sản phẩm</CLabel>
                      <Select
                        name="productGroup"
                        onChange={async item => {
                          setFieldValue('productGroup', item.value);
                          await Promise.resolve();
                          renderProductCode();
                        }}
                        options={productGroup.map(item => ({
                          value: item,
                          label: `${item.productBrand?.name} - ${item.name}`
                        }))}
                      />
                      <CInvalidFeedback className="d-block">{errors.productGroup}</CInvalidFeedback>
                    </CFormGroup>
                  </CCol>
                  <CCol lg="6">
                    <CFormGroup>
                      <CLabel htmlFor="password">Giá đại lý</CLabel>
                      <CurrencyInput name="agentPrice" handleChange={handleChange} />
                      <CInvalidFeedback className="d-block">{errors.agentPrice}</CInvalidFeedback>
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel htmlFor="password">Giá Salon</CLabel>
                      <CurrencyInput name="price" handleChange={handleChange} />
                      <CInvalidFeedback className="d-block">{errors.price}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="volume">Dung tích</CLabel>
                      <CInput
                        type="number"
                        name="volume"
                        id="volume"
                        placeholder="Dung tích"
                        autoComplete="volume"
                        onChange={async e => {
                          await handleChange(e);
                          renderProductCode();
                        }}
                        invalid={errors.volume}
                        onBlur={handleBlur}
                        value={values.volume}
                      />
                      <CInvalidFeedback className="d-block">{errors.volume}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="userName">Đơn vị</CLabel>
                      <Select
                        name="unit"
                        onChange={item => {
                          setFieldValue('unit', item.value);
                        }}
                        options={UnitType.map(item => ({
                          value: item.value,
                          label: `${item.title}`
                        }))}
                      />
                      <CInvalidFeedback className="d-block">{errors.unit}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="code">Trạng thái</CLabel>
                      <Select
                        name="status"
                        onChange={item => {
                          setFieldValue('status', item.value);
                        }}
                        options={ProductStatus.map(item => ({
                          value: item.value,
                          label: item.title
                        }))}
                      />
                      <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CFormGroup>
                  <Dropzone
                    getUploadParams={getUploadParams}
                    onChangeStatus={handleChangeStatus}
                    accept="image/*,audio/*,video/*"
                    inputLabel="Upload Ảnh"
                    inputContent="Kéo thả hình ảnh hoặc bấm để chọn ảnh"
                    submitButtonContent="Hoàn thành"
                    inputWithFilesContent="Thêm file"
                  />
                </CFormGroup>
                <CFormGroup className="d-flex justify-content-center">
                  <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                    <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
                  </CButton>
                  <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                    <CIcon name="cil-ban" /> Xóa nhập liệu
                  </CButton>
                </CFormGroup>
              </CForm>
            );
          }}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateProduct;
