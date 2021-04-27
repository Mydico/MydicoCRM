import React, {useEffect, useRef, useState} from 'react';
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

  CCardTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {getDetailProduct, updateProduct} from './product.api';
import {getProductGroup} from '../ProductGroup/product-group.api';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';
import {fetching, globalizedProductSelectors} from './product.reducer';
import {globalizedproductGroupsSelectors} from '../ProductGroup/product-group.reducer';
import {ProductStatus, UnitType} from './contants';
import {mappingStatus} from './CreateProduct';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import CurrencyInput from '../../../components/currency-input/currency-input';
import {getCodeByName} from '../../../../shared/utils/normalize';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
  });
};

import { validate } from '../../../../shared/utils/normalize';


const EditProduct = (props) => {
  const {initialState} = useSelector((state) => state.product);
  const initialValues = {
    agentPrice: 0,
    barcode: '',
    code: '',
    createdBy: null,
    createdDate: '',
    desc: '',
    id: '',
    image: '[]',
    lastModifiedBy: null,
    lastModifiedDate: null,
    name: '',
    price: 0,
    productBrand: null,
    productGroup: null,
    code: '',
    createdBy: null,
    createdDate: '',
    description: null,
    id: '',
    lastModifiedBy: null,
    lastModifiedDate: null,
    name: '',
    status: '',
    unit: '',
    volume: 0,
  };
  const ref = useRef(null);
  const images = useRef([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [initValues, setInitValues] = useState(null);
  const {selectById} = globalizedProductSelectors;
  const {selectAll} = globalizedproductGroupsSelectors;
  const product = useSelector((state) => selectById(state, props.match.params.id));
  const [initImages, setInitImages] = useState([]);
  const productGroup = useSelector(selectAll);
  useEffect(() => {
    dispatch(getDetailProduct(props.match.params.id));
    dispatch(getProductGroup());
  }, []);

  useEffect(() => {
    if (product) {
      const temp = {...product};
      temp.image = [];
      try {
        temp.image = JSON.parse(product.image);
      } catch (e) {}
      const arrRequest = temp.image?.map((image) => fetch(image));
      Promise.all(arrRequest).then((arrRes) => {
        const arr = arrRes.map((res) => {
          return res?.arrayBuffer().then((buf) => {
            return new File([buf], res.url.match(/.*\/(.*)$/)[1], {type: 'image/jpeg'});
          });
        });
        Promise.all(arr).then((res) => setInitImages(res));
      });
      setInitValues(temp);
    }
  }, [product]);

  const onSubmit = (values, {resetForm}) => {
    dispatch(fetching());
    values.image = JSON.stringify(images.current);
    dispatch(updateProduct(values));
    resetForm();
  };

  const getUploadParams = () => {
    return {url: process.env.NODE_ENV === 'development' ? 'http://localhost:8082/api/files' : 'http://localhost:8082/api/files'};
  };

  const handleChangeStatus = ({xhr}, status) => {
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
    ref.current.setFieldValue('code', `${code}`);
  };
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa sản phẩm</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValues || initialValues}
          innerRef={ref}
          validate={validate(validationSchema)}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,


            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue


            ,
          }) => (
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={`${values.code}`}
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
                      onChange={async (e) => {
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
                      name="desc"
                      id="desc"
                      placeholder="Mô tả"
                      autoComplete="desc"
                      invalid={errors.desc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.desc}
                    />
                    <CInvalidFeedback>{errors.desc}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="productGroup">Nhóm sản phẩm</CLabel>
                    <Select
                      name="productGroup"
                      onChange={async (item) => {
                        await setFieldValue('productGroup', item.value);
                        renderProductCode();
                      }}
                      value={{
                        value: values.productGroup,
                        label: `${values.productGroup?.productBrand?.name} - ${values.productGroup?.name}`,
                      }}
                      options={productGroup.map((item) => ({
                        value: item,
                        label: `${item.productBrand?.name} - ${item.name}`,
                      }))}
                    />
                    <CInvalidFeedback>{errors.productGroup}</CInvalidFeedback>
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
                      onChange={async (e) => {
                        await handleChange(e);
                        renderProductCode();
                      }}
                      valid={errors.volume}
                      onBlur={handleBlur}
                      value={values.volume}
                    />
                    <CInvalidFeedback className="d-block">{errors.volume}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="userName">Đơn vị</CLabel>
                    <Select
                      name="unit"
                      onChange={(item) => {
                        setFieldValue('unit', item.value);
                      }}
                      value={{
                        value: values.unit,
                        label: values.unit,
                      }}
                      options={UnitType.map((item) => ({
                        value: item.value,
                        label: `${item.title}`,
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Trạng thái</CLabel>
                    <Select
                      name="status"
                      onChange={(item) => {
                        setFieldValue('status', item.value);
                      }}
                      value={{
                        value: values.status,
                        label: mappingStatus[values.status],
                      }}
                      options={ProductStatus.map((item) => ({
                        value: item.value,
                        label: mappingStatus[item.title],
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
                  initialFiles={initImages}
                />
              </CFormGroup>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu thay đổi'}
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default EditProduct;
