import React, { useEffect, useRef, useState } from 'react';
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
  CSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getProductType, getDetailProduct, getDistrict, updateProduct } from './product.api';
import { getProductGroup } from '../ProductGroup/product-group.api';
import Toaster from '../../../components/notifications/toaster/Toaster';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedProductSelectors } from './product.reducer';
import { globalizedproductGroupsSelectors } from '../ProductGroup/product-group.reducer';
import { ProductStatus, UnitType } from './contants';
import { mappingStatus } from './CreateProduct';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';

const validationSchema = function (values) {
  return Yup.object().shape({
    name: Yup.string().min(5, `Tên phải lớn hơn 5 kí tự`).required('Tên không để trống'),
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
      [error.path]: error.errors[FIRST_ERROR],
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

const EditProduct = props => {
  const { initialState } = useSelector(state => state.product);
  const initialValues = {
    code: '',
    name: '',
    contactName: '',
    email: '',
    tel: '',
    dateOfBirth: '',
    city: null,
    district: null,
    address: '',
    branch: null,
    type: null,
    image: [],
    createdYear: '',
    obclubJoinTime: '',
  };
  const toastRef = useRef();
  const images = useRef([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [initValues, setInitValues] = useState(null);
  const { selectById } = globalizedProductSelectors;
  const { selectAll } = globalizedproductGroupsSelectors;
  const product = useSelector(state => selectById(state, props.match.params.id));
  const [initImages, setInitImages] = useState([]);
  const productGroup = useSelector(selectAll);
  useEffect(() => {
    dispatch(getDetailProduct(props.match.params.id));
    dispatch(getProductGroup());
  }, []);

  useEffect(() => {
    if (product) {
      const temp = { ...product };
      temp.productGroup = temp.productGroup.id;
      temp.status = temp.status;
      temp.unit = temp.unit;
      temp.image = [];
      try {
        temp.image = JSON.parse(product.image);
      } catch (e) {}
      const arrRequest = temp.image.map(image => fetch(image));
      Promise.all(arrRequest).then(arrRes => {
        const arr = arrRes.map(res => {
          return res?.arrayBuffer().then(buf => {
            return new File([buf], res.url.match(/.*\/(.*)$/)[1], { type: 'image/jpeg' });
          });
        });
        Promise.all(arr).then(res => setInitImages(res));
      });
      setInitValues(temp);
    }
  }, [product]);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    dispatch(fetching());
    delete values.code;
    values.image = JSON.stringify(images.current);
    dispatch(updateProduct(values));
    resetForm();
  };

  const getUploadParams = () => {
    return { url: process.env.NODE_ENV === 'development' ? 'http://localhost:8082/api/files' : 'http://103.121.91.142:8082/api/files' };
  };

  const handleChangeStatus = ({ meta, file, xhr }, status) => {
    if (status === 'done') {
      const response = JSON.parse(xhr.response);
      const arr = [...images.current];
      arr.push(response[0].url);
      images.current = arr;
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Toaster ref={toastRef} message="Tạo mới sản phẩm thành công" />
      <CCardHeader>Chỉnh sửa sản phẩm</CCardHeader>
      <CCardBody>
        <Formik initialValues={initValues || initialValues} validate={validate(validationSchema)} enableReinitialize onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            status,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            isValid,
            handleReset,
            setTouched,
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
                      valid={errors.name || null}
                      invalid={touched.name && !!errors.name}
                      required
                      onChange={handleChange}
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
                      valid={errors.desc || null}
                      invalid={touched.desc && !!errors.desc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.desc}
                    />
                    <CInvalidFeedback>{errors.desc}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="productGroup">Loại sản phẩm</CLabel>
                    <CSelect
                      custom
                      name="productGroup"
                      id="productGroup"
                      value={values.productGroup}
                      onChange={e => {
                        setFieldValue('productGroup', e.target.value);
                      }}
                    >
                      {productGroup &&
                        productGroup.map(item => (
                          <option key={item.id} value={item.id}>
                            {`${item.productBrand?.name} - ${item.name}`}
                          </option>
                        ))}
                    </CSelect>
                    <CInvalidFeedback>{errors.tel}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="password">Giá đại lý</CLabel>
                    <CInput
                      type="number"
                      name="price"
                      id="price"
                      placeholder="Giá đại lý"
                      autoComplete="address"
                      onChange={handleChange}
                      valid={errors.price || null}
                      onBlur={handleBlur}
                      value={values.price}
                    />
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
                      onChange={handleChange}
                      invalid={errors.volume}
                      valid={!errors.volume || null}
                      onBlur={handleBlur}
                      value={values.volume}
                    />
                    <CInvalidFeedback className="d-block">{errors.volume}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="password">Giá Salon</CLabel>
                    <CInput
                      type="number"
                      name="agentPrice"
                      id="agentPrice"
                      placeholder="Giá Salon"
                      autoComplete="agentPrice"
                      onChange={handleChange}
                      valid={errors.agentPrice || null}
                      onBlur={handleBlur}
                      value={values.agentPrice}
                    />
                    <CInvalidFeedback className="d-block">{errors.agentPrice}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="userName">Đơn vị</CLabel>
                    <CSelect
                      custom
                      name="ccmonth"
                      name="type"
                      id="type"
                      value={values.unit}
                      onChange={e => {
                        setFieldValue('unit', e.target.value);
                      }}
                    >
                      {UnitType.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Trạng thái</CLabel>
                    <CSelect
                      custom
                      name="ccmonth"
                      name="type"
                      id="type"
                      value={values.status}
                      onChange={e => {
                        setFieldValue('status', e.target.value);
                      }}
                    >
                      {ProductStatus.map(item => (
                        <option key={item.value} value={item.value}>
                          {mappingStatus[item.title]}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
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
